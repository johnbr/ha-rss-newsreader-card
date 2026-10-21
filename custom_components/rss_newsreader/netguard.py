"""Keep feed and article fetches off the local network.

The websocket commands are open to every logged-in Home Assistant user, not
only admins, and they take a URL. Without a guard that makes Home Assistant a
proxy into whatever network it sits on: a feed URL of
``http://192.168.1.1/`` or ``http://169.254.169.254/`` gets fetched from inside
the network, and even when the body fails to parse as a feed, the error that
comes back tells the caller what is listening there. The article command's
"only links we served" allowlist does not close it either, because the caller
chooses the feed, and a feed it hosts can list any link it likes.

So every outbound request is held to public addresses, in two places:

* ``PublicOnlyResolver`` filters what a HOSTNAME resolves to, at connect
  time, inside the connector. Checking at connect time rather than before the
  request is what defeats DNS rebinding: there is no window between the check
  and the connection for the answer to change.
* ``check_url`` rejects an IP-LITERAL host before the request. aiohttp never
  hands a literal to the resolver, so the resolver alone would wave
  ``http://127.0.0.1/`` straight through.

Redirects are followed by ``guarded_get`` rather than by aiohttp, so that every
hop is checked the same way; a public URL that redirects to a private literal
is refused at the redirect.

No Home Assistant imports, so this is unit-testable with aiohttp alone.
"""

from __future__ import annotations

import errno
import ipaddress
import socket
from collections.abc import Callable, Mapping
from typing import Any
from urllib.parse import urljoin, urlsplit

from aiohttp import ClientResponse, ClientSession, ClientTimeout, TCPConnector
from aiohttp.abc import AbstractResolver, ResolveResult
from aiohttp.resolver import ThreadedResolver

MAX_REDIRECTS = 5
_REDIRECT_STATUSES = frozenset({301, 302, 303, 307, 308})


class BlockedDestinationError(OSError):
    """The request would reach a non-public address.

    An ``OSError`` on purpose: raised from the resolver, aiohttp wraps it in a
    ``ClientConnectorError`` like any other failure to connect, so callers
    that already handle ``ClientError`` report it as a failed fetch.
    """

    def __init__(self, message: str) -> None:
        # errno + strerror, because aiohttp's ClientConnectorError renders
        # `strerror` -- a one-argument OSError leaves it None.
        super().__init__(errno.EACCES, message)

    def __str__(self) -> str:
        return str(self.strerror)


def is_public_address(value: str) -> bool:
    """Could this address be reached from the internet?

    ``is_global`` covers loopback, RFC 1918, link-local (and so cloud metadata
    endpoints), carrier-grade NAT, unique-local IPv6 and the documentation
    ranges in one test, and resolves IPv4-mapped IPv6 correctly. Multicast is
    excluded separately because some of it counts as global.
    """
    try:
        address = ipaddress.ip_address(value.split("%", 1)[0])
    except ValueError:
        return False
    return address.is_global and not address.is_multicast


def check_url(url: str) -> None:
    """Refuse a URL that is not http(s), or whose host is a non-public literal.

    A hostname passes here and is checked by ``PublicOnlyResolver`` when the
    connection is made.
    """
    parts = urlsplit(url)
    if parts.scheme not in ("http", "https") or not parts.hostname:
        raise BlockedDestinationError(f"not an http(s) URL: {url}")
    try:
        ipaddress.ip_address(parts.hostname.split("%", 1)[0])
    except ValueError:
        return
    if not is_public_address(parts.hostname):
        raise BlockedDestinationError(f"{parts.hostname} is not a public address")


class PublicOnlyResolver(AbstractResolver):
    """Resolve hostnames, keeping only the public addresses."""

    def __init__(self, inner: AbstractResolver | None = None) -> None:
        self._inner = inner or ThreadedResolver()

    async def resolve(
        self, host: str, port: int = 0, family: socket.AddressFamily = socket.AF_INET
    ) -> list[ResolveResult]:
        results = await self._inner.resolve(host, port, family)
        public = [result for result in results if is_public_address(result["host"])]
        if not public:
            raise BlockedDestinationError(f"{host} does not resolve to a public address")
        return public

    async def close(self) -> None:
        await self._inner.close()


async def guarded_get(
    session: ClientSession,
    url: str,
    *,
    headers: Mapping[str, str],
    timeout: ClientTimeout,
    check: Callable[[str], None] = check_url,
    max_redirects: int = MAX_REDIRECTS,
) -> ClientResponse:
    """GET ``url``, following redirects by hand so every hop is checked.

    ``check`` is injectable for the tests, which have only loopback to serve
    from. The caller owns the returned response and must release it.
    """
    for _ in range(max_redirects + 1):
        check(url)
        response = await session.get(url, headers=headers, timeout=timeout, allow_redirects=False)
        location = response.headers.get("Location")
        if response.status not in _REDIRECT_STATUSES or not location:
            return response
        response.release()
        url = urljoin(str(response.url), location)
    raise BlockedDestinationError(f"more than {max_redirects} redirects")


def create_guarded_session(ssl_context: Any) -> ClientSession:
    """The integration's own session, with the public-only resolver.

    Its own rather than Home Assistant's shared session, because the resolver
    belongs to the connector and the shared one must not be restricted. The
    owner closes it.
    """
    return ClientSession(connector=TCPConnector(resolver=PublicOnlyResolver(), ssl=ssl_context))

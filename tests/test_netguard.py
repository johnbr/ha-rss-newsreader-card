"""The outbound guard: nothing a logged-in user asks for may reach a private address."""

import asyncio
import socket

import pytest
from aiohttp import ClientConnectorError, ClientSession, ClientTimeout, TCPConnector, web
from rss_newsreader_pure.netguard import (
    BlockedDestinationError,
    PublicOnlyResolver,
    check_url,
    guarded_get,
    is_public_address,
)

TIMEOUT = ClientTimeout(total=5)


@pytest.mark.parametrize(
    "address",
    [
        "127.0.0.1",
        "10.0.0.1",
        "172.16.5.4",
        "192.168.1.1",
        "169.254.169.254",  # cloud metadata
        "100.64.0.1",  # carrier-grade NAT
        "0.0.0.0",
        "::1",
        "fd00::1",
        "fe80::1%eth0",
        "::ffff:192.168.1.1",  # IPv4-mapped
        "224.0.0.251",  # multicast
        "not-an-address",
    ],
)
def test_non_public_addresses_are_refused(address: str) -> None:
    assert is_public_address(address) is False


@pytest.mark.parametrize("address", ["93.184.215.14", "1.1.1.1", "2606:4700:4700::1111"])
def test_public_addresses_pass(address: str) -> None:
    assert is_public_address(address) is True


@pytest.mark.parametrize(
    "url",
    [
        "http://127.0.0.1/",
        "http://127.0.0.1:8123/api/",
        "http://[::1]/feed",
        "http://169.254.169.254/latest/meta-data/",
        "http://192.168.1.1/",
        "file:///etc/passwd",
        "gopher://example.com/",
        "http:///nohost",
    ],
)
def test_check_url_refuses_private_literals_and_other_schemes(url: str) -> None:
    with pytest.raises(BlockedDestinationError):
        check_url(url)


@pytest.mark.parametrize("url", ["https://example.com/feed.xml", "http://1.1.1.1/", "https://localhost/"])
def test_check_url_leaves_hostnames_to_the_resolver(url: str) -> None:
    check_url(url)  # localhost is refused at connect time, by the resolver


class _FakeResolver:
    def __init__(self, addresses: list[str]) -> None:
        self._addresses = addresses

    async def resolve(self, host, port=0, family=socket.AF_INET):
        return [
            {"hostname": host, "host": a, "port": port, "family": family, "proto": 0, "flags": 0}
            for a in self._addresses
        ]

    async def close(self) -> None:
        return None


def test_resolver_drops_private_answers() -> None:
    resolver = PublicOnlyResolver(_FakeResolver(["10.0.0.5", "93.184.215.14"]))
    results = asyncio.run(resolver.resolve("mixed.example", 443))
    assert [r["host"] for r in results] == ["93.184.215.14"]


def test_resolver_refuses_a_host_with_only_private_answers() -> None:
    resolver = PublicOnlyResolver(_FakeResolver(["192.168.1.1", "127.0.0.1"]))
    with pytest.raises(BlockedDestinationError):
        asyncio.run(resolver.resolve("rebind.example", 80))


async def _serve(routes: list[web.RouteDef]) -> tuple[web.AppRunner, int]:
    app = web.Application()
    app.add_routes(routes)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "127.0.0.1", 0)
    await site.start()
    port = site._server.sockets[0].getsockname()[1]
    return runner, port


def _allow_loopback_origin(port: int):
    """The test server is on loopback; let only the first hop through."""

    def check(url: str) -> None:
        if url.startswith(f"http://127.0.0.1:{port}/"):
            return
        check_url(url)

    return check


def test_a_private_literal_is_refused_before_connecting() -> None:
    async def run() -> None:
        hits = []

        async def feed(request):
            hits.append(request.path)
            return web.Response(text="<rss/>")

        runner, port = await _serve([web.get("/feed", feed)])
        try:
            async with ClientSession() as session:
                with pytest.raises(BlockedDestinationError):
                    await guarded_get(session, f"http://127.0.0.1:{port}/feed", headers={}, timeout=TIMEOUT)
            assert hits == []
        finally:
            await runner.cleanup()

    asyncio.run(run())


def test_a_redirect_to_a_private_literal_is_refused() -> None:
    async def run() -> None:
        async def start(request):
            raise web.HTTPFound("http://10.0.0.1/admin")

        runner, port = await _serve([web.get("/start", start)])
        try:
            async with ClientSession() as session:
                with pytest.raises(BlockedDestinationError):
                    await guarded_get(
                        session,
                        f"http://127.0.0.1:{port}/start",
                        headers={},
                        timeout=TIMEOUT,
                        check=_allow_loopback_origin(port),
                    )
        finally:
            await runner.cleanup()

    asyncio.run(run())


def test_permitted_redirects_are_followed() -> None:
    async def run() -> None:
        async def start(request):
            raise web.HTTPFound("/final")

        async def final(request):
            return web.Response(text="arrived")

        runner, port = await _serve([web.get("/start", start), web.get("/final", final)])
        try:
            async with ClientSession() as session:
                response = await guarded_get(
                    session,
                    f"http://127.0.0.1:{port}/start",
                    headers={},
                    timeout=TIMEOUT,
                    check=_allow_loopback_origin(port),
                )
                async with response:
                    assert await response.text() == "arrived"
                    assert str(response.url).endswith("/final")
        finally:
            await runner.cleanup()

    asyncio.run(run())


def test_a_redirect_loop_is_cut_off() -> None:
    async def run() -> None:
        async def loop(request):
            raise web.HTTPFound("/loop")

        runner, port = await _serve([web.get("/loop", loop)])
        try:
            async with ClientSession() as session:
                with pytest.raises(BlockedDestinationError, match="redirects"):
                    await guarded_get(
                        session,
                        f"http://127.0.0.1:{port}/loop",
                        headers={},
                        timeout=TIMEOUT,
                        check=_allow_loopback_origin(port),
                    )
        finally:
            await runner.cleanup()

    asyncio.run(run())


def test_a_hostname_resolving_to_loopback_is_refused_at_connect_time() -> None:
    async def run() -> None:
        async def feed(request):
            return web.Response(text="<rss/>")

        runner, port = await _serve([web.get("/feed", feed)])
        try:
            connector = TCPConnector(resolver=PublicOnlyResolver())
            async with ClientSession(connector=connector) as session:
                with pytest.raises(ClientConnectorError, match="public address"):
                    await guarded_get(session, f"http://localhost:{port}/feed", headers={}, timeout=TIMEOUT)
        finally:
            await runner.cleanup()

    asyncio.run(run())

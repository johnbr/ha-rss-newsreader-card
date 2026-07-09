"""Server-side feed fetching with a shared TTL cache."""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from typing import Any

from aiohttp import ClientError, ClientResponse, ClientTimeout
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.util import dt as dt_util

from . import parse
from .const import (
    FEED_CACHE_FLOOR,
    FEED_CACHE_TTL,
    FEED_FETCH_TIMEOUT,
    FEED_MAX_BYTES,
    MAX_ITEMS_PER_FEED,
    RECENT_LINKS_MAX,
    RECENT_LINKS_TTL,
    USER_AGENT,
)

_LOGGER = logging.getLogger(__name__)


class FetchTooLargeError(Exception):
    """Response body exceeded the size cap."""


class FeedHTTPError(Exception):
    """Feed server returned an HTTP error status."""

    def __init__(self, status: int) -> None:
        super().__init__(f"HTTP {status}")
        self.status = status


async def read_capped(response: ClientResponse, cap: int) -> bytes:
    """Read a response body, aborting once it exceeds the cap."""
    chunks: list[bytes] = []
    total = 0
    async for chunk in response.content.iter_chunked(64 * 1024):
        total += len(chunk)
        if total > cap:
            raise FetchTooLargeError(f"body exceeds {cap} bytes")
        chunks.append(chunk)
    return b"".join(chunks)


@dataclass
class FeedCacheEntry:
    result: dict[str, Any] | None = None
    fetched_at: float = 0.0  # time.monotonic()
    etag: str | None = None
    last_modified: str | None = None
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)


class FeedManager:
    """Fetches, caches and normalizes feeds for all cards on the instance."""

    def __init__(self, hass: HomeAssistant, version: str) -> None:
        self._hass = hass
        self._cache: dict[str, FeedCacheEntry] = {}
        self._recent_links: dict[str, float] = {}
        self.user_agent = USER_AGENT.format(version=version)

    async def fetch_feeds(
        self, urls: list[str], force_refresh: bool, max_items: int
    ) -> dict[str, Any]:
        results = await asyncio.gather(
            *(self._get_feed(url, force_refresh, max_items) for url in urls),
            return_exceptions=True,
        )
        feeds: list[dict[str, Any]] = []
        for url, result in zip(urls, results):
            if isinstance(result, BaseException):
                _LOGGER.error(
                    "Unexpected error fetching feed %s", url, exc_info=result
                )
                result = _error_result(url, "fetch_failed", str(result))
            feeds.append(result)
        return {"fetched_at": dt_util.utcnow().isoformat(), "feeds": feeds}

    def is_link_allowed(self, url: str) -> bool:
        """SSRF guard: only fetch articles for links we recently served."""
        served_at = self._recent_links.get(url)
        return (
            served_at is not None
            and time.monotonic() - served_at < RECENT_LINKS_TTL
        )

    async def _get_feed(
        self, url: str, force_refresh: bool, max_items: int
    ) -> dict[str, Any]:
        entry = self._cache.setdefault(url, FeedCacheEntry())
        min_age = FEED_CACHE_FLOOR if force_refresh else FEED_CACHE_TTL
        if self._is_fresh(entry, min_age):
            return self._served(entry, max_items)

        async with entry.lock:
            # Another card may have refreshed while we waited on the lock
            if self._is_fresh(entry, min_age):
                return self._served(entry, max_items)
            try:
                return await self._refresh(url, entry, max_items)
            except (ClientError, TimeoutError) as err:
                return self._stale_or_error(
                    url, entry, max_items, "fetch_failed", str(err) or type(err).__name__
                )
            except FeedHTTPError as err:
                return self._stale_or_error(
                    url, entry, max_items, "http_error", str(err)
                )
            except FetchTooLargeError as err:
                return self._stale_or_error(url, entry, max_items, "too_large", str(err))
            except parse.FeedParseError as err:
                return self._stale_or_error(
                    url, entry, max_items, "parse_failed", str(err)
                )

    async def _refresh(
        self, url: str, entry: FeedCacheEntry, max_items: int
    ) -> dict[str, Any]:
        session = async_get_clientsession(self._hass)
        headers = {"User-Agent": self.user_agent}
        if entry.etag:
            headers["If-None-Match"] = entry.etag
        if entry.last_modified:
            headers["If-Modified-Since"] = entry.last_modified

        _LOGGER.debug("Fetching feed %s", url)
        async with session.get(
            url, headers=headers, timeout=ClientTimeout(total=FEED_FETCH_TIMEOUT)
        ) as response:
            if response.status == 304 and entry.result is not None:
                _LOGGER.debug("Feed %s not modified (304)", url)
                entry.fetched_at = time.monotonic()
                return self._served(entry, max_items)
            if response.status >= 400:
                raise FeedHTTPError(response.status)
            body = await read_capped(response, FEED_MAX_BYTES)
            etag = response.headers.get("ETag")
            last_modified = response.headers.get("Last-Modified")

        # feedparser is blocking: parse + normalize off the event loop
        result = await self._hass.async_add_executor_job(
            parse.parse_feed, body, url, MAX_ITEMS_PER_FEED
        )
        entry.result = result
        entry.fetched_at = time.monotonic()
        entry.etag = etag
        entry.last_modified = last_modified
        self._remember_links(result)
        return self._served(entry, max_items)

    @staticmethod
    def _is_fresh(entry: FeedCacheEntry, min_age: float) -> bool:
        return (
            entry.result is not None
            and time.monotonic() - entry.fetched_at < min_age
        )

    @staticmethod
    def _served(entry: FeedCacheEntry, max_items: int) -> dict[str, Any]:
        assert entry.result is not None
        return {
            **entry.result,
            "entries": entry.result["entries"][:max_items],
            "cache_age": int(time.monotonic() - entry.fetched_at),
        }

    def _stale_or_error(
        self,
        url: str,
        entry: FeedCacheEntry,
        max_items: int,
        code: str,
        message: str,
    ) -> dict[str, Any]:
        if entry.result is not None:
            _LOGGER.warning(
                "Feed %s failed (%s: %s); serving stale cache", url, code, message
            )
            return self._served(entry, max_items)
        _LOGGER.warning("Feed %s failed (%s: %s)", url, code, message)
        return _error_result(url, code, message)

    def _remember_links(self, result: dict[str, Any]) -> None:
        now = time.monotonic()
        for feed_entry in result["entries"]:
            if feed_entry.get("link"):
                self._recent_links[feed_entry["link"]] = now
        if len(self._recent_links) > RECENT_LINKS_MAX:
            newest = sorted(
                self._recent_links.items(), key=lambda kv: kv[1], reverse=True
            )[:RECENT_LINKS_MAX]
            self._recent_links = dict(newest)


def _error_result(url: str, code: str, message: str) -> dict[str, Any]:
    return {
        "url": url,
        "status": "error",
        "error": {"code": code, "message": message},
        "entries": [],
    }

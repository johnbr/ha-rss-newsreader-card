"""Full-article fetching + readability extraction with a small LRU cache."""

from __future__ import annotations

import time
from collections import OrderedDict
from typing import Any
from urllib.parse import urlparse

from aiohttp import ClientSession, ClientTimeout
from homeassistant.core import HomeAssistant

from . import extract
from .const import (
    ARTICLE_CACHE_SIZE,
    ARTICLE_CACHE_TTL,
    ARTICLE_FETCH_TIMEOUT,
    ARTICLE_MAX_BYTES,
)
from .feed_manager import FeedHTTPError, read_capped
from .netguard import guarded_get


class ArticleExtractor:
    """Fetches article pages and extracts reader-view content."""

    def __init__(self, hass: HomeAssistant, session: ClientSession, user_agent: str) -> None:
        self._hass = hass
        self._session = session
        self._user_agent = user_agent
        self._cache: OrderedDict[str, tuple[dict[str, Any], float]] = OrderedDict()

    async def fetch_article(self, url: str) -> dict[str, Any]:
        cached = self._cache.get(url)
        if cached and time.monotonic() - cached[1] < ARTICLE_CACHE_TTL:
            self._cache.move_to_end(url)
            return cached[0]

        if urlparse(url).scheme not in ("http", "https"):
            raise extract.ArticleExtractError("only http(s) URLs are supported")

        response = await guarded_get(
            self._session,
            url,
            headers={"User-Agent": self._user_agent},
            timeout=ClientTimeout(total=ARTICLE_FETCH_TIMEOUT),
        )
        async with response:
            if response.status >= 400:
                raise FeedHTTPError(response.status)
            body = await read_capped(response, ARTICLE_MAX_BYTES)
            encoding = response.charset or "utf-8"
            final_url = str(response.url)  # post-redirect base for relative links

        page_html = body.decode(encoding, errors="replace")
        result = await self._hass.async_add_executor_job(
            extract.extract_article, page_html, final_url
        )
        self._cache[url] = (result, time.monotonic())
        self._cache.move_to_end(url)
        while len(self._cache) > ARTICLE_CACHE_SIZE:
            self._cache.popitem(last=False)
        return result

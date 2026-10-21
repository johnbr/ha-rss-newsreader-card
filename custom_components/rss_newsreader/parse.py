"""Blocking feed parsing + normalization.

No Home Assistant imports here: everything is pure so it runs in an executor
and stays unit-testable without an HA install.
"""

from __future__ import annotations

import hashlib
import re
from datetime import datetime, timezone
from typing import Any
from urllib.parse import urlparse

import lxml.html

from .const import MAX_CONTENT_HTML_BYTES
from .sanitize import http_url, sanitize_html, strip_html


class FeedParseError(Exception):
    """The response body could not be parsed as a feed."""


_IMG_SRC_RE = re.compile(r'<img[^>]*\ssrc="([^"]+)"')


def parse_feed(body: bytes, feed_url: str, max_items: int) -> dict[str, Any]:
    """Parse raw feed bytes into the normalized per-feed envelope."""
    import feedparser  # local import: keeps module import cheap on the event loop

    parsed = feedparser.parse(body)
    if parsed.get("bozo") and not parsed.get("entries"):
        exc = parsed.get("bozo_exception")
        raise FeedParseError(str(exc) if exc else "unparseable feed")

    feed = parsed.get("feed", {})
    feed_link = http_url(feed.get("link"), feed_url) or feed_url
    entries = [
        _normalize_entry(entry, feed_link)
        for entry in parsed.get("entries", [])[:max_items]
    ]
    return {
        "url": feed_url,
        "status": "ok",
        "feed_title": strip_html(feed.get("title")) or _domain(feed_url),
        "feed_link": feed_link,
        "feed_icon": _feed_icon(feed, feed_link),
        "entries": entries,
    }


def _normalize_entry(entry: dict[str, Any], feed_link: str) -> dict[str, Any]:
    link = http_url(entry.get("link"), feed_link)
    base = link or feed_link
    title = strip_html(entry.get("title")) or "(untitled)"
    published = _published_iso(entry)

    summary_html = _clean_fragment(entry.get("summary"), base)
    content_html = None
    content_list = entry.get("content") or []
    if content_list and content_list[0].get("value"):
        content_html = _clean_fragment(content_list[0]["value"], base)
        content_html = _cap_html(content_html, MAX_CONTENT_HTML_BYTES)
        # feedparser aliases summary to content when a feed has no separate
        # summary — don't ship the same HTML twice
        if content_html == summary_html:
            summary_html = None

    entry_id = entry.get("id") or link
    if not entry_id:
        entry_id = hashlib.sha1(
            f"{title}|{published or ''}".encode("utf-8")
        ).hexdigest()

    return {
        "id": entry_id,
        "title": title,
        "link": link,
        "published": published,
        "author": strip_html(entry.get("author")) or None,
        "summary_html": summary_html or None,
        "content_html": content_html or None,
        "image_url": _entry_image(entry, content_html, summary_html),
        "has_full_content": bool(content_html),
    }


def _published_iso(entry: dict[str, Any]) -> str | None:
    parsed_time = entry.get("published_parsed") or entry.get("updated_parsed")
    if not parsed_time:
        return None
    try:
        return datetime(*parsed_time[:6], tzinfo=timezone.utc).isoformat()
    except (TypeError, ValueError):
        return None


def _clean_fragment(raw: str | None, base_url: str) -> str:
    if not raw:
        return ""
    return sanitize_html(_absolutize(raw, base_url))


def _absolutize(fragment: str, base_url: str) -> str:
    """Resolve relative src/href against the entry link before sanitizing."""
    if not fragment or not base_url:
        return fragment or ""
    try:
        root = lxml.html.fromstring(f"<div>{fragment}</div>")
        root.make_links_absolute(base_url, resolve_base_href=True)
        return (root.text or "") + "".join(
            lxml.html.tostring(child, encoding="unicode") for child in root
        )
    except Exception:  # noqa: BLE001 - malformed HTML must never kill a feed
        return fragment


def _cap_html(html_fragment: str, limit: int) -> str:
    if len(html_fragment.encode("utf-8")) <= limit:
        return html_fragment
    cut = html_fragment.encode("utf-8")[:limit].decode("utf-8", errors="ignore")
    open_bracket = cut.rfind("<")
    if open_bracket > cut.rfind(">"):
        cut = cut[:open_bracket]
    # Re-sanitize so nh3 closes any tags left open by the cut
    return sanitize_html(cut + "…")


def _entry_image(
    entry: dict[str, Any], content_html: str | None, summary_html: str | None
) -> str | None:
    # 1. media:content / media:thumbnail (largest wins)
    best_url, best_width = None, -1
    media = list(entry.get("media_content") or []) + list(
        entry.get("media_thumbnail") or []
    )
    for item in media:
        url = http_url(item.get("url"))
        if not url:
            continue
        mime = item.get("type") or ""
        medium = item.get("medium") or ""
        is_image = (
            mime.startswith("image/")
            or medium == "image"
            or (not mime and not medium)  # media:thumbnail carries neither
        )
        if not is_image:
            continue
        try:
            width = int(item.get("width") or 0)
        except (TypeError, ValueError):
            width = 0
        if width > best_width:
            best_url, best_width = url, width
    if best_url:
        return best_url

    # 2. image enclosure
    for enclosure in entry.get("enclosures") or []:
        href = http_url(enclosure.get("href") or enclosure.get("url"))
        if href and (enclosure.get("type") or "").startswith("image/"):
            return href

    # 3. first <img> in the (already sanitized) content/summary
    for fragment in (content_html, summary_html):
        if fragment:
            match = _IMG_SRC_RE.search(fragment)
            if match:
                return match.group(1)
    return None


def _feed_icon(feed: dict[str, Any], feed_link: str) -> str | None:
    image = feed.get("image") or {}
    href = http_url(image.get("href"))
    if href:
        return href
    parsed = urlparse(feed_link)
    if parsed.scheme in ("http", "https") and parsed.netloc:
        return f"{parsed.scheme}://{parsed.netloc}/favicon.ico"
    return None


def _domain(url: str) -> str:
    return urlparse(url).netloc or url

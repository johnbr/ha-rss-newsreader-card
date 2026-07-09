"""Blocking full-article extraction (readability).

No Home Assistant imports here: pure, runs in an executor, unit-testable.
"""

from __future__ import annotations

from typing import Any
from urllib.parse import urljoin

import lxml.html
from readability import Document

from .sanitize import sanitize_html, strip_html

_OG_IMAGE_XPATHS = (
    '//meta[@property="og:image"]/@content',
    '//meta[@property="og:image:url"]/@content',
    '//meta[@name="twitter:image"]/@content',
)


class ArticleExtractError(Exception):
    """No readable content could be extracted from the page."""


def extract_article(page_html: str, url: str) -> dict[str, Any]:
    """Extract reader-view content from a full article page."""
    try:
        doc = Document(page_html)
        summary = doc.summary(html_partial=True)
        title = strip_html(doc.short_title()) or None
    except Exception as err:  # readability raises lxml/Unparseable variants
        raise ArticleExtractError(f"extraction failed: {err}") from err

    if not summary or not strip_html(summary):
        raise ArticleExtractError("no readable content found")

    try:
        root = lxml.html.fromstring(summary)
        root.make_links_absolute(url, resolve_base_href=True)
        summary = lxml.html.tostring(root, encoding="unicode")
    except Exception:  # noqa: BLE001 - fall back to non-absolutized links
        pass

    content_html = sanitize_html(summary)
    text = strip_html(content_html)
    if not text:
        raise ArticleExtractError("no readable content found")

    return {
        "url": url,
        "title": title,
        "content_html": content_html,
        "image_url": _og_image(page_html, url),
        "excerpt": (text[:200] + "…") if len(text) > 200 else text,
    }


def _og_image(page_html: str, base_url: str) -> str | None:
    try:
        root = lxml.html.fromstring(page_html)
        for xpath in _OG_IMAGE_XPATHS:
            values = root.xpath(xpath)
            if values:
                candidate = urljoin(base_url, values[0].strip())
                if candidate.startswith(("http://", "https://")):
                    return candidate
    except Exception:  # noqa: BLE001 - og:image is best-effort
        pass
    return None

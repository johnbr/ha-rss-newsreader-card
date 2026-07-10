"""Blocking full-article extraction (readability).

No Home Assistant imports here: pure, runs in an executor, unit-testable.
"""

from __future__ import annotations

import re
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

# Page furniture that never belongs in a reader view. Removed before
# readability runs (so it can't score as content — e.g. The Guardian embeds
# newsletter signup promos in <aside> inside the article body) and again on
# the extracted fragment as belt and braces.
_JUNK_TAGS = {
    "aside", "form", "nav", "footer", "button", "input", "select",
    "textarea", "label", "dialog", "iframe", "script", "style", "noscript",
}

_JUNK_ATTR_RE = re.compile(
    r"newsletter|email[-_ ]?sign[-_ ]?up|\bsignup\b|subscribe"
    r"|\bpromo\b|promotion"
    r"|visually[-_ ]?hidden|\bsr[-_ ]only\b|screen[-_ ]?reader|skip[-_ ]?link"
    r"|related[-_ ]?(content|links|stories)|share[-_ ]?tools|social[-_ ]?share"
    r"|\badvert(isement)?\b",
    re.IGNORECASE,
)

_JUNK_ATTR_NAMES = (
    "class",
    "id",
    "data-component",
    "data-spacefinder-type",
    "data-testid",
    "aria-label",
)


class ArticleExtractError(Exception):
    """No readable content could be extracted from the page."""


def extract_article(page_html: str, url: str) -> dict[str, Any]:
    """Extract reader-view content from a full article page."""
    image_url = None
    try:
        page_root = lxml.html.fromstring(page_html)
        image_url = _og_image(page_root, url)
        _strip_junk(page_root)
        page_html = lxml.html.tostring(page_root, encoding="unicode")
    except Exception:  # noqa: BLE001 - fall back to the raw page
        pass

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
        _strip_junk(root)
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
        "image_url": image_url,
        "excerpt": (text[:200] + "…") if len(text) > 200 else text,
    }


def _strip_junk(root: lxml.html.HtmlElement) -> None:
    """Remove non-content furniture (promos, signup forms, hidden helpers)."""
    to_drop = []
    for element in root.iter():
        if not isinstance(element.tag, str):  # comments, processing instrs
            continue
        tag = element.tag.lower()
        if tag in _JUNK_TAGS:
            to_drop.append(element)
            continue
        if element.get("aria-hidden") == "true" or element.get("hidden") is not None:
            to_drop.append(element)
            continue
        # In-page jump links ("skip past newsletter promotion") are useless
        # once the page is reduced to a fragment
        if tag == "a" and (element.get("href") or "").startswith("#"):
            to_drop.append(element)
            continue
        markers = " ".join(
            value
            for name in _JUNK_ATTR_NAMES
            if (value := element.get(name))
        )
        if markers and _JUNK_ATTR_RE.search(markers):
            to_drop.append(element)
    for element in to_drop:
        if element.getparent() is not None:
            element.drop_tree()  # keeps tail text of inline elements


def _og_image(root: lxml.html.HtmlElement, base_url: str) -> str | None:
    try:
        for xpath in _OG_IMAGE_XPATHS:
            values = root.xpath(xpath)
            if values:
                candidate = urljoin(base_url, values[0].strip())
                if candidate.startswith(("http://", "https://")):
                    return candidate
    except Exception:  # noqa: BLE001 - og:image is best-effort
        pass
    return None

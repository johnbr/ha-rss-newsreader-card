"""Single sanitization choke point for all feed/article HTML.

No Home Assistant imports here so it stays unit-testable in isolation.
"""

from __future__ import annotations

import html as html_mod
import re

import nh3

ALLOWED_TAGS = {
    "a", "p", "br", "ul", "ol", "li", "blockquote", "strong", "em", "b", "i",
    "u", "s", "code", "pre", "h1", "h2", "h3", "h4", "h5", "h6", "img",
    "figure", "figcaption", "table", "thead", "tbody", "tr", "td", "th",
    "span", "div", "hr", "sub", "sup", "small", "time",
}

ALLOWED_ATTRIBUTES = {
    "a": {"href", "title"},
    "img": {"src", "alt", "title", "width", "height"},
    "time": {"datetime"},
}

_TAG_RE = re.compile(r"<[^>]+>")


def sanitize_html(raw: str | None) -> str:
    """Strip everything dangerous; the card renders the result via unsafeHTML."""
    if not raw:
        return ""
    return nh3.clean(
        raw,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        url_schemes={"http", "https"},
        link_rel="noopener noreferrer nofollow",
        set_tag_attribute_values={
            "img": {"loading": "lazy", "referrerpolicy": "no-referrer"},
            "a": {"target": "_blank"},
        },
    )


def strip_html(raw: str | None) -> str:
    """Reduce HTML to plain text (titles, excerpts)."""
    if not raw:
        return ""
    return html_mod.unescape(_TAG_RE.sub("", raw)).strip()

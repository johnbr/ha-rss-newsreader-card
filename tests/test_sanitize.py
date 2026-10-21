import pytest
from rss_newsreader_pure.sanitize import http_url, sanitize_html, strip_html


def test_script_stripped():
    out = sanitize_html('<p>hi</p><script>alert(1)</script>')
    assert "<script" not in out
    assert "alert" not in out
    assert "<p>hi</p>" in out


def test_event_handlers_stripped():
    out = sanitize_html('<p onclick="evil()">x</p><img src="https://a/b.jpg" onerror="evil()">')
    assert "onclick" not in out
    assert "onerror" not in out
    assert 'src="https://a/b.jpg"' in out


def test_iframe_stripped():
    out = sanitize_html('<p>a</p><iframe src="https://evil.example"></iframe>')
    assert "iframe" not in out


def test_javascript_href_stripped():
    out = sanitize_html('<a href="javascript:alert(1)">x</a>')
    assert "javascript:" not in out


def test_style_stripped():
    out = sanitize_html('<style>body{display:none}</style><p style="color:red">x</p>')
    assert "<style" not in out
    assert "style=" not in out


def test_img_gets_lazy_loading_and_no_referrer():
    out = sanitize_html('<img src="https://a/b.jpg" alt="pic" width="10" height="20">')
    assert 'loading="lazy"' in out
    assert 'referrerpolicy="no-referrer"' in out
    assert 'alt="pic"' in out
    assert 'width="10"' in out


def test_links_get_target_and_rel():
    out = sanitize_html('<a href="https://example.com/x">x</a>')
    assert 'target="_blank"' in out
    assert "noopener" in out
    assert "noreferrer" in out
    assert "nofollow" in out


def test_structure_preserved():
    src = "<h2>t</h2><ul><li>a</li></ul><blockquote>q</blockquote><pre><code>c</code></pre>"
    out = sanitize_html(src)
    for tag in ("<h2>", "<ul>", "<li>", "<blockquote>", "<pre>", "<code>"):
        assert tag in out


def test_empty_input():
    assert sanitize_html(None) == ""
    assert sanitize_html("") == ""


def test_strip_html():
    assert strip_html("<b>Bold</b> &amp; <i>plain</i>") == "Bold & plain"
    assert strip_html(None) == ""


@pytest.mark.parametrize(
    "value",
    [
        "javascript:alert(1)",
        " JavaScript:alert(1)",
        "java\tscript:alert(1)",
        "data:text/html,<script>alert(1)</script>",
        "vbscript:msgbox",
        "//no-scheme.example/a",
        "mailto:a@example.com",
        "",
        None,
        42,
    ],
)
def test_http_url_refuses_everything_but_http(value) -> None:
    assert http_url(value) is None


def test_http_url_keeps_http_and_https() -> None:
    assert http_url("https://example.com/a?b=c") == "https://example.com/a?b=c"
    assert http_url("  http://example.com/  ") == "http://example.com/"


def test_http_url_resolves_relative_links_against_the_feed() -> None:
    assert http_url("/2026/10/story", "https://news.example/feed.xml") == "https://news.example/2026/10/story"
    assert http_url("javascript:alert(1)", "https://news.example/feed.xml") is None


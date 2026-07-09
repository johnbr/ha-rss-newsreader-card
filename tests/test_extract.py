import pytest

from rss_newsreader_pure.extract import ArticleExtractError, extract_article

PAGE = """<!doctype html>
<html>
<head>
  <title>Big Story - Example News</title>
  <meta property="og:image" content="/images/hero.jpg">
</head>
<body>
  <nav><a href="/">Home</a><a href="/about">About</a></nav>
  <article>
    <h1>Big Story</h1>
    <p>{p1}</p>
    <p>{p2} <a href="/related">related coverage</a>.</p>
    <p><img src="/images/inline.jpg" alt="scene"> {p3}</p>
    <script>trackPageview();</script>
  </article>
  <footer>copyright</footer>
</body>
</html>
""".format(
    p1="This is the opening paragraph of a reasonably long news article. " * 5,
    p2="The second paragraph continues the story with additional detail and quotes. " * 5,
    p3="A closing paragraph wraps up the narrative with context and outlook. " * 5,
)


def test_extract_article_content():
    result = extract_article(PAGE, "https://news.example/story/1")
    assert "opening paragraph" in result["content_html"]
    assert "second paragraph" in result["content_html"]
    # short_title() only strips the "- Site Name" suffix for longer titles
    assert result["title"].startswith("Big Story")
    assert "<script" not in result["content_html"]
    assert "trackPageview" not in result["content_html"]


def test_relative_urls_absolutized():
    result = extract_article(PAGE, "https://news.example/story/1")
    assert 'src="https://news.example/images/inline.jpg"' in result["content_html"]
    assert 'href="https://news.example/related"' in result["content_html"]


def test_og_image():
    result = extract_article(PAGE, "https://news.example/story/1")
    assert result["image_url"] == "https://news.example/images/hero.jpg"


def test_excerpt():
    result = extract_article(PAGE, "https://news.example/story/1")
    assert result["excerpt"]
    assert len(result["excerpt"]) <= 201


def test_unreadable_page_raises():
    with pytest.raises(ArticleExtractError):
        extract_article("<html><body></body></html>", "https://x/1")

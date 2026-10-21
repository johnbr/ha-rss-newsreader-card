import pytest

from rss_newsreader_pure.parse import FeedParseError, parse_feed

RSS = """<?xml version="1.0"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:media="http://search.yahoo.com/mrss/">
<channel>
  <title>Test &amp; Feed</title>
  <link>https://example.com/</link>
  <item>
    <title>First &lt;b&gt;post&lt;/b&gt;</title>
    <link>https://example.com/posts/1</link>
    <guid>post-1</guid>
    <pubDate>Wed, 08 Jul 2026 12:00:00 GMT</pubDate>
    <description>&lt;p&gt;Summary with &lt;img src="/img/rel.jpg"&gt; and &lt;script&gt;alert(1)&lt;/script&gt;&lt;/p&gt;</description>
    <content:encoded>&lt;p onclick="evil()"&gt;Full &lt;a href="/other"&gt;text&lt;/a&gt;&lt;iframe src="https://evil.example"&gt;&lt;/iframe&gt; body&lt;/p&gt;</content:encoded>
    <media:thumbnail url="https://cdn.example.com/thumb.jpg"/>
  </item>
  <item>
    <title>No date post</title>
    <link>https://example.com/posts/2</link>
    <description>plain text summary</description>
  </item>
</channel>
</rss>
"""


@pytest.fixture
def feed():
    return parse_feed(RSS.encode(), "https://example.com/feed.xml", 50)


def test_feed_envelope(feed):
    assert feed["status"] == "ok"
    assert feed["feed_title"] == "Test & Feed"
    assert feed["feed_link"] == "https://example.com/"
    assert feed["feed_icon"] == "https://example.com/favicon.ico"
    assert len(feed["entries"]) == 2


def test_entry_normalization(feed):
    entry = feed["entries"][0]
    assert entry["id"] == "post-1"
    assert entry["title"] == "First post"  # HTML stripped
    assert entry["link"] == "https://example.com/posts/1"
    assert entry["published"] == "2026-07-08T12:00:00+00:00"
    assert entry["has_full_content"] is True


def test_summary_sanitized_and_absolutized(feed):
    summary = feed["entries"][0]["summary_html"]
    assert "<script" not in summary
    assert "alert" not in summary
    assert 'src="https://example.com/img/rel.jpg"' in summary


def test_content_sanitized(feed):
    content = feed["entries"][0]["content_html"]
    assert "onclick" not in content
    assert "iframe" not in content
    assert 'href="https://example.com/other"' in content


def test_image_from_media_thumbnail(feed):
    assert feed["entries"][0]["image_url"] == "https://cdn.example.com/thumb.jpg"


def test_undated_entry(feed):
    entry = feed["entries"][1]
    assert entry["published"] is None
    assert entry["id"] == "https://example.com/posts/2"  # falls back to link
    assert entry["has_full_content"] is False


def test_max_items():
    feed = parse_feed(RSS.encode(), "https://example.com/feed.xml", 1)
    assert len(feed["entries"]) == 1


def test_garbage_raises():
    with pytest.raises(FeedParseError):
        parse_feed(b"\x00\x01 this is not a feed at all", "https://x/feed", 50)


def test_media_content_largest_wins():
    rss = """<?xml version="1.0"?>
    <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel>
      <title>t</title><link>https://e.com/</link>
      <item>
        <title>x</title><link>https://e.com/1</link>
        <media:content url="https://e.com/small.jpg" type="image/jpeg" width="100"/>
        <media:content url="https://e.com/big.jpg" type="image/jpeg" width="800"/>
      </item>
    </channel></rss>"""
    feed = parse_feed(rss.encode(), "https://e.com/feed", 50)
    assert feed["entries"][0]["image_url"] == "https://e.com/big.jpg"


def test_video_media_content_skipped():
    rss = """<?xml version="1.0"?>
    <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel>
      <title>t</title><link>https://e.com/</link>
      <item>
        <title>x</title><link>https://e.com/1</link>
        <media:content url="https://e.com/vid.mp4" type="video/mp4"/>
      </item>
    </channel></rss>"""
    feed = parse_feed(rss.encode(), "https://e.com/feed", 50)
    assert feed["entries"][0]["image_url"] is None


def test_image_from_enclosure():
    rss = """<?xml version="1.0"?>
    <rss version="2.0"><channel>
      <title>t</title><link>https://e.com/</link>
      <item>
        <title>x</title><link>https://e.com/1</link>
        <enclosure url="https://e.com/enc.png" type="image/png" length="1"/>
      </item>
    </channel></rss>"""
    feed = parse_feed(rss.encode(), "https://e.com/feed", 50)
    assert feed["entries"][0]["image_url"] == "https://e.com/enc.png"


def test_image_from_content_img():
    rss = """<?xml version="1.0"?>
    <rss version="2.0"><channel>
      <title>t</title><link>https://e.com/</link>
      <item>
        <title>x</title><link>https://e.com/1</link>
        <description>&lt;p&gt;text &lt;img src="https://e.com/inline.gif"&gt;&lt;/p&gt;</description>
      </item>
    </channel></rss>"""
    feed = parse_feed(rss.encode(), "https://e.com/feed", 50)
    assert feed["entries"][0]["image_url"] == "https://e.com/inline.gif"


def test_atom_full_content():
    atom = """<?xml version="1.0"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Atom Blog</title>
      <link href="https://blog.example/"/>
      <entry>
        <title>Post</title>
        <link href="https://blog.example/p/1"/>
        <id>tag:blog.example,2026:1</id>
        <updated>2026-07-01T08:30:00Z</updated>
        <content type="html">&lt;p&gt;Full article body&lt;/p&gt;</content>
      </entry>
    </feed>"""
    feed = parse_feed(atom.encode(), "https://blog.example/atom.xml", 50)
    entry = feed["entries"][0]
    assert entry["published"] == "2026-07-01T08:30:00+00:00"
    assert entry["content_html"] == "<p>Full article body</p>"
    assert entry["has_full_content"] is True


HOSTILE_FEED = b"""<?xml version="1.0"?><rss version="2.0"><channel><title>t</title>
<link>javascript:alert(1)</link>
<item><title>Script link</title><link>javascript:alert(document.domain)</link>
<enclosure url="javascript:alert(2)" type="image/png"/></item>
<item><title>Data link</title><link>data:text/html,&lt;script&gt;alert(3)&lt;/script&gt;</link></item>
<item><title>Relative</title><link>/2026/10/story</link></item>
</channel></rss>"""


def test_feed_urls_other_than_http_never_reach_the_card():
    """The card binds `link` into <a href>; javascript: there runs in HA's origin."""
    result = parse_feed(HOSTILE_FEED, "https://feeds.example/rss", 10)
    assert result["feed_link"] == "https://feeds.example/rss"
    by_title = {entry["title"]: entry for entry in result["entries"]}
    assert by_title["Script link"]["link"] is None
    assert by_title["Script link"]["image_url"] is None
    assert by_title["Data link"]["link"] is None
    assert by_title["Relative"]["link"] == "https://feeds.example/2026/10/story"


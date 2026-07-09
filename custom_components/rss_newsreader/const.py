"""Constants for the RSS Newsreader integration."""

DOMAIN = "rss_newsreader"

URL_BASE = "/rss_newsreader"
CARD_FILENAME = "rss-newsreader-card.js"

# Feed fetching
FEED_CACHE_TTL = 900  # seconds a fetched feed stays fresh
FEED_CACHE_FLOOR = 60  # hard minimum between upstream fetches, even with force_refresh
FEED_FETCH_TIMEOUT = 15
FEED_MAX_BYTES = 3 * 1024 * 1024
MAX_FEEDS_PER_REQUEST = 20
MAX_ITEMS_PER_FEED = 50
DEFAULT_ITEMS_PER_FEED = 20
MAX_CONTENT_HTML_BYTES = 60 * 1024

# Full-article extraction
ARTICLE_FETCH_TIMEOUT = 20
ARTICLE_MAX_BYTES = 5 * 1024 * 1024
ARTICLE_CACHE_SIZE = 200
ARTICLE_CACHE_TTL = 24 * 3600

# Allowlist of links the backend will fetch articles for (SSRF guard)
RECENT_LINKS_MAX = 2000
RECENT_LINKS_TTL = 24 * 3600

# Default Python UAs get 403'd by many feed servers
USER_AGENT = (
    "Mozilla/5.0 (compatible; RSSNewsreaderCard/{version}; "
    "+https://github.com/johnbr/ha-rss-newsreader-card)"
)

# hass.data[DOMAIN] keys
DATA_FEED_MANAGER = "feed_manager"
DATA_ARTICLE_EXTRACTOR = "article_extractor"
DATA_WS_REGISTERED = "ws_registered"
DATA_STATIC_REGISTERED = "static_registered"

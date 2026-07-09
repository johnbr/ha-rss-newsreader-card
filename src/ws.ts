import type {
  ArticleResult,
  FetchFeedsResponse,
  HomeAssistant,
} from "./types";

export function fetchFeeds(
  hass: HomeAssistant,
  urls: string[],
  maxItemsPerFeed: number,
  forceRefresh = false
): Promise<FetchFeedsResponse> {
  return hass.connection.sendMessagePromise<FetchFeedsResponse>({
    type: "rss_newsreader/fetch_feeds",
    urls,
    max_items_per_feed: maxItemsPerFeed,
    force_refresh: forceRefresh,
  });
}

export function fetchArticle(
  hass: HomeAssistant,
  url: string
): Promise<ArticleResult> {
  return hass.connection.sendMessagePromise<ArticleResult>({
    type: "rss_newsreader/fetch_article",
    url,
  });
}

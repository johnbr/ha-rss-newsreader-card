export interface FeedConfig {
  url: string;
  name?: string;
  color?: string;
  full_content?: boolean;
}

export interface RssNewsreaderCardConfig {
  type: string;
  title?: string;
  feeds: FeedConfig[];
  refresh_interval?: number;
  max_items?: number;
  show_images?: boolean;
  open_links?: "new_tab" | "same_tab";
  height?: number;
}

export interface FeedEntry {
  id: string;
  title: string;
  link: string | null;
  published: string | null;
  author: string | null;
  summary_html: string | null;
  content_html: string | null;
  image_url: string | null;
  has_full_content: boolean;
}

export interface FeedResult {
  url: string;
  status: "ok" | "error";
  feed_title?: string;
  feed_link?: string;
  feed_icon?: string | null;
  cache_age?: number;
  error?: { code: string; message: string };
  entries: FeedEntry[];
}

export interface FetchFeedsResponse {
  fetched_at: string;
  feeds: FeedResult[];
}

export interface ArticleResult {
  url: string;
  title: string | null;
  content_html: string;
  image_url: string | null;
  excerpt: string | null;
}

/** One merged-list item: an entry plus its source feed + per-feed config. */
export interface DisplayEntry {
  entry: FeedEntry;
  feed: FeedResult;
  feedConfig: FeedConfig;
}

/** The slice of the hass object this card actually uses. */
export interface HomeAssistant {
  connection: {
    sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T>;
  };
  locale?: { language: string };
}

export interface WsError {
  code: string;
  message: string;
}

export function defineOnce(name: string, cls: CustomElementConstructor): void {
  if (!customElements.get(name)) {
    customElements.define(name, cls);
  }
}

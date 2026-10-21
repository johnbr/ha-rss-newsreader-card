import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";

import "./components/headline-item";
import "./components/article-view";
import "./editor";
import { feedLabel, hostname } from "./format";
import { sharedStyles } from "./styles";
import {
  defineOnce,
  type ArticleResult,
  type DisplayEntry,
  type FeedResult,
  type HomeAssistant,
  type RssNewsreaderCardConfig,
  type WsError,
} from "./types";
import { fetchArticle, fetchFeeds } from "./ws";

const DEFAULT_REFRESH_INTERVAL = 900;
const MIN_REFRESH_INTERVAL = 300;
const DEFAULT_MAX_ITEMS = 30;
const DEFAULT_LIST_MAX_HEIGHT = 480;

export class RssNewsreaderCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: RssNewsreaderCardConfig;

  @state() private _feeds: FeedResult[] = [];

  @state() private _loading = true;

  @state() private _fetchError: string | null = null;

  @state() private _view: "list" | "article" = "list";

  @state() private _active?: DisplayEntry;

  @state() private _article: ArticleResult | null = null;

  @state() private _articleLoading = false;

  @state() private _articleError: string | null = null;

  @state() private _now = Date.now();

  /** URL of the one feed the list is narrowed to; null shows every feed. */
  @state() private _feedFilter: string | null = null;

  private _pollTimer?: ReturnType<typeof setInterval>;

  private _tickTimer?: ReturnType<typeof setInterval>;

  private _lastFetch = 0;

  private _fetchedOnce = false;

  private _listScrollTop = 0;

  private _onVisibility = () => {
    if (!document.hidden && this._isStale()) {
      void this._fetchFeeds();
    }
  };

  public static getConfigElement(): HTMLElement {
    return document.createElement("rss-newsreader-card-editor");
  }

  public static getStubConfig(): Partial<RssNewsreaderCardConfig> {
    return {
      feeds: [{ url: "https://www.home-assistant.io/atom.xml" }],
    };
  }

  public setConfig(config: RssNewsreaderCardConfig): void {
    if (!config.feeds || !Array.isArray(config.feeds) || !config.feeds.length) {
      throw new Error("You need to configure at least one feed (feeds:)");
    }
    for (const feed of config.feeds) {
      // Empty urls are tolerated: the editor emits them while a row is typed
      if (feed.url && !/^https?:\/\//.test(feed.url)) {
        throw new Error(`Feed urls must start with http(s):// (got: ${feed.url})`);
      }
    }
    this._config = config;
    if (this._feedFilter && !this._validFeedUrls().includes(this._feedFilter)) {
      this._feedFilter = null;
    }
    this._fetchedOnce = false;
    this._view = "list";
    this._startTimers();
  }

  public getCardSize(): number {
    return this._config?.height ? Math.ceil(this._config.height / 50) : 6;
  }

  public getGridOptions() {
    return { columns: 12, rows: 6, min_rows: 3, min_columns: 6 };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this._onVisibility);
    this._startTimers();
    if (this._fetchedOnce && this._isStale()) {
      void this._fetchFeeds();
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("visibilitychange", this._onVisibility);
    this._stopTimers();
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (!this._fetchedOnce && this.hass && this._config) {
      this._fetchedOnce = true;
      void this._fetchFeeds();
    }
  }

  protected render() {
    if (!this._config) {
      return nothing;
    }
    const height = this._config.height;
    const containerStyle = height
      ? `height: ${height}px;`
      : `max-height: ${DEFAULT_LIST_MAX_HEIGHT}px;`;
    const title = this._config.title;
    const filter = this._renderFeedFilter();
    return html`
      <ha-card>
        ${title || filter
          ? html`<div class="header">
              ${title ? html`<h1 class="card-header">${title}</h1>` : nothing}
              ${filter}
            </div>`
          : nothing}
        <div class="container" style=${containerStyle}>
          ${this._view === "article" && this._active
            ? this._renderArticle()
            : this._renderList()}
        </div>
      </ha-card>
    `;
  }

  /** The feed picker: only in the list view, and only with 2+ feeds. */
  private _renderFeedFilter() {
    if (this._config?.show_feed_filter === false || this._view !== "list") {
      return nothing;
    }
    const feeds = this._filterOptions();
    if (feeds.length < 2) {
      return nothing;
    }
    const selected = this._feedFilter ?? "";
    return html`
      <div class="feed-filter">
        <select
          aria-label="Show articles from"
          .value=${selected}
          @change=${this._onFeedFilterChanged}
        >
          <option value="" ?selected=${selected === ""}>All feeds</option>
          ${feeds.map(
            (feed) => html`<option
              value=${feed.url}
              ?selected=${selected === feed.url}
            >
              ${feed.label}
            </option>`
          )}
        </select>
        <ha-icon icon="mdi:menu-down"></ha-icon>
      </div>
    `;
  }

  private _filterOptions(): { url: string; label: string }[] {
    const seen = new Set<string>();
    const options: { url: string; label: string }[] = [];
    for (const feedConfig of this._config?.feeds ?? []) {
      if (!/^https?:\/\//.test(feedConfig.url) || seen.has(feedConfig.url)) {
        continue;
      }
      seen.add(feedConfig.url);
      const feed = this._feeds.find((f) => f.url === feedConfig.url);
      options.push({ url: feedConfig.url, label: feedLabel(feedConfig, feed) });
    }
    return options;
  }

  private _onFeedFilterChanged(ev: Event): void {
    this._feedFilter = (ev.target as HTMLSelectElement).value || null;
    this._listScrollTop = 0;
    const list = this.renderRoot.querySelector(".list");
    if (list) {
      list.scrollTop = 0;
    }
  }

  private _renderList() {
    if (this._loading) {
      return html`<div class="list">
        ${[1, 2, 3, 4, 5].map(
          () => html`
            <div class="skeleton-row">
              <div style="flex:1">
                <div class="skeleton title-line"></div>
                <div class="skeleton meta-line"></div>
              </div>
            </div>
          `
        )}
      </div>`;
    }

    const filter = this._feedFilter;
    const failed = this._feeds.filter(
      (f) => f.status === "error" && (!filter || f.url === filter)
    );
    const entries = this._mergedEntries();

    if (this._fetchError && !entries.length) {
      return this._renderEmpty("mdi:alert-circle-outline", this._fetchError);
    }
    if (filter && failed.length && !entries.length) {
      return this._renderEmpty(
        "mdi:rss-off",
        `${this._filterLabel(filter)} failed: ${
          failed[0].error?.message ?? hostname(filter)
        }`
      );
    }
    if (failed.length && !entries.length) {
      return this._renderEmpty(
        "mdi:rss-off",
        `All feeds failed: ${failed
          .map((f) => f.error?.message ?? hostname(f.url))
          .join("; ")}`
      );
    }
    if (!entries.length) {
      return this._renderEmpty(
        "mdi:rss",
        filter
          ? "No articles in this feed yet."
          : this._validFeedUrls().length
            ? "No articles in these feeds yet."
            : "Add a feed URL to get started."
      );
    }

    return html`
      <div class="list" @entry-selected=${this._onEntrySelected}>
        ${failed.map(
          (feed) => html`
            <div class="feed-error-chip" title=${feed.error?.message ?? ""}>
              <ha-icon icon="mdi:alert-outline"></ha-icon>
              ${hostname(feed.url)} failed
            </div>
          `
        )}
        ${entries.map(
          (item) => html`
            <rss-newsreader-headline
              .item=${item}
              .now=${this._now}
              .language=${this.hass?.locale?.language ?? "en"}
              .showImage=${this._config!.show_images !== false}
            ></rss-newsreader-headline>
          `
        )}
      </div>
    `;
  }

  private _filterLabel(url: string): string {
    return (
      this._filterOptions().find((option) => option.url === url)?.label ??
      hostname(url)
    );
  }

  private _renderArticle() {
    return html`
      <rss-newsreader-article
        .item=${this._active!}
        .article=${this._article}
        .articleLoading=${this._articleLoading}
        .articleError=${this._articleError}
        .showImages=${this._config!.show_images !== false}
        .openLinks=${this._config!.open_links ?? "new_tab"}
        .language=${this.hass?.locale?.language ?? "en"}
        @back=${this._onBack}
      ></rss-newsreader-article>
    `;
  }

  private _renderEmpty(icon: string, message: string) {
    return html`
      <div class="empty">
        <ha-icon icon=${icon}></ha-icon>
        <div>${message}</div>
      </div>
    `;
  }

  private _mergedEntries(): DisplayEntry[] {
    if (!this._config) {
      return [];
    }
    const feedOrder = new Map(this._config.feeds.map((f, i) => [f.url, i]));
    const items: DisplayEntry[] = [];
    for (const feed of this._feeds) {
      if (
        feed.status !== "ok" ||
        (this._feedFilter && feed.url !== this._feedFilter)
      ) {
        continue;
      }
      const feedConfig =
        this._config.feeds.find((f) => f.url === feed.url) ?? {
          url: feed.url,
        };
      for (const entry of feed.entries) {
        items.push({ entry, feed, feedConfig });
      }
    }
    items.sort((a, b) => {
      const ta = a.entry.published ? Date.parse(a.entry.published) : NaN;
      const tb = b.entry.published ? Date.parse(b.entry.published) : NaN;
      if (Number.isNaN(ta) && Number.isNaN(tb)) {
        return (
          (feedOrder.get(a.feed.url) ?? 0) - (feedOrder.get(b.feed.url) ?? 0)
        );
      }
      if (Number.isNaN(ta)) {
        return 1; // undated entries last
      }
      if (Number.isNaN(tb)) {
        return -1;
      }
      return tb - ta;
    });
    const seen = new Set<string>();
    const deduped = items.filter((item) => {
      const key = item.entry.link ?? item.entry.id;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
    return deduped.slice(0, this._config.max_items ?? DEFAULT_MAX_ITEMS);
  }

  private _validFeedUrls(): string[] {
    return (this._config?.feeds ?? [])
      .map((f) => f.url)
      .filter((url) => /^https?:\/\//.test(url));
  }

  private async _fetchFeeds(): Promise<void> {
    if (!this.hass || !this._config) {
      return;
    }
    this._lastFetch = Date.now();
    const urls = this._validFeedUrls();
    if (!urls.length) {
      this._feeds = [];
      this._loading = false;
      return;
    }
    const maxItems = this._config.max_items ?? DEFAULT_MAX_ITEMS;
    try {
      const response = await fetchFeeds(
        this.hass,
        urls,
        Math.min(50, maxItems)
      );
      this._feeds = response.feeds;
      this._fetchError = null;
    } catch (err) {
      this._fetchError = (err as WsError).message ?? String(err);
    } finally {
      this._loading = false;
    }
  }

  private _onEntrySelected(ev: CustomEvent<{ item: DisplayEntry }>): void {
    const list = this.renderRoot.querySelector(".list");
    this._listScrollTop = list?.scrollTop ?? 0;
    const item = ev.detail.item;
    this._active = item;
    this._article = null;
    this._articleError = null;
    this._view = "article";
    if (item.feedConfig.full_content && item.entry.link) {
      void this._loadArticle(item.entry.link);
    }
  }

  private async _loadArticle(url: string): Promise<void> {
    if (!this.hass) {
      return;
    }
    this._articleLoading = true;
    try {
      const article = await fetchArticle(this.hass, url);
      // Ignore if the user already navigated elsewhere
      if (this._active?.entry.link === url) {
        this._article = article;
      }
    } catch (err) {
      if (this._active?.entry.link === url) {
        this._articleError = (err as WsError).message ?? String(err);
      }
    } finally {
      this._articleLoading = false;
    }
  }

  private async _onBack(): Promise<void> {
    this._view = "list";
    this._active = undefined;
    await this.updateComplete;
    const list = this.renderRoot.querySelector(".list");
    if (list) {
      list.scrollTop = this._listScrollTop;
    }
  }

  private _isStale(): boolean {
    return Date.now() - this._lastFetch > this._refreshIntervalMs();
  }

  private _refreshIntervalMs(): number {
    const seconds = Math.max(
      MIN_REFRESH_INTERVAL,
      this._config?.refresh_interval ?? DEFAULT_REFRESH_INTERVAL
    );
    return seconds * 1000;
  }

  private _startTimers(): void {
    this._stopTimers();
    if (!this._config) {
      return;
    }
    this._pollTimer = setInterval(() => {
      if (!document.hidden) {
        void this._fetchFeeds();
      }
    }, this._refreshIntervalMs());
    this._tickTimer = setInterval(() => {
      this._now = Date.now();
    }, 60_000);
  }

  private _stopTimers(): void {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = undefined;
    }
    if (this._tickTimer) {
      clearInterval(this._tickTimer);
      this._tickTimer = undefined;
    }
  }

  static styles = [
    sharedStyles,
    css`
      ha-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }

      .header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        padding: 12px 16px 4px;
      }

      /* A title too long to share the row pushes the picker onto its own */
      .card-header {
        flex: 1 1 auto;
        min-width: 0;
        padding: 0;
        margin: 0;
        font-size: var(--ha-card-header-font-size, 24px);
        font-weight: 400;
        line-height: 1.2;
        color: var(--ha-card-header-color, var(--primary-text-color));
      }

      .feed-filter {
        position: relative;
        flex-shrink: 1;
        min-width: 0;
        max-width: 60%;
        margin-left: auto;
      }

      .feed-filter select {
        appearance: none;
        -webkit-appearance: none;
        box-sizing: border-box;
        width: 100%;
        min-width: 120px;
        padding: 6px 30px 6px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color, var(--ha-card-background));
        color: var(--primary-text-color);
        font: inherit;
        font-size: 14px;
        line-height: 1.3;
        text-overflow: ellipsis;
        cursor: pointer;
      }

      .feed-filter select:hover {
        border-color: var(--secondary-text-color);
      }

      .feed-filter select:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 1px;
      }

      .feed-filter option {
        background: var(--card-background-color, var(--ha-card-background));
        color: var(--primary-text-color);
      }

      .feed-filter ha-icon {
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }

      .container {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: hidden;
      }

      .list {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
      }

      rss-newsreader-headline:last-child::part(row),
      .list > rss-newsreader-headline:last-of-type {
        border-bottom: none;
      }

      .feed-error-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 8px 16px 0;
        padding: 4px 10px;
        border-radius: 12px;
        background: var(--warning-color, #b7791f);
        color: var(--text-primary-color, #fff);
        font-size: 12px;
        width: fit-content;
      }

      .feed-error-chip ha-icon {
        --mdc-icon-size: 14px;
      }

      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 32px 16px;
        color: var(--secondary-text-color);
        font-size: 14px;
        text-align: center;
      }

      .empty ha-icon {
        --mdc-icon-size: 36px;
      }

      .skeleton-row {
        display: flex;
        padding: 12px 16px;
        border-bottom: 1px solid var(--divider-color);
      }

      .skeleton.title-line {
        height: 14px;
        width: 85%;
        margin-bottom: 8px;
      }

      .skeleton.meta-line {
        height: 10px;
        width: 40%;
      }
    `,
  ];
}

defineOnce("rss-newsreader-card", RssNewsreaderCard);

declare global {
  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "rss-newsreader-card",
  name: "RSS Newsreader Card",
  description:
    "Scrollable headlines from multiple RSS/Atom feeds with in-card article reading.",
  preview: true,
  documentationURL: "https://github.com/johnbr/ha-rss-newsreader-card",
});

// eslint-disable-next-line no-console
console.info(
  "%c RSS-NEWSREADER-CARD %c loaded ",
  "color: white; background: #039be5; font-weight: 700;",
  "color: #039be5; background: white; font-weight: 700;"
);

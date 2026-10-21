import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { absoluteTime, hostname, safeHttpUrl } from "../format";
import { sharedStyles } from "../styles";
import {
  defineOnce,
  type ArticleResult,
  type DisplayEntry,
} from "../types";

export class RssNewsreaderArticle extends LitElement {
  @property({ attribute: false }) public item!: DisplayEntry;

  @property({ attribute: false }) public article: ArticleResult | null = null;

  @property({ type: Boolean }) public articleLoading = false;

  @property() public articleError: string | null = null;

  @property({ type: Boolean }) public showImages = true;

  @property() public openLinks: "new_tab" | "same_tab" = "new_tab";

  @property() public language = "en";

  protected render() {
    const { entry, feed, feedConfig } = this.item;
    const source = feedConfig.name || feed.feed_title || hostname(feed.url);
    const title = this.article?.title || entry.title;
    // Server-sanitized (nh3) HTML: safe to render via unsafeHTML
    const bodyHtml =
      this.article?.content_html ||
      entry.content_html ||
      entry.summary_html ||
      "";
    const heroUrl = this.article?.image_url || entry.image_url;
    const link = safeHttpUrl(entry.link);
    const showHero =
      this.showImages && heroUrl && !bodyHtml.includes("<img");

    return html`
      <div class="toolbar">
        <button
          class="icon-btn"
          aria-label="Back to headlines"
          @click=${this._back}
        >
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </button>
        <span class="toolbar-source">${source}</span>
        ${link
          ? html`<a
              class="icon-btn ext"
              href=${link}
              target=${this.openLinks === "same_tab" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              aria-label="Open article on site"
            >
              <ha-icon icon="mdi:open-in-new"></ha-icon>
            </a>`
          : nothing}
      </div>
      <div class="body">
        <h2 class="headline">${title}</h2>
        <div class="meta">
          ${entry.author ? html`<span>${entry.author}</span><span>·</span>` : nothing}
          <span>${absoluteTime(entry.published, this.language)}</span>
        </div>
        ${showHero
          ? html`<img
              class="hero"
              src=${heroUrl!}
              alt=""
              @error=${this._hideImage}
            />`
          : nothing}
        ${this.articleLoading
          ? html`
              <div class="loading-note">Loading full article…</div>
              <div class="skeleton line"></div>
              <div class="skeleton line"></div>
              <div class="skeleton line short"></div>
            `
          : nothing}
        ${this.articleError
          ? html`<div class="error-note">
              Couldn't load the full article (${this.articleError}). Showing the
              feed summary instead.
            </div>`
          : nothing}
        ${bodyHtml
          ? html`<div
              class=${this.showImages ? "content" : "content no-images"}
              @click=${this._contentClick}
            >
              ${unsafeHTML(bodyHtml)}
            </div>`
          : this.articleLoading
            ? nothing
            : html`<div class="loading-note">
                This feed doesn't include article text.
              </div>`}
        ${link
          ? html`<a
              class="read-more"
              href=${link}
              target=${this.openLinks === "same_tab" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              >Read on ${hostname(link)}</a
            >`
          : nothing}
      </div>
    `;
  }

  private _back(): void {
    this.dispatchEvent(
      new CustomEvent("back", { bubbles: true, composed: true })
    );
  }

  private _hideImage(ev: Event): void {
    (ev.target as HTMLElement).style.display = "none";
  }

  private _contentClick(ev: Event): void {
    if (this.openLinks !== "same_tab") {
      return;
    }
    const anchor = (ev.composedPath() as HTMLElement[]).find(
      (el) => el.tagName === "A"
    ) as HTMLAnchorElement | undefined;
    if (anchor?.href) {
      ev.preventDefault();
      window.location.href = anchor.href;
    }
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
        flex-shrink: 0;
      }

      .toolbar-source {
        flex: 1;
        font-size: 13px;
        font-weight: 500;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      a.icon-btn {
        text-decoration: none;
      }

      .body {
        flex: 1;
        overflow-y: auto;
        padding: 12px 16px 16px;
        min-height: 0;
      }

      .headline {
        margin: 0 0 6px;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.3;
      }

      .body > .meta {
        margin-bottom: 12px;
      }

      .hero {
        width: 100%;
        max-height: 240px;
        object-fit: cover;
        border-radius: var(--ha-card-border-radius, 12px);
        margin-bottom: 12px;
        background: var(--secondary-background-color);
      }

      .content {
        font-size: 14px;
        line-height: 1.6;
        overflow-wrap: break-word;
      }

      .content img {
        max-width: 100%;
        height: auto;
        border-radius: var(--ha-card-border-radius, 12px);
      }

      .content.no-images img {
        display: none;
      }

      .content a {
        color: var(--primary-color);
      }

      .content pre {
        overflow-x: auto;
        background: var(--secondary-background-color);
        padding: 8px;
        border-radius: 6px;
      }

      .content blockquote {
        margin: 8px 0;
        padding-left: 12px;
        border-left: 3px solid var(--divider-color);
        color: var(--secondary-text-color);
      }

      .content table {
        max-width: 100%;
        overflow-x: auto;
        display: block;
        border-collapse: collapse;
      }

      .content td,
      .content th {
        border: 1px solid var(--divider-color);
        padding: 4px 8px;
      }

      .loading-note {
        color: var(--secondary-text-color);
        font-size: 13px;
        margin-bottom: 8px;
      }

      .error-note {
        color: var(--warning-color, #b7791f);
        font-size: 13px;
        margin-bottom: 8px;
      }

      .skeleton.line {
        height: 14px;
        margin-bottom: 8px;
      }

      .skeleton.line.short {
        width: 60%;
      }

      .read-more {
        display: inline-block;
        margin-top: 16px;
        color: var(--primary-color);
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
      }

      .read-more:hover {
        text-decoration: underline;
      }
    `,
  ];
}

defineOnce("rss-newsreader-article", RssNewsreaderArticle);

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { relativeTime, hostname } from "../format";
import { sharedStyles } from "../styles";
import { defineOnce, type DisplayEntry } from "../types";

export class RssNewsreaderHeadline extends LitElement {
  @property({ attribute: false }) public item!: DisplayEntry;

  @property({ type: Boolean }) public showImage = false;

  @property({ type: Number }) public now = Date.now();

  @property() public language = "en";

  @state() private _iconFailed = false;

  protected render() {
    const { entry, feed, feedConfig } = this.item;
    const source = feedConfig.name || feed.feed_title || hostname(feed.url);
    const time = relativeTime(entry.published, this.language, this.now);
    const accent = feedConfig.color;
    return html`
      <div
        class="row"
        role="button"
        tabindex="0"
        @click=${this._select}
        @keydown=${this._keydown}
      >
        <div class="text">
          <div class="title">${entry.title}</div>
          <div class="meta">
            <span
              class="badge"
              style=${accent ? `--badge-color: ${accent}` : ""}
            >
              ${feed.feed_icon && !this._iconFailed
                ? html`<img
                    src=${feed.feed_icon}
                    alt=""
                    @error=${() => (this._iconFailed = true)}
                  />`
                : source.slice(0, 1)}
            </span>
            <span class="source">${source}</span>
            ${time ? html`<span>·</span><span>${time}</span>` : nothing}
          </div>
        </div>
        ${this.showImage && entry.image_url
          ? html`<img
              class="thumb"
              src=${entry.image_url}
              alt=""
              loading="lazy"
              @error=${this._hideThumb}
            />`
          : nothing}
      </div>
    `;
  }

  private _select(): void {
    this.dispatchEvent(
      new CustomEvent("entry-selected", {
        detail: { item: this.item },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _keydown(ev: KeyboardEvent): void {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      this._select();
    }
  }

  private _hideThumb(ev: Event): void {
    (ev.target as HTMLElement).style.display = "none";
  }

  static styles = [
    sharedStyles,
    css`
      .row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        cursor: pointer;
        border-bottom: 1px solid var(--divider-color);
      }

      .row:hover,
      .row:focus-visible {
        background: var(--secondary-background-color);
        outline: none;
      }

      .text {
        flex: 1;
        min-width: 0;
      }

      .title {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.35;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 4px;
      }

      .thumb {
        flex-shrink: 0;
        width: 72px;
        height: 52px;
        object-fit: cover;
        border-radius: 8px;
        background: var(--secondary-background-color);
      }
    `,
  ];
}

defineOnce("rss-newsreader-headline", RssNewsreaderHeadline);

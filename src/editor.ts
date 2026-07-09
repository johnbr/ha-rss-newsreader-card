import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import {
  defineOnce,
  type FeedConfig,
  type HomeAssistant,
  type RssNewsreaderCardConfig,
} from "./types";

const LABELS: Record<string, string> = {
  title: "Title",
  refresh_interval: "Refresh interval",
  max_items: "Max headlines",
  height: "Card height",
  show_images: "Show images",
  open_links: "Open links in",
  url: "Feed URL",
  name: "Display name",
  color: "Accent color",
  full_content: "Fetch full article text when opened",
};

const OPTIONS_SCHEMA = [
  { name: "title", selector: { text: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      {
        name: "refresh_interval",
        selector: {
          number: {
            min: 300,
            max: 86400,
            step: 60,
            mode: "box",
            unit_of_measurement: "s",
          },
        },
      },
      {
        name: "max_items",
        selector: { number: { min: 1, max: 100, mode: "box" } },
      },
      {
        name: "height",
        selector: {
          number: {
            min: 150,
            max: 2000,
            step: 10,
            mode: "box",
            unit_of_measurement: "px",
          },
        },
      },
      { name: "show_images", selector: { boolean: {} } },
      {
        name: "open_links",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "new_tab", label: "New tab" },
              { value: "same_tab", label: "Same tab" },
            ],
          },
        },
      },
    ],
  },
];

const FEED_SCHEMA = [
  { name: "url", required: true, selector: { text: { type: "url" } } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "name", selector: { text: {} } },
      { name: "color", selector: { text: { prefix: "#" } } },
    ],
  },
  { name: "full_content", selector: { boolean: {} } },
];

export class RssNewsreaderCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: RssNewsreaderCardConfig;

  public setConfig(config: RssNewsreaderCardConfig): void {
    this._config = config;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    void this._ensureComponents();
  }

  /** ha-form is lazy-loaded by core editors; force it to be defined. */
  private async _ensureComponents(): Promise<void> {
    if (customElements.get("ha-form")) {
      return;
    }
    const helpers = await (
      window as unknown as {
        loadCardHelpers?: () => Promise<{
          createCardElement: (config: unknown) => Promise<{
            constructor: { getConfigElement?: () => Promise<unknown> };
          }>;
        }>;
      }
    ).loadCardHelpers?.();
    if (!helpers) {
      return;
    }
    const card = await helpers.createCardElement({
      type: "entities",
      entities: [],
    });
    await card?.constructor?.getConfigElement?.();
    this.requestUpdate();
  }

  protected render() {
    if (!this._config || !this.hass) {
      return nothing;
    }
    const feeds = this._config.feeds ?? [];
    return html`
      <div class="section-title">Feeds</div>
      ${feeds.map(
        (feed, index) => html`
          <div class="feed-row">
            <ha-form
              .hass=${this.hass}
              .data=${feed}
              .schema=${FEED_SCHEMA}
              .computeLabel=${this._computeLabel}
              @value-changed=${(ev: CustomEvent) =>
                this._feedChanged(index, ev)}
            ></ha-form>
            <button
              class="remove"
              title="Remove feed"
              ?disabled=${feeds.length === 1}
              @click=${() => this._removeFeed(index)}
            >
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          </div>
        `
      )}
      <button class="add" @click=${this._addFeed}>
        <ha-icon icon="mdi:plus"></ha-icon>
        Add feed
      </button>

      <div class="section-title">Options</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${OPTIONS_SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._optionsChanged}
      ></ha-form>
    `;
  }

  private _computeLabel = (schema: { name: string }): string =>
    LABELS[schema.name] ?? schema.name;

  private _feedChanged(index: number, ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) {
      return;
    }
    const value = ev.detail.value as FeedConfig;
    const feeds = [...(this._config.feeds ?? [])];
    feeds[index] = this._pruneEmpty(value);
    this._emit({ ...this._config, feeds });
  }

  private _optionsChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) {
      return;
    }
    const value = ev.detail.value as Partial<RssNewsreaderCardConfig>;
    this._emit(
      this._pruneEmpty({
        ...this._config,
        ...value,
      }) as RssNewsreaderCardConfig
    );
  }

  private _addFeed(): void {
    if (!this._config) {
      return;
    }
    this._emit({
      ...this._config,
      feeds: [...(this._config.feeds ?? []), { url: "" }],
    });
  }

  private _removeFeed(index: number): void {
    if (!this._config) {
      return;
    }
    const feeds = (this._config.feeds ?? []).filter((_, i) => i !== index);
    this._emit({ ...this._config, feeds });
  }

  private _pruneEmpty<T extends object>(obj: T): T {
    const out = { ...obj } as Record<string, unknown>;
    for (const key of Object.keys(out)) {
      if (out[key] === "" || out[key] === undefined || out[key] === null) {
        delete out[key];
      }
    }
    return out as T;
  }

  private _emit(config: RssNewsreaderCardConfig): void {
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      })
    );
  }

  static styles = css`
    :host {
      display: block;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin: 16px 0 8px;
    }

    .section-title:first-child {
      margin-top: 0;
    }

    .feed-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 12px;
      margin-bottom: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }

    .feed-row ha-form {
      flex: 1;
      min-width: 0;
    }

    button.remove,
    button.add {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px;
      border-radius: 6px;
      font-size: 14px;
    }

    button.remove:hover:not([disabled]),
    button.add:hover {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    button.remove[disabled] {
      opacity: 0.3;
      cursor: default;
    }

    button.add {
      color: var(--primary-color);
      font-weight: 500;
      padding: 8px 12px;
    }
  `;
}

defineOnce("rss-newsreader-card-editor", RssNewsreaderCardEditor);

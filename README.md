# RSS Newsreader Card for Home Assistant

A dashboard card that shows a merged, scrollable headline list from multiple
RSS/Atom feeds — and opens the article **inside the card** when you click a
headline, with inline images.

Feeds are fetched **server-side** by a bundled companion integration, so there
are no browser CORS problems, feeds are cached and shared across all cards and
devices, and (optionally) the full article text can be extracted from the
linked page, reader-view style.

## Features

- Multiple RSS/Atom feeds per card, merged and sorted by date
- Click a headline → the article expands in place (back button returns to the
  list, scroll position preserved)
- Inline article images + list thumbnails (`media:*`, enclosures, content
  images, `og:image`)
- Optional per-feed **full-article extraction** (readability) for feeds that
  only ship teasers
- All feed HTML is sanitized server-side (nh3/ammonia) before it ever reaches
  the browser, and every link and image URL is held to http(s)
- Fetches only public addresses, so the card can't be used to reach into your
  local network (see [Security](#security))
- Shared TTL cache with ETag/Last-Modified revalidation — many cards, one
  upstream fetch
- Visual card editor; light/dark theme aware
- One HACS install: the integration serves and auto-registers the card JS

## Installation

### HACS (recommended)

[![Open this repository in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=johnbr&repository=ha-rss-newsreader-card&category=integration)

1. In HACS, search for **RSS Newsreader Card**, download it (or use the button
   above), and restart Home Assistant.
2. Settings → Devices & Services → *Add Integration* → **RSS Newsreader**.
3. Add the card to a dashboard (it appears in the card picker as
   *RSS Newsreader Card*).

If HACS doesn't list it yet, add it as a custom repository instead: HACS →
**⋮** → **Custom repositories** → `https://github.com/johnbr/ha-rss-newsreader-card`,
category **Integration**, then continue from step 1.

### Manual

Copy `custom_components/rss_newsreader/` into your HA `config/custom_components/`
directory, restart, then add the integration as above.

> **YAML-mode dashboards**: the Lovelace resource is auto-registered only when
> dashboards are in storage mode (the default). If you manage dashboards in
> YAML, add it manually:
>
> ```yaml
> lovelace:
>   resources:
>     - url: /rss_newsreader/rss-newsreader-card.js?v=0.1.1
>       type: module
> ```
>
> Use the installed version for `?v=` and change it on every update, or browsers
> keep the old card. The integration logs the exact URL at startup.

## Card configuration

```yaml
type: custom:rss-newsreader-card
title: News
feeds:
  - url: https://feeds.bbci.co.uk/news/rss.xml
    name: BBC                # optional display name
    color: "#bb1919"         # optional badge accent color
    full_content: true       # fetch + extract the full article on open
  - url: https://www.home-assistant.io/atom.xml
refresh_interval: 900        # seconds between refreshes (min 300)
max_items: 30                # merged headline cap
show_images: true            # thumbnails + article images
open_links: new_tab          # new_tab | same_tab
height: 420                  # px; omit to let the layout decide
```

| Option | Default | Description |
| --- | --- | --- |
| `feeds` | *required* | List of feeds (1–20). Each needs a `url`; `name`, `color`, `full_content` optional. |
| `title` | — | Card header. |
| `refresh_interval` | `900` | Seconds between feed refreshes (minimum 300). Feeds are also cached server-side for 15 min. |
| `max_items` | `30` | Maximum merged headlines shown. |
| `show_images` | `true` | Show list thumbnails and article images. |
| `open_links` | `new_tab` | Where external article links open. |
| `height` | — | Fixed card content height in px (list becomes scrollable). |

### Where the article text comes from

- By default the card renders the feed's own content (`content:encoded` or the
  summary). Many feeds (e.g. most WordPress blogs, the HA blog) include the
  full article.
- With `full_content: true` on a feed, opening a headline asks the backend to
  fetch the linked page and extract readable text + images (readability). The
  feed summary is shown instantly and replaced when extraction finishes. This
  works only for links the backend itself recently served, and won't work on
  paywalled or JavaScript-rendered sites.

### Notes

- **Mixed content**: images served over plain `http://` are blocked by
  browsers on an `https://` Home Assistant. Broken images are hidden
  automatically.
- One dead feed never breaks the card — you'll see a small warning chip and
  the rest of the headlines.

## Security

Any logged-in Home Assistant user can ask the backend for a feed, not only
admins, since that is what lets the card work for everyone in the house. So the
backend refuses to fetch anything that isn't on a **public** address: loopback,
private (RFC 1918) and link-local ranges, cloud metadata addresses, and their
IPv6 equivalents. That holds for feeds, for article pages, for every redirect
hop, and for hostnames that resolve to such an address, which is checked when
the connection is made, so DNS tricks can't get around it.

The consequence: **a feed served from your own network can't be shown.** Use the
feed's public URL if it has one.

Feed links and image URLs are accepted only as http(s); anything else, such as a
`javascript:` link in a hostile feed, is dropped before it reaches the card, and
the card checks again before rendering a link.

## Development

```bash
npm install
npm run build        # bundles src/ → custom_components/rss_newsreader/frontend/
npm run watch        # rebuild on change
npm run typecheck

python3 -m venv .venv
.venv/bin/pip install feedparser==6.0.12 nh3==0.3.6 readability-lxml==0.8.4.1 aiohttp pytest
.venv/bin/python -m pytest tests/
```

To iterate against a live HA instance, copy or symlink
`custom_components/rss_newsreader` into HA's `config/custom_components/` and
restart. JS-only changes just need `npm run build` + a hard browser refresh.
You can exercise the backend without any card from the browser console:

```js
document.querySelector("home-assistant").hass.connection
  .sendMessagePromise({
    type: "rss_newsreader/fetch_feeds",
    urls: ["https://www.home-assistant.io/atom.xml"],
  })
  .then(console.log);
```

## License

MIT

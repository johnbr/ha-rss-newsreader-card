"""Websocket API for the RSS newsreader card."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from aiohttp import ClientError

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv

from . import extract
from .const import (
    DATA_ARTICLE_EXTRACTOR,
    DATA_FEED_MANAGER,
    DEFAULT_ITEMS_PER_FEED,
    DOMAIN,
    MAX_FEEDS_PER_REQUEST,
    MAX_ITEMS_PER_FEED,
)
from .feed_manager import FeedHTTPError, FetchTooLargeError

WS_FETCH_FEEDS = f"{DOMAIN}/fetch_feeds"
WS_FETCH_ARTICLE = f"{DOMAIN}/fetch_article"


@callback
def async_register_websocket_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_fetch_feeds)
    websocket_api.async_register_command(hass, ws_fetch_article)


def _domain_data(hass: HomeAssistant) -> dict[str, Any]:
    return hass.data.get(DOMAIN) or {}


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_FETCH_FEEDS,
        vol.Required("urls"): vol.All(
            cv.ensure_list, [cv.url], vol.Length(min=1, max=MAX_FEEDS_PER_REQUEST)
        ),
        vol.Optional("force_refresh", default=False): cv.boolean,
        vol.Optional("max_items_per_feed", default=DEFAULT_ITEMS_PER_FEED): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=MAX_ITEMS_PER_FEED)
        ),
    }
)
@websocket_api.async_response
async def ws_fetch_feeds(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    manager = _domain_data(hass).get(DATA_FEED_MANAGER)
    if manager is None:
        connection.send_error(msg["id"], "not_ready", "Integration is not loaded")
        return
    result = await manager.fetch_feeds(
        msg["urls"], msg["force_refresh"], msg["max_items_per_feed"]
    )
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_FETCH_ARTICLE,
        vol.Required("url"): cv.url,
    }
)
@websocket_api.async_response
async def ws_fetch_article(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    data = _domain_data(hass)
    manager = data.get(DATA_FEED_MANAGER)
    extractor = data.get(DATA_ARTICLE_EXTRACTOR)
    if manager is None or extractor is None:
        connection.send_error(msg["id"], "not_ready", "Integration is not loaded")
        return

    url = msg["url"]
    if not manager.is_link_allowed(url):
        connection.send_error(
            msg["id"], "not_allowed", "URL is not a recently served feed entry link"
        )
        return

    try:
        result = await extractor.fetch_article(url)
    except FetchTooLargeError:
        connection.send_error(msg["id"], "too_large", "Article page exceeds size limit")
    except (ClientError, TimeoutError, FeedHTTPError) as err:
        connection.send_error(
            msg["id"], "fetch_failed", f"Could not fetch article: {err}"
        )
    except extract.ArticleExtractError as err:
        connection.send_error(msg["id"], "extract_failed", str(err))
    else:
        connection.send_result(msg["id"], result)

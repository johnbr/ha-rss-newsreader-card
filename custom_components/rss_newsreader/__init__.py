"""RSS Newsreader: server-side feed fetching for the RSS newsreader card."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from .article import ArticleExtractor
from .const import (
    DATA_ARTICLE_EXTRACTOR,
    DATA_FEED_MANAGER,
    DATA_WS_REGISTERED,
    DOMAIN,
)
from .feed_manager import FeedManager
from .frontend import async_register_frontend, async_unregister_frontend
from .websocket import async_register_websocket_commands


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    integration = await async_get_integration(hass, DOMAIN)
    version = str(integration.version)

    data = hass.data.setdefault(DOMAIN, {})
    manager = FeedManager(hass, version)
    data[DATA_FEED_MANAGER] = manager
    data[DATA_ARTICLE_EXTRACTOR] = ArticleExtractor(hass, manager.user_agent)

    if not data.get(DATA_WS_REGISTERED):
        async_register_websocket_commands(hass)
        data[DATA_WS_REGISTERED] = True

    await async_register_frontend(hass, version)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    data = hass.data.get(DOMAIN, {})
    data.pop(DATA_FEED_MANAGER, None)
    data.pop(DATA_ARTICLE_EXTRACTOR, None)
    return True


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Clean up the Lovelace resource when the integration is deleted."""
    await async_unregister_frontend(hass)

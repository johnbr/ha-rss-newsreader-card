"""RSS Newsreader: server-side feed fetching for the RSS newsreader card."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_CLOSE
from homeassistant.core import Event, HomeAssistant
from homeassistant.loader import async_get_integration
from homeassistant.util.ssl import client_context

from .article import ArticleExtractor
from .const import (
    DATA_ARTICLE_EXTRACTOR,
    DATA_FEED_MANAGER,
    DATA_SESSION,
    DATA_WS_REGISTERED,
    DOMAIN,
)
from .feed_manager import FeedManager
from .frontend import async_register_frontend, async_unregister_frontend
from .netguard import create_guarded_session
from .websocket import async_register_websocket_commands


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    integration = await async_get_integration(hass, DOMAIN)
    version = str(integration.version)

    data = hass.data.setdefault(DOMAIN, {})
    # Every fetch goes through this session, which refuses non-public
    # addresses -- see netguard. Closed on unload, and on shutdown, which does
    # not unload entries.
    session = create_guarded_session(client_context())
    data[DATA_SESSION] = session

    async def _close_session(_: Event) -> None:
        await session.close()

    entry.async_on_unload(hass.bus.async_listen_once(EVENT_HOMEASSISTANT_CLOSE, _close_session))

    manager = FeedManager(hass, session, version)
    data[DATA_FEED_MANAGER] = manager
    data[DATA_ARTICLE_EXTRACTOR] = ArticleExtractor(hass, session, manager.user_agent)

    if not data.get(DATA_WS_REGISTERED):
        async_register_websocket_commands(hass)
        data[DATA_WS_REGISTERED] = True

    await async_register_frontend(hass, version)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    data = hass.data.get(DOMAIN, {})
    data.pop(DATA_FEED_MANAGER, None)
    data.pop(DATA_ARTICLE_EXTRACTOR, None)
    if (session := data.pop(DATA_SESSION, None)) is not None:
        await session.close()
    return True


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Clean up the Lovelace resource when the integration is deleted."""
    await async_unregister_frontend(hass)

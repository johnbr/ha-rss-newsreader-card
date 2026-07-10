"""Serve the card bundle and register it as a Lovelace resource."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import CARD_FILENAME, DATA_STATIC_REGISTERED, DOMAIN, URL_BASE

_LOGGER = logging.getLogger(__name__)

_CARD_URL_PATH = f"{URL_BASE}/{CARD_FILENAME}"


async def async_register_frontend(hass: HomeAssistant, version: str) -> None:
    data = hass.data.setdefault(DOMAIN, {})
    if not data.get(DATA_STATIC_REGISTERED):
        card_path = Path(__file__).parent / "frontend" / CARD_FILENAME
        await hass.http.async_register_static_paths(
            [StaticPathConfig(_CARD_URL_PATH, str(card_path), cache_headers=True)]
        )
        data[DATA_STATIC_REGISTERED] = True

    versioned_url = f"{_CARD_URL_PATH}?v={version}"
    resources = _storage_resources(hass)
    if resources is None:
        _LOGGER.info(
            "Lovelace is in YAML mode; add the card resource manually: "
            "url: %s, type: module",
            versioned_url,
        )
        return

    if not resources.loaded:
        await resources.async_load()
        resources.loaded = True

    for item in resources.async_items():
        if (item.get("url") or "").split("?")[0] == _CARD_URL_PATH:
            if item["url"] != versioned_url:
                await resources.async_update_item(
                    item["id"], {"res_type": "module", "url": versioned_url}
                )
                _LOGGER.debug("Updated Lovelace resource to %s", versioned_url)
            return

    await resources.async_create_item({"res_type": "module", "url": versioned_url})
    _LOGGER.debug("Registered Lovelace resource %s", versioned_url)


async def async_unregister_frontend(hass: HomeAssistant) -> None:
    resources = _storage_resources(hass)
    if resources is None:
        return
    if not resources.loaded:
        await resources.async_load()
        resources.loaded = True
    for item in list(resources.async_items()):
        if (item.get("url") or "").split("?")[0] == _CARD_URL_PATH:
            await resources.async_delete_item(item["id"])
            _LOGGER.debug("Removed Lovelace resource %s", item["url"])


def _storage_resources(hass: HomeAssistant):
    """Return the resource storage collection, or None in YAML resource mode."""
    lovelace = hass.data.get("lovelace")
    # HA 2026.7 renamed LovelaceData.mode to resource_mode; check both so
    # older cores (>= 2025.7) keep working
    mode = getattr(lovelace, "resource_mode", None) or getattr(
        lovelace, "mode", None
    )
    if mode != "storage":
        return None
    return getattr(lovelace, "resources", None)

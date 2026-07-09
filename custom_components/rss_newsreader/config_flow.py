"""Config flow for RSS Newsreader (single instance, no options)."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN


class RssNewsreaderConfigFlow(ConfigFlow, domain=DOMAIN):
    """Single-instance confirm-only flow; feeds are configured per-card."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(title="RSS Newsreader", data={})
        return self.async_show_form(step_id="user", data_schema=vol.Schema({}))

"""Load the pure backend modules without importing Home Assistant.

The integration's __init__.py imports homeassistant, so the package can't be
imported directly in unit tests. Instead we register a synthetic package whose
__path__ points at the component directory; parse/extract/sanitize/const are
HA-free, and their relative imports resolve against the synthetic package.
"""

import sys
import types
from pathlib import Path

COMPONENT_DIR = (
    Path(__file__).resolve().parents[1] / "custom_components" / "rss_newsreader"
)
PKG = "rss_newsreader_pure"

if PKG not in sys.modules:
    pkg = types.ModuleType(PKG)
    pkg.__path__ = [str(COMPONENT_DIR)]
    sys.modules[PKG] = pkg

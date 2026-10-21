"""Repository shape the HACS default store checks."""

from pathlib import Path

COMPONENT = Path(__file__).resolve().parents[1] / "custom_components" / "rss_newsreader"


def _png_size(path: Path) -> tuple[int, int]:
    header = path.read_bytes()[:24]
    assert header[:8] == b"\x89PNG\r\n\x1a\n", f"{path.name} is not a PNG"
    return int.from_bytes(header[16:20], "big"), int.from_bytes(header[20:24], "big")


def test_brand_icons_present():
    # HACS's `brands` check looks for exactly this file before falling back to
    # the home-assistant/brands repository, which this integration is not in.
    assert _png_size(COMPONENT / "brand" / "icon.png") == (256, 256)
    assert _png_size(COMPONENT / "brand" / "icon@2x.png") == (512, 512)

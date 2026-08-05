"""=============================================================================
Think in Japanese application configuration
=============================================================================
Purpose:
    Centralizes runtime settings so local development and future hosting can
    use the same application package without editing feature code.
============================================================================="""

from pathlib import Path


class Config:
    """Default public-site configuration."""

    APP_DIR = Path(__file__).resolve().parent
    BASE_DIR = APP_DIR.parent
    LEGACY_DIR = APP_DIR / "static" / "legacy"
    TEMPLATES_AUTO_RELOAD = True
    JSON_SORT_KEYS = False

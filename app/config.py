"""=============================================================================
Think in Japanese application configuration
=============================================================================
Purpose:
    Centralizes runtime settings so local development and future hosting can
    use the same application package without editing feature code.
============================================================================="""

from pathlib import Path
import os


class Config:
    """Default public-site configuration."""

    APP_DIR = Path(__file__).resolve().parent
    BASE_DIR = APP_DIR.parent
    LEGACY_DIR = APP_DIR / "static" / "legacy"
    TEMPLATES_AUTO_RELOAD = True
    JSON_SORT_KEYS = False

    # Hosted AI companion. The default preserves the bot used by the legacy
    # public HTML site. It can be overridden or disabled without code changes.
    AI_COMPANION_ENABLED = os.getenv("TIJ_AI_COMPANION_ENABLED", "true").lower() in {"1", "true", "yes", "on"}
    AI_COMPANION_BOT_ID = os.getenv("TIJ_AI_COMPANION_BOT_ID", "59258")

"""=============================================================================
Page lookup and language service
=============================================================================
Purpose:
    Encapsulates validation and localized page metadata retrieval.
============================================================================="""

from app.data.pages import PAGE_MAP, PAGES, VALID_LANGUAGES


def get_page(slug: str) -> dict | None:
    """Return page metadata for a slug, or None when it does not exist."""
    return PAGE_MAP.get(slug)


def is_valid_language(language: str) -> bool:
    """Return True when the requested language is supported."""
    return language in VALID_LANGUAGES


def get_legacy_filename(page: dict, language: str) -> str:
    """Resolve the legacy interactive page file for a language."""
    return page["file_es"] if language == "es" else page["file_en"]


def navigation_pages() -> list[dict]:
    """Return the canonical navigation registry."""
    return PAGES

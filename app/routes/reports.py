"""=============================================================================
Downloadable report blueprint
=============================================================================
Purpose:
    Exposes standalone HTML report downloads for every page and preserves the
    visitor's selected workbench theme in the exported file.
============================================================================="""

from io import BytesIO

from flask import Blueprint, abort, request, send_file

from app.services.page_service import get_legacy_filename, get_page, is_valid_language
from app.services.report_service import build_home_report, build_tool_report, normalize_theme

reports_bp = Blueprint("reports", __name__, url_prefix="/reports")


@reports_bp.get("/<lang>/<slug>/download")
def download_page(lang: str, slug: str):
    """Generate and download one self-contained HTML learning report."""
    if not is_valid_language(lang):
        abort(404)
    page = get_page(slug)
    if not page:
        abort(404)
    theme = normalize_theme(request.args.get("theme"))
    if slug == "home":
        content = build_home_report(page, lang, theme)
    else:
        content = build_tool_report(page, lang, theme, get_legacy_filename(page, lang))
    payload = BytesIO(content.encode("utf-8"))
    filename = f"think-in-japanese_{lang}_{slug}_{theme}.html"
    return send_file(payload, mimetype="text/html", as_attachment=True, download_name=filename)

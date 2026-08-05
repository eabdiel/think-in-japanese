"""=============================================================================
Standalone HTML report generation service
=============================================================================
Purpose:
    Produces a downloadable, self-contained HTML copy of any learning page.
    The active user theme is embedded into the report so downloaded content
    visually matches the workbench at the moment it is exported.
============================================================================="""

from __future__ import annotations

import base64
import mimetypes
import re
from pathlib import Path
from urllib.parse import unquote

from flask import current_app, render_template

from app.data.pages import VALID_THEMES

THEME_TOKENS = {
    "pixel": {"accent":"#d84f9b","accent2":"#7455e8","surface":"#fff8fc","ink":"#241b4b","muted":"#665b7c","border":"#e9bfdc"},
    "garden": {"accent":"#4c8c66","accent2":"#d39855","surface":"#fffaf0","ink":"#263c31","muted":"#617267","border":"#cfe2d2"},
    "night": {"accent":"#ff58bd","accent2":"#62a8ff","surface":"#0e1831","ink":"#f5f7ff","muted":"#b8c6ea","border":"#384d78"},
}


def normalize_theme(theme: str | None) -> str:
    """Return a known theme identifier, defaulting to Pixel Pastel."""
    return theme if theme in VALID_THEMES else "pixel"


def build_home_report(page: dict, language: str, theme: str) -> str:
    """Render the dashboard as a standalone downloadable HTML report."""
    return render_template(
        "reports/home_report.html",
        current=page,
        lang=language,
        theme=theme,
        tokens=THEME_TOKENS[theme],
    )


def build_tool_report(page: dict, language: str, theme: str, filename: str) -> str:
    """Load a tool page and convert its local dependencies into inline data."""
    legacy_root = Path(current_app.config["LEGACY_DIR"])
    source_path = legacy_root / filename
    html = source_path.read_text(encoding="utf-8", errors="replace")
    html = _inline_stylesheets(html, source_path.parent)
    html = _inline_scripts(html, source_path.parent)
    html = _inline_media(html, source_path.parent)
    html = _inject_report_chrome(html, page, language, theme)
    return html


def _data_uri(path: Path) -> str:
    """Convert a local file to a data URI for standalone HTML downloads."""
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def _resolve_local(reference: str, base_dir: Path) -> Path | None:
    """Resolve relative references while rejecting remote and anchor links."""
    clean = unquote(reference.split("?", 1)[0].split("#", 1)[0]).strip()
    if not clean or clean.startswith(("data:", "http://", "https://", "//", "#", "mailto:", "javascript:")):
        return None
    candidate = (base_dir / clean).resolve()
    static_root = Path(current_app.static_folder).resolve()
    if candidate.exists() and (candidate == static_root or static_root in candidate.parents):
        return candidate
    alternate = (static_root / clean.lstrip("/")).resolve()
    if alternate.exists() and (alternate == static_root or static_root in alternate.parents):
        return alternate
    return None


def _rewrite_css_urls(css: str, base_dir: Path) -> str:
    """Embed images and fonts referenced from an inlined stylesheet."""
    pattern = re.compile(r"url\((['\"]?)([^)'\"]+)\1\)", re.IGNORECASE)
    def replace(match: re.Match) -> str:
        path = _resolve_local(match.group(2), base_dir)
        return f"url('{_data_uri(path)}')" if path else match.group(0)
    return pattern.sub(replace, css)


def _inline_stylesheets(html: str, base_dir: Path) -> str:
    """Replace local stylesheet links with inline style blocks."""
    pattern = re.compile(r'<link\b(?=[^>]*rel=["\']?stylesheet["\']?)[^>]*href=["\']([^"\']+)["\'][^>]*>', re.IGNORECASE)
    def replace(match: re.Match) -> str:
        path = _resolve_local(match.group(1), base_dir)
        if not path:
            return match.group(0)
        css = _rewrite_css_urls(path.read_text(encoding="utf-8", errors="replace"), path.parent)
        return f"<style>/* Inlined from {path.name} */\n{css}</style>"
    return pattern.sub(replace, html)


def _inline_scripts(html: str, base_dir: Path) -> str:
    """Replace local JavaScript references with inline script blocks."""
    pattern = re.compile(r'<script\b([^>]*)src=["\']([^"\']+)["\']([^>]*)>\s*</script>', re.IGNORECASE)
    def replace(match: re.Match) -> str:
        path = _resolve_local(match.group(2), base_dir)
        if not path:
            return match.group(0)
        script = path.read_text(encoding="utf-8", errors="replace").replace("</script>", "<\\/script>")
        return f"<script>/* Inlined from {path.name} */\n{script}</script>"
    return pattern.sub(replace, html)


def _inline_media(html: str, base_dir: Path) -> str:
    """Embed local image, audio, video, and source references as data URIs."""
    pattern = re.compile(r'\b(src|poster)=["\']([^"\']+)["\']', re.IGNORECASE)
    def replace(match: re.Match) -> str:
        path = _resolve_local(match.group(2), base_dir)
        return f'{match.group(1)}="{_data_uri(path)}"' if path else match.group(0)
    return pattern.sub(replace, html)


def _inject_report_chrome(html: str, page: dict, language: str, theme: str) -> str:
    """Inject theme tokens, report metadata, and print-friendly controls."""
    tokens = THEME_TOKENS[theme]
    title = page["es"] if language == "es" else page["en"]
    subtitle = "Reporte de aprendizaje descargado" if language == "es" else "Downloaded learning report"
    report_css = f"""
    <style id="tij-report-theme">
      :root{{--report-accent:{tokens['accent']};--report-accent-2:{tokens['accent2']};--report-surface:{tokens['surface']};--report-ink:{tokens['ink']};--report-muted:{tokens['muted']};--report-border:{tokens['border']};}}
      html{{color-scheme:{'dark' if theme == 'night' else 'light'};}}
      body{{background:var(--report-surface)!important;color:var(--report-ink)!important;}}
      .tij-report-banner{{position:relative;z-index:99999;margin:0;padding:16px 22px;display:flex;align-items:center;justify-content:space-between;gap:16px;background:linear-gradient(135deg,var(--report-accent),var(--report-accent-2));color:white;font-family:system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.16)}}
      .tij-report-banner strong{{display:block;font-size:1.05rem}} .tij-report-banner small{{opacity:.9}}
      .tij-report-banner button{{border:1px solid rgba(255,255,255,.5);background:rgba(255,255,255,.16);color:white;border-radius:10px;padding:9px 13px;font-weight:700;cursor:pointer}}
      @media print{{.tij-report-banner button{{display:none}}.tij-report-banner{{box-shadow:none}}}}
    </style>
    """
    banner = f'<div class="tij-report-banner"><div><strong>{page["icon"]} {title}</strong><small>{subtitle} · {theme.replace("-", " ").title()}</small></div><button type="button" onclick="window.print()">🖨 Print / PDF</button></div>'
    if "</head>" in html.lower():
        html = re.sub(r"</head>", report_css + "</head>", html, count=1, flags=re.IGNORECASE)
    else:
        html = report_css + html
    if re.search(r"<body[^>]*>", html, flags=re.IGNORECASE):
        html = re.sub(r"(<body[^>]*>)", r"\1" + banner, html, count=1, flags=re.IGNORECASE)
    else:
        html = banner + html
    return html

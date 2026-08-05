# Think in Japanese V2.26 — Hosted Companion & Cloud Run Standardization

**Release date:** August 5, 2026  
**Author:** Edwin A. Rodriguez / ProgreTech

## Summary

This release establishes the August 5 Cloud Run deployment as the new application baseline, restores the hosted AI companion across the shared Flask shell, masks decorative text embedded in the home-page hero artwork, and removes obsolete scaffold files from the distributable project.

## Home-page hero correction

- Added a theme-aware glass title card behind the live **Think in Japanese** heading.
- The card visually masks lettering embedded in the scenic source image instead of allowing two title treatments to overlap.
- Added dedicated Pixel Pastel, Garden Cream, and Tokyo Night contrast treatments.
- Preserved the scenic artwork, independent mascot cutout, responsive actions, and existing mobile behavior.

## AI companion

- Restored the Aminos AI companion used by the legacy HTML site.
- Loaded the companion once from `app/templates/base.html`, so it appears consistently across English and Spanish Flask routes.
- Preserved the legacy bot identifier `59258` as the default.
- Added environment-variable configuration:
  - `TIJ_AI_COMPANION_ENABLED=true|false`
  - `TIJ_AI_COMPANION_BOT_ID=<bot id>`
- Included current page and language metadata on the loader element for future companion enhancements.
- Offline HTML downloads intentionally remain independent and continue using their original standalone implementation.

## Cloud Run and repository standardization

- Kept `main.py` as the only Python application entry point.
- Added `Procfile` with the Cloud Run-compatible Gunicorn command.
- Added `.gcloudignore` and `.dockerignore` to reduce uploaded build context and prevent local IDE, cache, archive, and virtual-environment files from entering builds.
- Removed obsolete root-level `app.py`, `run.py`, duplicate `templates/`, and duplicate `static/` scaffold content.
- Removed local `.git`, `.idea`, and Python cache material from the release archive.

## Runtime command

```text
gunicorn --bind 0.0.0.0:$PORT main:app
```

## Added files

- `.gcloudignore`
- `.dockerignore`
- `Procfile`

## Modified files

- `app/__init__.py`
- `app/config.py`
- `app/templates/base.html`
- `app/static/css/app.css`
- `RELEASE.md`

## Removed files and directories

- `app.py`
- `run.py`
- `templates/`
- `static/`
- `.git/`
- `.idea/`
- Python `__pycache__/` directories

## Deployment note

The AI companion depends on its hosted JavaScript provider and therefore requires internet access. The rest of the Flask application and the downloadable standalone HTML companions retain their existing offline-friendly behavior.


## V2.26.1 — Kana Dojo Canvas Hotfix

- Replaced the non-functional decorative resize corners with explicit horizontal resize handles.
- Removed the automatic `ResizeObserver` persistence that could save unintended widths and heights.
- Kana Dojo tile layouts now persist only order and user-selected width.
- Removed forced 720px tile heights so controls, board rows, review history, and bottom content remain visible.
- Allowed the Kana workspace and parent container to grow vertically without clipping.
- Added a new layout storage version so previously corrupted Kana layouts are ignored.
- Applied to English and Spanish Kana Dojo pages and all three themes.

### Modified files

- `app/static/css/app.css`
- `app/static/js/kana-dojo.js`
- `RELEASE.md`

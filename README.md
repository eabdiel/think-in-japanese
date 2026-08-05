# Think in Japanese V2.11 Learning Workbench

A public, offline-friendly Flask learning application with a shared responsive workbench, three persistent themes, modular feature code, and theme-aware standalone HTML reports.

## Run in PyCharm

1. Open this folder as the PyCharm project.
2. Select or create a virtual environment.
3. Install dependencies with `pip install -r requirements.txt`.
4. Run **`main.py`**.
5. Open `http://127.0.0.1:5000/en/`.

`main.py` is the only supported executable entry point. There is no root-level `app.py` or `run.py`.

## Structure

- `main.py` — local and future hosting entry point
- `app/routes/` — route blueprints by application section
- `app/services/` — reusable page and report logic
- `app/data/` — canonical bilingual navigation registry
- `app/templates/` — shared layouts, pages, and report templates
- `app/static/css/` — shared workbench styling and theme tokens
- `app/static/js/modules/` — focused browser behavior modules
- `app/static/legacy/` — preserved interactive learning tools
- `content/` — future data-driven lesson content
- `RELEASE.md` — current baseline notes and changed-file inventory

## Reports

The Report button generates a standalone HTML download using the active Pixel Pastel, Garden Cream, or Tokyo Night theme. Local stylesheets, scripts, and media used by existing tools are embedded wherever possible.

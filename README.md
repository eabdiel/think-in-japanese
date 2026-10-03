# Think in Japanese V2.11 Learning Workbench

Offline-friendly Flask Japanese learning workbench with bilingual navigation, study tools, themes, and standalone HTML reports.

A project of **[ProgreTech LLC](https://progretech.com)**, owned and maintained by **Ed Rodriguez**. Third-party components and contributions retain their respective ownership and notices.

[Project website](https://manabikobo.com) · [Report an issue](https://github.com/eabdiel/think-in-japanese/issues) · [Contribute](CONTRIBUTING.md)

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

## Collaboration

Japanese-language accuracy, spanish localization, keyboard accessibility, and offline study workflows are useful ways to help. Read [CONTRIBUTING.md](CONTRIBUTING.md) for issue reports, proposed changes, and attribution requirements.

## License and reuse

This repository uses custom ProgreTech source-available terms; see [license.md](license.md). Read the permitted uses, attribution, and contribution terms before reusing or submitting code. Public visibility is not an OSI-approved open-source license.

## More from ProgreTech

For more Japanese study tools, visit [Manabi Kōbō](https://manabikobo.com).

Discover the wider portfolio at [progretech.com](https://progretech.com). These links identify related products; they do not imply a bundled integration or shared license.

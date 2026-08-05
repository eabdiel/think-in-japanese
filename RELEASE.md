# Think in Japanese V2.25 — Michel Thomas & Furigana Games Parity

**Release date:** August 4, 2026  
**Author:** Edwin A. Rodriguez / ProgreTech

## Summary

This release brings the native Flask Michel Thomas Companion and Furigana Games pages much closer to their standalone HTML counterparts while preserving the shared draggable, horizontally resizable, minimizable workbench framework.

## Michel Thomas Companion

- Restored the unofficial-companion explanation and local-progress model.
- Added a course-progress tile with completed-CD count, percentage, progress bar, and reset action.
- Added the 6-week / 12-week calendar builder with configurable start date and pace.
- Added the complete CD-by-CD syllabus with locally saved completion checkboxes.
- Added the detailed Foundation and Advanced track reference with 134 source-derived track entries, search, expand-all, and collapse-all actions.
- Added reading and phrase reinforcement cards with Japanese, romaji, meaning, shuffle, romaji visibility, and browser speech playback.
- Added the kana writing lab with 16 source-derived writing prompts.
- Added recall flashcards with flip, previous, and next controls.
- Added the suggested weekly routine.
- Applied English and Spanish labels and guidance while preserving the source course terminology.

## Furigana Games

- Replaced the generic card wall with the grouped system-by-system report layout used by the standalone HTML page.
- Added collection metrics for displayed games, systems, and verified product IDs.
- Added quick platform chips alongside search and system filtering.
- Restored tables with English title, Japanese title, and Japanese product ID columns.
- Added responsive mobile report cards that avoid horizontal scrolling.
- Preserved the 114 source-derived game records and preferred platform order.
- Added localized English and Spanish labels and instructions.

## Workbench behavior

- Every added section is a draggable, horizontally resizable, and minimizable tile.
- Tile layout and tool state remain browser-local.
- Pixel Pastel, Garden Cream, and Tokyo Night styling is supported.
- Original standalone HTML files remain available through **Download offline version** only.
- `main.py` remains the local PyCharm execution entry point.

## Modified files

- `app/data/tool_content.json`
- `app/templates/native_tool.html`
- `app/static/js/native_tools.js`
- `app/static/css/app.css`
- `RELEASE.md`

## Validation

- Python source compilation completed successfully.
- JavaScript syntax validation completed successfully with Node.js.
- JSON content validation completed successfully.
- ZIP integrity validation completed successfully.

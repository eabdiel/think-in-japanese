"""=============================================================================
90-Day Tracker localized content
=============================================================================
Purpose:
    Keeps tracker guidance and labels outside Jinja templates so English and
    Spanish variants share one native Flask implementation.
============================================================================="""

TRACKER_CONTENT = {
    "en": {
        "title": "90-Day Japanese Tracker", "kicker": "Learning planner",
        "subtitle": "Build a realistic daily plan, mark completed work, and defer unfinished days without losing the sequence.",
        "overview_title": "Modes available",
        "overview": "Use the Flask workbench for a flexible, browser-saved tracker or download the original standalone HTML for completely offline use.",
        "web_title": "Flask workbench", "web_body": "Native responsive tiles, local browser storage, day completion, date shifting, notes, print support, and rearrangeable workspace panels.",
        "offline_title": "Offline HTML", "offline_body": "Download the original tracker page, save it anywhere, then open it directly in a desktop or mobile browser. No server or internet connection is required after download.",
        "download": "Download offline tracker", "how_title": "How to use the tracker",
        "steps": ["Choose a start date and apply it to build all 90 calendar dates.", "Open the current day, complete its checklist, then mark the day complete.", "Use Defer + Shift when needed; that day and all future unfinished days move forward one date.", "Your progress, notes, layout, and view preference stay in this browser."],
        "workspace_title": "Interactive 90-Day Workspace", "workspace_note": "Drag, resize, or minimize the panels. Tracker data is saved only in this browser.",
    },
    "es": {
        "title": "Rastreador japonés de 90 días", "kicker": "Planificador de aprendizaje",
        "subtitle": "Crea un plan diario realista, marca el trabajo completado y pospón días sin perder la secuencia.",
        "overview_title": "Modos disponibles",
        "overview": "Usa el área Flask como rastreador flexible guardado en el navegador o descarga el HTML original para uso totalmente sin conexión.",
        "web_title": "Área de trabajo Flask", "web_body": "Paneles nativos adaptables, almacenamiento local, fechas desplazables, notas, impresión y paneles reorganizables.",
        "offline_title": "HTML sin conexión", "offline_body": "Descarga la página original, guárdala donde prefieras y ábrela directamente en un navegador de escritorio o móvil. No necesita servidor ni internet después de descargarla.",
        "download": "Descargar rastreador sin conexión", "how_title": "Cómo usar el rastreador",
        "steps": ["Elige una fecha inicial y aplícala para crear las 90 fechas.", "Abre el día actual, completa su lista y marca el día como completado.", "Usa Posponer + Mover cuando sea necesario; ese día y los futuros no completados avanzarán una fecha.", "Tu progreso, notas, diseño y vista se guardan únicamente en este navegador."],
        "workspace_title": "Área interactiva de 90 días", "workspace_note": "Arrastra, cambia el tamaño o minimiza los paneles. Los datos se guardan solo en este navegador.",
    },
}

def get_tracker_content(language: str) -> dict:
    """Return localized tracker copy with English as a safe fallback."""
    return TRACKER_CONTENT.get(language, TRACKER_CONTENT["en"])

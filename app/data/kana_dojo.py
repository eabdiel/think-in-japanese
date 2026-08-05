"""=============================================================================
Kana Dojo localized content registry
=============================================================================
Purpose:
    Stores all explanatory text for the Kana Dojo Flask experience outside
    the HTML templates. Both English and Spanish pages consume this registry.
============================================================================="""

KANA_DOJO_CONTENT = {
    "en": {
        "kicker": "LEARNING WORKBENCH",
        "title": "Kana Dojo",
        "subtitle": "Train hiragana and katakana through recognition, recall, sound, and focused practice.",
        "overview_title": "Modes Available",
        "overview": "Use the web workbench for guided practice inside Think in Japanese, or download the complete offline HTML version and keep it on your computer, tablet, or phone.",
        "web_title": "Flask / web app mode",
        "web_body": "Best for normal use. The shared menu, language switcher, themes, guidance, and full Kana Dojo workspace stay together in one application.",
        "offline_title": "Offline HTML mode",
        "offline_body": "Download one self-contained HTML file. After it downloads, open it directly in Chrome, Edge, Firefox, Safari, or a mobile browser. No server, sign-in, or internet connection is required after the file is saved.",
        "download": "Download offline version",
        "how_title": "How to use Kana Dojo",
        "steps": [
            "Start in Learn mode and click through each kana row to connect the symbol, sound, and mnemonic.",
            "Move to Memory or Kana Only after the chart feels familiar.",
            "Use Random Kana for a mixed challenge and revisit missed characters before ending your session.",
            "Keep sessions short—five to ten focused minutes is enough for steady progress.",
        ],
        "workspace_title": "Interactive Kana Workspace",
        "workspace_note": "The activity below is fully functional and keeps its own local browser state. Reload only when you want to restart the current session.",
        "tips_title": "Practice guidance",
        "tips": [
            {"icon": "👀", "title": "Recognize first", "body": "Say the sound before clicking. Recognition should become automatic before speed matters."},
            {"icon": "🔊", "title": "Use sound", "body": "Listen, repeat aloud, and compare your pronunciation instead of practicing silently."},
            {"icon": "✍️", "title": "Add writing", "body": "Trace or write the kana on paper after each row to reinforce stroke memory."},
        ],
    },
    "es": {
        "kicker": "ÁREA DE APRENDIZAJE",
        "title": "Kana Dojo",
        "subtitle": "Entrena hiragana y katakana mediante reconocimiento, memoria, sonido y práctica enfocada.",
        "overview_title": "Modos disponibles",
        "overview": "Usa el área web para practicar dentro de Think in Japanese, o descarga la versión HTML completa para guardarla en tu computadora, tableta o teléfono.",
        "web_title": "Modo Flask / aplicación web",
        "web_body": "Ideal para el uso normal. El menú compartido, el selector de idioma, los temas, la guía y el Kana Dojo permanecen juntos en una sola aplicación.",
        "offline_title": "Modo HTML sin conexión",
        "offline_body": "Descarga un solo archivo HTML independiente. Después de descargarlo, ábrelo directamente en Chrome, Edge, Firefox, Safari o un navegador móvil. No requiere servidor, cuenta ni internet una vez guardado.",
        "download": "Descargar versión sin conexión",
        "how_title": "Cómo usar Kana Dojo",
        "steps": [
            "Comienza en modo Aprender y recorre cada fila para relacionar el símbolo, el sonido y la ayuda visual.",
            "Pasa a Memoria o Solo Kana cuando la tabla ya te resulte familiar.",
            "Usa Kana al azar para un reto mixto y repasa los caracteres fallados antes de terminar.",
            "Mantén sesiones cortas: de cinco a diez minutos enfocados es suficiente para avanzar.",
        ],
        "workspace_title": "Área interactiva de Kana",
        "workspace_note": "La actividad funciona por completo y conserva su propio estado local en el navegador. Recarga solo cuando quieras reiniciar la sesión actual.",
        "tips_title": "Guía de práctica",
        "tips": [
            {"icon": "👀", "title": "Reconoce primero", "body": "Di el sonido antes de hacer clic. La precisión debe volverse automática antes de buscar velocidad."},
            {"icon": "🔊", "title": "Usa el audio", "body": "Escucha, repite en voz alta y compara tu pronunciación en vez de practicar en silencio."},
            {"icon": "✍️", "title": "Añade escritura", "body": "Traza o escribe el kana en papel después de cada fila para reforzar la memoria de los trazos."},
        ],
    },
}


def get_kana_dojo_content(language: str) -> dict:
    """Return localized Kana Dojo guidance with English as a safe fallback."""
    return KANA_DOJO_CONTENT.get(language, KANA_DOJO_CONTENT["en"])

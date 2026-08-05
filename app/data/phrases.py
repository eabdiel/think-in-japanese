"""=============================================================================
Native phrase-deck content service
=============================================================================
Purpose:
    Loads the English and Spanish phrase collections extracted from the
    approved V2.6 offline HTML files. Flask templates receive structured data
    and never parse or embed the legacy pages at runtime.
============================================================================="""

from functools import lru_cache
import json
from pathlib import Path

_DATA_FILE = Path(__file__).with_name("phrase_content.json")

_DECK_COPY = {
    "phrases-1": {
        "en": {"kicker":"Foundation deck","title":"Phrases 1","subtitle":"Build a dependable core of everyday Japanese phrases.","overview":"Use the full deck for browsing, then narrow the list by category or search. Mark phrases locally as memorized and use Focus mode for deliberate review.","usage":["Read the Japanese phrase aloud before revealing the supporting fields.","Compare the natural translation with the literal brain translation.","Mark a phrase memorized only after you can recall it without looking.","Use the downloaded HTML when you need a standalone offline copy."],"notes":"Begin with recognition, then speak from the English meaning without reading the Japanese."},
        "es": {"kicker":"Mazo fundamental","title":"Frases 1","subtitle":"Construye una base confiable de frases japonesas cotidianas.","overview":"Usa el mazo completo para explorar y luego filtra por categoría o búsqueda. Marca frases localmente como memorizadas y usa el modo Enfoque para un repaso deliberado.","usage":["Lee la frase japonesa en voz alta antes de revisar los campos de apoyo.","Compara la traducción natural con la traducción cerebral literal.","Marca una frase como memorizada solo cuando puedas recordarla sin mirar.","Usa el HTML descargado cuando necesites una copia independiente sin conexión."],"notes":"Empieza con reconocimiento y luego habla desde el significado en español sin leer el japonés."},
    },
    "phrases-2": {
        "en": {"kicker":"Casual conversation","title":"Phrases 2","subtitle":"Practice natural expressions for friendly, everyday conversation.","overview":"This deck emphasizes casual phrasing and conversational rhythm. Search, filter, shuffle, and save memorized status only in your browser.","usage":["Check the category before using a phrase so the social tone fits.","Repeat each line at natural speed three times.","Use Focus mode to review one phrase without visual clutter.","Download the original HTML for a portable offline deck."],"notes":"Casual Japanese can sound abrupt when used in the wrong setting. Review category and context together."},
        "es": {"kicker":"Conversación casual","title":"Frases 2","subtitle":"Practica expresiones naturales para conversaciones cotidianas y amistosas.","overview":"Este mazo enfatiza frases casuales y ritmo conversacional. Busca, filtra, mezcla y guarda el estado memorizado solo en tu navegador.","usage":["Revisa la categoría antes de usar una frase para confirmar el tono social.","Repite cada línea tres veces a velocidad natural.","Usa el modo Enfoque para estudiar una frase sin distracciones.","Descarga el HTML original para un mazo portátil sin conexión."],"notes":"El japonés casual puede sonar brusco en el contexto equivocado. Estudia la categoría y el contexto juntos."},
    },
    "gaki-style": {
        "en": {"kicker":"Comedy & reactions","title":"Gaki Style","subtitle":"Study playful reactions, comedy phrasing, and expressive Japanese.","overview":"These lines are more situational than the foundation decks. Treat the category and literal meaning as usage guidance, not just translations.","usage":["Notice whether the phrase is a reaction, tease, complaint, or Kansai-style expression.","Practice the rhythm and emotion instead of reading every syllable evenly.","Keep playful phrases for suitable friends and informal settings.","Download the original HTML to carry the standalone deck offline."],"notes":"Expressive phrases depend heavily on delivery and relationship. Do not treat every line as neutral Japanese."},
        "es": {"kicker":"Comedia y reacciones","title":"Estilo Gaki","subtitle":"Estudia reacciones divertidas, frases de comedia y japonés expresivo.","overview":"Estas líneas dependen más de la situación que los mazos fundamentales. Usa la categoría y el significado literal como guía de uso, no solo como traducción.","usage":["Identifica si la frase es una reacción, broma, queja o expresión estilo Kansai.","Practica el ritmo y la emoción en vez de leer cada sílaba de forma uniforme.","Reserva las frases juguetonas para amistades y situaciones informales apropiadas.","Descarga el HTML original para llevar el mazo independiente sin conexión."],"notes":"Las frases expresivas dependen mucho de la entonación y la relación. No todas son japonés neutral."},
    },
}

@lru_cache(maxsize=1)
def _load() -> dict:
    return json.loads(_DATA_FILE.read_text(encoding="utf-8"))

def get_phrase_deck(slug: str, lang: str) -> dict:
    """Return localized copy and structured phrase rows for one native deck."""
    language = "es" if lang == "es" else "en"
    copy = dict(_DECK_COPY[slug][language])
    copy["items"] = _load()[slug][language]
    copy["slug"] = slug
    return copy

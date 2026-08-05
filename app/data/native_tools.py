"""=============================================================================
Native support-tool content service
=============================================================================
Purpose:
    Supplies source-derived content for the remaining iframe-free Flask tools.
============================================================================="""
from functools import lru_cache
import json
from pathlib import Path

_DATA = Path(__file__).with_name('tool_content.json')

@lru_cache(maxsize=1)
def _load():
    return json.loads(_DATA.read_text(encoding='utf-8'))

def get_native_tool(slug: str, lang: str) -> dict:
    raw = _load()
    labels = {
      'kanji-hub': ('Kanji Hub','Centro Kanji','Explore kanji by reading, meaning, phrase, tier, and reading family.','Explora kanji por lectura, significado, frase, nivel y familia de lectura.'),
      'radicals': ('Kanji Radicals','Radicales Kanji','Study 150 kanji building blocks, positions, readings, and examples.','Estudia 150 componentes kanji, posiciones, lecturas y ejemplos.'),
      'sentence-builder': ('Sentence Builder','Constructor de oraciones','Build Japanese sentences from movable word pieces and review reusable patterns.','Construye oraciones japonesas con piezas móviles y repasa patrones reutilizables.'),
      'audio-companion': ('Michel Thomas Companion','Compañero Michel Thomas','Use structured course notes, phrase review, and flashcards beside the audio course.','Usa notas estructuradas, repaso de frases y tarjetas junto al curso de audio.'),
      'furigana-games': ('Furigana Games','Juegos con furigana','Browse learner-friendly Japanese games by platform and title.','Explora juegos japoneses para estudiantes por plataforma y título.'),
    }[slug]
    key={'kanji-hub':'kanji_hub','radicals':'radicals','sentence-builder':'sentence','audio-companion':'audio','furigana-games':'games'}[slug]
    return {'slug':slug,'title':labels[0] if lang=='en' else labels[1], 'subtitle':labels[2] if lang=='en' else labels[3], 'data':raw[key]}

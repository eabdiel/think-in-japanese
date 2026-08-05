"""=============================================================================
Native study-tool content service
=============================================================================
Purpose:
    Loads pre-extracted bilingual content for Reading Aid, Frequency Deck,
    and Study Plan without parsing legacy HTML at Flask runtime.
============================================================================="""
from functools import lru_cache
import json
from pathlib import Path

_DATA_DIR = Path(__file__).resolve().parent

@lru_cache(maxsize=1)
def _study_data():
    return json.loads((_DATA_DIR / "study_content.json").read_text(encoding="utf-8"))

@lru_cache(maxsize=1)
def _plan_data():
    return json.loads((_DATA_DIR / "study_plan_content.json").read_text(encoding="utf-8"))

def get_study_tool(slug: str, lang: str) -> dict:
    data = _study_data()[slug][lang]
    labels = {
        "reading-aid": {
            "en": ("Character Reading Aid", "Search and review the characters used throughout the phrase collections."),
            "es": ("Ayuda de lectura de caracteres", "Busca y repasa los caracteres usados en las colecciones de frases."),
        },
        "frequency-deck": {
            "en": ("Character Frequency Deck", "Prioritize characters by how often they appear in the learning material."),
            "es": ("Mazo de frecuencia de caracteres", "Prioriza caracteres según su frecuencia en el material de estudio."),
        },
    }[slug][lang]
    return {**data, "slug": slug, "heading": labels[0], "subtitle": labels[1]}

def get_study_plan(lang: str) -> dict:
    return {
        "slug": "90-day-plan",
        "title": "Study Plan" if lang == "en" else "Plan de estudio",
        "subtitle": "A practical 90-day sequence for building Japanese habits." if lang == "en" else "Una secuencia práctica de 90 días para crear hábitos de japonés.",
        "sections": _plan_data()[lang],
    }

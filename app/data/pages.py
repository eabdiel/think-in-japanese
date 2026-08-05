"""=============================================================================
Think in Japanese page registry
=============================================================================
Purpose:
    Defines every public page once. Navigation, language switching, reports,
    and page routing all consume this registry to prevent menu variations.
============================================================================="""

PAGES = [
    {"slug":"home","icon":"🏠","en":"Home","es":"Inicio","file_en":"index.html","file_es":"index_es.html","group":"learn","desc_en":"Your Japanese learning dashboard and recommended study path.","desc_es":"Tu panel de aprendizaje y ruta de estudio recomendada."},
    {"slug":"kana-dojo","icon":"あ","en":"Kana Dojo","es":"Kana Dojo","file_en":"kana_dojo.html","file_es":"kana_dojo_es.html","group":"learn","desc_en":"Practice hiragana and katakana with writing, sound, and quiz modes.","desc_es":"Practica hiragana y katakana con escritura, audio y cuestionarios."},
    {"slug":"90-day-plan","icon":"🗺️","en":"Study Plan","es":"Plan de estudio","file_en":"think_in_japanese_part6_90_day_plan.html","file_es":"think_in_japanese_part6_90_day_plan_es.html","group":"learn","desc_en":"Follow a practical beginner roadmap from foundation to fluency habits.","desc_es":"Sigue una ruta práctica desde los fundamentos hasta hábitos de fluidez."},
    {"slug":"tracker","icon":"📅","en":"90-Day Tracker","es":"Rastreador de 90 días","file_en":"japanese_90_day_calendar_tracker.html","file_es":"japanese_90_day_calendar_tracker_es.html","group":"learn","desc_en":"Build a visible daily habit and protect your learning streak.","desc_es":"Crea un hábito diario visible y mantén tu racha de estudio."},
    {"slug":"phrases-1","icon":"💬","en":"Phrases 1","es":"Frases 1","file_en":"think_in_japanese_100_phrases_part1_reformatted.html","file_es":"think_in_japanese_100_phrases_part1_reformatted_es.html","group":"learn","desc_en":"Essential beginner phrases for everyday situations.","desc_es":"Frases esenciales para situaciones cotidianas."},
    {"slug":"phrases-2","icon":"🗨️","en":"Phrases 2","es":"Frases 2","file_en":"think_in_japanese_100_casual_phrases_part2.html","file_es":"think_in_japanese_100_casual_phrases_part2_es.html","group":"learn","desc_en":"Natural casual expressions for friendly conversation.","desc_es":"Expresiones casuales y naturales para conversar."},
    {"slug":"gaki-style","icon":"😎","en":"Gaki Style","es":"Estilo Gaki","file_en":"think_in_japanese_100_gaki_style_phrases_part3.html","file_es":"think_in_japanese_100_gaki_style_phrases_part3_es.html","group":"learn","desc_en":"Playful, modern expressions with usage guidance.","desc_es":"Expresiones modernas y divertidas con orientación de uso."},
    {"slug":"reading-aid","icon":"📖","en":"Reading Aid","es":"Ayuda de lectura","file_en":"think_in_japanese_character_reading_aid_part4.html","file_es":"think_in_japanese_character_reading_aid_part4_es.html","group":"learn","desc_en":"Move from kana recognition to confident reading.","desc_es":"Avanza del reconocimiento de kana a una lectura segura."},
    {"slug":"frequency-deck","icon":"⭐","en":"Frequency Deck","es":"Mazo de frecuencia","file_en":"think_in_japanese_part5_frequency_deck.html","file_es":"think_in_japanese_part5_frequency_deck_es.html","group":"learn","desc_en":"Prioritize the characters and words you will encounter most often.","desc_es":"Prioriza los caracteres y palabras más frecuentes."},
    {"slug":"kanji-hub","icon":"字","en":"Kanji Hub","es":"Centro Kanji","file_en":"kanji_hub.html","file_es":"kanji_hub_es.html","group":"tools","desc_en":"Explore kanji through meanings, readings, and components.","desc_es":"Explora kanji mediante significados, lecturas y componentes."},
    {"slug":"radicals","icon":"部","en":"Kanji Radicals","es":"Radicales Kanji","file_en":"kanji_radicals_trainer.html","file_es":"kanji_radicals_trainer_es.html","group":"tools","desc_en":"Learn the building blocks that make kanji easier to recognize.","desc_es":"Aprende los componentes que facilitan reconocer kanji."},
    {"slug":"sentence-builder","icon":"🧩","en":"Sentence Builder","es":"Constructor de oraciones","file_en":"sentence_structure_trainer.html","file_es":"sentence_structure_trainer.html","group":"tools","desc_en":"Practice Japanese word order and sentence patterns.","desc_es":"Practica el orden de palabras y patrones de oración."},
    {"slug":"audio-companion","icon":"🎧","en":"Michel Thomas Companion","es":"Compañero Michel Thomas","file_en":"michel_thomas_japanese_supplement.html","file_es":"michel_thomas_japanese_supplement.html","group":"support","desc_en":"Use structured notes alongside your audio lessons.","desc_es":"Usa notas estructuradas junto con tus lecciones de audio."},
    {"slug":"furigana-games","icon":"🎮","en":"Furigana Games","es":"Juegos con furigana","file_en":"games_with_furigana_by_system.html","file_es":"games_with_furigana_by_system.html","group":"support","desc_en":"Find learner-friendly games organized by console and reading support.","desc_es":"Encuentra juegos para estudiantes organizados por consola y apoyo de lectura."},
]

PAGE_MAP = {page["slug"]: page for page in PAGES}
VALID_LANGUAGES = {"en", "es"}
VALID_THEMES = {"pixel", "garden", "night"}

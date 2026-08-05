/* =============================================================================
 * Legacy Tool Workspace Adapter
 * =============================================================================
 * Hosts preserved interactive learning pages inside the unified Flask shell,
 * suppresses duplicate legacy navigation, applies the selected theme, and
 * redirects legacy page links through canonical Flask routes.
 * ============================================================================= */
(() => {
  const frame = document.getElementById('tool-frame');
  if (!frame) return;

  const mapping = {"index.html":"/en/","index_es.html":"/es/","kana_dojo.html":"/en/kana-dojo/","kana_dojo_es.html":"/es/kana-dojo/","japanese_90_day_calendar_tracker.html":"/en/tracker/","japanese_90_day_calendar_tracker_es.html":"/es/tracker/","think_in_japanese_100_phrases_part1_reformatted.html":"/en/phrases-1/","think_in_japanese_100_phrases_part1_reformatted_es.html":"/es/phrases-1/","think_in_japanese_100_casual_phrases_part2.html":"/en/phrases-2/","think_in_japanese_100_casual_phrases_part2_es.html":"/es/phrases-2/","think_in_japanese_100_gaki_style_phrases_part3.html":"/en/gaki-style/","think_in_japanese_100_gaki_style_phrases_part3_es.html":"/es/gaki-style/","think_in_japanese_character_reading_aid_part4.html":"/en/reading-aid/","think_in_japanese_character_reading_aid_part4_es.html":"/es/reading-aid/","think_in_japanese_part5_frequency_deck.html":"/en/frequency-deck/","think_in_japanese_part5_frequency_deck_es.html":"/es/frequency-deck/","think_in_japanese_part6_90_day_plan.html":"/en/90-day-plan/","think_in_japanese_part6_90_day_plan_es.html":"/es/90-day-plan/","kanji_hub.html":"/en/kanji-hub/","kanji_hub_es.html":"/es/kanji-hub/","kanji_radicals_trainer.html":"/en/radicals/","kanji_radicals_trainer_es.html":"/es/radicals/","sentence_structure_trainer.html":"/en/sentence-builder/","michel_thomas_japanese_supplement.html":"/en/audio-companion/","games_with_furigana_by_system.html":"/en/furigana-games/"};

  function styleFrame() {
    try {
      const documentInside = frame.contentDocument;
      if (!documentInside) return;
      if (!documentInside.getElementById('tij-workspace-bridge')) {
        const style = documentInside.createElement('style');
        style.id = 'tij-workspace-bridge';
        style.textContent = '.tij-appbar,.tij-sidebar,.tij-mobile-bottom,.tij-theme-pop,.tij-drawer-scrim,.pixel-site-header,.pixel-nav{display:none!important}html,body{padding:0!important;margin-top:0!important;margin-left:0!important}body{min-height:100vh!important}.tij-page-intro{display:none!important}';
        documentInside.head.appendChild(style);
      }
      const theme = document.documentElement.dataset.theme;
      documentInside.documentElement.setAttribute('data-tij-theme', theme);
      documentInside.body.classList.toggle('theme-garden', theme === 'garden');
      documentInside.body.classList.toggle('theme-night', theme === 'night');
      documentInside.querySelectorAll('a[href]').forEach((anchor) => {
        if (anchor.dataset.flaskRouted) return;
        const raw = (anchor.getAttribute('href') || '').split('/').pop();
        if (mapping[raw]) {
          anchor.dataset.flaskRouted = 'true';
          anchor.addEventListener('click', (event) => {
            event.preventDefault();
            parent.location.href = mapping[raw];
          });
        }
      });
    } catch (error) {
      console.warn('Workspace styling unavailable.', error);
    }
  }

  frame.addEventListener('load', styleFrame);
  window.addEventListener('tij-theme-change', styleFrame);
  document.querySelector('[data-workspace-reload]')?.addEventListener('click', () => frame.contentWindow.location.reload());
  document.querySelector('[data-workspace-fullscreen]')?.addEventListener('click', () => {
    const workspace = document.querySelector('.workspace');
    if (!document.fullscreenElement) workspace?.requestFullscreen?.();
    else document.exitFullscreen?.();
  });
})();

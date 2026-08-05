/* =============================================================================
 * Theme Manager
 * =============================================================================
 * Persists the selected color scheme, updates report download links, and
 * broadcasts theme changes to independently versioned interface modules.
 * ============================================================================= */
export function initializeThemeManager() {
  const root = document.documentElement;
  const buttons = [...document.querySelectorAll('[data-set-theme]')];

  function updateReportLinks(theme) {
    document.querySelectorAll('[data-report-download]').forEach((link) => {
      const target = new URL(link.href, window.location.origin);
      target.searchParams.set('theme', theme);
      link.href = target.toString();
    });
  }

  function setTheme(theme) {
    const selected = ['pixel', 'garden', 'night'].includes(theme) ? theme : 'pixel';
    root.dataset.theme = selected;
    localStorage.setItem('tij-theme', selected);
    buttons.forEach((button) => button.classList.toggle('active', button.dataset.setTheme === selected));
    updateReportLinks(selected);
    window.dispatchEvent(new CustomEvent('tij-theme-change', { detail: { theme: selected } }));
  }

  setTheme(localStorage.getItem('tij-theme') || 'pixel');
  buttons.forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.setTheme)));
}

/* =============================================================================
 * Responsive Navigation Controller
 * =============================================================================
 * Coordinates the desktop sidebar, mobile drawer, scrim, and theme panel with
 * a single implementation shared by every language and application page.
 * ============================================================================= */
export function initializeNavigation() {
  const drawer = document.querySelector('[data-drawer]');
  const scrim = document.querySelector('.drawer-scrim');
  const themePanel = document.querySelector('[data-theme-panel]');

  const closeDrawer = () => {
    drawer?.classList.remove('open');
    scrim?.classList.remove('open');
  };

  document.querySelectorAll('[data-drawer-open]').forEach((button) => {
    button.addEventListener('click', () => {
      drawer?.classList.add('open');
      scrim?.classList.add('open');
    });
  });
  document.querySelectorAll('[data-drawer-close]').forEach((button) => button.addEventListener('click', closeDrawer));
  document.querySelector('[data-theme-open]')?.addEventListener('click', () => themePanel?.classList.toggle('open'));
  document.querySelector('[data-theme-close]')?.addEventListener('click', () => themePanel?.classList.remove('open'));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDrawer();
      themePanel?.classList.remove('open');
    }
  });
}

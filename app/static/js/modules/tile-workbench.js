/* =============================================================================
 * Responsive Tile Workbench
 * =============================================================================
 * Adds ALM-Hub-inspired minimization and drag ordering to dashboard tiles.
 * Layout choices are stored locally so the public site needs no user account.
 * ============================================================================= */
export function initializeTileWorkbench() {
  const grid = document.querySelector('[data-tile-grid]');
  if (!grid) return;

  const storageKey = 'tij-dashboard-layout-v2';
  let draggedTile = null;

  function saveLayout() {
    const state = [...grid.querySelectorAll('[data-tile-id]')].map((tile) => ({
      id: tile.dataset.tileId,
      minimized: tile.classList.contains('is-minimized'),
    }));
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function restoreLayout() {
    try {
      const state = JSON.parse(localStorage.getItem(storageKey) || '[]');
      state.forEach((item) => {
        const tile = grid.querySelector(`[data-tile-id="${item.id}"]`);
        if (!tile) return;
        tile.classList.toggle('is-minimized', Boolean(item.minimized));
        grid.appendChild(tile);
      });
    } catch (error) {
      console.warn('Dashboard layout could not be restored.', error);
    }
  }

  grid.querySelectorAll('[data-tile-id]').forEach((tile) => {
    tile.draggable = true;
    tile.querySelector('[data-tile-toggle]')?.addEventListener('click', () => {
      tile.classList.toggle('is-minimized');
      saveLayout();
    });
    tile.addEventListener('dragstart', () => {
      draggedTile = tile;
      tile.classList.add('is-dragging');
    });
    tile.addEventListener('dragend', () => {
      tile.classList.remove('is-dragging');
      draggedTile = null;
      saveLayout();
    });
    tile.addEventListener('dragover', (event) => {
      event.preventDefault();
      if (draggedTile && draggedTile !== tile) {
        const box = tile.getBoundingClientRect();
        grid.insertBefore(draggedTile, event.clientY < box.top + box.height / 2 ? tile : tile.nextSibling);
      }
    });
  });
  restoreLayout();
}

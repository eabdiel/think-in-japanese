/* =============================================================================
 * Native Phrase Workbench
 * =============================================================================
 * Renders the bilingual phrase collections, preserves local study state, and
 * provides a draggable, freely resizable, minimizable workbench canvas.
 * ============================================================================= */
(() => {
  const root = document.querySelector('.phrase-native');
  if (!root) return;
  const lang = root.dataset.language === 'es' ? 'es' : 'en';
  const deck = root.dataset.deck;
  const items = JSON.parse(document.getElementById('phrase-data').textContent || '[]');
  const stateKey = `tij.phrases.v220.${deck}.${lang}`;
  const layoutKey = `tij.phrases.layout.v222.${deck}.${lang}`;
  let state = {memorized: [], notes: '', search: '', category: '', focus: false, memorizedOnly: false, order: items.map(x => x.id)};
  try { state = {...state, ...JSON.parse(localStorage.getItem(stateKey) || '{}')}; } catch (_) {}
  const save = () => localStorage.setItem(stateKey, JSON.stringify(state));
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const search = document.getElementById('phrase-search');
  const category = document.getElementById('phrase-category');
  const list = document.getElementById('phrase-list');
  const empty = document.getElementById('phrase-empty');
  const notes = document.getElementById('phrase-notes');
  [...new Set(items.map(x => x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b)).forEach(value => {
    const option = document.createElement('option'); option.value = value; option.textContent = value; category.appendChild(option);
  });
  search.value = state.search || ''; category.value = state.category || ''; notes.value = state.notes || '';
  function orderedItems() {
    const byId = new Map(items.map(x => [x.id, x]));
    return (state.order || []).map(id => byId.get(id)).filter(Boolean).concat(items.filter(x => !(state.order || []).includes(x.id)));
  }
  function render() {
    const query = (state.search || '').trim().toLocaleLowerCase();
    const memorized = new Set(state.memorized || []);
    let visible = orderedItems().filter(item => {
      const haystack = `${item.jp} ${item.romaji} ${item.natural} ${item.literal} ${item.category}`.toLocaleLowerCase();
      return (!query || haystack.includes(query)) && (!state.category || item.category === state.category) && (!state.memorizedOnly || memorized.has(item.id));
    });
    if (state.focus && visible.length > 1) visible = visible.slice(0, 1);
    list.innerHTML = visible.map(item => `<article class="phrase-card-native ${memorized.has(item.id) ? 'is-memorized' : ''}" data-id="${item.id}">
      <header><span class="phrase-number">${item.id}</span><div class="phrase-japanese">${esc(item.jp)}</div><button class="phrase-memory-toggle" type="button" aria-pressed="${memorized.has(item.id)}">${memorized.has(item.id) ? '✓' : '○'}</button></header>
      <div class="phrase-card-fields"><div><small>Romaji</small><strong>${esc(item.romaji)}</strong></div><div><small>${lang==='es'?'Español natural':'Natural English'}</small><strong>${esc(item.natural)}</strong></div><div><small>${lang==='es'?'Traducción cerebral literal':'Literal brain translation'}</small><strong>${esc(item.literal)}</strong></div></div>
      <footer><span>${esc(item.category)}</span><button class="phrase-speak" type="button" title="${lang==='es'?'Escuchar japonés':'Hear Japanese'}">🔊</button></footer>
    </article>`).join('');
    empty.hidden = visible.length > 0;
    document.getElementById('phrase-visible').textContent = visible.length;
    document.getElementById('phrase-memorized').textContent = memorized.size;
    document.getElementById('phrase-focus').classList.toggle('is-active', state.focus);
    document.getElementById('phrase-memorized-only').classList.toggle('is-active', state.memorizedOnly);
  }
  list.addEventListener('click', event => {
    const card = event.target.closest('.phrase-card-native'); if (!card) return;
    const id = Number(card.dataset.id);
    if (event.target.closest('.phrase-memory-toggle')) {
      const set = new Set(state.memorized || []); set.has(id) ? set.delete(id) : set.add(id); state.memorized = [...set]; save(); render();
    }
    if (event.target.closest('.phrase-speak')) {
      const item = items.find(x => x.id === id);
      if ('speechSynthesis' in window && item) { speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(item.jp); utterance.lang = 'ja-JP'; speechSynthesis.speak(utterance); }
    }
  });
  search.addEventListener('input', event => { state.search = event.target.value; save(); render(); });
  category.addEventListener('change', event => { state.category = event.target.value; save(); render(); });
  notes.addEventListener('input', event => { state.notes = event.target.value; save(); });
  document.getElementById('phrase-shuffle').onclick = () => { state.order = [...items.map(x=>x.id)].sort(()=>Math.random()-.5); save(); render(); };
  document.getElementById('phrase-focus').onclick = () => { state.focus = !state.focus; save(); render(); };
  document.getElementById('phrase-memorized-only').onclick = () => { state.memorizedOnly = !state.memorizedOnly; save(); render(); };
  document.getElementById('phrase-progress-reset').onclick = () => { if (confirm(lang==='es'?'¿Borrar todas las frases memorizadas de este mazo?':'Clear all memorized phrases in this deck?')) { state.memorized=[]; save(); render(); } };

  const canvas = document.getElementById('phrase-canvas');
  const tiles = () => [...canvas.querySelectorAll('.phrase-workbench-tile')];
  let dragged = null;
  let resizing = null;

  function persistLayout() {
    const data = tiles().map(tile => ({
      id: tile.dataset.phraseTile,
      width: tile.style.width,
      min: tile.classList.contains('is-minimized')
    }));
    localStorage.setItem(layoutKey, JSON.stringify(data));
  }

  function applyWidth(tile, width) {
    if (!width) return;
    tile.style.width = width;
    tile.style.flexBasis = width;
    tile.style.flexGrow = '0';
  }

  function loadLayout() {
    let data;
    try { data = JSON.parse(localStorage.getItem(layoutKey) || 'null'); } catch (_) {}
    if (!data) return;
    data.forEach(entry => {
      const tile = canvas.querySelector(`[data-phrase-tile="${entry.id}"]`);
      if (!tile) return;
      canvas.appendChild(tile);
      applyWidth(tile, entry.width);
      tile.classList.toggle('is-minimized', !!entry.min);
      tile.querySelector('.phrase-minimize').textContent = entry.min ? '+' : '−';
    });
  }

  // Dragging starts only from the visible handle. This prevents selections,
  // buttons, and phrase cards from accidentally moving an entire panel.
  canvas.addEventListener('pointerdown', event => {
    const handle = event.target.closest('.phrase-drag-handle');
    if (!handle) return;
    handle.closest('.phrase-workbench-tile').draggable = true;
  });
  canvas.addEventListener('dragstart', event => {
    const tile = event.target.closest('.phrase-workbench-tile');
    if (!tile || !tile.draggable) { event.preventDefault(); return; }
    dragged = tile;
    dragged.classList.add('is-dragging');
    event.dataTransfer.effectAllowed = 'move';
    try { event.dataTransfer.setData('text/plain', tile.dataset.phraseTile); } catch (_) {}
  });
  canvas.addEventListener('dragover', event => {
    if (!dragged) return;
    event.preventDefault();
    const target = event.target.closest('.phrase-workbench-tile');
    tiles().forEach(tile => tile.classList.remove('is-drop-target'));
    if (target && target !== dragged) target.classList.add('is-drop-target');
  });
  canvas.addEventListener('drop', event => {
    if (!dragged) return;
    event.preventDefault();
    const target = event.target.closest('.phrase-workbench-tile');
    tiles().forEach(tile => tile.classList.remove('is-drop-target'));
    if (target && target !== dragged) {
      const rect = target.getBoundingClientRect();
      const before = event.clientY < rect.top + rect.height / 2 ||
        (Math.abs(event.clientY - (rect.top + rect.height / 2)) < rect.height / 3 && event.clientX < rect.left + rect.width / 2);
      canvas.insertBefore(dragged, before ? target : target.nextSibling);
    }
    persistLayout();
  });
  canvas.addEventListener('dragend', () => {
    tiles().forEach(tile => {
      tile.classList.remove('is-drop-target', 'is-dragging');
      tile.draggable = false;
    });
    dragged = null;
    persistLayout();
  });

  // Explicit horizontal resize handle. Unlike CSS resize, this does not react
  // to flex wrapping or save temporary browser-calculated widths.
  canvas.addEventListener('pointerdown', event => {
    const handle = event.target.closest('.phrase-resize-hint');
    if (!handle || window.matchMedia('(max-width:760px)').matches) return;
    event.preventDefault();
    event.stopPropagation();
    const tile = handle.closest('.phrase-workbench-tile');
    const canvasRect = canvas.getBoundingClientRect();
    const rect = tile.getBoundingClientRect();
    resizing = {
      tile,
      startX: event.clientX,
      startWidth: rect.width,
      maxWidth: Math.max(280, canvasRect.width - 2)
    };
    tile.classList.add('is-resizing');
    handle.setPointerCapture?.(event.pointerId);
  });
  window.addEventListener('pointermove', event => {
    if (!resizing) return;
    const type = resizing.tile.dataset.phraseTile;
    const minimum = type === 'deck' ? 320 : 260;
    const width = Math.max(minimum, Math.min(resizing.maxWidth, resizing.startWidth + (event.clientX - resizing.startX)));
    applyWidth(resizing.tile, `${Math.round(width)}px`);
  });
  window.addEventListener('pointerup', () => {
    if (!resizing) return;
    resizing.tile.classList.remove('is-resizing');
    resizing = null;
    persistLayout();
  });

  canvas.addEventListener('click', event => {
    const button = event.target.closest('.phrase-minimize');
    if (!button) return;
    const tile = button.closest('.phrase-workbench-tile');
    tile.classList.toggle('is-minimized');
    button.textContent = tile.classList.contains('is-minimized') ? '+' : '−';
    persistLayout();
  });

  document.getElementById('phrase-layout-reset').onclick = () => {
    localStorage.removeItem(layoutKey);
    location.reload();
  };
  loadLayout(); render();
})();

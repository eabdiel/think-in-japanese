/*=============================================================================
Think in Japanese native study-tool workbench
=============================================================================
Purpose:
  Renders bilingual study collections and provides stable drag, horizontal
  resize, minimize, local notes, memorized state, and layout persistence.
=============================================================================*/
(() => {
  const root = document.querySelector('.study-native');
  if (!root) return;
  const canvas = document.getElementById('study-canvas');
  const lang = root.dataset.language || 'en';
  const tool = root.dataset.tool || 'study';
  const layoutKey = `tij-${tool}-${lang}-layout-v1`;
  const notesKey = `tij-${tool}-${lang}-notes-v1`;
  const memoKey = `tij-${tool}-${lang}-memorized-v1`;
  let dragged = null;
  let resizing = null;
  let items = [];
  try { items = JSON.parse(document.getElementById('study-data')?.textContent || '[]'); } catch (_) {}
  let memorized = new Set(JSON.parse(localStorage.getItem(memoKey) || '[]'));
  let shuffled = false;
  let memorizedOnly = false;

  const saveLayout = () => {
    const state = [...canvas.querySelectorAll('[data-study-tile]')].map(tile => ({
      id: tile.dataset.studyTile,
      width: tile.style.flexBasis || '',
      minimized: tile.classList.contains('is-minimized')
    }));
    localStorage.setItem(layoutKey, JSON.stringify(state));
  };
  const restoreLayout = () => {
    let state = [];
    try { state = JSON.parse(localStorage.getItem(layoutKey) || '[]'); } catch (_) {}
    const map = new Map(state.map(x => [x.id, x]));
    state.forEach(x => { const tile = canvas.querySelector(`[data-study-tile="${CSS.escape(x.id)}"]`); if (tile) canvas.appendChild(tile); });
    canvas.querySelectorAll('[data-study-tile]').forEach(tile => {
      const s = map.get(tile.dataset.studyTile);
      if (!s) return;
      if (s.width) tile.style.flexBasis = s.width;
      tile.classList.toggle('is-minimized', !!s.minimized);
    });
  };

  canvas.querySelectorAll('.study-minimize').forEach(btn => btn.addEventListener('click', () => {
    btn.closest('[data-study-tile]').classList.toggle('is-minimized'); saveLayout();
  }));
  canvas.querySelectorAll('.study-drag-handle').forEach(handle => {
    const tile = handle.closest('[data-study-tile]');
    handle.draggable = true;
    handle.addEventListener('dragstart', e => { dragged = tile; tile.classList.add('is-dragging'); e.dataTransfer.effectAllowed = 'move'; });
    handle.addEventListener('dragend', () => { tile.classList.remove('is-dragging'); dragged = null; saveLayout(); });
  });
  canvas.addEventListener('dragover', e => {
    if (!dragged) return; e.preventDefault();
    const target = e.target.closest('[data-study-tile]');
    if (!target || target === dragged) return;
    const rect = target.getBoundingClientRect();
    canvas.insertBefore(dragged, e.clientX < rect.left + rect.width / 2 ? target : target.nextSibling);
  });
  canvas.querySelectorAll('.study-resize-hint').forEach(handle => {
    handle.addEventListener('pointerdown', e => {
      if (matchMedia('(max-width: 760px)').matches) return;
      const tile = handle.closest('[data-study-tile]');
      resizing = { tile, startX: e.clientX, width: tile.getBoundingClientRect().width };
      handle.setPointerCapture(e.pointerId); e.preventDefault();
    });
    handle.addEventListener('pointermove', e => {
      if (!resizing) return;
      const max = Math.max(280, canvas.clientWidth - 12);
      const width = Math.min(max, Math.max(260, resizing.width + e.clientX - resizing.startX));
      resizing.tile.style.flexBasis = `${Math.round(width)}px`;
    });
    handle.addEventListener('pointerup', () => { if (resizing) saveLayout(); resizing = null; });
  });
  document.getElementById('study-layout-reset')?.addEventListener('click', () => {
    localStorage.removeItem(layoutKey);
    canvas.querySelectorAll('[data-study-tile]').forEach(tile => { tile.style.flexBasis = ''; tile.classList.remove('is-minimized'); });
    location.reload();
  });

  const notes = document.getElementById('study-notes');
  if (notes) { notes.value = localStorage.getItem(notesKey) || ''; notes.addEventListener('input', () => localStorage.setItem(notesKey, notes.value)); }

  const list = document.getElementById('study-list');
  if (list) {
    const search = document.getElementById('study-search');
    const type = document.getElementById('study-type');
    [...new Set(items.map(x => x.type).filter(Boolean))].sort().forEach(value => { const o=document.createElement('option'); o.value=value; o.textContent=value; type.appendChild(o); });
    const render = () => {
      const q=(search.value||'').toLowerCase(); const t=type.value;
      let rows=items.filter(item => (!t || item.type===t) && (!memorizedOnly || memorized.has(item.id)) && JSON.stringify(item).toLowerCase().includes(q));
      if (shuffled) rows=[...rows].sort(()=>Math.random()-.5);
      list.innerHTML='';
      rows.forEach(item => {
        const card=document.createElement('article'); card.className='native-study-card';
        const fields=Object.entries(item.fields||{}).map(([k,v])=>`<div><small>${k}</small><span>${v}</span></div>`).join('');
        card.innerHTML=`<header><b>${item.character}</b><span>${item.type||''}</span><button type="button" aria-label="memorized">${memorized.has(item.id)?'✓':'○'}</button></header><section>${fields}</section>`;
        card.querySelector('button').addEventListener('click',()=>{memorized.has(item.id)?memorized.delete(item.id):memorized.add(item.id);localStorage.setItem(memoKey,JSON.stringify([...memorized]));render();});
        list.appendChild(card);
      });
      document.getElementById('study-visible').textContent=rows.length;
      document.getElementById('study-memorized').textContent=memorized.size;
    };
    search.addEventListener('input',render); type.addEventListener('change',render);
    document.getElementById('study-shuffle').addEventListener('click',()=>{shuffled=!shuffled;render();});
    document.getElementById('study-memorized-only').addEventListener('click',()=>{memorizedOnly=!memorizedOnly;render();});
    render();
  }
  restoreLayout();
})();

/* =============================================================================
 * 90-Day Tracker native workbench
 * =============================================================================
 * Builds the bilingual schedule, persists progress locally, and manages the
 * draggable, resizable, minimizable tracker canvas without server accounts.
 * ============================================================================= */
(() => {
  const root=document.querySelector('.tracker-native'); if(!root)return;
  const es=root.dataset.language==='es';
  const key=`tij.tracker.v219.${es?'es':'en'}`, layoutKey=`tij.tracker.layout.v221.${es?'es':'en'}`;
  const today=new Date(); today.setHours(0,0,0,0);
  const iso=d=>{const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`};
  const add=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
  const dateFrom=s=>new Date(`${s}T00:00:00`);
  const chapter=d=>[[1,7,1],[8,14,2],[15,22,3],[23,30,0],[31,38,4],[39,46,5],[47,53,6],[54,60,7],[61,67,8],[68,74,9],[75,80,10],[81,85,11],[86,90,12]].find(x=>d>=x[0]&&d<=x[1])[2];
  const phase=d=>d<=30?(es?'Fase 1: Base':'Phase 1: Foundation'):d<=60?(es?'Fase 2: Japonés real':'Phase 2: Real Japanese'):(es?'Fase 3: Principiante funcional':'Phase 3: Functional Beginner');
  const plan=()=>Array.from({length:90},(_,i)=>{const d=i+1,dow=i%7,ch=chapter(d),focus=ch?(es?`Genki cap. ${ch}`:`Genki Ch. ${ch}`):(es?'Repaso y recuperación':'Review + catch-up');let tasks;
    if(dow===5) tasks=es?[`${focus}: completa la sección y ejemplos`,'Cuaderno Genki: ejercicios asignados','Escribe vocabulario y kana durante 15 minutos','Lee el diálogo cinco veces','Practica 8 frases personales','Kana Dojo: prueba rápida']:[`${focus}: finish lesson section and examples`,'Genki Workbook: assigned exercises','Write vocabulary and kana for 15 minutes','Read the dialog aloud five times','Practice 8 personal phrases','Kana Dojo speed run'];
    else if(dow===6) tasks=es?['Sin gramática nueva salvo recuperación',`${focus}: repaso semanal`,'Corrige errores del cuaderno','Kana débil solamente','Explica la gramática sin notas']:['No new grammar unless catching up',`${focus}: weekly review`,'Correct workbook mistakes','Weak kana only','Explain grammar without notes'];
    else {const patterns=es?[[`${focus}: gramática`,'Cuaderno: un grupo de ejercicios','Kana Dojo: 10 minutos','Cinco frases en voz alta'],['Audio activo / recuerdo','Vocabulario Genki','Escritura de kana','Dos frases personales'],[`${focus}: diálogo y partículas`,'Cuaderno: ejercicios','Lectura en voz alta','Repaso de kana'],['Audio de puntos débiles',`${focus}: repaso`,'Escritura de vocabulario','Tres frases personales'],['Repaso ligero semanal','Escucha opcional','Kana débil','Mazo de frecuencia']]:[[`${focus}: grammar study`,'Workbook exercise set','Kana Dojo: 10 minutes','Five phrases aloud'],['Active audio recall','Genki vocabulary','Kana writing','Two personal phrases'],[`${focus}: dialog and particles`,'Workbook exercises','Read aloud','Kana review'],['Weak-track audio',`${focus}: review`,'Vocabulary writing','Three personal sentences'],['Light weekly review','Optional listening','Weak kana','Frequency deck']];tasks=patterns[dow]}
    if(d===30)tasks.unshift(es?'Control: completa casi todo Michel Thomas':'Checkpoint: Michel Thomas mostly complete');if(d===60)tasks.unshift(es?'Control: objetivo Genki cap. 7':'Checkpoint: target Genki Ch. 7');if(d===90)tasks.unshift(es?'Control final: termina Genki I':'Final checkpoint: finish Genki I');
    return {day:d,phase:phase(d),focus,type:dow===5?(es?'Trabajo profundo':'Deep work'):dow===6?(es?'Repaso dominical':'Sunday review'):(es?'Día de estudio':'Study day'),time:dow>=5?(es?'Bloque: 1.5–3 horas':'Block: 1.5–3 hours'):(es?'Bloque: 45–90 minutos':'Block: 45–90 minutes'),tasks};});
  const create=start=>({start,compact:false,notes:'',days:plan().map((d,i)=>({...d,date:iso(add(dateFrom(start),i)),status:'open',defer:0}))});
  let state;try{state=JSON.parse(localStorage.getItem(key))}catch(e){}if(!state||state.days?.length!==90)state=create(iso(today));
  const save=()=>localStorage.setItem(key,JSON.stringify(state));
  const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  function render(){root.classList.toggle('is-compact',state.compact);document.getElementById('tracker-start').value=state.start;document.getElementById('tracker-notes').value=state.notes||'';document.getElementById('tracker-compact').textContent=state.compact?(es?'Vista completa':'Full view'):(es?'Vista compacta':'Compact view');const cal=document.getElementById('tracker-calendar');cal.innerHTML='';let month='';state.days.forEach((d,i)=>{const dt=dateFrom(d.date),m=dt.toLocaleDateString(es?'es':'en',{month:'long',year:'numeric'});if(m!==month){month=m;const h=document.createElement('h3');h.className='tracker-month';h.textContent=m;cal.appendChild(h)}const card=document.createElement('article');card.className=`tracker-day ${d.status==='complete'?'is-complete':''} ${d.defer?'is-deferred':''} ${d.date===iso(today)?'is-today':''}`;card.innerHTML=`<div class="tracker-day-head"><div><strong>${es?'Día':'Day'} ${d.day}</strong><small>${d.phase}</small></div><time>${dt.toLocaleDateString(es?'es':'en',{weekday:'short',month:'short',day:'numeric'})}</time></div><div class="tracker-day-focus">${esc(d.focus)}</div><small class="tracker-day-time">${esc(d.time)} · ${esc(d.type)}</small><ul>${d.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><div class="tracker-day-status">${d.status==='complete'?(es?'Estado: completado':'Status: complete'):d.defer?(es?`Movido ${d.defer} día(s)`:`Shifted ${d.defer} day(s)`):(es?'Estado: abierto':'Status: open')}</div><div class="tracker-day-actions"><button class="workbench-button workbench-button--primary" data-action="complete" data-index="${i}">${d.status==='complete'?(es?'Deshacer':'Undo'):(es?'Completar':'Complete')}</button><button class="workbench-button" data-action="defer" data-index="${i}">${es?'Posponer + mover':'Defer + shift'}</button></div>`;cal.appendChild(card)});metrics()}
  function metrics(){const done=state.days.filter(d=>d.status==='complete').length,defer=state.days.reduce((a,d)=>a+(d.defer||0),0),next=state.days.find(d=>d.status!=='complete'),finish=dateFrom(state.days[89].date);document.getElementById('tracker-completed').textContent=`${done}/90`;document.getElementById('tracker-deferred').textContent=defer;document.getElementById('tracker-target').textContent=next?`${es?'Día':'Day'} ${next.day}`:(es?'Terminado':'Done');document.getElementById('tracker-finish').textContent=finish.toLocaleDateString(es?'es':'en',{month:'short',day:'numeric',year:'numeric'});document.getElementById('tracker-progress-bar').style.width=`${Math.round(done/90*100)}%`}
  document.getElementById('tracker-calendar').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const i=+b.dataset.index;if(b.dataset.action==='complete')state.days[i].status=state.days[i].status==='complete'?'open':'complete';else for(let x=i;x<90;x++)if(state.days[x].status!=='complete'){state.days[x].date=iso(add(dateFrom(state.days[x].date),1));state.days[x].defer=(state.days[x].defer||0)+1}save();render()});
  document.getElementById('tracker-apply').onclick=()=>{const n=document.getElementById('tracker-start').value||iso(today);if(!confirm(es?'¿Cambiar la fecha inicial y reconstruir todas las fechas?':'Change the start date and rebuild all dates?'))return;const statuses=state.days.map(d=>d.status),notes=state.notes,compact=state.compact;state=create(n);state.days.forEach((d,i)=>d.status=statuses[i]);state.notes=notes;state.compact=compact;save();render()};
  document.getElementById('tracker-compact').onclick=()=>{state.compact=!state.compact;save();render()};document.getElementById('tracker-print').onclick=()=>window.print();document.getElementById('tracker-reset').onclick=()=>{if(confirm(es?'¿Reiniciar todo el rastreador?':'Reset the full tracker?')){state=create(document.getElementById('tracker-start').value||iso(today));save();render()}};document.getElementById('tracker-notes').oninput=e=>{state.notes=e.target.value;save()};
  // Tile layout -------------------------------------------------------------
  // The tracker canvas uses explicit pointer-based drag and horizontal resize
  // behavior. This avoids ResizeObserver feedback loops that previously saved
  // temporary flex-wrap widths as if the user had resized the tiles.
  const canvas=document.getElementById('tracker-canvas');
  const tiles=()=>[...canvas.querySelectorAll('.tracker-tile')];
  let dragged=null;
  let resizing=null;

  function saveLayout(){
    const data=tiles().map(tile=>({
      id:tile.dataset.trackerTile,
      width:tile.style.width,
      min:tile.classList.contains('is-minimized')
    }));
    localStorage.setItem(layoutKey,JSON.stringify(data));
  }

  function applyWidth(tile,width){
    if(!width)return;
    tile.style.width=width;
    tile.style.flexBasis=width;
    tile.style.flexGrow='0';
  }

  function loadLayout(){
    let data;
    try{data=JSON.parse(localStorage.getItem(layoutKey)||'null')}catch(e){}
    if(!data)return;
    data.forEach(entry=>{
      const tile=canvas.querySelector(`[data-tracker-tile="${entry.id}"]`);
      if(!tile)return;
      canvas.appendChild(tile);
      applyWidth(tile,entry.width);
      tile.classList.toggle('is-minimized',!!entry.min);
      tile.querySelector('.tracker-minimize').textContent=entry.min?'+':'−';
    });
  }

  // Enable HTML drag only while the user is holding a visible drag handle.
  canvas.addEventListener('pointerdown',event=>{
    const handle=event.target.closest('.tracker-drag-handle');
    if(!handle)return;
    const tile=handle.closest('.tracker-tile');
    tile.draggable=true;
  });
  canvas.addEventListener('dragstart',event=>{
    const tile=event.target.closest('.tracker-tile');
    if(!tile||!tile.draggable){event.preventDefault();return;}
    dragged=tile;
    dragged.classList.add('is-dragging');
    event.dataTransfer.effectAllowed='move';
    try{event.dataTransfer.setData('text/plain',tile.dataset.trackerTile)}catch(e){}
  });
  canvas.addEventListener('dragover',event=>{
    if(!dragged)return;
    event.preventDefault();
    const target=event.target.closest('.tracker-tile');
    tiles().forEach(tile=>tile.classList.remove('is-drop-target'));
    if(target&&target!==dragged)target.classList.add('is-drop-target');
  });
  canvas.addEventListener('drop',event=>{
    if(!dragged)return;
    event.preventDefault();
    const target=event.target.closest('.tracker-tile');
    tiles().forEach(tile=>tile.classList.remove('is-drop-target'));
    if(target&&target!==dragged){
      const rect=target.getBoundingClientRect();
      const before=event.clientY<rect.top+rect.height/2 ||
        (Math.abs(event.clientY-(rect.top+rect.height/2))<rect.height/3 && event.clientX<rect.left+rect.width/2);
      canvas.insertBefore(dragged,before?target:target.nextSibling);
    }
    saveLayout();
  });
  canvas.addEventListener('dragend',()=>{
    tiles().forEach(tile=>{tile.classList.remove('is-drop-target','is-dragging');tile.draggable=false;});
    dragged=null;
    saveLayout();
  });

  // Horizontal resize handle. Width is clamped to the visible canvas so a tile
  // can become a narrow column, share a row, or span nearly the full workspace.
  canvas.addEventListener('pointerdown',event=>{
    const handle=event.target.closest('.tracker-resize-hint');
    if(!handle||window.matchMedia('(max-width:760px)').matches)return;
    event.preventDefault();
    const tile=handle.closest('.tracker-tile');
    const canvasRect=canvas.getBoundingClientRect();
    const rect=tile.getBoundingClientRect();
    resizing={tile,startX:event.clientX,startWidth:rect.width,maxWidth:Math.max(280,canvasRect.width-2)};
    tile.classList.add('is-resizing');
    handle.setPointerCapture?.(event.pointerId);
  });
  window.addEventListener('pointermove',event=>{
    if(!resizing)return;
    const minimum=resizing.tile.dataset.trackerTile==='calendar'?320:260;
    const width=Math.max(minimum,Math.min(resizing.maxWidth,resizing.startWidth+(event.clientX-resizing.startX)));
    applyWidth(resizing.tile,`${Math.round(width)}px`);
  });
  window.addEventListener('pointerup',()=>{
    if(!resizing)return;
    resizing.tile.classList.remove('is-resizing');
    resizing=null;
    saveLayout();
  });

  canvas.addEventListener('click',event=>{
    const button=event.target.closest('.tracker-minimize');
    if(!button)return;
    const tile=button.closest('.tracker-tile');
    tile.classList.toggle('is-minimized');
    button.textContent=tile.classList.contains('is-minimized')?'+':'−';
    saveLayout();
  });

  document.getElementById('tracker-layout-reset').onclick=()=>{
    localStorage.removeItem(layoutKey);
    location.reload();
  };
  loadLayout();render();
})();

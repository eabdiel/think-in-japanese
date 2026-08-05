/*=============================================================================
Think in Japanese native support-tool workbenches
=============================================================================
Purpose:
  Provides stable tile layout controls and native interactions for Kanji Hub,
  Radicals, Sentence Builder, Michel Thomas Companion, and Furigana Games.
=============================================================================*/
(() => {
  const root=document.querySelector('.native-tool'); if(!root) return;
  const canvas=document.getElementById('native-canvas'), tool=root.dataset.tool, lang=root.dataset.language||'en';
  const L=(en,es)=>lang==='es'?es:en, layoutKey=`tij-${tool}-${lang}-native-layout-v1`, notesKey=`tij-${tool}-${lang}-notes-v1`;
  let data={}; try{data=JSON.parse(document.getElementById('native-data')?.textContent||'{}')}catch(_){data={}}
  let dragged=null,resizing=null;
  const saveLayout=()=>localStorage.setItem(layoutKey,JSON.stringify([...canvas.querySelectorAll('[data-native-tile]')].map(t=>({id:t.dataset.nativeTile,width:t.style.flexBasis||'',min:t.classList.contains('is-minimized')}))));
  const restoreLayout=()=>{let s=[];try{s=JSON.parse(localStorage.getItem(layoutKey)||'[]')}catch(_){} const m=new Map(s.map(x=>[x.id,x]));s.forEach(x=>{const t=canvas.querySelector(`[data-native-tile="${x.id}"]`);if(t)canvas.appendChild(t)});canvas.querySelectorAll('[data-native-tile]').forEach(t=>{const x=m.get(t.dataset.nativeTile);if(x){t.style.flexBasis=x.width||'';t.classList.toggle('is-minimized',!!x.min)}})};
  canvas.querySelectorAll('.native-minimize').forEach(b=>b.onclick=()=>{b.closest('[data-native-tile]').classList.toggle('is-minimized');saveLayout()});
  canvas.querySelectorAll('.native-drag-handle').forEach(h=>{h.draggable=true;const t=h.closest('[data-native-tile]');h.addEventListener('dragstart',e=>{dragged=t;e.dataTransfer.effectAllowed='move';t.classList.add('is-dragging')});h.addEventListener('dragend',()=>{t.classList.remove('is-dragging');dragged=null;saveLayout()})});
  canvas.addEventListener('dragover',e=>{if(!dragged)return;e.preventDefault();const t=e.target.closest('[data-native-tile]');if(!t||t===dragged)return;const r=t.getBoundingClientRect();canvas.insertBefore(dragged,e.clientX<r.left+r.width/2?t:t.nextSibling)});
  canvas.querySelectorAll('.native-resize-handle').forEach(h=>{h.addEventListener('pointerdown',e=>{if(matchMedia('(max-width:760px)').matches)return;const t=h.closest('[data-native-tile]');resizing={t,x:e.clientX,w:t.getBoundingClientRect().width};h.setPointerCapture(e.pointerId);e.preventDefault()});h.addEventListener('pointermove',e=>{if(!resizing)return;resizing.t.style.flexBasis=`${Math.round(Math.min(canvas.clientWidth-8,Math.max(260,resizing.w+e.clientX-resizing.x)))}px`});h.addEventListener('pointerup',()=>{if(resizing)saveLayout();resizing=null})});
  document.getElementById('native-layout-reset')?.addEventListener('click',()=>{localStorage.removeItem(layoutKey);location.reload()});
  const notes=document.getElementById('native-notes');notes.value=localStorage.getItem(notesKey)||'';notes.oninput=()=>localStorage.setItem(notesKey,notes.value);
  const controls=document.getElementById('native-controls'), workspace=document.getElementById('native-workspace');
  const input=(id,ph)=>`<label>${L('Search','Buscar')}<input id="${id}" type="search" placeholder="${ph}"></label>`;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  if(tool==='kanji-hub'){
    let group='',q='',shuffled=false; const rows=Array.isArray(data)?data:[];
    const groups=[...new Set(rows.map(x=>x.bucket))].sort();
    controls.innerHTML=input('native-search',L('Kanji, reading, phrase…','Kanji, lectura, frase…'))+`<label>${L('Reading family','Familia de lectura')}<select id="native-filter"><option value="">${L('All groups','Todos los grupos')}</option>${groups.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><button class="workbench-button workbench-button--primary" id="native-shuffle">🔀 ${L('Shuffle','Mezclar')}</button>`;
    const render=()=>{let a=rows.filter(x=>(!group||x.bucket===group)&&(!q||JSON.stringify(x).toLowerCase().includes(q)));if(shuffled)a=[...a].sort(()=>Math.random()-.5);workspace.innerHTML=`<div class="native-card-grid">${a.map(x=>`<article class="native-record-card"><header><b class="native-symbol">${x.kanji}</b><span>#${x.rank}</span></header><h3>${esc(x.reading)}</h3><p>${esc(x.natural)}</p><blockquote>${esc(x.word)}<small>${esc(x.romaji)}</small></blockquote><details><summary>${L('Mnemonic and source','Mnemotecnia y fuente')}</summary><p>${esc(x.mnemonic)}</p><small>${esc(x.source)} · ${x.count}</small></details></article>`).join('')}</div>`};
    controls.querySelector('#native-search').oninput=e=>{q=e.target.value.toLowerCase();render()};controls.querySelector('#native-filter').onchange=e=>{group=e.target.value;render()};controls.querySelector('#native-shuffle').onclick=()=>{shuffled=!shuffled;render()};render();
  } else if(tool==='radicals'){
    const rows=Array.isArray(data)?data:[];let q='',pos='';let card=0,revealed=false;
    const positions=[...new Set(rows.map(x=>x[lang==='es'?'position_es':'position_en']))].sort();
    controls.innerHTML=input('native-search',L('Radical, meaning, example…','Radical, significado, ejemplo…'))+`<label>${L('Position','Posición')}<select id="native-filter"><option value="">${L('All positions','Todas las posiciones')}</option>${positions.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><button class="workbench-button workbench-button--primary" id="radical-flash">🃏 ${L('Flashcard mode','Modo tarjetas')}</button>`;
    const positionDiagram=(position)=>{const p=String(position||'');let active;if(/Left|Izquierda/i.test(p))active=[0,3,6];else if(/Right|Derecha/i.test(p))active=[2,5,8];else if(/Top|Arriba/i.test(p))active=[0,1,2];else if(/Bottom|Abajo/i.test(p))active=[6,7,8];else if(/Center|Centro/i.test(p))active=[4];else active=[0,1,2,3,4,5,6,7,8];return `<div class="radical-position-grid" aria-label="${esc(position)}">${Array.from({length:9},(_,i)=>`<i class="${active.includes(i)?'is-active':''}"></i>`).join('')}</div>`};
    const render=()=>{const a=rows.filter(x=>(!pos||x[lang==='es'?'position_es':'position_en']===pos)&&(!q||JSON.stringify(x).toLowerCase().includes(q)));workspace.innerHTML=`<div class="radical-result-count">${a.length} / ${rows.length}</div><div class="radical-card-grid">${a.map(x=>{const position=x[lang==='es'?'position_es':'position_en'];return `<article class="radical-card"><div class="radical-symbol">${x.symbol}</div><h3>${esc(x[lang==='es'?'meaning_es':'meaning_en'])}</h3>${positionDiagram(position)}<p><b>${L('Position','Posición')}:</b> ${esc(position)}</p><p><b>On’yomi:</b> ${esc(x.on)} &nbsp; <b>Kun’yomi:</b> ${esc(x.kun)}</p><div class="radical-examples"><b>${L('Examples','Ejemplos')}:</b><div>${x.examples.map(e=>`<span class="radical-example"><em>${x.symbol}</em><strong>→</strong>${e}</span>`).join('')}</div></div></article>`}).join('')}</div>`};
    controls.querySelector('#native-search').oninput=e=>{q=e.target.value.toLowerCase();render()};controls.querySelector('#native-filter').onchange=e=>{pos=e.target.value;render()};controls.querySelector('#radical-flash').onclick=()=>{card=(card+1)%rows.length;revealed=false;const x=rows[card];workspace.innerHTML=`<button class="native-flashcard" id="reveal-radical"><b>${x.symbol}</b><span>${L('Tap to reveal','Toca para revelar')}</span></button>`;workspace.querySelector('button').onclick=()=>{if(revealed)return;revealed=true;workspace.querySelector('span').textContent=`${x[lang==='es'?'meaning_es':'meaning_en']} · ${x.on} / ${x.kun} · ${x.examples.join(' ')}`}};render();
  } else if(tool==='sentence-builder'){
    const challenges=data.challenges||[],patterns=data.patterns||[],lessons=data.lessons||[];
    let ix=0, level='normal', patternLimit=18, category='all', cardIndex=0, cardFlipped=false;
    const colorKey=document.getElementById('sentence-color-key');
    const syllabus=document.getElementById('sentence-syllabus');
    const patternArea=document.getElementById('sentence-patterns');
    const flashArea=document.getElementById('sentence-flashcards');
    const cheatArea=document.getElementById('sentence-cheatsheet');
    const classFor=w=>{
      if(['は','が','を','に','へ','で','と','も','の','から','まで','より','か'].includes(w))return 'grammar-particle';
      if(['明日','今日','昨日','今','毎日','週末'].includes(w))return 'grammar-time';
      if(['学校','ここ','家','机の上','日本','東京','大阪'].includes(w))return 'grammar-place';
      if(['水','日本語','本','写真','肉','漢字'].includes(w))return 'grammar-object';
      if(['おもしろい','寒い','楽しい','いい','好き'].includes(w))return 'grammar-adjective';
      if(['前に','後で','こと','ように','たら','そうです'].includes(w))return 'grammar-pattern';
      if(/ます|ません|ました|です|ください|います|あります|思います|なりました|飲む|行かない|見た$/.test(w))return 'grammar-verb';
      return 'grammar-noun';
    };
    const colorize=jp=>String(jp||'').split(/(は|が|を|に|へ|で|と|も|の|から|まで|より|か|明日|今日|昨日|今|学校|ここ|家|机の上|日本|東京|大阪|水|日本語|本|写真|肉|漢字|おもしろい|寒い|楽しい|いい|好き|前に|後で|こと|ように|たら|そうです|飲みます|食べません|見ました|勉強します|行きます|あります|います|です)/g).filter(Boolean).map(x=>`<span class="grammar-token ${classFor(x)}">${esc(x)}</span>`).join('');
    controls.innerHTML=`
      <div class="sentence-control-grid">
        <button class="workbench-button workbench-button--primary" id="sentence-next">➡ ${L('Next challenge','Siguiente reto')}</button>
        <button class="workbench-button" id="sentence-check">✓ ${L('Validate sentence','Validar oración')}</button>
        <button class="workbench-button" id="sentence-clear">↺ ${L('Reset pieces','Restablecer piezas')}</button>
        <button class="workbench-button" id="sentence-reveal">👁 ${L('Reveal answer','Mostrar respuesta')}</button>
      </div>
      <label>${L('Difficulty','Dificultad')}<select id="sentence-level"><option value="easy">${L('Easy','Fácil')}</option><option value="normal" selected>${L('Normal','Normal')}</option><option value="hard">${L('Hard','Difícil')}</option></select></label>
      <label>${L('Pattern reference','Referencia de patrones')}<select id="pattern-select">${patterns.map((p,i)=>`<option value="${i}">${esc(p.name)}</option>`).join('')}</select></label>
      <div id="pattern-reference" class="sentence-mini-reference"></div>`;
    const draw=()=>{
      const pool=challenges.filter(c=>level==='hard'?true:(level==='normal'?c.lvl!=='hard':c.lvl==='easy'));
      if(!pool.length)return;
      const c=pool[ix%pool.length];
      const words=[...c.ans,...c.extra].sort(()=>Math.random()-.5);
      workspace.innerHTML=`<section class="sentence-prompt"><span>${esc(c.lvl)}</span><h2>${esc(c.en)}</h2><p>${L('Drag or tap the Japanese pieces into the answer area.','Arrastra o toca las piezas japonesas dentro del área de respuesta.')}</p></section><h3>${L('Your sentence','Tu oración')}</h3><div class="sentence-dropzone" id="sentence-answer"></div><h3>${L('Word bank','Banco de palabras')}</h3><div class="sentence-wordbank">${words.map(w=>`<button draggable="true" class="grammar-token ${classFor(w)}">${esc(w)}</button>`).join('')}</div><div id="sentence-feedback"></div>`;
      const answer=workspace.querySelector('#sentence-answer');
      workspace.querySelectorAll('.sentence-wordbank button').forEach(b=>{
        b.onclick=()=>answer.appendChild(b);
        b.ondragstart=e=>{e.dataTransfer.setData('text/plain',b.textContent);b.classList.add('is-dragging')};
        b.ondragend=()=>b.classList.remove('is-dragging');
      });
      answer.ondragover=e=>e.preventDefault();
      answer.ondrop=e=>{e.preventDefault();const txt=e.dataTransfer.getData('text/plain');const b=[...workspace.querySelectorAll('.sentence-wordbank button')].find(x=>x.textContent===txt);if(b)answer.appendChild(b)};
    };
    const currentChallenge=()=>{const pool=challenges.filter(c=>level==='hard'?true:(level==='normal'?c.lvl!=='hard':c.lvl==='easy'));return pool[ix%pool.length]};
    const showPattern=()=>{const p=patterns[+controls.querySelector('#pattern-select').value];controls.querySelector('#pattern-reference').innerHTML=`<h3>${esc(p.structure)}</h3><div class="sentence-colored-example">${colorize(p.jp)}</div><p>${esc(p.en)}</p>`};
    controls.querySelector('#sentence-next').onclick=()=>{ix++;draw()};
    controls.querySelector('#sentence-clear').onclick=draw;
    controls.querySelector('#sentence-reveal').onclick=()=>{const c=currentChallenge(),answer=workspace.querySelector('#sentence-answer');answer.innerHTML=c.ans.map(w=>`<button class="grammar-token ${classFor(w)}">${esc(w)}</button>`).join('');workspace.querySelector('#sentence-feedback').innerHTML=`<div class="sentence-result warn">${L('Answer revealed. Read it aloud, then try the next sentence.','Respuesta mostrada. Léela en voz alta y luego intenta la siguiente oración.')}</div>`};
    controls.querySelector('#sentence-check').onclick=()=>{const c=currentChallenge(),a=[...workspace.querySelectorAll('#sentence-answer button')].map(x=>x.textContent),ok=JSON.stringify(a)===JSON.stringify(c.ans);workspace.querySelector('#sentence-feedback').innerHTML=`<div class="sentence-result ${ok?'ok':'bad'}">${ok?L('Correct! Great structure.','¡Correcto! Buena estructura.'):L('Try again. Expected: ','Inténtalo de nuevo. Se esperaba: ')+c.ans.join(' ')}</div>`};
    controls.querySelector('#sentence-level').onchange=e=>{level=e.target.value;ix=0;draw()};
    controls.querySelector('#pattern-select').onchange=showPattern;

    const keyItems=[['Topic / は','Tema / は','grammar-topic'],['Particle','Partícula','grammar-particle'],['Object / を','Objeto / を','grammar-object'],['Verb / Ending','Verbo / terminación','grammar-verb'],['Adjective','Adjetivo','grammar-adjective'],['Noun','Sustantivo','grammar-noun'],['Time','Tiempo','grammar-time'],['Place','Lugar','grammar-place'],['Grammar Pattern','Patrón gramatical','grammar-pattern']];
    colorKey.innerHTML=`<div class="sentence-color-key">${keyItems.map(x=>`<span class="grammar-token ${x[2]}">${esc(lang==='es'?x[1]:x[0])}</span>`).join('')}</div><p>${L('Japanese usually places context first and the main verb or ending last. Think: time/context → topic → place/details → object → verb/ending.','El japonés normalmente coloca primero el contexto y al final el verbo o la terminación principal. Piensa: tiempo/contexto → tema → lugar/detalles → objeto → verbo/terminación.')}</p>`;
    syllabus.innerHTML=`<p>${L('Work through these stages in order. Each stage unlocks a major group of everyday sentences.','Avanza por estas etapas en orden. Cada etapa abre un grupo importante de oraciones cotidianas.')}</p><div class="sentence-syllabus-grid">${lessons.map(x=>`<article><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></article>`).join('')}</div>`;
    const categories=[...new Set(patterns.map(p=>p.cat))];
    const renderPatterns=()=>{const list=patterns.filter(p=>category==='all'||p.cat===category);patternArea.innerHTML=`<div class="sentence-pattern-toolbar"><label>${L('Filter','Filtro')}<select id="sentence-category"><option value="all">${L('All categories','Todas las categorías')}</option>${categories.map(c=>`<option value="${esc(c)}" ${c===category?'selected':''}>${esc(c)}</option>`).join('')}</select></label><button class="workbench-button" id="sentence-show-all">${patternLimit>18?L('Show first 18','Mostrar 18'):L('Show all','Mostrar todos')}</button></div><div class="sentence-pattern-grid">${list.slice(0,patternLimit).map(p=>`<article class="sentence-pattern-card"><h3>${esc(p.name)}</h3><div class="sentence-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><code>${esc(p.structure)}</code><div class="sentence-colored-example">${colorize(p.jp)}</div><p>${esc(p.en)}</p></article>`).join('')}</div>`;patternArea.querySelector('#sentence-category').onchange=e=>{category=e.target.value;renderPatterns()};patternArea.querySelector('#sentence-show-all').onclick=()=>{patternLimit=patternLimit>18?18:999;renderPatterns()}};
    const cards=patterns.map(p=>({front:`${L('Pattern','Patrón')}: ${p.name}\n${p.structure}`,back:`${p.jp}\n${p.en}\n${L('Category','Categoría')}: ${p.cat}`}));
    const renderCard=()=>{const c=cards[cardIndex];flashArea.innerHTML=`<button class="sentence-flashcard" id="sentence-flashcard">${esc(cardFlipped?c.back:c.front).replace(/\n/g,'<br>')}</button><div class="sentence-flash-controls"><button class="workbench-button" id="sentence-prev">← ${L('Previous','Anterior')}</button><button class="workbench-button workbench-button--primary" id="sentence-flip">↻ ${L('Flip','Voltear')}</button><button class="workbench-button" id="sentence-next-card">${L('Next','Siguiente')} →</button><button class="workbench-button" id="sentence-shuffle">🔀 ${L('Shuffle','Mezclar')}</button></div>`;flashArea.querySelector('#sentence-flashcard').onclick=flashArea.querySelector('#sentence-flip').onclick=()=>{cardFlipped=!cardFlipped;renderCard()};flashArea.querySelector('#sentence-prev').onclick=()=>{cardIndex=(cardIndex-1+cards.length)%cards.length;cardFlipped=false;renderCard()};flashArea.querySelector('#sentence-next-card').onclick=()=>{cardIndex=(cardIndex+1)%cards.length;cardFlipped=false;renderCard()};flashArea.querySelector('#sentence-shuffle').onclick=()=>{cards.sort(()=>Math.random()-.5);cardIndex=0;cardFlipped=false;renderCard()}};
    const cheats=lang==='es'?[['は wa','Marcador de tema: “en cuanto a...”. Se escribe は y se pronuncia wa como partícula.'],['が ga','Marca el sujeto o información nueva; se usa mucho con existencia, habilidad y gustos.'],['を o','Marca el objeto directo de una acción: 水を飲みます = beber agua.'],['に / へ','Destino, momento, objetivo u objeto indirecto. へ enfatiza dirección.'],['で','Lugar donde ocurre una acción o herramienta/método usado.'],['と / や','と = y/con/cita. や = y cosas como...'],['から / まで','Desde / hasta: 9時から5時まで.'],['です / ます','Terminaciones formales: です para sustantivos/adjetivos; ます para verbos.'],['Formas simples','La forma diccionario, ない, た y なかった son la base de muchos patrones.']]:[['は wa','Topic marker: “as for...” Written は, pronounced wa as a particle.'],['が ga','Marks subject or new information; common with existence, ability, and likes.'],['を o','Marks the direct object of an action: 水を飲みます = drink water.'],['に / へ','Destination, time point, target, or indirect object. へ emphasizes direction.'],['で','Where an action happens, or the tool or method used.'],['と / や','と = and/with/quote marker. や = and things like...'],['から / まで','From / until: 9時から5時まで.'],['です / ます','Polite endings: です for noun/adjective sentences; ます for verbs.'],['Plain forms','Dictionary form, ない, た, and なかった become the base for many patterns.']];
    cheatArea.innerHTML=`<div class="sentence-cheat-grid">${cheats.map(x=>`<article><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join('')}</div>`;
    draw();showPattern();renderPatterns();renderCard();
  } else if(tool==='audio-companion'){
    const units=data.units||[],phrases=data.phrases||[],flash=data.flash||[];let fi=0,show=false;
    controls.innerHTML=input('native-search',L('Track, focus, phrase…','Pista, enfoque, frase…'))+`<button class="workbench-button workbench-button--primary" id="audio-flash">🃏 ${L('Flashcard','Tarjeta')}</button><button class="workbench-button" id="audio-next">➡ ${L('Next card','Siguiente tarjeta')}</button>`;
    const render=q=>{const us=units.filter(x=>JSON.stringify(x).toLowerCase().includes(q));const ps=phrases.filter(x=>JSON.stringify(x).toLowerCase().includes(q));workspace.innerHTML=`<h2>${L('Course map','Mapa del curso')}</h2><div class="audio-unit-grid">${us.map(x=>`<article><small>${esc(x.course)} · ${esc(x.cd)}</small><h3>${esc(x.title)}</h3><p>${esc(x.focus)}</p></article>`).join('')}</div><h2>${L('Phrase companion','Compañero de frases')}</h2><div class="native-card-grid">${ps.map(x=>`<article class="native-record-card"><h3>${esc(x.jp)}</h3><p>${esc(x.romaji)}</p><strong>${esc(x.en)}</strong><button class="speak-button" data-speak="${esc(x.jp)}">🔊</button></article>`).join('')}</div>`;workspace.querySelectorAll('[data-speak]').forEach(b=>b.onclick=()=>{speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(b.dataset.speak))})};
    controls.querySelector('#native-search').oninput=e=>render(e.target.value.toLowerCase());controls.querySelector('#audio-flash').onclick=()=>{show=!show;workspace.innerHTML=`<button class="native-flashcard" id="audio-card"><b>${show?flash[fi][1].replace(/<[^>]+>/g,' '):flash[fi][0]}</b><span>${L('Tap to flip','Toca para voltear')}</span></button>`;workspace.querySelector('button').onclick=()=>controls.querySelector('#audio-flash').click()};controls.querySelector('#audio-next').onclick=()=>{fi=(fi+1)%flash.length;show=false;controls.querySelector('#audio-flash').click()};render('');
  } else if(tool==='furigana-games'){
    const rows=Array.isArray(data)?data:[];let q='',system='';const systems=[...new Set(rows.map(x=>x.system))].sort();
    controls.innerHTML=input('native-search',L('Title, Japanese title, ID…','Título, título japonés, ID…'))+`<label>${L('System','Sistema')}<select id="native-filter"><option value="">${L('All systems','Todos los sistemas')}</option>${systems.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><button class="workbench-button workbench-button--primary" id="games-print">🖨 ${L('Print list','Imprimir lista')}</button>`;
    const render=()=>{const a=rows.filter(x=>(!system||x.system===system)&&(!q||JSON.stringify(x).toLowerCase().includes(q)));workspace.innerHTML=`<div class="games-count">${a.length} ${L('games','juegos')}</div><div class="game-card-grid">${a.map(x=>`<article class="game-card"><small>${esc(x.system)}</small><h3>${esc(x.english)}</h3><p lang="ja">${esc(x.japanese)}</p><code>${esc(x.id||L('Not verified','No verificado'))}</code></article>`).join('')}</div>`};controls.querySelector('#native-search').oninput=e=>{q=e.target.value.toLowerCase();render()};controls.querySelector('#native-filter').onchange=e=>{system=e.target.value;render()};controls.querySelector('#games-print').onclick=()=>print();render();
  }
  restoreLayout();
})();

/* =============================================================================
Kana Dojo native Flask workbench
=============================================================================
Purpose:
  Provides the complete in-app Kana Dojo experience without embedding legacy
  HTML. Session statistics and review data remain local to the browser.
============================================================================= */
(() => {
  const root = document.querySelector('.kana-native');
  if (!root) return;
  const isEs = root.dataset.language === 'es';

  /* ==========================================================================
  Workbench tile layout manager
  ==========================================================================
  Major Kana Dojo panels are reorderable and resizable. Layout preferences are
  browser-local and language-specific so English and Spanish can each retain a
  useful arrangement without requiring user accounts.
  ========================================================================= */
  const workspace = root.querySelector('.kana-practice-grid');
  const layoutKey = `tij-kana-workbench-layout-v2261-${isEs ? 'es' : 'en'}`;
  const defaultOrder = ['controls', 'board', 'review'];
  let draggedTile = null;

  function saveWorkbenchLayout() {
    if (!workspace) return;
    const tiles = [...workspace.querySelectorAll('[data-kana-tile]')];
    const layout = tiles.map((tile) => ({
      id: tile.dataset.kanaTile,
      width: Math.round(tile.getBoundingClientRect().width),
    }));
    try { localStorage.setItem(layoutKey, JSON.stringify(layout)); } catch (error) { /* local storage is optional */ }
  }

  function applyWorkbenchLayout() {
    if (!workspace) return;
    let layout = [];
    try { layout = JSON.parse(localStorage.getItem(layoutKey) || '[]'); } catch (error) { layout = []; }
    if (!Array.isArray(layout) || !layout.length) return;
    const byId = new Map([...workspace.querySelectorAll('[data-kana-tile]')].map((tile) => [tile.dataset.kanaTile, tile]));
    layout.forEach((item) => {
      const tile = byId.get(item.id);
      if (!tile) return;
      workspace.appendChild(tile);
      if (window.innerWidth > 850 && Number.isFinite(item.width)) {
        const maxWidth = Math.max(240, workspace.clientWidth);
        const width = Math.min(maxWidth, Math.max(240, item.width));
        tile.style.width = `${width}px`;
        tile.style.flexBasis = `${width}px`;
      }
    });
  }

  function resetWorkbenchLayout() {
    if (!workspace) return;
    const byId = new Map([...workspace.querySelectorAll('[data-kana-tile]')].map((tile) => [tile.dataset.kanaTile, tile]));
    defaultOrder.forEach((id) => { if (byId.has(id)) workspace.appendChild(byId.get(id)); });
    [...workspace.querySelectorAll('[data-kana-tile]')].forEach((tile) => {
      tile.style.removeProperty('width');
      tile.style.removeProperty('height');
      tile.style.removeProperty('flex-basis');
    });
    try { localStorage.removeItem(layoutKey); } catch (error) { /* local storage is optional */ }
  }

  function initializeWorkbenchTiles() {
    if (!workspace) return;
    applyWorkbenchLayout();
    workspace.querySelectorAll('[data-kana-tile]').forEach((tile) => {
      const handle = tile.querySelector('.kana-drag-handle');
      const resizeHandle = tile.querySelector('.kana-resize-hint');
      tile.draggable = false;
      handle?.addEventListener('pointerdown', () => { tile.draggable = true; });
      handle?.addEventListener('pointerup', () => { tile.draggable = false; });
      handle?.addEventListener('pointercancel', () => { tile.draggable = false; });
      tile.addEventListener('dragstart', (event) => {
        if (!tile.draggable) { event.preventDefault(); return; }
        draggedTile = tile;
        tile.classList.add('is-dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', tile.dataset.kanaTile || 'tile');
      });
      tile.addEventListener('dragend', () => {
        tile.draggable = false;
        tile.classList.remove('is-dragging');
        workspace.querySelectorAll('.is-drop-target').forEach((item) => item.classList.remove('is-drop-target'));
        draggedTile = null;
        saveWorkbenchLayout();
      });
      tile.addEventListener('dragover', (event) => {
        if (!draggedTile || draggedTile === tile) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        tile.classList.add('is-drop-target');
      });
      tile.addEventListener('dragleave', () => tile.classList.remove('is-drop-target'));
      tile.addEventListener('drop', (event) => {
        event.preventDefault();
        tile.classList.remove('is-drop-target');
        if (!draggedTile || draggedTile === tile) return;
        const bounds = tile.getBoundingClientRect();
        const insertAfter = event.clientX > bounds.left + bounds.width / 2 || event.clientY > bounds.top + bounds.height / 2;
        workspace.insertBefore(draggedTile, insertAfter ? tile.nextSibling : tile);
        saveWorkbenchLayout();
      });

      resizeHandle?.addEventListener('pointerdown', (event) => {
        if (window.innerWidth <= 850) return;
        event.preventDefault();
        event.stopPropagation();
        const startX = event.clientX;
        const startWidth = tile.getBoundingClientRect().width;
        const workspaceWidth = workspace.getBoundingClientRect().width;
        const minWidth = tile.dataset.kanaTile === 'board' ? Math.min(520, workspaceWidth) : 240;
        tile.classList.add('is-resizing');
        resizeHandle.setPointerCapture?.(event.pointerId);
        const move = (moveEvent) => {
          const width = Math.min(workspaceWidth, Math.max(minWidth, startWidth + moveEvent.clientX - startX));
          tile.style.width = `${Math.round(width)}px`;
          tile.style.flexBasis = `${Math.round(width)}px`;
        };
        const stop = () => {
          tile.classList.remove('is-resizing');
          resizeHandle.removeEventListener('pointermove', move);
          resizeHandle.removeEventListener('pointerup', stop);
          resizeHandle.removeEventListener('pointercancel', stop);
          saveWorkbenchLayout();
        };
        resizeHandle.addEventListener('pointermove', move);
        resizeHandle.addEventListener('pointerup', stop);
        resizeHandle.addEventListener('pointercancel', stop);
      });
    });
    document.getElementById('kana-layout-reset')?.addEventListener('click', resetWorkbenchLayout);
  }
  const baseRows = [
    ['Vowels','v',[['a','あ','ア','🐊','Alligator'],['i','い','イ','🦅','Eagle'],['u','う','ウ','🛸','UFO'],['e','え','エ','🙌','Excited'],['o','お','オ','🐙','Octopus']]],
    ['K Row','k',[['ka','か','カ','🪁','Kite'],['ki','き','キ','🔑','Key'],['ku','く','ク','🐦','Cuckoo'],['ke','け','ケ','🛢️','Keg'],['ko','こ','コ','🐟','Koi']]],
    ['S Row','s',[['sa','さ','サ','🪚','Saw'],['shi','し','シ','🐑','Sheep'],['su','す','ス','🍣','Sushi'],['se','せ','セ','⚖️','Seesaw'],['so','そ','ソ','🧦','Socks']]],
    ['T Row','t',[['ta','た','タ','🌮','Taco'],['chi','ち','チ','🐆','Cheetah'],['tsu','つ','ツ','🌊','Tsunami'],['te','て','テ','🎾','Tennis'],['to','と','ト','🍅','Tomato']]],
    ['N Row','n',[['na','な','ナ','🐋','Narwhal'],['ni','に','ニ','🪡','Needle'],['nu','ぬ','ヌ','🍜','Noodles'],['ne','ね','ネ','🪺','Nest'],['no','の','ノ','📘','Notebook']]],
    ['H Row','h',[['ha','は','ハ','🎩','Hat'],['hi','ひ','ヒ','🦛','Hippo'],['fu','ふ','フ','🍱','Food'],['he','へ','ヘ','🚁','Helicopter'],['ho','ほ','ホ','🐴','Horse']]],
    ['M Row','m',[['ma','ま','マ','🗺️','Map'],['mi','み','ミ','🥛','Milk'],['mu','む','ム','🌙','Moon'],['me','め','メ','🍈','Melon'],['mo','も','モ','🐒','Monkey']]],
    ['Y Row','y',[['ya','や','ヤ','🐂','Yak'],null,['yu','ゆ','ユ','🦄','Unicorn'],null,['yo','よ','ヨ','🪀','Yo-yo']]],
    ['R Row','r',[['ra','ら','ラ','📻','Radio'],['ri','り','リ','💍','Ring'],['ru','る','ル','📏','Ruler'],['re','れ','レ','🧾','Receipt'],['ro','ろ','ロ','🚀','Rocket']]],
    ['W & N','w',[['wa','わ','ワ','🌊','Wave'],null,['wo','を','ヲ','🐺','Wolf'],null,['n','ん','ン','🥷','Ninja']]]
  ];
  const voicedRows = [
    ['G Row','g',[['ga','が','ガ','🦍','Gorilla'],['gi','ぎ','ギ','🎸','Guitar'],['gu','ぐ','グ','🪿','Goose'],['ge','げ','ゲ','🎮','Game'],['go','ご','ゴ','🦆','Goose']]],
    ['Z Row','z',[['za','ざ','ザ','🦓','Zebra'],['ji','じ','ジ','👖','Jeans'],['zu','ず','ズ','🦒','Zoo'],['ze','ぜ','ゼ','0️⃣','Zero'],['zo','ぞ','ゾ','🧟','Zombie']]],
    ['D Row','d',[['da','だ','ダ','🎯','Dart'],['ji','ぢ','ヂ','💿','Disc'],['zu','づ','ヅ','🧩','Puzzle'],['de','で','デ','🖥️','Desk'],['do','ど','ド','🚪','Door']]],
    ['B Row','b',[['ba','ば','バ','🦇','Bat'],['bi','び','ビ','🍺','Beer'],['bu','ぶ','ブ','👢','Boot'],['be','べ','ベ','🔔','Bell'],['bo','ぼ','ボ','⚽','Ball']]]
  ];
  const pRow = ['P Row','p',[['pa','ぱ','パ','🥧','Pie'],['pi','ぴ','ピ','🍕','Pizza'],['pu','ぷ','プ','🐩','Poodle'],['pe','ぺ','ペ','✒️','Pen'],['po','ぽ','ポ','🪴','Pot']]];
  const standardWords = ['hai','iie','ai','ao','ie','ue','koi','ika','aki','eki','kaki','kiku','sake','sushi','suki','asa','ashi','taiko','tako','taki','tsuki','tori','nani','neko','inu','niwa','hana','hito','hoshi','fune','heya','mimi','mame','mori','momo','ame','umi','yama','yume','yuki','yoru','ringo','sora','kumo','mura','machi','michi','miso','kasa','ramen','anime','karaoke','kimono','samurai','ninja','sakura','sensei','watashi','anata'];
  const voicedWords = ['kagi','gohan','kaze','mizu','zoo','denwa','doko','buta','bento','bara','panda','pan','piano','pen'];
  const wordTranslationsEn = {
  hai:"yes", iie:"no", ai:"love", ao:"blue", ie:"house", ue:"up / above", koi:"carp / love", ika:"squid", aki:"autumn", eki:"station", ookii:"big", kaki:"persimmon / oyster", kiku:"to listen / chrysanthemum", koko:"here", koke:"moss", sake:"sake / alcohol", saki:"ahead / previous", sushi:"sushi", suki:"like", soko:"there", seki:"seat / cough", asa:"morning", ashi:"leg / foot", uso:"lie", isu:"chair", taiko:"drum", tako:"octopus", taki:"waterfall", tsuki:"moon", tsuchi:"earth / soil", te:"hand", to:"door / and", tokei:"clock / watch", tori:"bird", nani:"what", naka:"inside", neko:"cat", inu:"dog", niwa:"garden", nori:"seaweed / ride", nuno:"cloth", hana:"flower / nose", hito:"person", hifu:"skin", hane:"wing / feather", hon:"book", hoshi:"star", haha:"mother", fune:"boat", heya:"room", mae:"front / before", mimi:"ear", mame:"bean", mori:"forest", momo:"peach", mune:"chest", ame:"rain / candy", umi:"sea", yama:"mountain", yume:"dream", yuki:"snow", yori:"from / than", yoru:"night", raion:"lion", ringo:"apple", raku:"easy / comfort", renkon:"lotus root", roku:"six", iro:"color", sora:"sky", kumo:"cloud / spider", mura:"village", machi:"town", michi:"road", miso:"miso", kasa:"umbrella", kushi:"comb / skewer", kutsushita:"socks", tenisu:"tennis", tomato:"tomato", ramen:"ramen", kamera:"camera", meron:"melon", banana:"banana", miruku:"milk", terebi:"TV", rajio:"radio", anime:"anime", karaoke:"karaoke", kimono:"kimono", samurai:"samurai", ninja:"ninja", tsunami:"tsunami", sakura:"cherry blossom", sensei:"teacher", senpai:"senior / mentor", kouhai:"junior", watashi:"I / me", anata:"you", kare:"he / boyfriend", kanojo:"she / girlfriend", are:"that over there", kore:"this", sore:"that", dore:"which one",
  ichi:"one", ima:"now", imi:"meaning", imo:"potato", iya:"no / unpleasant", iru:"to be / need", ire:"container / put in", iwa:"rock", in:"syllabic n practice", uta:"song", uchi:"inside / home", utsu:"to hit", uma:"horse / good", ume:"plum", ura:"back side", uri:"melon / selling", uru:"to sell", ebi:"shrimp", en:"yen / circle / connection", oi:"hey", ou:"king / chase", oka:"hill", oki:"open sea", oku:"to put / back", osu:"to push", oto:"sound", oni:"demon", one:"older sister variant / practice", ono:"axe", oya:"parent", ore:"I / me casual", oro:"practice pattern", on:"sound / favor", kai:"shellfish / meeting", kau:"to buy", kao:"face", kaku:"to write", kashi:"sweets / lyrics", kasu:"to lend", kata:"shoulder / way", kachi:"win / value", katsu:"to win / cutlet", kana:"kana / I wonder", kani:"crab", kane:"money / bell", kama:"pot / sickle",
  gogo:"afternoon", goma:"sesame", gohan:"rice / meal", kagi:"key", migi:"right side", sugoi:"amazing", gake:"cliff", geki:"drama / intense", gaku:"study / learning", goi:"vocabulary", zaru:"basket / sieve", mizu:"water", kaze:"wind / cold", kazu:"number", zutto:"continuously", zero:"zero", zoni:"New Year soup", doko:"where", dare:"who", dame:"not good", denwa:"phone", mado:"window", taberu:"to eat", boku:"I / me casual", bara:"rose", buta:"pig", basho:"place", bento:"boxed lunch", biiru:"beer", asobu:"to play", yobu:"to call", kaban:"bag", kubi:"neck", tabe:"eat stem / practice", giri:"obligation / duty", guru:"guru / spinning", gero:"vomit / frog sound", goro:"around / rumble", zushi:"sushi city/name", zaseki:"seat", zoori:"sandals", dango:"dumpling", dai:"large / topic", demo:"but / demo", doro:"mud", dora:"gong / Dora", doki:"heartbeat", bijin:"beautiful person", bunka:"culture", benri:"convenient", booru:"ball", gomu:"rubber", gomi:"trash", genki:"healthy / energetic", ginko:"ginkgo", ginkou:"bank", gosen:"five thousand", zubon:"pants", zannen:"too bad", zenbu:"all", dozo:"please / go ahead", daiji:"important", daikon:"daikon radish", doubutsu:"animal", bideo:"video", basu:"bus", biru:"building", boushi:"hat", budou:"grapes", bebii:"baby", pan:"bread", pen:"pen", piano:"piano", pika:"sparkle", piko:"beep / chirp", puka:"floating", paku:"bite / chomp", poko:"popping sound", peko:"hungry / bow", pura:"plastic / plus", puro:"professional", papa:"dad", pipi:"beep-beep", popo:"pop / coo", puu:"poof", puchi:"small / petite", peta:"sticky slap", pote:"plop", pomu:"pom", puri:"プリ / cute pose", pasuta:"pasta", panda:"panda", pinku:"pink", posuto:"post / mailbox",
  au:"to meet", aka:"red", asu:"tomorrow", ase:"sweat", ato:"after / later", ana:"hole", ani:"older brother", ane:"older sister", ano:"that / um", aho:"foolish", ama:"sweet / amateur", ari:"ant / exists", aru:"to exist / to have", ii:"good", iku:"to go", iko:"let's go", ishi:"stone / will", ita:"was / board", itsu:"when", ito:"thread", ina:"rice plant", ine:"rice plant", uo:"fish", ushi:"cow", uni:"sea urchin", ura:"back side", eri:"collar", era:"gills", oko:"practice form / kana drill", oshi:"favorite / push", oya:"parent", ore:"I / me casual", kai:"shellfish / meeting", kau:"to buy", kao:"face", kaku:"to write", kashi:"sweets / lyrics", kasu:"to lend", kata:"shoulder / way", kachi:"win / value", katsu:"to win / cutlet", kato:"Kato / name", kani:"crab", kane:"money / bell", kama:"pot / sickle"
};
  const wordTranslationsEs = {
  hai:"sí", iie:"no", ai:"amor", ao:"azul", ie:"casa", ue:"arriba / encima", koi:"carpa / amor", ika:"calamar", aki:"otoño", eki:"estación", ookii:"grande", kaki:"caqui / ostra", kiku:"escuchar / crisantemo", koko:"aquí", koke:"musgo", sake:"sake / alcohol", saki:"adelante / antes", sushi:"sushi", suki:"gustar", soko:"ahí", seki:"asiento / tos", asa:"mañana", ashi:"pierna / pie", uso:"mentira", isu:"silla", taiko:"tambor", tako:"pulpo", taki:"cascada", tsuki:"luna", tsuchi:"tierra / suelo", te:"mano", to:"puerta / y", tokei:"reloj", tori:"pájaro", nani:"qué", naka:"dentro", neko:"gato", inu:"perro", niwa:"jardín", nori:"alga / montar", nuno:"tela", hana:"flor / nariz", hito:"persona", hifu:"piel", hane:"ala / pluma", hon:"libro", hoshi:"estrella", haha:"madre", fune:"barco", heya:"habitación", mae:"frente / antes", mimi:"oreja", mame:"frijol", mori:"bosque", momo:"durazno", mune:"pecho", ame:"lluvia / dulce", umi:"mar", yama:"montaña", yume:"sueño", yuki:"nieve", yori:"desde / que", yoru:"noche", raion:"león", ringo:"manzana", raku:"fácil / comodidad", renkon:"raíz de loto", roku:"seis", iro:"color", sora:"cielo", kumo:"nube / araña", mura:"aldea", machi:"pueblo / ciudad", michi:"camino", miso:"miso", kasa:"sombrilla / paraguas", kushi:"peine / brocheta", kutsushita:"medias / calcetines", tenisu:"tenis", tomato:"tomate", ramen:"ramen", kamera:"cámara", meron:"melón", banana:"banana", miruku:"leche", terebi:"televisión", rajio:"radio", anime:"anime", karaoke:"karaoke", kimono:"kimono", samurai:"samurái", ninja:"ninja", tsunami:"tsunami", sakura:"flor de cerezo", sensei:"maestro / profesor", senpai:"senior / mentor", kouhai:"junior", watashi:"yo", anata:"tú / usted", kare:"él / novio", kanojo:"ella / novia", are:"aquello de allá", kore:"esto", sore:"eso", dore:"cuál",
  ichi:"uno", ima:"ahora", imi:"significado", imo:"papa / batata", iya:"no / desagradable", iru:"estar / necesitar", ire:"recipiente / meter", iwa:"roca", in:"práctica de la n silábica", uta:"canción", uchi:"dentro / casa", utsu:"golpear", uma:"caballo / bueno", ume:"ciruela", ura:"parte trasera", uri:"melón / venta", uru:"vender", ebi:"camarón", en:"yen / círculo / conexión", oi:"oye", ou:"rey / perseguir", oka:"colina", oki:"mar abierto", oku:"poner / fondo", osu:"empujar", oto:"sonido", oni:"demonio", one:"variante de hermana mayor / práctica", ono:"hacha", oya:"padre / madre", ore:"yo informal", oro:"patrón de práctica", on:"sonido / favor", kai:"marisco / reunión", kau:"comprar", kao:"cara", kaku:"escribir", kashi:"dulces / letra de canción", kasu:"prestar", kata:"hombro / forma", kachi:"victoria / valor", katsu:"ganar / chuleta", kana:"kana / me pregunto", kani:"cangrejo", kane:"dinero / campana", kama:"olla / hoz",
  gogo:"tarde", goma:"sésamo", gohan:"arroz / comida", kagi:"llave", migi:"lado derecho", sugoi:"increíble", gake:"acantilado", geki:"drama / intenso", gaku:"estudio / aprendizaje", goi:"vocabulario", zaru:"canasta / colador", mizu:"agua", kaze:"viento / resfriado", kazu:"número", zutto:"continuamente", zero:"cero", zoni:"sopa de Año Nuevo", doko:"dónde", dare:"quién", dame:"no sirve / no está bien", denwa:"teléfono", mado:"ventana", taberu:"comer", boku:"yo informal", bara:"rosa", buta:"cerdo", basho:"lugar", bento:"comida en caja", biiru:"cerveza", asobu:"jugar", yobu:"llamar", kaban:"bolso / mochila", kubi:"cuello", tabe:"raíz de comer / práctica", giri:"obligación / deber", guru:"gurú / girando", gero:"vómito / sonido de rana", goro:"aproximadamente / retumbo", zushi:"ciudad/nombre de Zushi", zaseki:"asiento", zoori:"sandalias", dango:"bolita dulce", dai:"grande / tema", demo:"pero / demo", doro:"lodo", dora:"gong / Dora", doki:"latido", bijin:"persona bella", bunka:"cultura", benri:"conveniente", booru:"bola", gomu:"goma", gomi:"basura", genki:"saludable / con energía", ginko:"ginkgo", ginkou:"banco", gosen:"cinco mil", zubon:"pantalón", zannen:"qué pena", zenbu:"todo", dozo:"por favor / adelante", daiji:"importante", daikon:"rábano daikon", doubutsu:"animal", bideo:"video", basu:"autobús", biru:"edificio", boushi:"sombrero", budou:"uvas", bebii:"bebé", pan:"pan", pen:"bolígrafo", piano:"piano", pika:"brillo", piko:"pitido / chirrido", puka:"flotando", paku:"mordida", poko:"sonido de pop", peko:"hambre / reverencia", pura:"plástico / plus", puro:"profesional", papa:"papá", pipi:"pi pi / pitido", popo:"pop / arrullo", puu:"puf", puchi:"pequeño / petite", peta:"golpe pegajoso", pote:"plop", pomu:"pom", puri:"pose cute /プリ", pasuta:"pasta", panda:"panda", pinku:"rosado", posuto:"correo / buzón",
  au:"encontrarse", aka:"rojo", asu:"mañana", ase:"sudor", ato:"después / luego", ana:"agujero", ani:"hermano mayor", ane:"hermana mayor", ano:"ese / eh", aho:"tonto", ama:"dulce / aficionado", ari:"hormiga / existe", aru:"existir / tener", ii:"bueno", iku:"ir", iko:"vamos", ishi:"piedra / voluntad", ita:"estaba / tabla", itsu:"cuándo", ito:"hilo", ina:"planta de arroz", ine:"planta de arroz", uo:"pez", ushi:"vaca", uni:"erizo de mar", eri:"cuello de ropa", era:"branquias", oko:"forma de práctica / ejercicio kana", oshi:"favorito / empujar", kato:"Kato / nombre"
};
  const wordTranslations = isEs ? wordTranslationsEs : wordTranslationsEn;
  const getTranslation = word => wordTranslations[word] || t('Translation not available yet.','Traducción no disponible todavía.');
  const storeKey = 'tij-kana-dojo-v215';
  const board = document.getElementById('kana-board');
  const wordEl = document.getElementById('kana-word');
  const answerEl = document.getElementById('kana-answer');
  const feedbackEl = document.getElementById('kana-feedback');
  const historyEl = document.getElementById('kana-history');
  const missedEl = document.getElementById('kana-missed');
  let state = {score:0,correct:0,attempts:0,played:0,streak:0,best:0,missed:{},history:[]};
  try { state = {...state, ...JSON.parse(localStorage.getItem(storeKey) || '{}')}; } catch (_) {}
  let script='h', mode='learning', shuffled=false, labels=true, mnemonics=true, compact=false, dakuten=false, handakuten=false, daily=false;
  let current='', expected=[], clicks=[], locked=false, reviewPool=[];

  const allRows = () => [...baseRows, ...(dakuten ? voicedRows : []), ...(handakuten ? [pRow] : [])];
  const lookup = () => { const map={}; allRows().forEach(r => r[2].forEach(x => { if (x && !map[x[0]]) map[x[0]]=x; })); return map; };
  const parseOrder = () => Object.keys(lookup()).sort((a,b) => b.length-a.length);
  const save = () => localStorage.setItem(storeKey, JSON.stringify(state));
  const shuffle = items => [...items].sort(() => Math.random() - .5);
  const t = (en,es) => isEs ? es : en;
  const rowNames = {
    Vowels:t('Vowels','Vocales'), 'K Row':t('K Row','Fila K'), 'S Row':t('S Row','Fila S'),
    'T Row':t('T Row','Fila T'), 'N Row':t('N Row','Fila N'), 'H Row':t('H Row','Fila H'),
    'M Row':t('M Row','Fila M'), 'Y Row':t('Y Row','Fila Y'), 'R Row':t('R Row','Fila R'),
    'W & N':t('W & N','W y N'), 'G Row':t('G Row','Fila G'), 'Z Row':t('Z Row','Fila Z'),
    'D Row':t('D Row','Fila D'), 'B Row':t('B Row','Fila B'), 'P Row':t('P Row','Fila P'),
    Mixed:t('Mixed','Mixto')
  };

  function parseWord(word) {
    let rest=word, parts=[];
    while(rest){ const part=parseOrder().find(p => rest.startsWith(p)); if(!part)return []; parts.push(part); rest=rest.slice(part.length); }
    return parts;
  }
  function updateStats(){
    document.getElementById('kana-score').textContent=state.score;
    document.getElementById('kana-accuracy').textContent=`${state.attempts ? Math.round((state.correct/state.attempts)*100) : 100}%`;
    document.getElementById('kana-streak').textContent=state.streak;
    document.getElementById('kana-best').textContent=state.best;
    document.getElementById('kana-played').textContent=state.played;
    document.getElementById('kana-correct').textContent=state.correct;
    document.getElementById('kana-attempts').textContent=state.attempts;
    renderHistory(); renderMissed();
  }
  function renderBoard(){
    board.innerHTML=''; board.classList.toggle('is-compact',compact); let source=allRows().map(r=>[r[0],r[1],[...r[2]]]);
    if(shuffled){ const all=shuffle(source.flatMap(r=>r[2]).filter(Boolean)); source=[]; for(let i=0;i<all.length;i+=5)source.push([t('Mixed','Mixto'),'mix',all.slice(i,i+5)]); }
    source.forEach(([name,cls,items])=>{
      const row=document.createElement('div'); row.className=`kana-row kana-row--${cls}`;
      if(labels){ const label=document.createElement('div'); label.className=`kana-row-label kana-row-label--${cls}`; label.innerHTML=`<strong>${rowNames[name]||name}</strong><small>${cls}</small>`; row.appendChild(label); }
      items.forEach(item=>{
        if(!item){ const spacer=document.createElement('span'); spacer.className='kana-tile kana-tile--empty'; spacer.setAttribute('aria-hidden','true'); row.appendChild(spacer); return; }
        const b=document.createElement('button'); b.type='button'; b.className='kana-tile'; b.dataset.syl=item[0];
        b.innerHTML=`<span class="kana-symbol">${script==='h'?item[1]:item[2]}</span>${mode==='kana'||!mnemonics?'':`<span class="kana-picture">${item[3]}</span>`}${mode==='learning'&&mnemonics?`<small>${item[4]}</small>`:''}`;
        b.addEventListener('click',()=>choose(item[0],b)); row.appendChild(b);
      }); board.appendChild(row);
    });
  }
  function wordPool(){ if(reviewPool.length)return reviewPool; let pool=[...standardWords]; if(dakuten||handakuten)pool.push(...voicedWords); return pool; }
  function dailyWord(){ const pool=wordPool(); const d=new Date(); const seed=Number(`${d.getFullYear()}${d.getMonth()+1}${d.getDate()}`); return pool[seed%pool.length]; }
  function nextWord(){
    locked=false; clicks=[]; answerEl.textContent=''; feedbackEl.className='kana-feedback';
    const pool=wordPool(); current=daily ? dailyWord() : pool[Math.floor(Math.random()*pool.length)]; expected=parseWord(current);
    if(!expected.length){ reviewPool=[]; return nextWord(); }
    wordEl.textContent=current; feedbackEl.textContent=t('Choose the kana in order.','Elige los kana en orden.'); renderBoard();
  }
  function finish(success, wrongSyl=''){
    locked=true; state.played++; state.attempts++;
    if(success){ state.correct++; state.streak++; state.best=Math.max(state.best,state.streak); state.score+=10+Math.max(0,expected.length-1)*2; feedbackEl.textContent=t('Correct! Great work.','¡Correcto! Muy bien.'); feedbackEl.className='kana-feedback is-good'; }
    else { state.streak=0; state.score=Math.max(0,state.score-2); if(wrongSyl)state.missed[wrongSyl]=(state.missed[wrongSyl]||0)+1; feedbackEl.textContent=t('Not quite. Review the highlighted kana and try the next word.','Aún no. Repasa el kana marcado y prueba la siguiente palabra.'); feedbackEl.className='kana-feedback is-bad'; }
    const map=lookup();
    const completedKana=expected.map(x=>{const m=map[x]; return m?(script==='h'?m[1]:m[2]):x;}).join('');
    state.history.unshift({word:current,translation:getTranslation(current),ok:success,kana:completedKana,script,at:Date.now()});
    state.history=state.history.slice(0,60); save(); updateStats();
  }
  function choose(syl,button){
    if(locked)return; const idx=clicks.length; clicks.push(syl); button.classList.add('selected'); const map=lookup(); answerEl.textContent=clicks.map(x=>script==='h'?map[x][1]:map[x][2]).join('');
    if(syl!==expected[idx]){ button.classList.add('wrong'); finish(false, expected[idx]); return; }
    button.classList.add('right'); if(clicks.length===expected.length)finish(true);
  }
  function renderHistory(){
    historyEl.innerHTML=state.history.length?'':`<p class="empty-state">${t('No practice recorded yet.','Aún no hay práctica registrada.')}</p>`;
    state.history.forEach(item=>{
      const d=document.createElement('article');
      d.className='kana-history-item';
      const translation=item.translation||getTranslation(item.word);
      const stamp=item.at?new Intl.DateTimeFormat(isEs?'es':'en',{hour:'numeric',minute:'2-digit'}).format(new Date(item.at)):'';
      d.innerHTML=`<div class="kana-history-copy"><div class="kana-history-main"><b>${item.word}</b><span class="kana-history-kana">${item.kana||'—'}</span></div><small class="kana-history-translation">${translation}</small></div><div class="kana-history-result"><strong class="${item.ok?'ok':'no'}">${item.ok?'✓':'×'}</strong><small>${stamp}</small></div>`;
      historyEl.appendChild(d);
    });
  }
  function renderMissed(){
    const map=lookup(); const entries=Object.entries(state.missed).sort((a,b)=>b[1]-a[1]).slice(0,6); missedEl.innerHTML=entries.length?'':`<p class="empty-state">${t('No missed kana yet.','Todavía no hay kana fallados.')}</p>`;
    entries.forEach(([syl,count])=>{const item=map[syl]||baseRows.flatMap(r=>r[2]).find(x=>x && x[0]===syl); const d=document.createElement('button');d.type='button';d.className='missed-chip';d.innerHTML=`<span>${item?(script==='h'?item[1]:item[2]):syl}</span><b>${syl}</b><small>${count}×</small>`;d.addEventListener('click',()=>{reviewPool=standardWords.filter(w=>parseWord(w).includes(syl));nextWord();});missedEl.appendChild(d);});
  }
  function toggleButton(id,on,enOn,enOff,esOn,esOff){const b=document.getElementById(id);b.classList.toggle('is-on',on);b.textContent=t(on?enOn:enOff,on?esOn:esOff);}

  document.querySelectorAll('[data-script]').forEach(b=>b.addEventListener('click',()=>{script=b.dataset.script;document.querySelectorAll('[data-script]').forEach(x=>x.classList.toggle('active',x===b));renderBoard();renderMissed();answerEl.textContent=clicks.map(x=>script==='h'?lookup()[x][1]:lookup()[x][2]).join('');}));
  document.getElementById('kana-mode').addEventListener('change',e=>{mode=e.target.value;renderBoard();});
  document.getElementById('kana-next').addEventListener('click',nextWord);
  document.getElementById('kana-shuffle').addEventListener('click',()=>{shuffled=!shuffled;toggleButton('kana-shuffle',shuffled,'🔀 Board randomized','🔀 Randomize board','🔀 Tabla mezclada','🔀 Mezclar tabla');renderBoard();});
  document.getElementById('kana-labels').addEventListener('click',()=>{labels=!labels;toggleButton('kana-labels',!labels,'🎨 Show row help','🎨 Hide row help','🎨 Mostrar ayuda de filas','🎨 Ocultar ayuda de filas');renderBoard();});
  document.getElementById('kana-density').addEventListener('click',()=>{compact=!compact;toggleButton('kana-density',compact,'↔ Comfortable tiles','↔ Compact tiles','↔ Fichas amplias','↔ Compactar fichas');renderBoard();});
  document.getElementById('kana-mnemonics').addEventListener('click',()=>{mnemonics=!mnemonics;toggleButton('kana-mnemonics',!mnemonics,'🖼 Show mnemonic labels','🖼 Hide mnemonic labels','🖼 Mostrar ayudas','🖼 Ocultar ayudas');renderBoard();});
  document.getElementById('kana-dakuten').addEventListener('click',()=>{dakuten=!dakuten;toggleButton('kana-dakuten',dakuten,'゛Dakuten: On','゛Dakuten: Off','゛Dakuten: Sí','゛Dakuten: No');reviewPool=[];nextWord();});
  document.getElementById('kana-handakuten').addEventListener('click',()=>{handakuten=!handakuten;toggleButton('kana-handakuten',handakuten,'゜Handakuten: On','゜Handakuten: Off','゜Handakuten: Sí','゜Handakuten: No');reviewPool=[];nextWord();});
  document.getElementById('kana-daily').addEventListener('click',()=>{daily=!daily;toggleButton('kana-daily',daily,'📅 Daily challenge: On','📅 Daily challenge: Off','📅 Reto diario: Sí','📅 Reto diario: No');reviewPool=[];nextWord();});
  document.getElementById('kana-review-missed').addEventListener('click',()=>{const missed=Object.keys(state.missed);reviewPool=standardWords.filter(w=>parseWord(w).some(x=>missed.includes(x)));if(!reviewPool.length)feedbackEl.textContent=t('No missed kana to review yet.','Todavía no hay kana fallados para repasar.');else nextWord();});
  document.getElementById('kana-clear-history').addEventListener('click',()=>{state.history=[];save();renderHistory();});
  document.getElementById('kana-reset').addEventListener('click',()=>{state={score:0,correct:0,attempts:0,played:0,streak:0,best:0,missed:{},history:[]};reviewPool=[];save();updateStats();nextWord();});

  initializeWorkbenchTiles();
  updateStats(); nextWord();
})();

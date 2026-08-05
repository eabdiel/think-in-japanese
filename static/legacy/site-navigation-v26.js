(function(){
  var STORAGE_KEY='tij-theme';
  var VALID_THEMES=['pixel','garden','night'];
  var MOBILE_QUERY='(max-width: 720px)';

  function normalizeTheme(theme){return VALID_THEMES.indexOf(theme)>=0?theme:'garden';}
  function readSavedTheme(){try{return normalizeTheme(localStorage.getItem(STORAGE_KEY)||'garden');}catch(e){return 'garden';}}
  function applyTheme(theme,persist){
    theme=normalizeTheme(theme);
    document.body.classList.remove('theme-pixel','theme-garden','theme-night');
    document.body.classList.add('theme-'+theme);
    document.documentElement.setAttribute('data-tij-theme',theme);
    document.documentElement.style.colorScheme=theme==='night'?'dark':'light';
    if(persist!==false){try{localStorage.setItem(STORAGE_KEY,theme);}catch(e){}}
    document.querySelectorAll('.theme-btn').forEach(function(btn){
      var on=btn.getAttribute('data-theme')===theme;
      btn.classList.toggle('active',on); btn.setAttribute('aria-pressed',on?'true':'false');
    });
  }
  function closeSubmenus(except){
    document.querySelectorAll('.pixel-nav details.nav-group[open]').forEach(function(group){if(group!==except)group.removeAttribute('open');});
  }
  function closeMobileNav(nav,focusButton){
    if(!nav)return;
    nav.classList.remove('mobile-nav-open');
    var button=nav.querySelector('.mobile-nav-toggle');
    if(button){button.setAttribute('aria-expanded','false');if(focusButton)button.focus();}
    closeSubmenus();
  }
  function currentPageLabel(nav){
    var active=nav.querySelector('a.active,.lang-pill.active');
    if(active&&active.textContent.trim())return active.textContent.trim();
    var h1=document.querySelector('h1');
    return h1&&h1.textContent.trim()?h1.textContent.trim():'Think in Japanese';
  }
  function buildMobileNavigation(nav,index){
    var inner=nav.querySelector('.pixel-nav-inner');
    if(!inner||inner.dataset.mobileNavBuilt)return;
    inner.dataset.mobileNavBuilt='1';
    var panel=document.createElement('div'); panel.className='mobile-nav-panel'; panel.id='mobile-nav-panel-'+index;
    while(inner.firstChild)panel.appendChild(inner.firstChild);
    var button=document.createElement('button'); button.type='button'; button.className='mobile-nav-toggle';
    button.setAttribute('aria-expanded','false'); button.setAttribute('aria-controls',panel.id);
    button.innerHTML='<span class="hamburger" aria-hidden="true">☰</span><span>Menu</span>';
    var title=document.createElement('div'); title.className='mobile-nav-title'; title.textContent=currentPageLabel(nav);
    inner.appendChild(button); inner.appendChild(title); inner.appendChild(panel);
    button.addEventListener('click',function(){
      var opening=!nav.classList.contains('mobile-nav-open');
      document.querySelectorAll('.pixel-nav.mobile-nav-open').forEach(function(other){if(other!==nav)closeMobileNav(other,false);});
      nav.classList.toggle('mobile-nav-open',opening); button.setAttribute('aria-expanded',opening?'true':'false');
      if(!opening)closeSubmenus();
    });
  }
  function init(){
    applyTheme(readSavedTheme(),false);
    document.querySelectorAll('.theme-btn').forEach(function(btn){
      if(btn.dataset.sharedThemeBound)return; btn.dataset.sharedThemeBound='1';
      btn.addEventListener('click',function(){applyTheme(btn.getAttribute('data-theme'),true);});
    });
    document.querySelectorAll('.pixel-nav').forEach(buildMobileNavigation);
    document.querySelectorAll('.pixel-nav details.nav-group').forEach(function(group){
      group.addEventListener('toggle',function(){if(group.open)closeSubmenus(group);});
    });
    document.addEventListener('click',function(e){
      var nav=e.target.closest('.pixel-nav');
      if(!nav){document.querySelectorAll('.pixel-nav.mobile-nav-open').forEach(function(n){closeMobileNav(n,false);});return;}
      var link=e.target.closest('.pixel-nav a');
      if(link&&window.matchMedia(MOBILE_QUERY).matches)closeMobileNav(nav,false);
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape')document.querySelectorAll('.pixel-nav.mobile-nav-open').forEach(function(n){closeMobileNav(n,true);});
    });
    window.addEventListener('resize',function(){
      if(!window.matchMedia(MOBILE_QUERY).matches)document.querySelectorAll('.pixel-nav.mobile-nav-open').forEach(function(n){closeMobileNav(n,false);});
    });
    window.addEventListener('storage',function(e){if(e.key===STORAGE_KEY)applyTheme(normalizeTheme(e.newValue),false);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

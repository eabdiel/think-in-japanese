(function(){
  var STORAGE_KEY='tij-theme';
  var VALID_THEMES=['pixel','garden','night'];

  function normalizeTheme(theme){
    return VALID_THEMES.indexOf(theme)>=0?theme:'garden';
  }

  function readSavedTheme(){
    try{return normalizeTheme(localStorage.getItem(STORAGE_KEY)||'garden');}
    catch(e){return 'garden';}
  }

  function applyTheme(theme, persist){
    theme=normalizeTheme(theme);
    document.body.classList.remove('theme-pixel','theme-garden','theme-night');
    document.body.classList.add('theme-'+theme);
    document.documentElement.setAttribute('data-tij-theme',theme);
    document.documentElement.style.colorScheme=theme==='night'?'dark':'light';
    if(persist!==false){try{localStorage.setItem(STORAGE_KEY,theme);}catch(e){}}
    document.querySelectorAll('.theme-btn').forEach(function(btn){
      var on=btn.getAttribute('data-theme')===theme;
      btn.classList.toggle('active',on);
      btn.setAttribute('aria-pressed',on?'true':'false');
    });
  }

  function closeMenus(except){
    document.querySelectorAll('.pixel-nav details.nav-group[open]').forEach(function(group){
      if(group!==except)group.removeAttribute('open');
    });
  }

  function init(){
    applyTheme(readSavedTheme(),false);

    document.querySelectorAll('.theme-btn').forEach(function(btn){
      if(btn.dataset.sharedThemeBound)return;
      btn.dataset.sharedThemeBound='1';
      btn.addEventListener('click',function(){applyTheme(btn.getAttribute('data-theme'),true);});
    });

    document.querySelectorAll('.pixel-nav details.nav-group').forEach(function(group){
      group.addEventListener('toggle',function(){if(group.open)closeMenus(group);});
    });

    document.addEventListener('click',function(e){
      if(!e.target.closest('.pixel-nav'))closeMenus();
      var link=e.target.closest('.pixel-nav .nav-menu a');
      if(link){var details=link.closest('details');if(details)details.removeAttribute('open');}
    });

    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenus();});

    window.addEventListener('storage',function(e){
      if(e.key===STORAGE_KEY)applyTheme(normalizeTheme(e.newValue),false);
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* ==========================================================================
   PRITAM CHANDRA — SITE DESIGN SYSTEM
   Shared interaction behaviour: theme toggle, text-size toggle, sidebar
   drawer, hide-on-scroll navbar. Vanilla JS, no dependencies.

   NOTE ON PERSISTENCE: this demo intentionally keeps state in memory only
   (it resets on reload). In the real Jekyll site, wrap the three "set"
   functions below with localStorage.getItem/setItem so preferences persist
   across visits — see CLAUDE.md "Interaction behaviour" section.
   ========================================================================== */
(function(){
  var root = document.documentElement;
  /* The width below which the nav's sidebar-toggle button opens the
     off-canvas drawer instead of the manual "hide sidebars" mode. Every
     page now collapses at the same width — the responsive layout puts a
     wide right sidebar underneath the left one before either goes into
     the drawer, so there's no longer a need for a page-specific value. */
  var MOBILE_BP = 700;

  /* ---------- theme toggle (icon-only) ---------- */
  var themeBtn = document.querySelectorAll('[data-action="toggle-theme"]');
  function currentTheme(){
    var explicit = root.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function paintThemeBtn(){
    var t = currentTheme();
    themeBtn.forEach(function(b){
      b.textContent = t === 'dark' ? '☾' : '☀'; /* ☾ / ☀ */
      b.setAttribute('aria-pressed', t === 'dark');
    });
  }
  themeBtn.forEach(function(b){
    b.addEventListener('click', function(){
      root.setAttribute('data-theme', currentTheme() === 'dark' ? 'light' : 'dark');
      paintThemeBtn();
    });
  });
  paintThemeBtn();

  /* ---------- text size: a −/+ pair over a wider range ---------- */
  var sizeDecBtn = document.querySelectorAll('[data-action="size-dec"]');
  var sizeIncBtn = document.querySelectorAll('[data-action="size-inc"]');
  var SIZES = [80, 90, 100, 110, 120, 130, 140, 150]; /* percent */
  var DEFAULT_IDX = 2; /* 100% */
  var sizeIdx = DEFAULT_IDX;
  function paintSizeBtns(){
    sizeDecBtn.forEach(function(b){ b.disabled = sizeIdx === 0; });
    sizeIncBtn.forEach(function(b){ b.disabled = sizeIdx === SIZES.length - 1; });
  }
  function applySize(){
    root.style.fontSize = SIZES[sizeIdx] + '%';
    paintSizeBtns();
  }
  sizeDecBtn.forEach(function(b){
    b.addEventListener('click', function(){
      if (sizeIdx > 0){ sizeIdx--; applySize(); }
    });
  });
  sizeIncBtn.forEach(function(b){
    b.addEventListener('click', function(){
      if (sizeIdx < SIZES.length - 1){ sizeIdx++; applySize(); }
    });
  });
  paintSizeBtns();

  /* ---------- sidebar toggle / off-canvas drawer ---------- */
  var sbBtn = document.querySelectorAll('[data-action="toggle-sidebars"]');
  var drawer = document.querySelector('.drawer');
  var drawerCloseEls = document.querySelectorAll('[data-action="close-drawer"]');
  function isMobile(){ return window.innerWidth < MOBILE_BP; }
  function closeDrawer(){ root.classList.remove('drawer-open'); }
  sbBtn.forEach(function(b){
    b.addEventListener('click', function(){
      if (isMobile()){
        root.classList.toggle('drawer-open');
      } else {
        root.classList.toggle('sb-hidden');
      }
      sbBtn.forEach(function(btn){ btn.setAttribute('aria-pressed', root.classList.contains('sb-hidden') || root.classList.contains('drawer-open')); });
    });
  });
  drawerCloseEls.forEach(function(el){
    el.addEventListener('click', closeDrawer);
  });
  /* Any in-page link inside the drawer (a table of contents entry, a tag,
     a timeline year) should also close the drawer once clicked — otherwise
     the page scrolls to the right place *behind* a drawer that is still
     sitting open on top of it, which reads as "the link doesn't work". */
  if (drawer){
    drawer.querySelectorAll('a[href]').forEach(function(a){
      a.addEventListener('click', closeDrawer);
    });
  }
  window.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeDrawer();
  });

  /* ---------- hide navbar on scroll down, reveal on scroll up ---------- */
  var nav = document.querySelector('.sitenav');
  if (nav){
    var lastY = window.scrollY, ticking = false;
    window.addEventListener('scroll', function(){
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        var y = window.scrollY;
        if (y > lastY && y > 80){ nav.classList.add('is-hidden'); }
        else { nav.classList.remove('is-hidden'); }
        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- blog home: All / Collections / Pages filter ---------- */
  /* Present in duplicate (static left sidebar + drawer copy); both sets
     of buttons are wired together since they select on data-filter alone. */
  var filterBtns = document.querySelectorAll('[data-filter]');
  if (filterBtns.length){
    var entries = document.querySelectorAll('.post-entry');
    var dividers = document.querySelectorAll('.year-divider');
    var applyFilter = function(kind){
      entries.forEach(function(el){
        var show = kind === 'all' || el.getAttribute('data-kind') === kind;
        el.hidden = !show;
        var hr = el.nextElementSibling;
        if (hr && hr.matches('hr.rule')) hr.hidden = !show;
      });
      /* Hide a year heading too, if every entry under it got filtered out. */
      dividers.forEach(function(div){
        var el = div.nextElementSibling, any = false;
        while (el && !el.classList.contains('year-divider')){
          if (el.classList.contains('post-entry') && !el.hidden) any = true;
          el = el.nextElementSibling;
        }
        div.hidden = !any;
      });
      filterBtns.forEach(function(b){
        b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === kind));
      });
    };
    filterBtns.forEach(function(b){
      b.addEventListener('click', function(){ applyFilter(b.getAttribute('data-filter')); });
    });
  }

  /* ---------- render math with KaTeX, if present on the page ---------- */
  if (window.renderMathInElement){
    renderMathInElement(document.body, {
      delimiters: [
        {left: "$$", right: "$$", display: true},
        {left: "\\[", right: "\\]", display: true},
        {left: "$", right: "$", display: false},
        {left: "\\(", right: "\\)", display: false}
      ],
      throwOnError: false
    });
  }
})();

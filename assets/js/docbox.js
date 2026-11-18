/* DocBox custom scripts — served as an external file so Jekyll's
   compress_html can never strip newlines inside it (the bug that
   previously turned the whole inline script into one commented line). */
(function () {
  // ---- Theme restore happens inline in <head> (head_custom.html).
  // ---- Theme toggle -------------------------------------------------------
  var THEME_KEY = 'docbox-theme';

  function applyTheme(theme) {
    if (theme === 'dark' || theme === 'light') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function isDarkNow() {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function createToggleButton() {
    var header = document.querySelector('.main-header') || document.querySelector('.site-header');
    if (!header || header.querySelector('.theme-toggle')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'تغییر تم روشن/تاریک');
    btn.textContent = isDarkNow() ? '☀' : '☾';

    btn.addEventListener('click', function () {
      var next = isDarkNow() ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      btn.textContent = isDarkNow() ? '☀' : '☾';
    });

    header.appendChild(btn);
  }

  // ---- Copy buttons on code blocks ---------------------------------------
  function addCopyButtons() {
    var blocks = document.querySelectorAll('.main-content pre');
    blocks.forEach(function (pre) {
      if (pre.querySelector('.copy-btn')) return;
      pre.style.position = 'relative';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = 'کپی';

      function flash(msg) {
        btn.textContent = msg;
        setTimeout(function () { btn.textContent = 'کپی'; }, 1500);
      }

      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.innerText : pre.innerText;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { flash('کپی شد ✓'); });
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand('copy');
            flash('کپی شد ✓');
          } catch (e) {
            flash('خطا');
          }
          document.body.removeChild(ta);
        }
      });

      pre.appendChild(btn);
    });
  }

  // ---- Library filter + live search (homepage) ---------------------------
  function initLibraryFilter() {
    var input = document.getElementById('lib-search-input');
    var chips = document.getElementById('lib-chips');
    var grid = document.getElementById('lib-grid');
    var count = document.getElementById('lib-count');
    var empty = document.getElementById('lib-empty');
    if (!input || !chips || !grid || !count) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));
    var activeCat = 'all';
    var faDigits = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
                     '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹' };
    function toFa(n) {
      return String(n).replace(/[0-9]/g, function (d) { return faDigits[d]; });
    }

    function apply() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var okCat = activeCat === 'all' || card.getAttribute('data-cat') === activeCat;
        var hay = (card.getAttribute('data-text') || '') + ' ' + card.textContent;
        hay = hay.toLowerCase();
        var okQ = !q || hay.indexOf(q) !== -1;
        var show = okCat && okQ;
        card.style.display = show ? '' : 'none';
        if (show) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
      var isFa = (input.getAttribute('placeholder') || '').indexOf('جستجو') !== -1;
      if (isFa) {
        count.textContent = toFa(shown) + ' دستورپخت';
      } else {
        count.textContent = shown + (shown === 1 ? ' recipe' : ' recipes');
      }
    }

    chips.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      chips.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      activeCat = chip.getAttribute('data-cat') || 'all';
      apply();
    });

    input.addEventListener('input', apply);
    apply();
  }

  // ---- Per-language localization (fa default, en pages swap) --------------
  function initLocalization() {
    var isEn = window.location.pathname.indexOf('/docbox/en') === 0;

    if (isEn) {
      document.documentElement.classList.add('db-en');

      // swap top-nav labels + targets (live theme renders links as .site-button)
      document.querySelectorAll('.aux-nav-list-item .site-button').forEach(function (a) {
        var t = a.textContent.trim();
        if (t === 'دستورپخت‌ها') { a.textContent = 'Recipes'; a.setAttribute('href', '/docbox/en/'); }
        else if (t === 'درباره') { a.textContent = 'About'; a.setAttribute('href', '/docbox/en/about'); }
      });

      // search placeholder
      document.querySelectorAll('.search-input').forEach(function (i) {
        i.setAttribute('placeholder', 'Search recipes…');
        i.setAttribute('aria-label', 'Search recipes');
      });
    } else {
      document.querySelectorAll('.search-input').forEach(function (i) {
        i.setAttribute('placeholder', 'جستجو در دستورپخت‌ها…');
        i.setAttribute('aria-label', 'جستجو در دستورپخت‌ها');
      });
      // back-to-top label for fa pages (theme renders it with id, no class)
      var btt = document.getElementById('back-to-top');
      if (btt) btt.textContent = 'بازگشت به بالا ↑';
    }

    // active nav state
    var path = window.location.pathname;
    document.querySelectorAll('.aux-nav-list-item .site-button').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.indexOf('/docbox/') !== 0) return;
      var norm = href.replace(/\/$/, '').replace(/\.md$/, '');
      var cur = path.replace(/\/$/, '').replace(/\.html$/, '');
      if (norm === cur || (norm === '/docbox/fa' && (cur === '/docbox' || cur === ''))) {
        a.classList.add('aux-active');
      }
    });
  }

  // ---- Code block language labels ----------------------------------------
  function addCodeLabels() {
    document.querySelectorAll('.main-content pre').forEach(function (pre) {
      var code = pre.querySelector('code');
      if (!code) return;
      var cls = code.className || '';
      var lang = null;
      if (cls.indexOf('gdscript') !== -1) lang = 'GDScript';
      else if (cls.indexOf('language-json') !== -1) lang = 'JSON';
      // plain ```text blocks (math, notes) intentionally get no label
      if (!lang || pre.querySelector('.code-lang')) return;
      var tag = document.createElement('span');
      tag.className = 'code-lang';
      tag.textContent = lang;
      pre.appendChild(tag);
    });
  }

  // ---- Prev / Next + Related recipes (on recipe pages) --------------------
  function initRecipeNav() {
    var m = window.location.pathname.match(/\/(fa|en)\/recipes\/([a-z0-9-]+?)(\.md|\.html)?\/?$/);
    if (!m) return;
    var lang = m[1], id = m[2];
    var fa = lang === 'fa';
    fetch('/docbox/recipes.json').then(function (r) { return r.json(); }).then(function (list) {
      var idx = -1, entry = null;
      list.forEach(function (e, i) { if (e.id === id) { idx = i; entry = e; } });
      if (idx === -1) return;

      // prev / next bar
      var html = '<div class="recipe-pn">';
      if (idx > 0) {
        var p = list[idx - 1];
        html += '<a class="recipe-pn-item prev" href="/docbox/' + lang + '/recipes/' + p.id + '">' +
          '<span class="recipe-pn-dir">' + (fa ? 'قبلی' : 'Previous') + '</span>' +
          '<span class="recipe-pn-title">' + (fa ? p.title : (p.title_en || p.title)) + '</span></a>';
      } else {
        html += '<span class="recipe-pn-item"></span>';
      }
      if (idx < list.length - 1) {
        var n = list[idx + 1];
        html += '<a class="recipe-pn-item next" href="/docbox/' + lang + '/recipes/' + n.id + '">' +
          '<span class="recipe-pn-dir">' + (fa ? 'بعدی' : 'Next') + '</span>' +
          '<span class="recipe-pn-title">' + (fa ? n.title : (n.title_en || n.title)) + '</span></a>';
      } else {
        html += '<span class="recipe-pn-item"></span>';
      }
      html += '</div>';

      // related (shared tags), up to 3 cards — real category/engine/badge per entry
      var rel = list.filter(function (e) {
        return e.id !== id && (e.tags || []).some(function (t) { return (entry.tags || []).indexOf(t) !== -1; });
      }).slice(0, 3);

      if (rel.length) {
        html += '<h2 class="recipe-rel-title">' + (fa ? 'دستورپخت‌های مرتبط' : 'Related recipes') + '</h2><div class="cards recipe-rel">';
        rel.forEach(function (e) {
          var title = fa ? e.title : (e.title_en || e.title);
          var sum = fa ? e.summary_fa : e.summary;
          var cat = e.category || 'patterns';
          var badgeCls = e.verification === 'automated' ? 'badge-automated' : 'badge-verified';
          html += '<a class="card cat-' + cat + '" href="/docbox/' + lang + '/recipes/' + e.id + '">' +
            '<div class="card-head"><span class="card-engine">Godot ' + (e.min_engine_version || '4.0') + '+</span>' +
            '<span class="badge ' + badgeCls + '">' + (e.verification || 'human-verified') + '</span></div>' +
            '<h3>' + title + '</h3><p>' + sum + '</p>' +
            '<div class="card-tags">' + (e.tags || []).map(function (t) { return '<span>' + t + '</span>'; }).join('') +
            '</div></a>';
        });
        html += '</div>';
      }

      var main = document.querySelector('.main-content');
      if (main) {
        var wrap = document.createElement('div');
        wrap.innerHTML = html;
        main.appendChild(wrap);
      }
    }).catch(function () {});
  }

  // ---- Brand + language dropdown (segmented control) ---------------------
  function counterpart(path, toEn) {
    var p = path;
    if (toEn) {
      p = p.replace('/docbox/fa/', '/docbox/en/');
      if (p.indexOf('/docbox/en') !== 0) {
        if (p.indexOf('/docbox/about') === 0) p = '/docbox/en/about';
        else if (p.indexOf('/docbox/agent') === 0) p = '/docbox/en/agent';
        else p = '/docbox/en/';
      }
    } else {
      // the Persian About page lives at the site root, not under /fa/
      if (p.indexOf('/docbox/en/about') === 0) p = '/docbox/about';
      else {
        p = p.replace('/docbox/en/', '/docbox/fa/');
        if (p.indexOf('/docbox/fa') !== 0) p = '/docbox/fa/';
      }
    }
    return p;
  }

  function buildLangSwitch(isEn) {
    var sw = document.createElement('div');
    sw.className = 'lang-switch' + (isEn ? ' en' : '');
    sw.innerHTML =
      '<button type="button" class="lang-toggle" aria-haspopup="true" aria-expanded="false">' +
      '<span class="lang-globe">🌐</span>' +
      '<span class="lang-current">' + (isEn ? 'English' : 'فارسی') + '</span>' +
      '<span class="lang-caret">▾</span></button>' +
      '<div class="lang-menu" hidden>' +
      '<a class="lang-option' + (isEn ? '' : ' active') + '" href="' + counterpart(window.location.pathname, false) + '">' +
      '<span>فارسی</span><span class="lang-sub">Persian</span></a>' +
      '<a class="lang-option' + (isEn ? ' active' : '') + '" href="' + counterpart(window.location.pathname, true) + '">' +
      '<span>English</span><span class="lang-sub">انگلیسی</span></a>' +
      '</div>';

    var toggle = sw.querySelector('.lang-toggle');
    var menu = sw.querySelector('.lang-menu');
    function close() { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.hidden;
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) {
      if (!sw.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    return sw;
  }

  function initHeaderExtras() {
    var header = document.querySelector('.main-header') || document.querySelector('.site-header');
    if (!header) return;
    var path = window.location.pathname;
    var isEn = path.indexOf('/docbox/en') === 0;

    // brand at the start
    if (!header.querySelector('.db-brand')) {
      var brand = document.createElement('a');
      brand.className = 'db-brand';
      brand.href = isEn ? '/docbox/en/' : '/docbox/fa/';
      brand.innerHTML = '<span class="db-brand-mark">D</span><span>DocBox</span>';
      header.insertBefore(brand, header.firstChild);
    }

    // GitHub aux link opens in a new tab
    header.querySelectorAll('.site-button[href*="github.com"]').forEach(function (a) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });

    // language dropdown replaces the plain English aux link;
    // if the link is missing for any reason, fall back to appending
    if (!header.querySelector('.lang-switch')) {
      var langLi = null;
      header.querySelectorAll('.aux-nav-list-item .site-button').forEach(function (a) {
        var href = a.getAttribute('href') || '';
        if (href.indexOf('/docbox/en') === 0) langLi = a.closest('li') || a;
      });
      var sw = buildLangSwitch(isEn);
      if (langLi) {
        langLi.replaceWith(sw);
      } else {
        var aux = header.querySelector('.aux-nav') || header;
        aux.appendChild(sw);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    try { createToggleButton(); } catch (e) {}
    try { initHeaderExtras(); } catch (e) {}
    try { addCopyButtons(); } catch (e) {}
    try { initLibraryFilter(); } catch (e) {}
    try { initLocalization(); } catch (e) {}
    try { addCodeLabels(); } catch (e) {}
    try { initRecipeNav(); } catch (e) {}
  });
})();

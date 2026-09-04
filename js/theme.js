/* Theme switcher: 'sakura' (cherry blossom) | 'lotus' (painterly rose).
   Runs synchronously right after <body> opens so the correct theme class is
   set before the background engines (sakura.js / lotus.js) self-select.
   Persisted in mwn.theme; overridable via ?theme=sakura|lotus. */
(function () {
  'use strict';
  var qs = null;
  try { qs = new URLSearchParams(location.search).get('theme'); } catch (e) {}
  if (qs === 'sakura' || qs === 'lotus') {
    try { localStorage.setItem('mwn.theme', qs); } catch (e) {}
  }
  var t = null;
  try { t = localStorage.getItem('mwn.theme'); } catch (e) {}
  if (t !== 'lotus' && t !== 'sakura') t = 'sakura';

  document.body.classList.remove('bg-paper', 'bg-sakura');
  document.body.classList.add(t === 'lotus' ? 'bg-paper' : 'bg-sakura');

  document.addEventListener('DOMContentLoaded', function () {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'theme-toggle';
    b.title = t === 'lotus' ? 'Switch to cherry blossom' : 'Switch to lotus';
    b.innerHTML = t === 'lotus'
      ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="#c7839d"><circle cx="12" cy="7" r="3.2"/><circle cx="7" cy="10.5" r="3.2"/><circle cx="17" cy="10.5" r="3.2"/><circle cx="9" cy="15.5" r="3.2"/><circle cx="15" cy="15.5" r="3.2"/><circle cx="12" cy="11.5" r="2" fill="#f3e2b8"/></svg>'
      : '<svg viewBox="0 0 24 24" width="20" height="20" fill="#a96e26"><path d="M12 4 C 9 8, 9 13, 12 17 C 15 13, 15 8, 12 4 Z"/><path d="M5 9 C 6 13, 9 16, 12 17 C 11 13, 9 10, 5 9 Z" opacity=".75"/><path d="M19 9 C 18 13, 15 16, 12 17 C 13 13, 15 10, 19 9 Z" opacity=".75"/></svg>';
    b.addEventListener('click', function () {
      try { localStorage.setItem('mwn.theme', t === 'lotus' ? 'sakura' : 'lotus'); } catch (e) {}
      location.reload();
    });
    document.body.appendChild(b);
  });
})();

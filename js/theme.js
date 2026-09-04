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
    b.textContent = t === 'lotus' ? '\u{1F338}' : '\u{1FAB7}';
    b.addEventListener('click', function () {
      try { localStorage.setItem('mwn.theme', t === 'lotus' ? 'sakura' : 'lotus'); } catch (e) {}
      location.reload();
    });
    document.body.appendChild(b);
  });
})();

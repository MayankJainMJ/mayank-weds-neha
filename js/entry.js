/* The Entry Moment — envelope with wax-seal monogram; tap to break, card
   unfolds, names ink themselves, countdown settles in.
   Rules (per design loops): envelope IS the loader (no separate spinner);
   once per device (mwn.intro); reduced-motion or revisit -> straight to card;
   "replay opening" footnote re-runs it. Background bloom is held until the
   envelope opens, then released.
   Only runs on the invite page (needs .invite-card). */
(function () {
  'use strict';

  var card = document.querySelector('.invite-card');
  if (!card || !window.LOGO) return;

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* envelope greets EVERY visit (couple's call). ?entry=0 skips (tests/deep links), ?entry=1 forces. */
  var skip = false;
  try {
    var q = new URLSearchParams(location.search).get('entry');
    if (q === '0') skip = true;
    if (q === '1') { skip = false; reduced = false; }
  } catch (e) {}

  var isSakura = document.body.classList.contains('bg-sakura');

  /* ---------- countdown (always, entry or not) ---------- */
  function addCountdown() {
    if (document.getElementById('invCount')) return;
    var days = Math.ceil((new Date('2026-12-03T00:00:00+05:30') - Date.now()) / 864e5);
    var txt = days > 1 ? days + ' days' : days === 1 ? 'tomorrow' : days === 0 ? 'today' : 'just married \u2726';
    var p = document.createElement('p');
    p.id = 'invCount';
    p.className = 'inv-count';
    p.textContent = days > 1 ? 'in ' + txt : txt;
    var year = document.querySelector('.inv-year');
    if (year) year.insertAdjacentElement('afterend', p);
  }

  /* ---------- names ink-write ---------- */
  function inkNames() {
    var names = document.querySelector('.inv-names');
    if (!names || reduced) return;
    var ink = document.createElement('div');
    ink.className = 'ink-names';
    ink.innerHTML = '<span class="ink-line">Neha &amp; Mayank</span>' +
      '<svg class="ink-flourish" viewBox="0 0 200 14" aria-hidden="true"><path d="M6 8 C 50 2, 90 12, 100 7 C 112 2, 150 10, 194 6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
    names.style.opacity = '0';
    ink.style.position = 'absolute';
    ink.style.left = '0';
    ink.style.right = '0';
    ink.style.top = (names.offsetTop - 6) + 'px';
    ink.style.margin = '0';
    names.parentNode.style.position = 'relative';
    names.parentNode.appendChild(ink);
    /* after the ink writes, crossfade to the formal caps */
    setTimeout(function () {
      ink.classList.add('ink-out');
      names.style.transition = 'opacity .6s ease';
      names.style.opacity = '1';
      setTimeout(function () { ink.remove(); }, 700);
    }, 2750);
  }

  /* ---------- envelope ---------- */
  function buildEnvelope() {
    var ov = document.createElement('div');
    ov.className = 'env-ov';
    ov.id = 'envOv';
    ov.innerHTML =
      '<div class="env-scene">' +
        '<div class="env">' +
          '<div class="env-back"></div>' +
          '<div class="env-card"></div>' +
          '<div class="env-front"></div>' +
          '<div class="env-flap"><picture><source srcset="img/logo.webp" type="image/webp"><img class="flap-logo" src="img/logo.png" alt=""></picture></div>' +
          '<button type="button" class="env-seal" aria-label="Break the seal and open your invitation">' +
            '<svg viewBox="0 0 100 100" aria-hidden="true">' +
              '<path class="wax-rim" d="M50 3 C 68 1, 84 10, 92 26 C 99 40, 98 60, 90 74 C 81 90, 64 98, 47 97 C 30 96, 14 86, 7 70 C 1 55, 3 36, 12 22 C 21 9, 34 4, 50 3 Z"/><path class="wax" transform="translate(50,50) scale(.92) translate(-50,-50)" d="M50 3 C 68 1, 84 10, 92 26 C 99 40, 98 60, 90 74 C 81 90, 64 98, 47 97 C 30 96, 14 86, 7 70 C 1 55, 3 36, 12 22 C 21 9, 34 4, 50 3 Z"/>' +
              '<g class="seal-emboss" transform="translate(19,24.2) scale(.31)">' + window.LOGO.seal(200, 'currentColor').replace(/<\/?svg[^>]*>/g, '') + '</g>' +
      '<g class="seal-mono" transform="translate(19,23) scale(.31)">' + window.LOGO.seal(200, 'currentColor').replace(/<\/?svg[^>]*>/g, '') + '</g>' +
            '</svg>' +
          '</button>' +
          '<p class="env-hint">tap the seal to open</p>' +
        '</div>' +
      '</div>';
    return ov;
  }

  function play(isReplay) {
    if (document.getElementById('envOv')) return;
    document.body.classList.add('hold-bloom', 'env-locked');
    var ov = buildEnvelope();
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.classList.add('env-in'); });

    var opened = false;
    ov.querySelector('.env-seal').addEventListener('click', function () {
      if (opened) return;
      opened = true;
      try { localStorage.setItem('mwn.intro', '1'); } catch (e) {}
      ov.classList.add('env-open');            /* seal cracks, flap lifts, card rises */
      setTimeout(inkNames, 600);               /* ink begins as the flap lifts — write overlaps the reveal */
      setTimeout(function () {
        document.body.classList.remove('hold-bloom');  /* release background bloom */
        ov.classList.add('env-gone');
      }, 950);
      setTimeout(function () {
        ov.remove();
        document.body.classList.remove('env-locked');
      }, 1650);
    });
  }

  /* the pets belong on the card, large enough to read as illustration */
  function addCardLogo() {
    if (document.querySelector('.card-logo')) return;
    var d = document.createElement('div');
    d.className = 'card-logo';
    d.innerHTML = '<picture><source srcset="img/logo.webp" type="image/webp"><img src="img/logo.png" alt="Neha and Mayank" decoding="async"></picture>';
    card.insertBefore(d, card.firstChild);
  }

  addCardLogo();
  addCountdown();

  if (!skip && !reduced) {
    /* wait for fonts so the reveal is never half-dressed; cap the wait */
    var go = function () { play(false); };
    if (document.fonts && document.fonts.ready) {
      var done = false;
      var once = function () { if (!done) { done = true; go(); } };
      document.fonts.ready.then(once);
      setTimeout(once, 1400);
    } else { go(); }
  }
})();

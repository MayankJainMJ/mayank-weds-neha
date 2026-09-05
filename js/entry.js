/* The Entry Moment v2 — "Cherry Blossom Keepsake".
   A physical piece of stationery on the invitation's own watercolour paper:
   layered envelope (body/interior/insert/folds/flap), dusty-rose wax seal
   with embossed monogram + SVG crack, weighted flap, and a SHARED-CARD
   transition: the insert becomes the real invite card via FLIP.
   Sequence target: ~2.8s after tap. Once per browser session
   (sessionStorage), ?entry=1 forces, ?entry=0 skips, reduced-motion skips.
   The personalised illustrated logo is used AS-IS (small, on the flap). */
(function () {
  'use strict';

  var card = document.querySelector('.invite-card');
  if (!card) return;

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var skip = false;
  try {
    if (sessionStorage.getItem('mwn.introSes') === '1') skip = true;
    var q = new URLSearchParams(location.search).get('entry');
    if (q === '0') skip = true;
    if (q === '1') skip = false;   /* forces replay but NEVER overrides reduced-motion */
  } catch (e) {}

  /* ---------- countdown ---------- */
  function addCountdown() {
    if (document.getElementById('invCount')) return;
    var days = Math.ceil((new Date('2026-12-03T00:00:00+05:30') - Date.now()) / 864e5);
    var p = document.createElement('p');
    p.id = 'invCount';
    p.className = 'inv-count';
    p.textContent = days > 1 ? 'in ' + days + ' days' : days === 1 ? 'tomorrow' : days === 0 ? 'today' : 'just married \u2726';
    var year = document.querySelector('.inv-year');
    if (year) year.insertAdjacentElement('afterend', p);
  }

  function addCardLogo() {
    if (document.querySelector('.card-logo')) return;
    var d = document.createElement('div');
    d.className = 'card-logo';
    d.innerHTML = '<picture><source srcset="img/logo.webp" type="image/webp"><img src="img/logo.png" alt="Neha and Mayank" decoding="async"></picture>';
    card.insertBefore(d, card.firstChild);
  }

  function addReplay() {
    if (document.getElementById('replayEntry')) return;
    var links = document.querySelector('.inv-links');
    if (!links) return;
    var sep = document.createElement('span');
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '\u00B7';
    var b = document.createElement('button');
    b.type = 'button';
    b.id = 'replayEntry';
    b.className = 'linklike';
    b.textContent = 'Replay opening';
    b.addEventListener('click', function () {
      try { sessionStorage.removeItem('mwn.introSes'); } catch (e) {}
      play();
    });
    links.appendChild(sep);
    links.appendChild(b);
  }

  /* ---------- names: handwritten, then kept as a faint gold watermark ---------- */
  function inkNames(run) {
    var names = document.querySelector('.inv-names');
    if (!names || matchMedia('(prefers-reduced-motion: reduce)').matches ||
        document.querySelector('.ink-names')) return;
    var ink = document.createElement('div');
    ink.className = 'ink-names';
    ink.innerHTML = '<span class="ink-wipe"><span class="ink-line">Neha &amp; Mayank</span></span>';
    ink.style.position = 'absolute';
    ink.style.left = '0';
    ink.style.right = '0';
    ink.style.top = (names.offsetTop - 4) + 'px';
    names.style.opacity = '0';
    names.parentNode.style.position = 'relative';
    names.parentNode.appendChild(ink);
    setTimeout(function () {
      if (run.dead) return;
      ink.classList.add('ink-keep');            /* rises + fades to watermark */
      names.style.transition = 'opacity .45s ease';
      names.style.opacity = '1';
      setTimeout(function () { ink.remove(); }, 2600); /* watermark lingers, then leaves quietly */
    }, 1050);
  }

  /* ---------- wax seal: two halves + crack ---------- */
  /* plain wax — no lettering competes with the real logo on the flap:
     an embossed rim ring and a soft centre dimple, like an unstamped seal */
  function sealSVG() {
    var L = 'M50 3 L46 22 L54 40 L47 60 L52 78 L47 97 C 30 96,14 86,7 70 C 1 55,3 36,12 22 C 21 9,34 4,50 3 Z';
    var R = 'M50 3 C 68 1,84 10,92 26 C 99 40,98 60,90 74 C 81 90,64 98,47 97 L52 78 L47 60 L54 40 L46 22 L50 3 Z';
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<g class="ck-half ck-half-l"><path class="ck-wax" d="' + L + '"/></g>' +
      '<g class="ck-half ck-half-r"><path class="ck-wax" d="' + R + '"/></g>' +
      '<circle class="ck-rim-sh" cx="50" cy="51.2" r="33"/>' +
      '<circle class="ck-rim-hi" cx="50" cy="49.6" r="33"/>' +
      '<circle class="ck-dimp" cx="50" cy="50.6" r="9.5"/>' +
      '<circle class="ck-dimp-hi" cx="50" cy="49.4" r="9.5"/>' +
      '<path class="ck-crack" d="M50 3 L46 22 L54 40 L47 60 L52 78 L47 97" fill="none"/>' +
      '<rect class="ck-sweep" x="-40" y="0" width="26" height="100" transform="rotate(18)"/>' +
      '</svg>';
  }

  function buildOverlay() {
    var ov = document.createElement('div');
    ov.className = 'ck-ov';
    ov.id = 'envOv';
    ov.innerHTML =
      '<div class="ck-vignette" aria-hidden="true"></div>' +
      '<div class="ck-glow" aria-hidden="true"></div>' +
      '<div class="ck-branch" aria-hidden="true">' +
        '<svg viewBox="0 0 220 150" fill="none">' +
        '<path d="M-8 10 C 40 24, 86 52, 132 108 C 140 118, 146 128, 149 140" stroke="#6b4a35" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M52 32 C 66 25, 80 23, 94 26" stroke="#6b4a35" stroke-width="2" stroke-linecap="round"/>' +
        '<circle cx="70" cy="30" r="9" fill="#f5c9d6"/><circle cx="97" cy="27" r="7" fill="#f0b4c7"/>' +
        '<circle cx="120" cy="86" r="10" fill="#f5c9d6"/><circle cx="143" cy="122" r="7" fill="#f0b4c7"/>' +
        '<path d="M84 52 C 92 46, 100 46, 106 50 C 100 56, 90 57, 84 52 Z" fill="#87975f" opacity=".8"/>' +
        '</svg></div>' +
      '<div class="ck-loose" aria-hidden="true"><i></i><i></i><i></i></div>' +
      '<div class="ck-head">' +
        '<p class="ck-eyebrow">Together with their families</p>' +
        '<p class="ck-topnames">Neha &nbsp;&middot;&nbsp; Mayank</p>' +
      '</div>' +
      '<div class="ck-scene">' +
        '<div class="ck-env">' +
          '<div class="ck-body"></div>' +
          '<div class="ck-insert"></div>' +
          '<div class="ck-interior"></div>' +
          '<div class="ck-fold ck-fold-l"></div>' +
          '<div class="ck-fold ck-fold-r"></div>' +
          '<div class="ck-fold ck-fold-b"></div>' +
          '<div class="ck-grain"></div>' +
          '<div class="ck-flap"><picture><source srcset="img/logo.webp" type="image/webp"><img class="ck-flaplogo" src="img/logo.png" alt=""></picture></div>' +
          '<button type="button" class="ck-seal" aria-label="Open Neha and Mayank\u2019s wedding invitation">' + sealSVG() + '</button>' +
        '</div>' +
      '</div>' +
      '<p class="ck-hint">Tap the seal to open<span class="ck-hintline" aria-hidden="true"></span></p>';
    return ov;
  }

  /* staggered blossom release: upper-left first, sides, lower-right, petals last */
  function releaseBloom(run) {
    var b = document.body;
    b.classList.add('go1');
    setTimeout(function () { if (!run.dead) b.classList.add('go2'); }, 140);
    setTimeout(function () { if (!run.dead) b.classList.add('go3'); }, 280);
    setTimeout(function () { if (!run.dead) b.classList.add('go4'); }, 900);
    setTimeout(function () { if (!run.dead) b.classList.remove('hold-bloom', 'go1', 'go2', 'go3', 'go4'); }, 1600);
  }

  /* card content groups revealed in sequence after the FLIP lands */
  function contentGroups() {
    var sel = [
      ['.inv-script', '.inv-year', '#invCount'],            /* date + countdown */
      ['.inv-rule', '.inv-venue'],                          /* venue */
      ['.inv-note', '.inv-rsvp', '.inv-links']              /* note + actions */
    ];
    return sel.map(function (g) {
      return g.map(function (s) { return card.querySelector(s); }).filter(Boolean);
    });
  }

  /* force-finish: if reduced-motion is switched on mid-entry, the overlay
     would go display:none with the page still locked — release everything.
     run.dead invalidates every timer/rAF queued by this play() run. */
  function bail(mq, onmq, run) {
    run.dead = true;
    try { if (mq.removeEventListener) mq.removeEventListener('change', onmq); else mq.removeListener(onmq); } catch (e) {}
    var o = document.getElementById('envOv');
    if (o) o.remove();
    try { card.getAnimations().forEach(function (a) { a.cancel(); }); } catch (e) {}
    card.style.opacity = '';
    document.body.classList.remove('hold-bloom', 'env-locked', 'ck-flip', 'go1', 'go2', 'go3', 'go4');
    var els = document.querySelectorAll('.ck-g');
    for (var i = 0; i < els.length; i++) els[i].classList.remove('ck-g', 'ckh');
    var names = document.querySelector('.inv-names');
    if (names) { names.style.opacity = ''; names.style.transition = ''; }
    var ink = document.querySelector('.ink-names');
    if (ink) ink.remove();
  }

  function play() {
    /* live check: replay must never build an overlay the reduced-motion CSS hides */
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.getElementById('envOv')) return;
    document.body.classList.add('hold-bloom', 'env-locked');
    var run = { dead: false };
    var mq = matchMedia('(prefers-reduced-motion: reduce)');
    var onmq = function (e) { if (e.matches) bail(mq, onmq, run); };
    try { if (mq.addEventListener) mq.addEventListener('change', onmq); else mq.addListener(onmq); } catch (e) {}
    var ov = buildOverlay();
    document.body.appendChild(ov);
    requestAnimationFrame(function () { if (!run.dead) ov.classList.add('ck-in'); });

    var opened = false;
    ov.querySelector('.ck-seal').addEventListener('click', function () {
      if (opened) return;
      opened = true;
      try { sessionStorage.setItem('mwn.introSes', '1'); } catch (e) {}
      try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {}

      var staleInk = document.querySelector('.ink-names');
      if (staleInk) staleInk.remove();                    /* replay: clear last run's watermark */

      ov.classList.add('ck-crack');                       /* 0-220 compress, 180-460 crack+separate */
      setTimeout(function () { if (!run.dead) ov.classList.add('ck-open'); }, 240);   /* flap 240-960, insert rises 540+ */

      var groups = contentGroups();
      /* shared-card FLIP: the insert becomes the real invitation.
         ck-flip (z/visibility swap) must COMMIT a frame before the transform
         animation starts, or the compositor never re-sorts the card above
         the overlay. Hence the double-rAF. */
      setTimeout(function () {
        if (run.dead) return;
        card.style.opacity = '0';                         /* no flash while layers commit */
        document.body.classList.add('ck-flip');           /* card above envelope */
        /* the z drop must COMMIT before ov's own opacity transition begins —
           Chromium freezes layer order once the overlay starts fading */
        ov.style.zIndex = '10';
        /* below the fold of the moment: content arrives in sequence */
        groups.forEach(function (g) { g.forEach(function (el) {
          el.style.animation = 'none';   /* load-time entrance anims would override .ckh */
          el.classList.add('ck-g', 'ckh');
        }); });
        var nm = card.querySelector('.inv-names');
        if (nm) nm.style.opacity = '0';  /* no flash before the ink writes them */
        requestAnimationFrame(function () { requestAnimationFrame(function () {
          if (run.dead) { card.style.opacity = ''; return; }
          ov.classList.add('ck-away');                    /* envelope lowers + fades */
          var insert = ov.querySelector('.ck-insert');
          var first = insert.getBoundingClientRect();     /* read at launch — it is mid-rise */
          var last = card.getBoundingClientRect();
          insert.style.transition = 'none';               /* vanish instantly — the card takes over */
          insert.style.opacity = '0';
          card.style.opacity = '';
          /* UNIFORM scale (no distortion): width-matched; the not-yet-emerged
             lower portion is clipped and released like paper leaving a pocket */
          var s = first.width / last.width;
          var dx = first.left - last.left, dy = first.top - last.top;
          var hid = Math.max(0, (1 - first.height / (last.height * s)) * 100);
          try {
            var fl = card.animate([
              { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')', transformOrigin: 'top left' },
              { transform: 'translate(0,0) scale(1)', transformOrigin: 'top left' }
            ], { duration: 800, easing: 'cubic-bezier(.22,.72,.18,1)', fill: 'both' });
            fl.onfinish = function () { fl.cancel(); };   /* lingering transform breaks text painting */
            var cl = card.animate([
              { clipPath: 'inset(0 0 ' + hid.toFixed(2) + '% 0 round 6px)' },
              { clipPath: 'inset(0 0 0% 0 round 6px)' }
            ], { duration: 560, easing: 'cubic-bezier(.3, .4, .2, 1)', fill: 'both' });
            cl.onfinish = function () { cl.cancel(); };
          } catch (e) {}
        }); });
      }, 950);

      setTimeout(function () { if (!run.dead) inkNames(run); }, 1200);
      setTimeout(function () { if (!run.dead) releaseBloom(run); }, 1250);
      /* staggered reveal: date/countdown -> venue -> note/actions */
      [1600, 1750, 1900].forEach(function (t, i) {
        setTimeout(function () {
          if (run.dead) return;
          groups[i].forEach(function (el) { el.classList.remove('ckh'); });
        }, t);
      });
      setTimeout(function () {
        if (run.dead) return;
        try { if (mq.removeEventListener) mq.removeEventListener('change', onmq); else mq.removeListener(onmq); } catch (e) {}
        ov.remove();
        document.body.classList.remove('env-locked', 'ck-flip');
        groups.forEach(function (g) { g.forEach(function (el) { el.classList.remove('ck-g', 'ckh'); }); });
        var names = document.querySelector('.inv-names');
        if (names) {
          /* idempotent: if the ink pass never ran, restore visibility here */
          if (!document.querySelector('.ink-names')) { names.style.opacity = ''; names.style.transition = ''; }
          names.setAttribute('tabindex', '-1');
          names.addEventListener('blur', function () { names.removeAttribute('tabindex'); }, { once: true });
          try { names.focus({ preventScroll: true }); } catch (e) {}
        }
      }, 2450);
    });
  }

  addCardLogo();
  addCountdown();
  addReplay();

  if (!skip && !reduced) {
    var go = function () { play(); };
    if (document.fonts && document.fonts.ready) {
      var done = false;
      var once = function () { if (!done) { done = true; go(); } };
      document.fonts.ready.then(once);
      setTimeout(once, 1400);
    } else { go(); }
  }
})();

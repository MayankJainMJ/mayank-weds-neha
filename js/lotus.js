/* Blooming lotus stationery background (invite + rsvp).
   Injects two fixed, zero-layout-height layers:
     .lotus-bg — paper mandalas (behind content)
     .lotus-fg — corner lotuses that bloom petal-by-petal, temple bell, drifting petals (above cards, pointer-events:none)
   Pure SVG + CSS animation. Reduced-motion → flowers render fully open, nothing moves. */
(function () {
  'use strict';

  var PETAL = 'M0 0 C -9 -10, -10 -26, 0 -38 C 10 -26, 9 -10, 0 0 Z';

  function lotus(size, delay, stem) {
    var outer = [-56, -28, 0, 28, 56];
    var inner = [-26, 0, 26];
    var s = '<svg class="lotus" width="' + size + '" height="' + size + '" viewBox="-46 -46 92 ' + (stem ? 94 : 52) + '" aria-hidden="true">';
    s += '<defs><linearGradient id="lpO" x1="0" y1="1" x2="0" y2="0">' +
         '<stop offset="0" stop-color="#b83a56"/><stop offset=".55" stop-color="#d95a78"/><stop offset="1" stop-color="#f2a0b4"/></linearGradient>' +
         '<linearGradient id="lpI" x1="0" y1="1" x2="0" y2="0">' +
         '<stop offset="0" stop-color="#d95a78"/><stop offset="1" stop-color="#f9c4d0"/></linearGradient></defs>';
    if (stem) {
      s += '<path class="lotus-stem" d="M0 0 C 3 14, -4 28, 2 46" fill="none" stroke="#7d9b76" stroke-width="1.8" stroke-linecap="round"/>';
    }
    outer.forEach(function (a, i) {
      s += '<path class="petal" style="--a:' + a + 'deg;--i:' + i + ';--d:' + delay + 's" d="' + PETAL + '" fill="url(#lpO)"/>';
    });
    inner.forEach(function (a, i) {
      s += '<path class="petal inner" style="--a:' + a + 'deg;--i:' + (i + 5) + ';--s:.72;--d:' + delay + 's" d="' + PETAL + '" fill="url(#lpI)"/>';
    });
    s += '<ellipse class="lotus-heart" style="--d:' + delay + 's" cx="0" cy="-7" rx="4.5" ry="3.5" fill="#f5c542"/>';
    return s + '</svg>';
  }

  function bell() {
    return '<svg class="lotus-bell-svg" width="46" height="72" viewBox="-16 0 32 50" aria-hidden="true">' +
      '<rect x="-1.2" y="0" width="2.4" height="9" rx="1" fill="#8a6a1f"/>' +
      '<g class="bell-swing">' +
      '<path d="M-10 30 Q -10 14, 0 14 Q 10 14, 10 30 L 12.5 34 L -12.5 34 Z" fill="#c9a334" stroke="#8a6a1f" stroke-width="1.2"/>' +
      '<rect x="-3.5" y="9" width="7" height="6" rx="2" fill="#b08d2a"/>' +
      '<circle class="bell-clapper" cx="0" cy="37.5" r="3.2" fill="#8a6a1f"/>' +
      '</g></svg>';
  }

  function mandala(r) {
    var s = '<svg width="' + (r * 2.4) + '" height="' + (r * 2.4) + '" viewBox="' + (-r * 1.2) + ' ' + (-r * 1.2) + ' ' + (r * 2.4) + ' ' + (r * 2.4) + '" aria-hidden="true" fill="none" stroke="#b3765a">';
    s += '<circle r="' + r + '" stroke-width="1" stroke-dasharray="2 5"/>';
    s += '<circle r="' + (r * .78) + '" stroke-width="1"/>';
    s += '<circle r="' + (r * .34) + '" stroke-width="1" stroke-dasharray="1 3"/>';
    for (var i = 0; i < 24; i++) {
      s += '<ellipse rx="' + (r * .07) + '" ry="' + (r * .2) + '" cx="0" cy="' + (-r * .56) + '" stroke-width=".8" transform="rotate(' + (i * 15) + ')"/>';
    }
    return s + '</svg>';
  }

  function driftPetal(i) {
    return '<svg class="drift" style="--dl:' + (i * 4.2) + 's;--dur:' + (15 + i * 3.5) + 's;left:' + (12 + i * 22) + 'vw" width="16" height="16" viewBox="-10 -40 20 42"><path d="' + PETAL + '" fill="#e88ba0" transform="scale(.42)"/></svg>';
  }

  var bg = document.createElement('div');
  bg.className = 'lotus-bg';
  bg.setAttribute('aria-hidden', 'true');
  bg.innerHTML =
    '<div class="lm lm-tr">' + mandala(120) + '</div>' +
    '<div class="lm lm-bl">' + mandala(150) + '</div>' +
    '<div class="lm lm-ml">' + mandala(70) + '</div>';

  var fg = document.createElement('div');
  fg.className = 'lotus-fg';
  fg.setAttribute('aria-hidden', 'true');
  fg.innerHTML =
    '<div class="lotus-bell">' + bell() + '</div>' +
    '<div class="lo lo-br1 lotus-sway">' + lotus(120, .5, true) + '</div>' +
    '<div class="lo lo-br2 lotus-sway s2">' + lotus(78, 1.1, true) + '</div>' +
    '<div class="lo lo-tl lotus-sway s3">' + lotus(64, 1.5, false) + '</div>' +
    '<div class="lo lo-bl lotus-sway s2">' + lotus(56, 1.8, false) + '</div>' +
    driftPetal(0) + driftPetal(1) + driftPetal(2) + driftPetal(3);

  document.body.insertBefore(bg, document.body.firstChild);
  document.body.appendChild(fg);
})();

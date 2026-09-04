/* Painterly lotus stationery background v2 — modeled on the dusty-rose
   watercolor reference (rose paper, blotchy washes, layered many-petal
   lotuses with veining, baroque corner frame).
   Layers (all fixed, zero layout height):
     .lotus-bg — paper washes (feTurbulence clouds), baroque frame, grain
     .lotus-fg — blooming lotuses + buds + drifting petals (pointer-events:none)
   Petals stay individual <g> elements so bloom/sway animations keep working. */
(function () {
  'use strict';

  /* pointed lotus petal, base at (0,0), tip at (0,-46) */
  var PETAL = 'M0 0 C -11 -9, -14 -30, 0 -46 C 14 -30, 11 -9, 0 0 Z';
  var VEINS =
    '<path d="M0 -3 C -1 -16, -1 -30, 0 -42" class="vein"/>' +
    '<path d="M0 -4 C -5 -14, -7 -26, -4 -36" class="vein"/>' +
    '<path d="M0 -4 C 5 -14, 7 -26, 4 -36" class="vein"/>' +
    '<path d="M0 -5 C -8 -12, -10 -22, -8 -28" class="vein v2"/>' +
    '<path d="M0 -5 C 8 -12, 10 -22, 8 -28" class="vein v2"/>';

  /* shared defs: gradients + watercolor-edge filter (referenced by url()) */
  var DEFS =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<linearGradient id="lgO" x1="0" y1="1" x2="0" y2="0">' +
    '<stop offset="0" stop-color="#7d003d"/><stop offset=".5" stop-color="#b02460"/><stop offset="1" stop-color="#d45b91"/></linearGradient>' +
    '<linearGradient id="lgM" x1="0" y1="1" x2="0" y2="0">' +
    '<stop offset="0" stop-color="#a70849"/><stop offset=".5" stop-color="#d45b91"/><stop offset="1" stop-color="#f5b2c7"/></linearGradient>' +
    '<linearGradient id="lgI" x1="0" y1="1" x2="0" y2="0">' +
    '<stop offset="0" stop-color="#d74f83"/><stop offset=".55" stop-color="#f3b3c7"/><stop offset="1" stop-color="#fbdde7"/></linearGradient>' +
    '<filter id="wedge" x="-10%" y="-10%" width="120%" height="120%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="11" result="n"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="2.8"/></filter>' +
    '<filter id="blot" x="-30%" y="-30%" width="160%" height="160%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" seed="4" result="n"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="60"/>' +
    '<feGaussianBlur stdDeviation="7"/></filter>' +
    '<filter id="blot2" x="-30%" y="-30%" width="160%" height="160%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="17" result="n"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="46"/>' +
    '<feGaussianBlur stdDeviation="3"/></filter>' +
    '<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9"/>' +
    '<feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.30  0 0 0 0 0.32  0 0 0 0.05 0"/></filter>' +
    '</defs></svg>';

  /* one lotus: 7 broad outer + 5 mid + 3 pointed inner petals, all separate */
  function lotus(delay, stem) {
    var jr = [3, -4, 2, -2, 4, -3, 1, -2, 3, -1, 2, -3, 1, 2, -1]; /* angle jitter */
    var js = [0, .04, -.03, .02, -.04, .03, -.02, .04, -.02, 0, .03, -.03, .02, -.02, .03];
    var n = 0;
    var s = '<svg class="lotus" viewBox="-58 -58 116 ' + (stem ? 120 : 62) + '" aria-hidden="true">';
    if (stem) {
      s += '<path class="lotus-stem" d="M0 0 C 4 16, -5 34, 3 58" fill="none" stroke="#69752d" stroke-width="1.6" stroke-linecap="round"/>' +
           '<path class="lotus-stem" d="M0 0 C 4 16, -5 34, 3 58" fill="none" stroke="#9aa658" stroke-width=".6" stroke-linecap="round" opacity=".7"/>' +
           '<path class="lotus-leaf" d="M2 30 C 14 26, 26 30, 30 40 C 18 44, 6 40, 2 30 Z" fill="#69752d" opacity=".8"/>';
    }
    function ring(angles, scale, grad, cls) {
      angles.forEach(function (a) {
        var ang = a + jr[n % jr.length];
        var sc = scale + js[n % js.length];
        s += '<g class="petal ' + cls + '" style="--a:' + ang + 'deg;--i:' + n + ';--s:' + sc.toFixed(2) + ';--d:' + delay + 's">' +
             '<path d="' + PETAL + '" fill="url(#' + grad + ')"/>' +
             '<path d="' + PETAL + '" fill="#76052f" opacity=".45" transform="scale(.5,.34)"/>' +
             '<path d="' + PETAL + '" fill="#f7c6d6" opacity=".38" transform="translate(2.5,-3) scale(.3,.78)"/>' +
             VEINS + '</g>';
        n++;
      });
    }
    s += '<g filter="url(#wedge)">';
    ring([-66, 66], .78, 'lgO', 'p-droop');            /* drooping outer sepals */
    ring([-46, -30, -15, 0, 15, 30, 46], 1, 'lgO', 'p-outer');
    ring([-32, -16, 0, 16, 32], .84, 'lgM', 'p-mid');
    ring([-12, 0, 12], .62, 'lgI', 'p-inner');
    s += '<ellipse class="lotus-heart" style="--d:' + delay + 's" cx="0" cy="-9" rx="6.5" ry="5" fill="#76052f" opacity=".92"/>';
    s += '</g></svg>';
    return s;
  }

  /* closed bud on a stem */
  function bud(delay) {
    var s = '<svg class="lotus" viewBox="-30 -56 60 116" aria-hidden="true">';
    s += '<path class="lotus-stem" d="M0 0 C 3 14, -3 32, 2 56" fill="none" stroke="#69752d" stroke-width="1.5" stroke-linecap="round"/>';
    s += '<g filter="url(#wedge)">';
    [[-14, .82, 'lgO'], [14, .82, 'lgO'], [0, .9, 'lgM']].forEach(function (p, i) {
      s += '<g class="petal" style="--a:' + p[0] + 'deg;--i:' + i + ';--s:' + p[1] + ';--d:' + delay + 's">' +
           '<path d="' + PETAL + '" fill="url(#' + p[2] + ')"/>' + '</g>';
    });
    s += '<path d="M-7 2 C -4 8, 4 8, 7 2 L 0 -6 Z" fill="#69752d" opacity=".85"/>';
    return s + '</g></svg>';
  }

  /* watercolor paper: big soft blots, pale center, grain */
  function clouds() {
    return '<svg class="wclouds" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 400 800" aria-hidden="true">' +
      '<rect width="400" height="800" fill="#f3e5dd" opacity=".28"/>' +
      '<g filter="url(#blot)">' +
      '<ellipse cx="-20" cy="400" rx="150" ry="330" fill="#c08286" opacity=".2"/>' +
      '<ellipse cx="420" cy="430" rx="150" ry="340" fill="#c08286" opacity=".2"/>' +
      '<ellipse cx="30" cy="180" rx="130" ry="230" fill="#c98f91" opacity=".22"/>' +
      '<ellipse cx="390" cy="120" rx="150" ry="200" fill="#b97f85" opacity=".19"/>' +
      '<ellipse cx="370" cy="620" rx="170" ry="240" fill="#c98f91" opacity=".23"/>' +
      '<ellipse cx="20" cy="700" rx="150" ry="200" fill="#d9aba5" opacity=".15"/>' +
      '<ellipse cx="210" cy="60" rx="180" ry="90" fill="#d9aba5" opacity=".12"/>' +
      '<ellipse cx="200" cy="400" rx="170" ry="260" fill="#fff4e8" opacity=".38"/>' +
      '</g>' +
      '<g filter="url(#blot2)">' +
      '<ellipse cx="80" cy="330" rx="90" ry="120" fill="#c98f91" opacity=".14"/>' +
      '<ellipse cx="330" cy="260" rx="80" ry="140" fill="#b97f85" opacity=".13"/>' +
      '<ellipse cx="140" cy="640" rx="110" ry="90" fill="#d9aba5" opacity=".15"/>' +
      '<ellipse cx="290" cy="470" rx="70" ry="100" fill="#c98f91" opacity=".12"/>' +
      '</g>' +
      '<rect width="400" height="800" filter="url(#grain)" opacity=".9"/>' +
      '</svg>';
  }

  /* baroque corner ornament (stroke scrollwork), mirrored to 4 corners */
  function cornerOrn() {
    return '<svg viewBox="0 0 130 130" aria-hidden="true" fill="none" stroke="#a94f68">' +
      '<path d="M4 126 C 4 120, 14 118, 22 120 C 40 124, 58 122, 74 118" stroke-width="2.2" opacity=".55"/>' +
      '<path d="M126 4 C 120 4, 118 14, 120 22 C 124 40, 122 58, 118 74" stroke-width="2.2" opacity=".55"/>' +
      '<path d="M74 118 c 8 -2 10 -10 4 -13 c -5 -2 -9 3 -5 7" stroke-width="1.8" opacity=".55"/>' +
      '<path d="M118 74 c -2 8 -10 10 -13 4 c -2 -5 3 -9 7 -5" stroke-width="1.8" opacity=".55"/>' +
      '<path d="M4 86 C 4 40, 18 16, 60 8 C 74 6, 84 10, 86 18" stroke-width="3" opacity=".62"/>' +
      '<path d="M10 86 C 10 46, 24 22, 62 14" stroke-width="1.5" opacity=".55"/>' +
      '<path d="M86 18 c 2 8 -6 12 -11 8 c -4 -3 -2 -9 3 -9" stroke-width="2" opacity=".65"/>' +
      '<path d="M4 86 c 8 -2 12 6 8 11 c -3 4 -9 2 -9 -3" stroke-width="2" opacity=".65"/>' +
      '<path d="M30 34 c -6 -8 2 -18 10 -14" stroke-width="1.6" opacity=".55"/>' +
      '<path d="M46 22 c -2 -8 8 -14 14 -9" stroke-width="1.6" opacity=".55"/>' +
      '<path d="M18 56 c -8 -2 -10 -12 -3 -16" stroke-width="1.6" opacity=".55"/>' +
      '<path d="M24 44 q 8 -4 12 4 q -8 4 -12 -4 Z" fill="#a94f67" stroke="none" opacity=".3"/>' +
      '<path d="M40 28 q 8 -3 10 5 q -8 3 -10 -5 Z" fill="#a94f67" stroke="none" opacity=".3"/>' +
      '<circle cx="68" cy="10" r="1.6" fill="#a94f67" stroke="none" opacity=".5"/>' +
      '<circle cx="12" cy="66" r="1.6" fill="#a94f67" stroke="none" opacity=".5"/>' +
      '<circle cx="78" cy="24" r="1.3" fill="#a94f67" stroke="none" opacity=".4"/>' +
      '</svg>';
  }

  function driftPetal(i) {
    return '<svg class="drift" style="--dl:' + (i * 4.5) + 's;--dur:' + (16 + i * 3.5) + 's;left:' + (10 + i * 24) + 'vw" width="18" height="18" viewBox="-14 -48 28 50"><path d="' + PETAL + '" fill="#cc6f8d" transform="scale(.5)" opacity=".8"/></svg>';
  }

  var bg = document.createElement('div');
  bg.className = 'lotus-bg';
  bg.setAttribute('aria-hidden', 'true');
  bg.innerHTML = DEFS + clouds() +
    '<div class="pframe" aria-hidden="true"></div>' +
    '<div class="orn orn-tl">' + cornerOrn() + '</div>' +
    '<div class="orn orn-tr">' + cornerOrn() + '</div>' +
    '<div class="orn orn-bl">' + cornerOrn() + '</div>' +
    '<div class="orn orn-br">' + cornerOrn() + '</div>';

  var fg = document.createElement('div');
  fg.className = 'lotus-fg';
  fg.setAttribute('aria-hidden', 'true');
  fg.innerHTML =
    '<div class="lo lo-br1 lotus-sway">' + lotus(.4, true) + '</div>' +
    '<div class="lo lo-br2 lotus-sway s2">' + lotus(1.0, true) + '</div>' +
    '<div class="lo lo-tl lotus-sway s3">' + lotus(1.4, false) + '</div>' +
    '<div class="lo lo-ml lotus-sway s2">' + lotus(1.2, false) + '</div>' +
    '<div class="lo lo-bl lotus-sway s2">' + lotus(1.7, true) + '</div>' +
    '<div class="lo lo-bud1 lotus-sway s3">' + bud(2.0) + '</div>' +
    driftPetal(0) + driftPetal(1) + driftPetal(2) + driftPetal(3);

  document.body.insertBefore(bg, document.body.firstChild);
  document.body.appendChild(fg);
})();

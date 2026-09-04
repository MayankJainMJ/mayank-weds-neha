/* Couple's monogram — hand-traced SVG recreation of the designer logo:
   Devanagari म (Ma) interwoven with Latin N, dusty slate blue, thin elegant
   strokes with a leading flourish. Three tiers:
     LOGO.seal(size,color) — line-art monogram alone (wax seal, favicon)
     LOGO.full(size)      — monogram + pets (white puppy atop the bar,
                            ginger cat at the right foot, calico leaping at
                            lower-left) + lotus & lily sprigs (envelope front)
   Brand blue stays constant across themes. */
(function () {
  'use strict';

  var BLUE = '#52679c';

  /* monogram strokes (viewBox 0 0 200 170):
     - leading flourish sweeping from top-left down into the म loop
     - म: bowl-loop + stem + shirorekha (top bar)
     - N: left vertical (shared visual rhythm), diagonal, right vertical */
  function monoPaths(color, w) {
    return '' +
      /* flourish */
      '<path d="M28 22 C 14 30, 10 48, 20 62 C 28 73, 40 74, 46 66 C 51 59, 47 50, 39 50 C 33 50, 30 55, 33 60" fill="none" stroke="' + color + '" stroke-width="' + w + '" stroke-linecap="round"/>' +
      /* म bowl loop */
      '<path d="M62 118 C 46 118, 36 106, 36 92 C 36 78, 46 68, 60 68 C 74 68, 84 78, 84 94 L 84 40" fill="none" stroke="' + color + '" stroke-width="' + w + '" stroke-linecap="round"/>' +
      /* shirorekha (top bar) spanning म into N */
      '<path d="M64 40 L 176 40" fill="none" stroke="' + color + '" stroke-width="' + w + '" stroke-linecap="round"/>' +
      /* म stem continuing below bar */
      '<path d="M118 40 L 118 100" fill="none" stroke="' + color + '" stroke-width="' + w + '" stroke-linecap="round"/>' +
      /* म stem foot */
      '<path d="M112 100 L 124 100" fill="none" stroke="' + color + '" stroke-width="' + (w * .8) + '" stroke-linecap="round"/>' +
      /* N: two full verticals + diagonal, descending past the bar */
      '<path d="M134 46 L 134 120" fill="none" stroke="' + color + '" stroke-width="' + w + '" stroke-linecap="round"/>' +
      '<path d="M134 52 L 162 114" fill="none" stroke="' + color + '" stroke-width="' + w + '" stroke-linecap="round"/>' +
      '<path d="M162 120 L 162 46" fill="none" stroke="' + color + '" stroke-width="' + w + '" stroke-linecap="round"/>' +
      /* serif feet */
      '<path d="M128 120 L 140 120 M 156 120 L 168 120" fill="none" stroke="' + color + '" stroke-width="' + (w * .8) + '" stroke-linecap="round"/>';
  }

  function seal(size, color) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 200 170" aria-label="Neha and Mayank monogram">' +
      monoPaths(color || BLUE, 7) + '</svg>';
  }

  /* pets, simplified but recognizable */
  var PUPPY = /* white bichon sitting on the bar, left of म stem */
    '<g transform="translate(88,8)">' +
    '<ellipse cx="14" cy="26" rx="11" ry="9" fill="#fdfbf7" stroke="#e4ddd0" stroke-width="1"/>' +
    '<circle cx="14" cy="12" r="9" fill="#fdfbf7" stroke="#e4ddd0" stroke-width="1"/>' +
    '<circle cx="7" cy="8" r="4" fill="#fdfbf7"/><circle cx="21" cy="8" r="4" fill="#fdfbf7"/>' +
    '<circle cx="11" cy="11" r="1.2" fill="#3a3230"/><circle cx="17" cy="11" r="1.2" fill="#3a3230"/>' +
    '<ellipse cx="14" cy="15" rx="1.8" ry="1.4" fill="#3a3230"/>' +
    '<circle cx="14" cy="20" r="1.6" fill="#d9a03c"/>' + /* collar bell */
    '<path d="M4 30 Q 2 34, 6 35 M 24 30 Q 26 34, 22 35" stroke="#e4ddd0" stroke-width="1.2" fill="none"/>' +
    '</g>';

  var GINGER = /* ginger cat sitting at N's right foot */
    '<g transform="translate(160,96)">' +
    '<path d="M12 40 C 2 40, -2 30, 2 20 C 5 12, 12 8, 18 10 L 18 40 Z" fill="#d98c4a"/>' +
    '<ellipse cx="15" cy="38" rx="12" ry="5" fill="#d98c4a"/>' +
    '<circle cx="18" cy="8" r="8" fill="#d98c4a"/>' +
    '<path d="M12 2 L 14 -4 L 18 1 Z M 24 2 L 26 -4 L 22 1 Z" fill="#c97a38"/>' +
    '<circle cx="15" cy="7" r="1.1" fill="#3a2a1a"/><circle cx="21" cy="7" r="1.1" fill="#3a2a1a"/>' +
    '<path d="M18 10 L 18 12 M 15 12 Q 18 14, 21 12" stroke="#3a2a1a" stroke-width=".8" fill="none"/>' +
    '<path d="M4 22 L 10 22 M 3 27 L 9 27" stroke="#c97a38" stroke-width="1.4"/>' + /* stripes */
    '<path d="M26 38 C 32 36, 34 28, 30 24" stroke="#d98c4a" stroke-width="3.4" fill="none" stroke-linecap="round"/>' + /* tail */
    '</g>';

  var CALICO = /* calico cat leaping up at the flourish, lower-left */
    '<g transform="translate(18,118) rotate(-24)">' +
    '<ellipse cx="16" cy="12" rx="15" ry="7" fill="#fdfbf7" stroke="#e0d8ca" stroke-width=".8"/>' +
    '<path d="M6 8 C 2 4, 8 2, 12 6 Z" fill="#e8a04c"/><path d="M20 6 C 24 2, 30 6, 26 10 Z" fill="#4a3a30"/>' +
    '<circle cx="30" cy="8" r="6" fill="#fdfbf7" stroke="#e0d8ca" stroke-width=".8"/>' +
    '<path d="M26 3 L 27 -2 L 30 2 Z M 34 3 L 36 -1 L 32 1 Z" fill="#e8a04c"/>' +
    '<circle cx="29" cy="7" r=".9" fill="#3a3230"/><circle cx="33" cy="7" r=".9" fill="#3a3230"/>' +
    '<path d="M2 14 C -4 18, -6 24, -2 28" stroke="#4a3a30" stroke-width="2.8" fill="none" stroke-linecap="round"/>' + /* tail */
    '<path d="M10 18 L 8 24 M 22 18 L 24 24" stroke="#e0d8ca" stroke-width="2" stroke-linecap="round"/>' + /* legs */
    '</g>';

  var LOTUS_SPRIG = /* small pink lotus at the flourish, like the reference */
    '<g transform="translate(30,86)">' +
    '<path d="M0 0 C -5 -3, -6 -9, -2 -13 C 1 -10, 2 -4, 0 0 Z" fill="#e88ba8"/>' +
    '<path d="M0 0 C 5 -3, 6 -9, 2 -13 C -1 -10, -2 -4, 0 0 Z" fill="#f2aec3"/>' +
    '<path d="M0 0 C -1 -6, 0 -10, 0 -14 C 1 -10, 1 -6, 0 0 Z" fill="#f7cdd9"/>' +
    '<path d="M-6 2 C -2 5, 4 5, 8 2 C 4 0, -2 0, -6 2 Z" fill="#7fa05a" opacity=".85"/>' +
    '</g>';

  var LILY_SPRIG = /* lily cluster right, above the ginger cat */
    '<g transform="translate(168,58)">' +
    '<path d="M0 0 C -6 -4, -7 -12, -2 -16 C 2 -12, 3 -5, 0 0 Z" fill="#f2aec3"/>' +
    '<path d="M4 -2 C 0 -8, 2 -16, 8 -18 C 10 -12, 8 -6, 4 -2 Z" fill="#e88ba8"/>' +
    '<path d="M8 2 C 6 -4, 10 -10, 16 -10 C 15 -4, 12 0, 8 2 Z" fill="#f7cdd9"/>' +
    '<path d="M0 2 C 2 8, 0 14, -2 18" stroke="#7fa05a" stroke-width="1.6" fill="none"/>' +
    '<path d="M-2 10 C -6 8, -8 4, -7 0" stroke="#7fa05a" stroke-width="1.2" fill="none"/>' +
    '</g>';

  function full(size) {
    return '<svg width="' + size + '" height="' + (size * .85) + '" viewBox="0 0 200 170" aria-label="Neha and Mayank monogram with their pets">' +
      monoPaths(BLUE, 6) + PUPPY + GINGER + CALICO + LOTUS_SPRIG + LILY_SPRIG + '</svg>';
  }

  window.LOGO = { seal: seal, full: full, BLUE: BLUE };
})();

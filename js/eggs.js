/* Easter eggs. E4: tap the couple's names 8 times → 8 confetti hearts + toast.
   Eggs are bonus delight only — never required for invite/RSVP. */
(function () {
  'use strict';

  var names = document.getElementById('names');
  var toast = document.getElementById('toast');
  if (!names || !toast) return;

  var taps = 0;

  function burstHearts(x, y) {
    var glyphs = ['\u2665', '\u{1F49B}', '\u{1F9E1}', '\u2764\uFE0F'];
    for (var i = 0; i < 8; i++) {
      (function (i) {
        setTimeout(function () {
          var h = document.createElement('span');
          h.className = 'egg-heart';
          h.textContent = glyphs[i % glyphs.length];
          h.style.left = (x + (Math.random() * 90 - 45)) + 'px';
          h.style.top = y + 'px';
          document.body.appendChild(h);
          setTimeout(function () { h.remove(); }, 1500);
        }, i * 90);
      })(i);
    }
  }

  names.style.cursor = 'pointer';
  names.addEventListener('click', function (e) {
    taps++;
    if (taps >= 8) {
      taps = 0;
      burstHearts(e.clientX || window.innerWidth / 2, e.clientY || 160);
      toast.textContent = 'Eight taps. Eight years. \u2665';
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 2800);
    }
  });
})();

/* Entity behaviors + skins for the platformer layer: platforms, ?-blocks,
   drops, stompable enemies, Act-1 hazards (puddle, vada pav cart), rain.
   game.js orchestrates; this file only knows how one thing moves/draws.
   All coordinates are world px unless a camX is passed for drawing. */
(function () {
  'use strict';

  var GROUND = 400;

  /* ---------- sizes (game.js mirrors these in its HIT table) ---------- */
  var SIZES = {
    dog:  { w: 22, h: 16 },
    auto: { w: 32, h: 26 }
  };

  /* ---------- updates ---------- */
  function updateEnemy(e, dt, camX, W) {
    if (e.dead) { e.deadT += dt; return; }
    e.t += dt;
    if (e.kind === 'dog') {
      e.x = e.baseX + Math.sin(e.t * 1.2) * 26;      // gentle patrol — stompable under auto-run commit
    } else if (e.kind === 'auto') {
      if (e.x - camX < W + 60) e.x -= 58 * dt;        // drives left once near
    }
  }

  function updateDrop(d, dt) {
    d.t += dt;
    if (d.t < 0.3) d.y -= 66 * dt;                    // pop up out of the block
  }

  /* ---------- draws ---------- */
  function px(n) { return Math.round(n); }

  function drawPlatform(ctx, p, camX) {
    var x = px(p.x - camX), y = p.y;
    if (x + p.w < -20 || x > 340) return;
    if (p.kind === 'trainroof') {
      ctx.fillStyle = '#8f3b2e';                       // local-train car roof
      ctx.fillRect(x, y, p.w, 6);
      ctx.fillStyle = '#b04a38';
      ctx.fillRect(x + 2, y + 6, p.w - 4, 8);
      ctx.fillStyle = '#ffd9a0';                       // window strip
      for (var w2 = x + 6; w2 < x + p.w - 8; w2 += 14) ctx.fillRect(w2, y + 8, 8, 4);
    } else if (p.kind === 'scaffold') {
      ctx.fillStyle = '#c9a24b';                       // bamboo plank
      ctx.fillRect(x, y, p.w, 5);
      ctx.fillStyle = '#8a6b3f';
      ctx.fillRect(x + 4, y + 5, 3, GROUND - y - 5);   // poles to ground
      ctx.fillRect(x + p.w - 7, y + 5, 3, GROUND - y - 5);
      ctx.fillRect(x + 2, y + 1, p.w - 4, 1);
    } else if (p.kind === 'seawall') {
      ctx.fillStyle = '#9aa3ad';                       // tetrapod sea wall
      ctx.fillRect(x, y, p.w, 6);
      ctx.fillStyle = '#7d868f';
      ctx.fillRect(x, y + 6, p.w, GROUND - y - 6);
      ctx.fillStyle = '#b5bec7';
      for (var s2 = x + 4; s2 < x + p.w - 10; s2 += 22) ctx.fillRect(s2, y + 10, 12, 6);
    } else {
      ctx.fillStyle = '#8d99ae';
      ctx.fillRect(x, y, p.w, 8);
    }
  }

  function drawBlock(ctx, b, camX, t) {
    var x = px(b.x - camX), y = b.y;
    if (x < -20 || x > 340) return;
    if (b.hitFx && b.hitFx > 0) y -= Math.round(Math.sin(b.hitFx * Math.PI) * 6); // bump nudge
    ctx.fillStyle = b.hit ? '#8a8578' : '#fb8500';
    ctx.fillRect(x, y, 16, 16);
    ctx.fillStyle = b.hit ? '#6f6b60' : '#ffd23f';
    ctx.fillRect(x + 1, y + 1, 14, 2);
    ctx.fillRect(x + 1, y + 1, 2, 14);
    if (!b.hit) {                                       // "?" dots
      ctx.fillStyle = '#7b2d00';
      ctx.fillRect(x + 6, y + 4, 4, 2);
      ctx.fillRect(x + 9, y + 6, 2, 3);
      ctx.fillRect(x + 7, y + 9, 2, 2);
      ctx.fillRect(x + 7, y + 12, 2, 2);
    }
  }

  function drawEnemy(ctx, e, camX, runTime) {
    var s = SIZES[e.kind] || SIZES.dog;
    var x = px(e.x - camX), y = GROUND - s.h;
    if (x + s.w < -20 || x > 340) return;
    var a = e.dead ? Math.max(0, 1 - e.deadT * 2) : 1;
    if (a <= 0) return;
    ctx.globalAlpha = a;
    if (e.dead) y = GROUND - Math.max(4, s.h * (1 - e.deadT)); // squash
    if (e.kind === 'dog') {
      ctx.fillStyle = '#9a7248';
      ctx.fillRect(x + 2, y + 4, 16, 8);                // body
      ctx.fillRect(x + 14, y, 7, 8);                    // head
      ctx.fillStyle = '#7c5a36';
      ctx.fillRect(x + 15, y - 2, 2, 3);                // ear
      ctx.fillRect(x, y + 3 + Math.round(Math.sin(runTime * 8)) , 3, 2); // tail wag
      ctx.fillStyle = '#241a12';
      ctx.fillRect(x + 18, y + 2, 2, 2);                // eye
      if (!e.dead) {                                    // legs
        var f = Math.floor(runTime * 8) % 2;
        ctx.fillStyle = '#7c5a36';
        ctx.fillRect(x + 4 + f * 2, y + 12, 3, 4);
        ctx.fillRect(x + 12 - f * 2, y + 12, 3, 4);
      }
    } else if (e.kind === 'auto') {
      ctx.fillStyle = '#2b2118';
      ctx.fillRect(x + 2, y, 26, 8);                    // black hood
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(x, y + 8, 32, 12);                   // yellow body
      ctx.fillStyle = '#8ecae6';
      ctx.fillRect(x + 4, y + 3, 9, 6);                 // windshield
      ctx.fillStyle = '#241a12';
      ctx.fillRect(x + 4, y + 20, 6, 6);                // wheels
      ctx.fillRect(x + 22, y + 20, 6, 6);
      ctx.fillStyle = '#c94f2a';
      ctx.fillRect(x + 29, y + 10, 3, 4);               // tail light
    }
    ctx.globalAlpha = 1;
  }

  function drawDrop(ctx, d, camX) {
    var x = px(d.x - camX), y = px(d.y);
    if (d.type === 'heart') {
      ctx.fillStyle = '#e85d75';
      ctx.fillRect(x + 1, y, 4, 4); ctx.fillRect(x + 8, y, 4, 4);
      ctx.fillRect(x, y + 3, 13, 5); ctx.fillRect(x + 3, y + 8, 7, 3);
      ctx.fillStyle = '#ffb3c1';
      ctx.fillRect(x + 2, y + 1, 2, 2);
    } else if (d.type === 'prop:chai') {
      ctx.fillStyle = '#b06a3a';                        // cutting chai glass
      ctx.fillRect(x + 2, y + 3, 9, 10);
      ctx.fillStyle = '#e8c39e';
      ctx.fillRect(x + 3, y + 4, 7, 3);
      ctx.fillStyle = 'rgba(255,255,255,.7)';           // steam
      ctx.fillRect(x + 4, y - 2 , 2, 3); ctx.fillRect(x + 8, y - 4, 2, 3);
    } else if (d.type === 'prop:boardingpass') {
      ctx.fillStyle = '#f4f7fa';
      ctx.fillRect(x, y + 2, 14, 10);
      ctx.fillStyle = '#3d6bb0';
      ctx.fillRect(x, y + 2, 14, 3);
      ctx.fillStyle = '#c94f2a';
      ctx.fillRect(x + 2, y + 7, 6, 2);
    } else {                                            // generic prop
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(x, y, 12, 12);
    }
  }

  function drawHeartC(ctx, x, y, runTime) {             // collectible heart
    y += px(Math.sin(runTime * 4 + x * 0.05) * 2);
    ctx.fillStyle = '#e85d75';
    ctx.fillRect(x + 1, y, 4, 4); ctx.fillRect(x + 8, y, 4, 4);
    ctx.fillRect(x, y + 3, 13, 5); ctx.fillRect(x + 3, y + 8, 7, 3);
    ctx.fillStyle = '#ffd23f';
    ctx.fillRect(x + 3, y + 1, 2, 2);
  }

  function drawPuddle(ctx, x) {
    ctx.fillStyle = 'rgba(100, 150, 190, .75)';
    ctx.fillRect(x + 2, GROUND - 6, 26, 6);
    ctx.fillRect(x, GROUND - 3, 30, 3);
    ctx.fillStyle = 'rgba(200, 225, 245, .8)';
    ctx.fillRect(x + 6, GROUND - 5, 8, 1);
  }

  function drawCart(ctx, x) {
    var y = GROUND - 26;
    ctx.fillStyle = '#8a6b3f';
    ctx.fillRect(x, y + 8, 26, 12);                     // cart box
    ctx.fillStyle = '#241a12';
    ctx.fillRect(x + 3, y + 20, 6, 6); ctx.fillRect(x + 17, y + 20, 6, 6);
    ctx.fillStyle = '#ffd9a0';                          // pav stack
    ctx.fillRect(x + 3, y + 2, 8, 6); ctx.fillRect(x + 13, y + 4, 8, 4);
    ctx.fillStyle = '#c94f2a';
    ctx.fillRect(x + 5, y + 4, 4, 2);                   // vada
    ctx.fillStyle = '#e85d75';
    ctx.fillRect(x + 8, y - 6, 12, 6);                  // little flag
    ctx.fillStyle = '#5a4632';
    ctx.fillRect(x + 6, y - 6, 2, 14);
  }

  function drawRain(ctx, runTime, W, H) {
    ctx.strokeStyle = 'rgba(190, 215, 235, .4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var i = 0; i < 34; i++) {
      var seed = i * 97;
      var rx = ((seed + runTime * 260) % (W + 60)) - 30;
      var ry = ((seed * 7 + runTime * 460) % H);
      ctx.moveTo(W - rx, ry);
      ctx.lineTo(W - rx - 3, ry + 9);
    }
    ctx.stroke();
  }

  window.ENT = {
    SIZES: SIZES,
    updateEnemy: updateEnemy,
    updateDrop: updateDrop,
    drawPlatform: drawPlatform,
    drawBlock: drawBlock,
    drawEnemy: drawEnemy,
    drawDrop: drawDrop,
    drawHeartC: drawHeartC,
    drawPuddle: drawPuddle,
    drawCart: drawCart,
    drawRain: drawRain
  };
})();

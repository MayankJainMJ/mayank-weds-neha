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
    auto: { w: 32, h: 26 },
    plow: { w: 40, h: 26 }
  };

  /* ---------- updates ---------- */
  function updateEnemy(e, dt, camX, W) {
    if (e.dead) { e.deadT += dt; return; }
    e.t += dt;
    if (e.x - camX < -70) { e.dead = true; e.deadT = 99; return; } // passed & gone — never migrates back
    if (e.kind === 'dog') {
      e.x = e.baseX + Math.sin(e.t * 1.2) * 26;      // gentle patrol — stompable under auto-run commit
    } else if (e.kind === 'auto') {
      if (e.x - camX < W + 60) e.x -= 58 * dt;        // drives left once near
    } else if (e.kind === 'plow') {
      if (e.x - camX < W + 60) e.x -= 36 * dt;        // slow, wide, relentless
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

  function drawFloe(ctx, p, camX) {
    var x = Math.round(p.x - camX), y = Math.round(p.y);
    ctx.fillStyle = '#eef4f8';
    ctx.fillRect(x, y, p.w, 8);
    ctx.fillStyle = '#cfdde8';
    ctx.fillRect(x + 3, y + 8, p.w - 6, 4);
    ctx.fillStyle = 'rgba(126, 178, 221, .5)';       // water lap
    ctx.fillRect(x - 4, y + 11, p.w + 8, 3);
  }

  function drawSkilift(ctx, p, camX) {
    var x = Math.round(p.x - camX), y = Math.round(p.y);
    ctx.strokeStyle = 'rgba(90, 100, 115, .8)';
    ctx.lineWidth = 2;
    ctx.beginPath();                                  // cable up and away
    ctx.moveTo(x + p.w / 2, y - 40);
    ctx.lineTo(x + p.w / 2 - 60, 60);
    ctx.moveTo(x + p.w / 2, y - 40);
    ctx.lineTo(x + p.w / 2 + 90, 30);
    ctx.stroke();
    ctx.fillStyle = '#5a646f';
    ctx.fillRect(x + p.w / 2 - 2, y - 40, 4, 40);     // hanger
    ctx.fillStyle = '#c94f4f';
    ctx.fillRect(x, y, p.w, 6);                       // seat
    ctx.fillRect(x, y - 22, 5, 22);                   // backrest
  }

  function drawBlackIce(ctx, x) {
    ctx.fillStyle = 'rgba(30, 45, 70, .8)';
    ctx.fillRect(x, GROUND - 3, 56, 3);
    ctx.fillStyle = 'rgba(160, 200, 240, .8)';
    ctx.fillRect(x + 6, GROUND - 3, 10, 1);
    ctx.fillRect(x + 30, GROUND - 2, 12, 1);
  }

  function drawIcicle(ctx, ic, camX) {
    var x = Math.round(ic.x - camX);
    if (x < -30 || x > 350) return;
    if (ic.state === 'shatter') {
      ctx.fillStyle = 'rgba(210, 235, 250,' + Math.max(0, 0.9 - ic.t * 2) + ')';
      ctx.fillRect(x - 6, GROUND - 6, 4, 4);
      ctx.fillRect(x + 4, GROUND - 8, 4, 4);
      ctx.fillRect(x + 12, GROUND - 5, 3, 3);
      return;
    }
    var y = Math.round(ic.y);
    if (ic.state === 'warn') x += Math.round(Math.sin(ic.t * 60) * 2); // shake cue
    ctx.fillStyle = '#9aa8b8';                        // little eave it hangs from
    if (ic.state === 'hang' || ic.state === 'warn') ctx.fillRect(x - 8, y - 6, 28, 6);
    ctx.fillStyle = '#d8ecfa';
    ctx.fillRect(x, y, 10, 10);
    ctx.fillRect(x + 2, y + 10, 6, 6);
    ctx.fillRect(x + 4, y + 16, 2, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 2, y + 2, 2, 8);
  }

  function drawTerrace(ctx, p, camX) {
    var x = Math.round(p.x - camX), y = Math.round(p.y);
    ctx.fillStyle = '#8a9a55';                        // grassy hill terrace
    ctx.fillRect(x, y, p.w, 8);
    ctx.fillStyle = '#6e5340';                        // earth face
    ctx.fillRect(x, y + 8, p.w, GROUND - y - 8);
    ctx.fillStyle = '#75844a';
    for (var g2 = x + 6; g2 < x + p.w - 8; g2 += 26) ctx.fillRect(g2, y + 2, 12, 3);
    ctx.fillStyle = 'rgba(251, 133, 0, .8)';          // marigold edge dots
    for (var m2 = x + 10; m2 < x + p.w - 6; m2 += 40) ctx.fillRect(m2, y - 3, 4, 4);
  }

  function drawPlatformExt(ctx, p, camX, runTime) {
    if (p.kind === 'terrace') return drawTerrace(ctx, p, camX);
    if (p.kind === 'icefloe') return drawFloe(ctx, p, camX);
    if (p.kind === 'skilift') return drawSkilift(ctx, p, camX);
    return drawPlatform(ctx, p, camX);
  }

  window.ENT = {
    drawPlatformExt: drawPlatformExt,
    drawBlackIce: drawBlackIce,
    drawIcicle: drawIcicle,
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

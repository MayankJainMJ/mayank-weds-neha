/* Road to Pawna — auto-runner engine. One input: tap/Space = jump.
   Fixed-timestep physics, rAF render, AABB collisions, 3 lives,
   continue-on-death never blocks the invite. Data lives in levels.js. */
(function () {
  'use strict';

  /* ---------- constants ---------- */
  var W = 320, H = 480, GROUND = 400;
  var GRAVITY = 1500, JUMP_V = -560, STEP = 1 / 60;
  var PLAYER_X = 56, PW = 18, PH = 26;
  var HIT = {
    chair:  { w: 24, h: 30 },
    excel:  { w: 30, h: 14 },
    door:   { w: 16, h: 46 },
    laddoo: { w: 14, h: 14 },
    token:  { w: 16, h: 16 }
  };

  /* ---------- dom ---------- */
  var gameEl = document.getElementById('game');
  var canvas = document.getElementById('gc');
  var ctx = canvas.getContext('2d');
  var hudLives = document.getElementById('hudLives');
  var hudScore = document.getElementById('hudScore');
  var overlay = document.getElementById('gameOverlay');
  var toast = document.getElementById('toast');

  /* ---------- state ---------- */
  var mode = 'idle'; // idle | chapter | run | over | clear | paused
  var act = null, items = [], taunts = [];
  var camX = 0, player = null, lives = 3, laddoos = 0, tokenGot = false;
  var runTime = 0, acc = 0, lastT = 0, rafId = 0;
  var invincibleUntil = 0, buildings = [], clouds = [];
  var store = window.MWN.load();

  /* ---------- canvas scale ---------- */
  function fit() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var s = Math.min(vw / W, vh / H);
    canvas.style.width = Math.floor(W * s) + 'px';
    canvas.style.height = Math.floor(H * s) + 'px';
  }
  canvas.width = W; canvas.height = H;
  window.addEventListener('resize', fit);

  /* ---------- helpers ---------- */
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  function overlayHTML(lines, buttons) {
    var h = '<div class="pixel-dialog">';
    h += '<p>' + lines.join('<br>') + '</p>';
    buttons.forEach(function (b) {
      h += '<button class="btn ' + (b.ghost ? 'btn-ghost" style="color:#2b2118"' : 'btn-primary"') + ' data-a="' + b.a + '">' + b.label + '</button>';
    });
    if (buttons.escape) { /* noop */ }
    h += '<a class="skip-link" style="display:block;margin-top:1rem" href="invite.html">Skip to the invitation \u2192</a>';
    h += '</div>';
    overlay.innerHTML = h;
    overlay.style.display = 'flex';
  }
  function hideOverlay() { overlay.style.display = 'none'; }

  overlay.addEventListener('click', function (e) {
    var a = e.target && e.target.getAttribute && e.target.getAttribute('data-a');
    if (!a && mode === 'chapter') { startRun(); return; } // tap anywhere to GO
    if (!a) return;
    if (a === 'run') startRun();
    if (a === 'continue') { lives = 3; laddoos = 0; camX = 0; runTime = 0; resetPlayer(); startRun(); }
    if (a === 'replay') beginAct('act1');
    if (a === 'resume') { mode = 'run'; hideOverlay(); lastT = 0; }
  });

  function score() {
    return Math.min(9999,
      laddoos * 10 +
      (tokenGot ? 100 : 0) +
      (mode === 'clear' ? lives * 50 + Math.max(0, 300 - Math.floor(runTime) * 8) : 0));
  }

  function hud() {
    var h = '';
    for (var i = 0; i < 3; i++) h += i < lives ? '\u2665' : '\u2661';
    hudLives.textContent = h;
    hudScore.textContent = 'LADDOOS ' + laddoos + (tokenGot ? ' \u2726' : '');
  }

  function resetPlayer() {
    player = { y: GROUND - PH, vy: 0, onGround: true, frame: 0 };
  }

  /* ---------- flow ---------- */
  function beginAct(id) {
    act = window.LEVELS[id];
    items = act.items.map(function (it) { return { t: it.t, x: it.x, dy: it.dy || 0, hit: false }; });
    taunts = act.taunts;
    camX = 0; lives = 3; laddoos = 0; runTime = 0;
    tokenGot = false;
    resetPlayer();
    buildScenery();
    store.plays += 1; window.MWN.save(store);
    gameEl.hidden = false;
    document.getElementById('splash').style.display = 'none';
    fit();
    mode = 'chapter';
    overlayHTML(act.chapter, [{ a: 'run', label: '\u25B6 GO' }]);
    hud();
    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  function startRun() {
    hideOverlay();
    mode = 'run';
    lastT = 0;
  }

  function die() {
    lives = 0; hud();
    mode = 'over';
    overlayHTML(
      ['OUT OF LIVES.', 'BUT LOVE FINDS A WAY.'],
      [{ a: 'continue', label: '\u25B6 CONTINUE' }]
    );
  }

  function clearAct() {
    mode = 'clear';
    var sc = score();
    if (sc > store.bestScore) { store.bestScore = sc; }
    store.unlocked = true;
    window.MWN.save(store);
    var lines = act.clearLine.concat(['', 'ACT 1 CLEAR \u2726 SCORE ' + sc, 'BEST ' + store.bestScore, '', 'ACTS 2 & 3 COMING SOON']);
    overlayHTML(lines, [
      { a: 'goinvite', label: 'SEE THE INVITATION \u2192' },
      { a: 'replay', label: 'RUN IT AGAIN', ghost: true }
    ]);
    // wire the invite button as a link
    var b = overlay.querySelector('[data-a="goinvite"]');
    if (b) b.addEventListener('click', function () { location.href = 'invite.html'; });
  }

  /* ---------- input ---------- */
  function jump() {
    if (mode === 'chapter') { startRun(); return; }
    if (mode !== 'run') return;
    if (player.onGround) {
      player.vy = JUMP_V;
      player.onGround = false;
    }
  }
  canvas.addEventListener('pointerdown', function (e) { e.preventDefault(); jump(); });
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      if (!gameEl.hidden) { e.preventDefault(); jump(); }
    }
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && mode === 'run') {
      mode = 'paused';
      overlayHTML(['PAUSED'], [{ a: 'resume', label: '\u25B6 RESUME' }]);
    }
  });

  /* ---------- physics ---------- */
  function update(dt) {
    camX += act.speed * dt;
    runTime += dt;
    player.frame += dt * 10;

    player.vy += GRAVITY * dt;
    player.y += player.vy * dt;
    if (player.y >= GROUND - PH) {
      player.y = GROUND - PH;
      player.vy = 0;
      player.onGround = true;
    }

    var px = PLAYER_X, py = player.y;
    var now = runTime;

    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.hit) continue;
      var box = HIT[it.t];
      var sx = it.x - camX;
      if (sx < -60 || sx > W + 60) continue;
      var oy = (it.t === 'laddoo' || it.t === 'token')
        ? GROUND + it.dy - box.h
        : GROUND - box.h;
      var pad = 3; // forgiveness
      if (px + pad < sx + box.w && px + PW - pad > sx &&
          py + pad < oy + box.h && py + PH - pad > oy) {
        if (it.t === 'laddoo') {
          it.hit = true; laddoos++; hud();
        } else if (it.t === 'token') {
          it.hit = true; tokenGot = true;
          store.tokens[act.tokenIndex] = true; window.MWN.save(store);
          showToast('\u2726 Memory unlocked: 2018 \u2014 where it all began');
          hud();
        } else if (now > invincibleUntil) {
          lives--;
          hud();
          if (lives <= 0) { die(); return; }
          invincibleUntil = now + 1.4;
        }
      }
    }

    if (camX >= act.flagX - PLAYER_X) { clearAct(); }
  }

  /* ---------- scenery ---------- */
  function buildScenery() {
    buildings = []; clouds = [];
    var x = 0, i;
    while (x < act.flagX + 800) {
      buildings.push({ x: x, w: 30 + Math.random() * 50, h: 50 + Math.random() * 90 });
      x += 40 + Math.random() * 70;
    }
    for (i = 0; i < 14; i++) {
      clouds.push({ x: Math.random() * (act.flagX + 800), y: 30 + Math.random() * 120, w: 30 + Math.random() * 40 });
    }
  }

  /* ---------- render ---------- */
  function px(n) { return Math.round(n); }

  function drawPlayer() {
    var x = px(PLAYER_X), y = px(player.y);
    var blink = runTime < invincibleUntil && Math.floor(runTime * 12) % 2 === 0;
    if (blink) return;
    // legs (2-frame run)
    var f = player.onGround ? (Math.floor(player.frame) % 2) : 0;
    ctx.fillStyle = '#3b2d20';
    if (player.onGround) {
      if (f === 0) { ctx.fillRect(x + 2, y + 20, 5, 6); ctx.fillRect(x + 11, y + 22, 5, 4); }
      else { ctx.fillRect(x + 2, y + 22, 5, 4); ctx.fillRect(x + 11, y + 20, 5, 6); }
    } else { ctx.fillRect(x + 2, y + 19, 5, 5); ctx.fillRect(x + 11, y + 21, 5, 5); }
    // kurta
    ctx.fillStyle = '#e8703a';
    ctx.fillRect(x + 1, y + 9, 16, 12);
    ctx.fillStyle = '#c94f2a';
    ctx.fillRect(x + 1, y + 17, 16, 2);
    // head
    ctx.fillStyle = '#e8b88a';
    ctx.fillRect(x + 3, y + 1, 12, 9);
    // hair
    ctx.fillStyle = '#241a12';
    ctx.fillRect(x + 3, y, 12, 3);
    ctx.fillRect(x + 2, y + 1, 2, 4);
    // eye
    ctx.fillStyle = '#241a12';
    ctx.fillRect(x + 12, y + 4, 2, 2);
  }

  function drawItem(it) {
    var box = HIT[it.t];
    var x = px(it.x - camX), y;
    if (it.t === 'laddoo') {
      y = px(GROUND + it.dy - box.h);
      ctx.fillStyle = '#fb8500';
      ctx.fillRect(x + 3, y + 1, 8, 12);
      ctx.fillRect(x + 1, y + 3, 12, 8);
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(x + 4, y + 3, 3, 3);
    } else if (it.t === 'token') {
      y = px(GROUND + it.dy - box.h);
      var bob = Math.sin(runTime * 4) * 3;
      y += px(bob);
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(x + 2, y, 12, 12);
      ctx.fillStyle = '#e85d75';
      ctx.fillRect(x + 4, y + 3, 3, 3); ctx.fillRect(x + 9, y + 3, 3, 3);
      ctx.fillRect(x + 4, y + 5, 8, 3); ctx.fillRect(x + 6, y + 8, 4, 2);
    } else if (it.t === 'chair') {
      y = GROUND - box.h;
      ctx.fillStyle = '#4a4a5a';
      ctx.fillRect(x + 4, y, 16, 12);           // backrest
      ctx.fillRect(x + 2, y + 12, 20, 5);       // seat
      ctx.fillRect(x + 10, y + 17, 4, 9);       // stem
      ctx.fillRect(x + 3, y + 26, 18, 3);       // base
      ctx.fillStyle = '#6a6a7a';
      ctx.fillRect(x + 5, y + 1, 14, 3);
    } else if (it.t === 'excel') {
      y = GROUND - box.h;
      ctx.fillStyle = '#1d6f42';
      ctx.fillRect(x, y, 30, 14);
      ctx.fillStyle = '#ffffff';
      for (var r = 0; r < 2; r++) for (var c = 0; c < 4; c++) ctx.fillRect(x + 3 + c * 7, y + 3 + r * 6, 5, 4);
    } else if (it.t === 'door') {
      y = GROUND - box.h;
      ctx.fillStyle = '#8d99ae';
      ctx.fillRect(x, y, 16, 46);
      ctx.fillStyle = '#5c677d';
      ctx.fillRect(x + 7, y, 2, 46);
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(x + 2, y + 20, 3, 6); ctx.fillRect(x + 11, y + 20, 3, 6);
    }
  }

  function render() {
    // sky
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#8ecae6'); g.addColorStop(.6, '#bde0fe'); g.addColorStop(1, '#ffe8b6');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // sun
    ctx.fillStyle = '#ffd23f';
    ctx.fillRect(250, 40, 28, 28);
    // clouds (slow parallax)
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    clouds.forEach(function (c) {
      var cx = px(c.x - camX * 0.3);
      if (cx > -80 && cx < W + 80) { ctx.fillRect(cx, c.y, c.w, 8); ctx.fillRect(cx + 8, c.y - 6, c.w * .5, 6); }
    });
    // buildings (mid parallax — washed out so they never read as obstacles)
    ctx.fillStyle = 'rgba(140, 160, 195, .38)';
    buildings.forEach(function (b) {
      var bx = px(b.x - camX * 0.55);
      if (bx > -100 && bx < W + 100) ctx.fillRect(bx, GROUND - b.h, b.w, b.h);
    });
    // haze band separating background from playfield
    var hz = ctx.createLinearGradient(0, GROUND - 70, 0, GROUND);
    hz.addColorStop(0, 'rgba(255, 232, 182, 0)');
    hz.addColorStop(1, 'rgba(255, 232, 182, .55)');
    ctx.fillStyle = hz;
    ctx.fillRect(0, GROUND - 70, W, 70);
    // taunt bubbles (world speed)
    ctx.font = '7px "Press Start 2P", monospace';
    taunts.forEach(function (t) {
      var tx = px(t.x - camX);
      if (tx > -220 && tx < W + 40) {
        var w = ctx.measureText(t.text).width + 14;
        ctx.fillStyle = 'rgba(255,255,255,.92)';
        ctx.fillRect(tx, 180, w, 22);
        ctx.fillStyle = '#2b2118';
        ctx.fillText(t.text, tx + 7, 194);
      }
    });
    // ground
    ctx.fillStyle = '#4a7c59';
    ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = '#3b6349';
    for (var gx = -(px(camX) % 20); gx < W; gx += 20) ctx.fillRect(gx, GROUND, 10, 4);
    // flag
    var fx = px(act.flagX - camX);
    if (fx < W + 40) {
      ctx.fillStyle = '#7b4a12';
      ctx.fillRect(fx, GROUND - 120, 4, 120);
      ctx.fillStyle = '#e85d75';
      ctx.fillRect(fx + 4, GROUND - 120, 26, 18);
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(fx + 4, GROUND - 104, 26, 3);
    }
    // items + player
    items.forEach(function (it) { if (!it.hit) drawItem(it); });
    drawPlayer();
  }

  /* ---------- loop ---------- */
  function loop(t) {
    rafId = requestAnimationFrame(loop);
    if (mode === 'run') {
      if (!lastT) lastT = t;
      acc += Math.min(0.1, (t - lastT) / 1000);
      lastT = t;
      while (acc >= STEP) { update(STEP); acc -= STEP; if (mode !== 'run') { acc = 0; break; } }
    } else {
      lastT = t;
    }
    render();
  }

  /* ---------- public ---------- */
  window.GAME = {
    begin: function () { beginAct('act1'); },
    /* test hooks — harmless in prod */
    _debug: function () { return { mode: mode, camX: camX, lives: lives, laddoos: laddoos, tokenGot: tokenGot, playerY: player && player.y, score: score() }; },
    _warp: function (x) { camX = x; },
    _jump: jump
  };
})();

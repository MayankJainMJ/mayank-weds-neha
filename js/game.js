/* Road to Pawna — two-act auto-runner. One input: tap/Space = jump.
   Act 1 (him): Mumbai → he reaches the flag and waits.
   Act 2 (her): Japan — Fuji, Lake Kawaguchiko, shinkansen, the ring studio —
   she runs to him and they exchange the rings they made for each other.
   Fixed-timestep physics, rAF render, AABB, 3 lives per act,
   continue-on-death never blocks the invite. Data lives in levels.js. */
(function () {
  'use strict';

  /* ---------- constants ---------- */
  var W = 320, H = 480, GROUND = 400;
  var GRAVITY = 1500, JUMP_V = -560, STEP = 1 / 60;
  var PLAYER_X = 56, PW = 18, PH = 26;
  var HIT = {
    chair:     { w: 24, h: 30 },
    excel:     { w: 30, h: 14 },
    door:      { w: 16, h: 46 },
    suitcase:  { w: 18, h: 44 },
    lantern:   { w: 14, h: 24 },
    traindoor: { w: 16, h: 46 },
    laddoo:    { w: 14, h: 14 },
    token:     { w: 16, h: 16 },
    ring:      { w: 14, h: 14 }
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
  var mode = 'idle'; // idle | chapter | run | over | rings | clear | paused
  var actIdx = 0, act = null, items = [], taunts = [];
  var camX = 0, player = null, lives = 3;
  var laddoos = 0, sessionTokens = 0, ringGot = false; // persist across acts in a run
  var runTime = 0, acc = 0, lastT = 0, rafId = 0;
  var invincibleUntil = 0, scenery = [], clouds = [];
  var ringsT = 0, brideX = 0, hearts = [];
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

  /* ---------- color helpers ---------- */
  function hx(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function rgb(a) { return 'rgb(' + a[0] + ',' + a[1] + ',' + a[2] + ')'; }

  /* ---------- ui helpers ---------- */
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
    if (a === 'next') loadAct(actIdx + 1);
    if (a === 'continue') { lives = 3; camX = 0; resetPlayer(); startRun(); }
    if (a === 'replay') beginRun();
    if (a === 'resume') { mode = 'run'; hideOverlay(); lastT = 0; }
    if (a === 'goinvite') location.href = 'invite.html';
  });

  function score(final) {
    return Math.min(9999,
      laddoos * 10 +
      sessionTokens * 100 +
      (ringGot ? 150 : 0) +
      (final ? lives * 50 + Math.max(0, 300 - Math.floor(runTime) * 4) : 0));
  }

  function hud() {
    var h = '';
    for (var i = 0; i < 3; i++) h += i < lives ? '\u2665' : '\u2661';
    hudLives.textContent = h;
    hudScore.textContent = act.name.split(' \u2014 ')[0] + ' \u00B7 ' + laddoos + (ringGot ? ' \u25CB' : '') + (sessionTokens ? ' \u2726' : '');
  }

  function resetPlayer() {
    player = { y: GROUND - PH, vy: 0, onGround: true, frame: 0 };
  }

  /* ---------- flow ---------- */
  function loadAct(i) {
    actIdx = i;
    act = window.LEVELS[window.LEVELS.acts[i]];
    items = act.items.map(function (it) { return { t: it.t, x: it.x, dy: it.dy || 0, hit: false }; });
    taunts = act.taunts;
    camX = 0; lives = 3; invincibleUntil = 0;
    resetPlayer();
    buildScenery();
    mode = 'chapter';
    overlayHTML(act.chapter, [{ a: 'run', label: '\u25B6 GO' }]);
    hud();
  }

  function beginRun() {
    laddoos = 0; sessionTokens = 0; ringGot = false; runTime = 0;
    hearts = []; ringsT = 0;
    store.plays += 1; window.MWN.save(store);
    gameEl.hidden = false;
    document.getElementById('splash').style.display = 'none';
    fit();
    loadAct(0);
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

  function actCleared() {
    if (actIdx < window.LEVELS.acts.length - 1) {
      mode = 'clear';
      overlayHTML(act.clearLine, [{ a: 'next', label: '\u25B6 HER TURN' }]);
    } else {
      // Act 2: run to him — rings first, overlay after
      mode = 'rings';
      ringsT = 0;
      brideX = PLAYER_X;
      player.y = GROUND - PH; player.vy = 0; player.onGround = true;
    }
  }

  function finishGame() {
    mode = 'clear';
    var sc = score(true);
    if (sc > store.bestScore) store.bestScore = sc;
    store.unlocked = true;
    window.MWN.save(store);
    var lines = act.clearLine.concat([
      '', 'SCORE ' + sc + ' \u00B7 BEST ' + store.bestScore,
      '', 'ACT 3 \u2014 THE ROAD TO PAWNA', 'COMING SOON'
    ]);
    overlayHTML(lines, [
      { a: 'goinvite', label: 'SEE THE INVITATION \u2192' },
      { a: 'replay', label: 'RUN IT AGAIN', ghost: true }
    ]);
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
      var collectible = (it.t === 'laddoo' || it.t === 'token' || it.t === 'ring');
      var oy = collectible ? GROUND + it.dy - box.h : GROUND - box.h;
      var pad = 3; // forgiveness
      if (px + pad < sx + box.w && px + PW - pad > sx &&
          py + pad < oy + box.h && py + PH - pad > oy) {
        if (it.t === 'laddoo') {
          it.hit = true; laddoos++; hud();
        } else if (it.t === 'token') {
          it.hit = true; sessionTokens++;
          store.tokens[act.tokenIndex] = true; window.MWN.save(store);
          showToast(act.tokenToast);
          hud();
        } else if (it.t === 'ring') {
          it.hit = true; ringGot = true;
          showToast('\u2726 You made his ring at the studio');
          hud();
        } else if (now > invincibleUntil) {
          lives--;
          hud();
          if (lives <= 0) { die(); return; }
          invincibleUntil = now + 1.4;
        }
      }
    }

    var trigger = act.groomAtFlag ? act.flagX - 190 : act.flagX - PLAYER_X;
    if (camX >= trigger) { actCleared(); }
  }

  function updateRings(dt) {
    ringsT += dt;
    runTime += dt;
    var gx = act.flagX - camX + 12; // groom screen x
    var target = gx - 26;
    if (brideX < target) brideX = Math.min(target, brideX + 90 * dt);
    // hearts
    if (ringsT > 0.7 && Math.random() < dt * 6) {
      hearts.push({ x: (brideX + gx) / 2 + (Math.random() * 40 - 20), y: GROUND - 40, vy: -30 - Math.random() * 25, life: 1.6 });
    }
    for (var i = hearts.length - 1; i >= 0; i--) {
      var hh = hearts[i];
      hh.y += hh.vy * dt; hh.life -= dt;
      if (hh.life <= 0) hearts.splice(i, 1);
    }
    if (ringsT > 2.6) finishGame();
  }

  /* ---------- scenery ---------- */
  function buildScenery() {
    scenery = []; clouds = [];
    var i, x;
    if (act.style === 'mumbai') {
      x = 0;
      while (x < (act.flagX + 800) * 0.55 + W) {
        scenery.push({ t: 'bldg', x: x, w: 30 + Math.random() * 50, h: 50 + Math.random() * 90 });
        x += 40 + Math.random() * 70;
      }
    } else {
      // Japan: sakura + torii early, Fuji + Lake Kawaguchiko in the second half
      x = 0;
      while (x < 1300) {
        scenery.push({ t: 'sakura', x: x, h: 46 + Math.random() * 26 });
        x += 90 + Math.random() * 90;
      }
      scenery.push({ t: 'torii', x: 320 });
      scenery.push({ t: 'torii', x: 980 });
      scenery.push({ t: 'fuji', x: 1560 });
      scenery.push({ t: 'lake', x: 1290, w: 830 });
      x = 1300;
      while (x < 2400) {
        if (Math.random() < .6) scenery.push({ t: 'sakura', x: x, h: 40 + Math.random() * 22 });
        x += 130 + Math.random() * 110;
      }
    }
    for (i = 0; i < 14; i++) {
      clouds.push({ x: Math.random() * (act.flagX + 800), y: 30 + Math.random() * 110, w: 30 + Math.random() * 40 });
    }
  }

  /* ---------- sprites ---------- */
  function px(n) { return Math.round(n); }

  function drawMayank(x, y, facingLeft, running, frame) {
    x = px(x); y = px(y);
    var f = running ? (Math.floor(frame) % 2) : 0;
    ctx.fillStyle = '#3b2d20';
    if (running) {
      if (f === 0) { ctx.fillRect(x + 2, y + 20, 5, 6); ctx.fillRect(x + 11, y + 22, 5, 4); }
      else { ctx.fillRect(x + 2, y + 22, 5, 4); ctx.fillRect(x + 11, y + 20, 5, 6); }
    } else { ctx.fillRect(x + 3, y + 20, 5, 6); ctx.fillRect(x + 10, y + 20, 5, 6); }
    ctx.fillStyle = '#e8703a';                    // kurta
    ctx.fillRect(x + 1, y + 9, 16, 12);
    ctx.fillStyle = '#c94f2a';
    ctx.fillRect(x + 1, y + 17, 16, 2);
    ctx.fillStyle = '#e8b88a';                    // head
    ctx.fillRect(x + 3, y + 1, 12, 9);
    ctx.fillStyle = '#241a12';                    // hair
    ctx.fillRect(x + 3, y, 12, 3);
    ctx.fillRect(facingLeft ? x + 14 : x + 2, y + 1, 2, 4);
    ctx.fillStyle = '#241a12';                    // eye
    ctx.fillRect(facingLeft ? x + 4 : x + 12, y + 4, 2, 2);
  }

  function drawNeha(x, y, running, frame) {
    x = px(x); y = px(y);
    var f = running ? (Math.floor(frame) % 2) : 0;
    ctx.fillStyle = '#3b2d20';                    // legs
    if (running) {
      if (f === 0) { ctx.fillRect(x + 2, y + 20, 5, 6); ctx.fillRect(x + 11, y + 22, 5, 4); }
      else { ctx.fillRect(x + 2, y + 22, 5, 4); ctx.fillRect(x + 11, y + 20, 5, 6); }
    } else { ctx.fillRect(x + 3, y + 20, 5, 6); ctx.fillRect(x + 10, y + 20, 5, 6); }
    ctx.fillStyle = '#e85d75';                    // kurti
    ctx.fillRect(x + 1, y + 9, 16, 12);
    ctx.fillStyle = '#ffd23f';                    // gold trim
    ctx.fillRect(x + 1, y + 19, 16, 2);
    ctx.fillStyle = '#241a12';                    // hair behind
    ctx.fillRect(x + 1, y + 2, 3, 13);
    ctx.fillStyle = '#e8b88a';                    // head
    ctx.fillRect(x + 4, y + 1, 11, 9);
    ctx.fillStyle = '#241a12';                    // hair top
    ctx.fillRect(x + 3, y, 12, 3);
    ctx.fillStyle = '#d64545';                    // bindi
    ctx.fillRect(x + 9, y + 4, 1, 1);
    ctx.fillStyle = '#241a12';                    // eye
    ctx.fillRect(x + 12, y + 4, 2, 2);
  }

  function drawGoldRing(x, y, blinkPhase) {
    ctx.fillStyle = blinkPhase ? '#fff3c4' : '#ffd23f';
    ctx.fillRect(x, y, 10, 10);
    ctx.fillStyle = act.style === 'japan' ? skyBottom() : '#ffffff';
    ctx.fillRect(x + 3, y + 3, 4, 4);
  }

  function skyBottom() { return '#ffd9a0'; }

  /* ---------- item skins ---------- */
  function drawItem(it) {
    var box = HIT[it.t];
    var x = px(it.x - camX), y;
    var collectible = (it.t === 'laddoo' || it.t === 'token' || it.t === 'ring');
    y = collectible ? px(GROUND + it.dy - box.h) : GROUND - box.h;

    if (it.t === 'laddoo') {
      ctx.fillStyle = '#fb8500';
      ctx.fillRect(x + 3, y + 1, 8, 12);
      ctx.fillRect(x + 1, y + 3, 12, 8);
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(x + 4, y + 3, 3, 3);
    } else if (it.t === 'token') {
      y += px(Math.sin(runTime * 4) * 3);
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(x + 2, y, 12, 12);
      ctx.fillStyle = '#e85d75';
      ctx.fillRect(x + 4, y + 3, 3, 3); ctx.fillRect(x + 9, y + 3, 3, 3);
      ctx.fillRect(x + 4, y + 5, 8, 3); ctx.fillRect(x + 6, y + 8, 4, 2);
    } else if (it.t === 'ring') {
      y += px(Math.sin(runTime * 4) * 3);
      drawGoldRing(x + 2, y + 2, Math.floor(runTime * 4) % 2 === 0);
      ctx.fillStyle = '#fff3c4';
      ctx.fillRect(x + 13, y - 2, 2, 2);
    } else if (it.t === 'chair') {
      ctx.fillStyle = '#4a4a5a';
      ctx.fillRect(x + 4, y, 16, 12);
      ctx.fillRect(x + 2, y + 12, 20, 5);
      ctx.fillRect(x + 10, y + 17, 4, 9);
      ctx.fillRect(x + 3, y + 26, 18, 3);
      ctx.fillStyle = '#6a6a7a';
      ctx.fillRect(x + 5, y + 1, 14, 3);
    } else if (it.t === 'excel') {
      ctx.fillStyle = '#1d6f42';
      ctx.fillRect(x, y, 30, 14);
      ctx.fillStyle = '#ffffff';
      for (var r = 0; r < 2; r++) for (var c = 0; c < 4; c++) ctx.fillRect(x + 3 + c * 7, y + 3 + r * 6, 5, 4);
    } else if (it.t === 'door') {
      ctx.fillStyle = '#8d99ae';
      ctx.fillRect(x, y, 16, 46);
      ctx.fillStyle = '#5c677d';
      ctx.fillRect(x + 7, y, 2, 46);
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(x + 2, y + 20, 3, 6); ctx.fillRect(x + 11, y + 20, 3, 6);
    } else if (it.t === 'suitcase') {
      ctx.fillStyle = '#b4656f';
      ctx.fillRect(x, y + 30, 18, 14);
      ctx.fillStyle = '#5c7bab';
      ctx.fillRect(x + 1, y + 16, 16, 14);
      ctx.fillStyle = '#c9a24b';
      ctx.fillRect(x + 2, y + 2, 14, 14);
      ctx.fillStyle = '#7a5a2a';
      ctx.fillRect(x + 6, y, 6, 3);
    } else if (it.t === 'lantern') {
      ctx.fillStyle = '#5a4632';
      ctx.fillRect(x + 5, y + 14, 4, 10);
      ctx.fillStyle = '#d64545';
      ctx.fillRect(x + 1, y + 3, 12, 11);
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(x + 2, y, 10, 3); ctx.fillRect(x + 2, y + 14, 10, 2);
      ctx.fillStyle = '#ff9b6a';
      ctx.fillRect(x + 5, y + 6, 4, 5);
    } else if (it.t === 'traindoor') {
      ctx.fillStyle = '#f2f5f8';
      ctx.fillRect(x, y, 16, 46);
      ctx.fillStyle = '#3d6bb0';
      ctx.fillRect(x, y + 8, 16, 4);
      ctx.fillStyle = '#9fc2e8';
      ctx.fillRect(x + 3, y + 16, 10, 12);
      ctx.fillStyle = '#c3ccd6';
      ctx.fillRect(x + 7, y, 2, 46);
    }
  }

  /* ---------- backgrounds ---------- */
  function renderSky() {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    if (act.style === 'mumbai') {
      g.addColorStop(0, '#8ecae6'); g.addColorStop(.6, '#bde0fe'); g.addColorStop(1, '#ffe8b6');
    } else {
      g.addColorStop(0, '#8c6bb1'); g.addColorStop(.55, '#f2909e'); g.addColorStop(1, '#ffd9a0');
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // sun (mumbai) / low sunset sun (japan)
    ctx.fillStyle = act.style === 'mumbai' ? '#ffd23f' : '#ff8b5e';
    if (act.style === 'mumbai') ctx.fillRect(250, 40, 28, 28);
    else ctx.fillRect(236, 120, 34, 34);
    // clouds
    ctx.fillStyle = act.style === 'mumbai' ? 'rgba(255,255,255,.85)' : 'rgba(255,236,224,.8)';
    clouds.forEach(function (c) {
      var cx = px(c.x - camX * 0.3);
      if (cx > -80 && cx < W + 80) { ctx.fillRect(cx, c.y, c.w, 8); ctx.fillRect(cx + 8, c.y - 6, c.w * .5, 6); }
    });
  }

  function renderScenery() {
    var F = 0.55;
    scenery.forEach(function (s) {
      var sx = px(s.x - camX * F);
      if (sx < -260 || sx > W + 60) return;
      if (s.t === 'bldg') {
        ctx.fillStyle = 'rgba(140, 160, 195, .38)';
        ctx.fillRect(sx, GROUND - s.h, s.w, s.h);
      } else if (s.t === 'sakura') {
        ctx.fillStyle = 'rgba(122, 85, 70, .5)';
        ctx.fillRect(sx + 8, GROUND - s.h + 18, 5, s.h - 18);
        ctx.fillStyle = 'rgba(244, 184, 200, .65)';
        ctx.fillRect(sx, GROUND - s.h, 22, 16);
        ctx.fillRect(sx + 4, GROUND - s.h - 7, 14, 8);
      } else if (s.t === 'torii') {
        ctx.fillStyle = 'rgba(201, 79, 79, .55)';
        ctx.fillRect(sx, GROUND - 64, 6, 64);
        ctx.fillRect(sx + 34, GROUND - 64, 6, 64);
        ctx.fillRect(sx - 6, GROUND - 70, 52, 7);
        ctx.fillRect(sx - 2, GROUND - 56, 44, 5);
      } else if (s.t === 'fuji') {
        ctx.fillStyle = 'rgba(125, 143, 168, .6)';
        ctx.beginPath();
        ctx.moveTo(sx - 110, GROUND - 8);
        ctx.lineTo(sx, GROUND - 128);
        ctx.lineTo(sx + 110, GROUND - 8);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.beginPath();
        ctx.moveTo(sx - 34, GROUND - 90);
        ctx.lineTo(sx, GROUND - 128);
        ctx.lineTo(sx + 34, GROUND - 90);
        ctx.lineTo(sx + 22, GROUND - 84);
        ctx.lineTo(sx + 8, GROUND - 92);
        ctx.lineTo(sx - 8, GROUND - 84);
        ctx.lineTo(sx - 22, GROUND - 92);
        ctx.closePath(); ctx.fill();
      } else if (s.t === 'lake') {
        // Lake Kawaguchiko + Fuji reflection glints
        ctx.fillStyle = 'rgba(126, 178, 221, .55)';
        ctx.fillRect(sx, GROUND - 26, s.w, 26);
        ctx.fillStyle = 'rgba(255, 255, 255, .5)';
        for (var k = 0; k < 6; k++) ctx.fillRect(sx + 40 + k * (s.w / 6), GROUND - 18 + (k % 2) * 6, 18, 2);
      }
    });
    // haze band separating background from playfield
    var hzTop = act.style === 'mumbai' ? 'rgba(255, 232, 182, 0)' : 'rgba(255, 217, 160, 0)';
    var hzBot = act.style === 'mumbai' ? 'rgba(255, 232, 182, .55)' : 'rgba(255, 217, 160, .5)';
    var hz = ctx.createLinearGradient(0, GROUND - 70, 0, GROUND);
    hz.addColorStop(0, hzTop); hz.addColorStop(1, hzBot);
    ctx.fillStyle = hz;
    ctx.fillRect(0, GROUND - 70, W, 70);
  }

  function renderTrain() {
    if (act.style !== 'japan') return;
    var period = 7, tt = runTime % period;
    if (tt > 1.1) return;
    var tx = W + 120 - (tt / 1.1) * (W + 320);
    var ty = 208;
    ctx.fillStyle = '#f4f7fa';
    ctx.fillRect(px(tx), ty, 150, 16);
    ctx.beginPath(); // nose
    ctx.moveTo(px(tx), ty);
    ctx.lineTo(px(tx) - 22, ty + 16);
    ctx.lineTo(px(tx), ty + 16);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3d6bb0';
    ctx.fillRect(px(tx) - 14, ty + 10, 164, 3);
    ctx.fillStyle = '#9fc2e8';
    for (var i = 0; i < 6; i++) ctx.fillRect(px(tx) + 10 + i * 24, ty + 3, 12, 5);
  }

  function renderGround() {
    ctx.fillStyle = act.style === 'mumbai' ? '#4a7c59' : '#6f9a6a';
    ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = act.style === 'mumbai' ? '#3b6349' : '#5b8258';
    for (var gx = -(px(camX) % 20); gx < W; gx += 20) ctx.fillRect(gx, GROUND, 10, 4);
    if (act.style === 'japan') {
      // fallen sakura petals
      ctx.fillStyle = 'rgba(244, 184, 200, .8)';
      for (var pxl = -(px(camX * 1.0) % 46); pxl < W; pxl += 46) ctx.fillRect(pxl, GROUND + 10, 3, 3);
    }
  }

  function renderFlag() {
    var fx = px(act.flagX - camX);
    if (fx > W + 60) return;
    ctx.fillStyle = '#7b4a12';
    ctx.fillRect(fx, GROUND - 120, 4, 120);
    ctx.fillStyle = '#e85d75';
    ctx.fillRect(fx + 4, GROUND - 120, 26, 18);
    ctx.fillStyle = '#ffd23f';
    ctx.fillRect(fx + 4, GROUND - 104, 26, 3);
    if (act.groomAtFlag) {
      var gx = fx + 12;
      drawMayank(gx, GROUND - PH, true, false, 0);
      // heart bobbing over his head while he waits
      if (mode === 'run' || mode === 'rings') {
        var hy = GROUND - PH - 14 + Math.sin(runTime * 3) * 3;
        ctx.fillStyle = '#e85d75';
        ctx.fillRect(gx + 5, px(hy), 3, 3); ctx.fillRect(gx + 10, px(hy), 3, 3);
        ctx.fillRect(gx + 5, px(hy) + 2, 8, 3); ctx.fillRect(gx + 7, px(hy) + 5, 4, 2);
      }
    }
  }

  function renderRings() {
    var gx = px(act.flagX - camX + 12);
    drawNeha(brideX, GROUND - PH, brideX < gx - 26, runTime * 10);
    if (ringsT > 0.9) {
      var blink = Math.floor(runTime * 5) % 2 === 0;
      drawGoldRing(px((brideX + gx) / 2) - 2, GROUND - PH - 22, blink);
      drawGoldRing(px((brideX + gx) / 2) + 8, GROUND - PH - 30, !blink);
    }
    ctx.fillStyle = '#e85d75';
    hearts.forEach(function (hh) {
      var hx2 = px(hh.x), hy = px(hh.y);
      ctx.globalAlpha = Math.max(0, Math.min(1, hh.life));
      ctx.fillRect(hx2, hy, 3, 3); ctx.fillRect(hx2 + 5, hy, 3, 3);
      ctx.fillRect(hx2, hy + 2, 8, 3); ctx.fillRect(hx2 + 2, hy + 5, 4, 2);
      ctx.globalAlpha = 1;
    });
  }

  function render() {
    renderSky();
    renderTrain();
    renderScenery();
    var finale = (mode === 'rings' || (mode === 'clear' && actIdx === window.LEVELS.acts.length - 1 && ringsT > 0));
    if (!finale) {
      // signposts / taunt bubbles (hidden once the finale starts)
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
    }
    renderGround();
    renderFlag();
    items.forEach(function (it) { if (!it.hit) drawItem(it); });
    if (finale) {
      renderRings();
    } else {
      var blinking = runTime < invincibleUntil && Math.floor(runTime * 12) % 2 === 0;
      if (!blinking) {
        if (act.player === 'neha') drawNeha(PLAYER_X, player.y, player.onGround, player.frame);
        else drawMayank(PLAYER_X, player.y, false, player.onGround, player.frame);
      }
    }
  }

  /* ---------- loop ---------- */
  function loop(t) {
    rafId = requestAnimationFrame(loop);
    if (mode === 'run') {
      if (!lastT) lastT = t;
      acc += Math.min(0.1, (t - lastT) / 1000);
      lastT = t;
      while (acc >= STEP) { update(STEP); acc -= STEP; if (mode !== 'run') { acc = 0; break; } }
    } else if (mode === 'rings') {
      if (!lastT) lastT = t;
      updateRings(Math.min(0.05, (t - lastT) / 1000));
      lastT = t;
    } else {
      lastT = t;
    }
    render();
  }

  /* ---------- public ---------- */
  window.GAME = {
    begin: beginRun,
    /* test hooks — harmless in prod */
    _debug: function () {
      return { mode: mode, actIdx: actIdx, camX: camX, lives: lives, laddoos: laddoos,
               tokens: sessionTokens, ringGot: ringGot, playerY: player && player.y, score: score(false) };
    },
    _warp: function (x) { camX = x; },
    _jump: jump
  };
})();

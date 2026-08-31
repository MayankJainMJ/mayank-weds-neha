/* Original chiptune via Web Audio — no files, no borrowed melodies.
   Three THEMED tracks:
   - india  (Act 1): Bhupali-raga pentatonic, square-wave lead over a
     tanpura-style Sa–Pa drone. Peppy, filmi-street energy.
   - canada (Act 2): winter folk lilt in G, warm triangle lead, sleigh-bell
     ticks. Slow snow.
   - japan  (Act 3): hirajoshi scale, koto-style short plucks, sparse drone.
   AudioContext unlocks on first user gesture (PRESS START / any tap).
   API: MUSIC.start(name) · stop() · sfx(name) · toggleMute() · unlock() */
(function () {
  'use strict';

  var ac = null, master = null, timer = null, step = 0, track = null, muted = false;

  var TRACKS = {
    india: {   // Bhupali (C D E G A) — bright, dancing
      bpm: 160, lead: 'square', dur: 0.14, vol: 0.45,
      mel:  [76, 79, 81, 79, 76, 74, 72, 74, 76, 79, 84, 81, 79, 0, 76, 0,
             76, 79, 81, 84, 81, 79, 76, 74, 72, 74, 76, 74, 72, 0, 67, 0],
      bass: [48, 0, 55, 0, 48, 0, 55, 0],   // Sa–Pa tanpura drone
      tick: false
    },
    canada: {  // G-major folk lilt — warm lodge, falling snow
      bpm: 104, lead: 'triangle', dur: 0.22, vol: 0.55,
      mel:  [67, 0, 71, 74, 0, 79, 78, 0, 74, 71, 0, 67, 66, 0, 69, 71,
             74, 0, 78, 76, 0, 74, 71, 0, 69, 67, 0, 62, 67, 0, 0, 0],
      bass: [43, 0, 0, 50, 0, 0, 47, 0, 0, 50, 0, 0],
      tick: true                              // sleigh-bell ticks
    },
    japan: {   // Hirajoshi (A B C E F) — koto plucks, spacious
      bpm: 128, lead: 'triangle', dur: 0.1, vol: 0.6,
      mel:  [69, 0, 72, 0, 76, 77, 76, 72, 71, 0, 69, 0, 64, 0, 69, 0,
             72, 76, 77, 81, 77, 76, 72, 71, 69, 71, 72, 71, 69, 0, 0, 0],
      bass: [45, 0, 0, 0, 40, 0, 0, 0],
      tick: false
    }
  };
  // legacy names still work
  TRACKS.mumbai = TRACKS.india;
  TRACKS.calgary = TRACKS.canada;

  function freq(n) { return 440 * Math.pow(2, (n - 69) / 12); }

  function ensure() {
    if (!ac) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ac = new AC();
      master = ac.createGain();
      master.gain.value = 0.18;
      master.connect(ac.destination);
    }
    if (ac.state === 'suspended') ac.resume();
    return true;
  }

  function blip(f, dur, type, vol, slideTo) {
    if (!ac || muted || !f) return;
    var t = ac.currentTime;
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function start(name) {
    if (!ensure()) return;
    stop();
    track = TRACKS[name] || TRACKS.india;
    step = 0;
    var interval = 60000 / track.bpm / 2; // 8th notes
    timer = setInterval(function () {
      if (ac.state === 'suspended') { ac.resume(); return; }
      var m = track.mel[step % track.mel.length];
      if (m) blip(freq(m), track.dur, track.lead, track.vol);
      var b = track.bass[step % track.bass.length];
      if (b) blip(freq(b), 0.22, 'triangle', 0.7);
      if (track.tick && step % 4 === 2) blip(2200, 0.04, 'square', 0.1);
      step++;
    }, interval);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  var SFX = {
    jump:  function () { blip(300, 0.12, 'square', 0.35, 620); },
    coin:  function () { blip(freq(88), 0.07, 'square', 0.4); setTimeout(function () { blip(freq(93), 0.12, 'square', 0.4); }, 60); },
    hit:   function () { blip(140, 0.25, 'sawtooth', 0.45, 60); },
    token: function () { [81, 84, 88, 93].forEach(function (n, i) { setTimeout(function () { blip(freq(n), 0.12, 'square', 0.4); }, i * 70); }); },
    clear: function () { [72, 76, 79, 84, 88].forEach(function (n, i) { setTimeout(function () { blip(freq(n), 0.16, 'square', 0.45); }, i * 90); }); },
    shoot: function () { blip(900, 0.09, 'square', 0.35, 300); },
    boom:  function () { blip(110, 0.3, 'sawtooth', 0.5, 50); }
  };

  window.MUSIC = {
    start: start,
    stop: stop,
    sfx: function (name) { if (ensure() && SFX[name]) SFX[name](); },
    toggleMute: function () { muted = !muted; return muted; },
    unlock: function () { ensure(); },   // call from any user gesture
    _state: function () { return { ctx: ac ? ac.state : 'none', playing: !!timer, muted: muted, track: track ? track.bpm : 0 }; },
    get muted() { return muted; }
  };
})();

/* Original Mario-STYLE chiptune via Web Audio — no files, no Nintendo melodies.
   Square-wave lead + triangle bass, one loop per act, plus SFX blips.
   AudioContext is created on first user gesture (PRESS START), so autoplay-safe.
   API: MUSIC.start(trackName) · stop() · sfx(name) · toggleMute() -> muted */
(function () {
  'use strict';

  var ac = null, master = null, timer = null, step = 0, track = null, muted = false;

  // melodies as MIDI note numbers, 0 = rest; one entry per 8th-note
  var TRACKS = {
    mumbai: { // peppy C-major grind
      bpm: 168,
      mel:  [72, 76, 79, 76, 81, 79, 76, 72, 74, 77, 81, 77, 79, 0, 76, 0,
             72, 76, 79, 76, 84, 81, 79, 76, 77, 81, 84, 81, 79, 76, 74, 0],
      bass: [48, 0, 55, 0, 53, 0, 55, 0, 50, 0, 57, 0, 55, 0, 52, 0]
    },
    calgary: { // wistful A-minor snow
      bpm: 116,
      mel:  [69, 0, 72, 74, 76, 0, 74, 72, 69, 0, 67, 64, 65, 67, 64, 0,
             69, 0, 72, 74, 77, 0, 76, 74, 72, 0, 74, 72, 69, 0, 0, 0],
      bass: [45, 0, 52, 0, 50, 0, 52, 0, 41, 0, 48, 0, 52, 0, 45, 0]
    },
    japan: { // celebratory pentatonic reunion
      bpm: 152,
      mel:  [77, 79, 81, 84, 81, 79, 77, 74, 72, 74, 77, 79, 77, 0, 74, 0,
             77, 79, 81, 84, 86, 84, 81, 79, 81, 84, 86, 88, 86, 0, 84, 0],
      bass: [41, 0, 48, 0, 46, 0, 48, 0, 43, 0, 50, 0, 48, 0, 41, 0]
    }
  };

  function freq(n) { return 440 * Math.pow(2, (n - 69) / 12); }

  function ensure() {
    if (!ac) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ac = new AC();
      master = ac.createGain();
      master.gain.value = 0.14;
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
    track = TRACKS[name] || TRACKS.mumbai;
    step = 0;
    var interval = 60000 / track.bpm / 2; // 8th notes
    timer = setInterval(function () {
      var m = track.mel[step % track.mel.length];
      if (m) blip(freq(m), 0.14, 'square', 0.45);
      var b = track.bass[step % track.bass.length];
      if (b) blip(freq(b), 0.2, 'triangle', 0.7);
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
    get muted() { return muted; }
  };
})();

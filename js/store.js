/* mwn.v1 — localStorage state. Every load path goes through sanitizeState().
   New fields MUST be added to sanitizeState() or they get stripped. */
(function () {
  'use strict';

  var KEY = 'mwn.v1';
  // Global fresh-start switch: bump this and every device self-resets its GAME
  // stats on next visit (then re-syncs zeros over its old Firestore doc).
  // Names and RSVPs always survive a reset.
  var RESET_EPOCH = 2;

  function defaults() {
    return {
      v: 1,
      epoch: RESET_EPOCH,
      name: '',
      bestScore: 0,
      plays: 0,
      unlocked: false,
      hardMode: false,
      tokens: [false, false, false, false, false, false, false, false],
      hearts: 0,          // persistent collectible count — never resets
      props: [],          // story props from ?-blocks
      inviteBits: [],     // invitation reveals (in-game toasts)
      scores: [],         // device-local leaderboard [{n, s}]
      rsvp: null,
      updatedAt: 0
    };
  }

  function bool(x) { return x === true; }
  function int(x, lo, hi) {
    x = parseInt(x, 10);
    if (isNaN(x)) return lo;
    return Math.max(lo, Math.min(hi, x));
  }
  function str(x, max) {
    return (typeof x === 'string' ? x : '').slice(0, max);
  }

  function sanitizeState(p) {
    var d = defaults();
    if (!p || typeof p !== 'object') return d;
    if (int(p.epoch, 0, 999) !== RESET_EPOCH) {
      // stale epoch: keep who they are and their RSVP, wipe the game
      p = { name: p.name, rsvp: p.rsvp };
    }
    d.name = str(p.name, 40);
    d.bestScore = int(p.bestScore, 0, 9999);
    d.plays = int(p.plays, 0, 100000);
    d.unlocked = bool(p.unlocked);
    d.hardMode = bool(p.hardMode);
    if (Array.isArray(p.tokens)) {
      for (var i = 0; i < 8; i++) d.tokens[i] = bool(p.tokens[i]);
    }
    d.hearts = int(p.hearts, 0, 999999);
    if (Array.isArray(p.props)) {
      for (var k = 0; k < p.props.length && d.props.length < 40; k++) {
        var pr = str(p.props[k], 24);
        if (pr && d.props.indexOf(pr) === -1) d.props.push(pr);
      }
    }
    if (Array.isArray(p.inviteBits)) {
      for (var m = 0; m < p.inviteBits.length && d.inviteBits.length < 8; m++) {
        var ib = str(p.inviteBits[m], 24);
        if (ib && d.inviteBits.indexOf(ib) === -1) d.inviteBits.push(ib);
      }
    }
    if (Array.isArray(p.scores)) {
      for (var q = 0; q < p.scores.length && d.scores.length < 10; q++) {
        var sc = p.scores[q];
        if (sc && typeof sc.n === 'string' && sc.n) {
          d.scores.push({ n: str(sc.n, 20), s: int(sc.s, 0, 9999) });
        }
      }
    }
    if (p.rsvp && typeof p.rsvp === 'object') {
      var names = [];
      if (Array.isArray(p.rsvp.partyNames)) {
        for (var j = 0; j < 1; j++) { // intimate wedding: +1 max
          if (typeof p.rsvp.partyNames[j] === 'string' && p.rsvp.partyNames[j].trim()) {
            names.push(str(p.rsvp.partyNames[j].trim(), 40));
          }
        }
      }
      d.rsvp = {
        attending: p.rsvp.attending === true,
        arrivalDay: p.rsvp.arrivalDay === '3' ? '3' : '2',
        partySize: int(p.rsvp.partySize, 1, 2),
        partyNames: names
      };
    }
    d.updatedAt = int(p.updatedAt, 0, 9007199254740991);
    return d;
  }

  function load() {
    try {
      return sanitizeState(JSON.parse(localStorage.getItem(KEY)));
    } catch (e) {
      return defaults();
    }
  }

  function save(state) {
    state.updatedAt = Date.now();
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      localStorage.setItem(KEY + '.ts', String(state.updatedAt));
    } catch (e) { /* storage full/blocked — state stays in memory */ }
    return state;
  }

  window.MWN = { KEY: KEY, defaults: defaults, sanitizeState: sanitizeState, load: load, save: save };
})();

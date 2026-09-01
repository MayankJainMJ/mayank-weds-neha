/* mwn.v1 — localStorage state. Every load path goes through sanitizeState().
   New fields MUST be added to sanitizeState() or they get stripped. */
(function () {
  'use strict';

  var KEY = 'mwn.v1';

  function defaults() {
    return {
      v: 1,
      name: '',
      bestScore: 0,
      plays: 0,
      unlocked: false,
      hardMode: false,
      tokens: [false, false, false, false, false, false, false, false],
      hearts: 0,          // persistent collectible count — never resets
      props: [],          // story props from ?-blocks
      inviteBits: [],     // act-4 invitation reveals
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

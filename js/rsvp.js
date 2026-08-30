/* RSVP form: prefill from mwn.v1, save locally, edit-in-place.
   Firebase sync arrives in P3 — cloud.js will push state.rsvp from the same doc. */
(function () {
  'use strict';

  var state = window.MWN.load();

  var form = document.getElementById('rsvpForm');
  var nameEl = document.getElementById('name');
  var songEl = document.getElementById('song');
  var noteEl = document.getElementById('note');
  var countEl = document.getElementById('count');
  var minusBtn = document.getElementById('minus');
  var plusBtn = document.getElementById('plus');
  var partyNamesGroup = document.getElementById('partyNamesGroup');
  var partyNamesWrap = document.getElementById('partyNames');
  var detailsBlock = document.getElementById('detailsBlock');
  var savedBanner = document.getElementById('savedBanner');
  var toast = document.getElementById('toast');

  var partySize = 1;

  /* ---------- helpers ---------- */

  function radios(name) {
    return Array.prototype.slice.call(document.querySelectorAll('input[name="' + name + '"]'));
  }

  function radioValue(name) {
    var r = radios(name).filter(function (x) { return x.checked; })[0];
    return r ? r.value : null;
  }

  function setRadio(name, value) {
    radios(name).forEach(function (r) { r.checked = (r.value === value); });
    highlightChoices();
  }

  function highlightChoices() {
    Array.prototype.slice.call(document.querySelectorAll('.choice')).forEach(function (label) {
      var input = label.querySelector('input');
      label.classList.toggle('selected', !!(input && input.checked));
    });
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  function renderPartyNames(existing) {
    partyNamesWrap.innerHTML = '';
    var extras = partySize - 1;
    partyNamesGroup.style.display = extras > 0 ? '' : 'none';
    for (var i = 0; i < extras; i++) {
      var input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 40;
      input.placeholder = 'Guest ' + (i + 2);
      input.style.marginBottom = '.6rem';
      input.className = 'party-name';
      if (existing && existing[i]) input.value = existing[i];
      partyNamesWrap.appendChild(input);
    }
  }

  function setPartySize(n, existingNames) {
    partySize = Math.max(1, Math.min(6, n));
    countEl.textContent = String(partySize);
    minusBtn.disabled = partySize <= 1;
    plusBtn.disabled = partySize >= 6;
    renderPartyNames(existingNames);
  }

  function updateDetailsVisibility() {
    var attending = radioValue('attending');
    detailsBlock.style.display = attending === 'no' ? 'none' : '';
  }

  /* ---------- prefill ---------- */

  nameEl.value = state.name || '';
  if (state.rsvp) {
    setRadio('attending', state.rsvp.attending ? 'yes' : 'no');
    setRadio('arrivalDay', state.rsvp.arrivalDay);
    setPartySize(state.rsvp.partySize, state.rsvp.partyNames);
    songEl.value = state.rsvp.song || '';
    noteEl.value = state.rsvp.note || '';
    savedBanner.textContent = state.rsvp.attending
      ? '\u2713 You\u2019ve RSVP\u2019d \u2014 ' + (state.rsvp.partySize > 1 ? state.rsvp.partySize + ' of you, ' : '') + 'arriving on the ' + (state.rsvp.arrivalDay === '2' ? '2nd' : '3rd') + '. Edit anytime below.'
      : '\u2713 Your response is saved. Changed your mind? Edit below \u2014 the hill awaits.';
    savedBanner.classList.add('show');
  } else {
    setPartySize(1);
  }
  updateDetailsVisibility();
  highlightChoices();

  /* ---------- events ---------- */

  minusBtn.addEventListener('click', function () { setPartySize(partySize - 1, collectPartyNames()); });
  plusBtn.addEventListener('click', function () { setPartySize(partySize + 1, collectPartyNames()); });

  radios('attending').forEach(function (r) {
    r.addEventListener('change', function () { updateDetailsVisibility(); highlightChoices(); });
  });
  radios('arrivalDay').forEach(function (r) {
    r.addEventListener('change', highlightChoices);
  });

  function collectPartyNames() {
    return Array.prototype.slice.call(document.querySelectorAll('.party-name'))
      .map(function (i) { return i.value.trim(); })
      .filter(Boolean);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = nameEl.value.trim();
    if (!name) {
      nameEl.focus();
      showToast('Tell us who you are first \u{1F60A}');
      return;
    }
    var attending = radioValue('attending');
    if (!attending) {
      showToast('Coming or not? We need to count the laddoos.');
      return;
    }
    if (attending === 'yes' && !radioValue('arrivalDay')) {
      showToast('Pick an arrival day \u2014 2nd or 3rd?');
      return;
    }

    state.name = name.slice(0, 40);
    state.rsvp = {
      attending: attending === 'yes',
      arrivalDay: radioValue('arrivalDay') || '3',
      partySize: attending === 'yes' ? partySize : 1,
      partyNames: attending === 'yes' ? collectPartyNames() : [],
      song: songEl.value.trim().slice(0, 80),
      note: noteEl.value.trim().slice(0, 300)
    };
    state = window.MWN.save(window.MWN.sanitizeState(state));

    savedBanner.textContent = state.rsvp.attending
      ? '\u2713 RSVP saved on this phone \u2014 it will sync automatically. See you on the ' + (state.rsvp.arrivalDay === '2' ? '2nd' : '3rd') + '!'
      : '\u2713 Saved. You will be missed (and mentioned at the bonfire).';
    savedBanner.classList.add('show');
    savedBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast(state.rsvp.attending ? 'Spot claimed \u{1F525}' : 'Saved \u{1F494}');
  });
})();

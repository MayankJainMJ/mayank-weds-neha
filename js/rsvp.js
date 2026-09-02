/* RSVP form: prefill from mwn.v1, save locally, edit-in-place.
   Captures ONLY: name, coming?, arrival day, +1 yes/no + their name. (v2.4)
   Firebase sync arrives in P3 — cloud.js will push state.rsvp from the same doc. */
(function () {
  'use strict';

  var state = window.MWN.load();

  var form = document.getElementById('rsvpForm');
  var nameEl = document.getElementById('name');
  var plusNameGroup = document.getElementById('plusNameGroup');
  var plusNameEl = document.getElementById('plusName');
  var detailsBlock = document.getElementById('detailsBlock');
  var savedBanner = document.getElementById('savedBanner');
  var toast = document.getElementById('toast');

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

  function updatePlusVisibility() {
    plusNameGroup.style.display = radioValue('plusOne') === 'yes' ? '' : 'none';
  }

  function updateDetailsVisibility() {
    var attending = radioValue('attending');
    detailsBlock.style.display = attending === 'no' ? 'none' : '';
  }

  /* ---------- prefill ---------- */

  nameEl.value = state.name || '';
  var greet = document.getElementById('greet');
  if (greet && state.name) {
    greet.textContent = 'Hi ' + state.name + '!';
    greet.hidden = false;
  }
  if (state.rsvp) {
    setRadio('attending', state.rsvp.attending ? 'yes' : 'no');
    setRadio('arrivalDay', state.rsvp.arrivalDay);
    if (state.rsvp.partySize > 1) {
      setRadio('plusOne', 'yes');
      plusNameEl.value = (state.rsvp.partyNames && state.rsvp.partyNames[0]) || '';
    }
    savedBanner.textContent = state.rsvp.attending
      ? '\u2713 You\u2019ve RSVP\u2019d \u2014 ' + (state.rsvp.partySize > 1 ? 'you + 1, ' : '') + 'arriving on the ' + (state.rsvp.arrivalDay === '2' ? '2nd' : '3rd') + '. Edit anytime below.'
      : '\u2713 Your response is saved. Changed your mind? Edit below \u2014 the hill awaits.';
    savedBanner.classList.add('show');
  }
  updatePlusVisibility();
  updateDetailsVisibility();
  highlightChoices();

  /* ---------- events ---------- */

  radios('attending').forEach(function (r) {
    r.addEventListener('change', function () { updateDetailsVisibility(); highlightChoices(); });
  });
  radios('arrivalDay').forEach(function (r) {
    r.addEventListener('change', highlightChoices);
  });
  radios('plusOne').forEach(function (r) {
    r.addEventListener('change', function () { updatePlusVisibility(); highlightChoices(); });
  });

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
    var plusOne = attending === 'yes' && radioValue('plusOne') === 'yes';
    var plusName = plusNameEl.value.trim();
    if (plusOne && !plusName) {
      plusNameEl.focus();
      showToast('What\u2019s your +1\u2019s name?');
      return;
    }

    state.name = name.slice(0, 40);
    state.rsvp = {
      attending: attending === 'yes',
      arrivalDay: radioValue('arrivalDay') || '3',
      partySize: plusOne ? 2 : 1,
      partyNames: plusOne ? [plusName.slice(0, 40)] : []
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

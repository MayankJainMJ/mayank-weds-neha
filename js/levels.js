/* DATA ONLY — acts, obstacles, chapter cards, taunts. Tuning happens here,
   never in game.js. x = world distance in logical px. Ground top = y 400.
   Obstacle types: chair (jump), excel (low slide, jump), door (tall, jump tight).
   laddoo dy / token dy = height above ground top (negative = up). */
window.LEVELS = {
  act1: {
    id: 'act1',
    name: 'ACT 1 \u2014 MUMBAI',
    chapter: ['2018. TWO STRANGERS', 'AT ENDEAVOUR,', 'GRINDING THROUGH', 'MBA PREP.'],
    clearLine: ['"I TOLD EVERYONE SHE WAS', 'JUST A GOOD FRIEND.', 'NOBODY BELIEVED ME."'],
    speed: 175,
    flagX: 3600,
    tokenIndex: 0,
    items: [
      { t: 'chair',  x: 380 },
      { t: 'laddoo', x: 520,  dy: -46 },
      { t: 'laddoo', x: 560,  dy: -70 },
      { t: 'laddoo', x: 600,  dy: -46 },
      { t: 'excel',  x: 760 },
      { t: 'door',   x: 960 },
      { t: 'laddoo', x: 1090, dy: -40 },
      { t: 'laddoo', x: 1130, dy: -40 },
      { t: 'laddoo', x: 1170, dy: -40 },
      { t: 'chair',  x: 1300 },
      { t: 'excel',  x: 1470 },
      { t: 'laddoo', x: 1600, dy: -92 },
      { t: 'door',   x: 1640 },
      { t: 'laddoo', x: 1690, dy: -92 },
      { t: 'chair',  x: 1860 },
      { t: 'token',  x: 1905, dy: -96 },
      { t: 'excel',  x: 2080 },
      { t: 'laddoo', x: 2200, dy: -46 },
      { t: 'laddoo', x: 2240, dy: -66 },
      { t: 'laddoo', x: 2280, dy: -46 },
      { t: 'door',   x: 2420 },
      { t: 'chair',  x: 2600 },
      { t: 'excel',  x: 2760 },
      { t: 'laddoo', x: 2880, dy: -50 },
      { t: 'laddoo', x: 2920, dy: -74 },
      { t: 'laddoo', x: 2960, dy: -50 },
      { t: 'door',   x: 3100 },
      { t: 'chair',  x: 3280 },
      { t: 'laddoo', x: 3400, dy: -44 },
      { t: 'laddoo', x: 3440, dy: -44 },
      { t: 'laddoo', x: 3480, dy: -44 }
    ],
    taunts: [
      { x: 650,  text: 'BETA, SHAADI KAB?' },
      { x: 1550, text: 'LOG KYA KAHENGE?' },
      { x: 2500, text: 'EXCEL BHEJ DO' },
      { x: 3200, text: 'ALMOST THERE!' }
    ]
  }
};

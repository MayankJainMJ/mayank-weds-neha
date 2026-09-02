/* DATA ONLY — acts, obstacles, chapter cards, signs. Tuning happens here,
   never in game.js. x = world distance in logical px. Ground top = y 400.
   Three acts converging on Japan (Codex story rounds, v2.5):
   Act 1 (him, Mumbai): the grind — chair/excel/door. Ends "she was an ocean away."
   Act 2 (her, Calgary): distance itself — snowdrift/clock/gate. Ends "she booked a flight."
   Act 3 (both, Japan): one tap, both jump — lantern/traindoor, ring studio,
   Fuji over Kawaguchiko, and a MANDAP ON A HILL instead of a castle.
   laddoo / token / ring dy = height above ground top (negative = up). */
window.LEVELS = {
  acts: ['act1', 'act2', 'act3'],

  act1: {
    id: 'act1',
    style: 'mumbai',
    player: 'mayank',
    music: 'india',
    name: 'ACT 1 \u2014 MUMBAI',
    chapter: ['ACT 1 \u2014 MUMBAI', '', '2018. TWO STRANGERS', 'AT ENDEAVOUR,', 'GRINDING THROUGH', 'MBA PREP.'],
    clearLine: ['ACT 1 CLEAR \u2726', '', 'BOARDING: BOM \u2708 JAPAN', 'SHE WAS AN OCEAN AWAY.', 'SO HE FLEW.'],
    nextLabel: '\u25B6 HER TURN',
    endScene: 'boarding',
    speed: 175,
    flagX: 3600,
    tokenIndex: 0,
    tokenToast: '\u2726 Memory unlocked: 2018 \u2014 where it all began',
    monster: { x: 2870, hp: 4, name: 'THE LONG-DISTANCE MONSTER',
               toast: '\u{1F498} Distance: defeated. For now\u2026' },
    physics: { jumpScale: 0.92 },       // monsoon rain dampens jumps
    weather: 'rain',
    platforms: [
      { x: 620,  y: 340, w: 70, kind: 'trainroof' },
      { x: 700,  y: 340, w: 70, kind: 'trainroof' },
      { x: 780,  y: 340, w: 70, kind: 'trainroof' },
      { x: 1180, y: 352, w: 56, kind: 'scaffold' },
      { x: 1252, y: 312, w: 56, kind: 'scaffold' },
      { x: 1820, y: 336, w: 70, kind: 'trainroof' },
      { x: 1892, y: 336, w: 70, kind: 'trainroof' },
      { x: 1964, y: 336, w: 70, kind: 'trainroof' },
      { x: 3100, y: 348, w: 240, kind: 'seawall' }
    ],
    blocks: [
      { x: 380,  y: 316, drop: 'heart' },
      { x: 950,  y: 316, drop: 'heart' },
      { x: 1330, y: 266, drop: 'prop:chai' },
      { x: 2150, y: 316, drop: 'heart' },
      { x: 2560, y: 316, drop: 'prop:boardingpass' },
      { x: 3350, y: 316, drop: 'heart' }
    ],
    enemies: [
      { x: 940,  kind: 'dog' },
      { x: 1450, kind: 'auto' },
      { x: 2240, kind: 'dog' },
      { x: 3230, kind: 'auto' }
    ],
    items: [
      { t: 'puddle', x: 300 },
      { t: 'heartc', x: 470,  dy: -46 },
      { t: 'heartc', x: 510,  dy: -68 },
      { t: 'heartc', x: 550,  dy: -46 },
      { t: 'heartc', x: 640,  dy: -80 },
      { t: 'heartc', x: 710,  dy: -80 },
      { t: 'heartc', x: 790,  dy: -80 },
      { t: 'cart',   x: 880 },
      { t: 'heartc', x: 1060, dy: -40 },
      { t: 'heartc', x: 1100, dy: -40 },
      { t: 'heartc', x: 1140, dy: -40 },
      { t: 'heartc', x: 1290, dy: -96 },
      { t: 'puddle', x: 1560 },
      { t: 'heartc', x: 1650, dy: -46 },
      { t: 'heartc', x: 1690, dy: -68 },
      { t: 'heartc', x: 1730, dy: -46 },
      { t: 'token',  x: 1940, dy: -100 },
      { t: 'heartc', x: 2060, dy: -40 },
      { t: 'puddle', x: 2330 },
      { t: 'heartc', x: 2390, dy: -46 },
      { t: 'heartc', x: 2430, dy: -68 },
      { t: 'heartc', x: 2470, dy: -46 },
      { t: 'heartc', x: 3140, dy: -88 },
      { t: 'heartc', x: 3200, dy: -88 },
      { t: 'heartc', x: 3260, dy: -88 }
    ],
    taunts: [
      { x: 260,  text: 'MUMBAI MONSOON' },
      { x: 650,  text: 'BETA, SHAADI KAB?' },
      { x: 1550, text: 'LOG KYA KAHENGE?' },
      { x: 2500, text: 'EXCEL BHEJ DO' },
      { x: 3150, text: 'AIRPORT \u2192' }
    ]
  },

  act2: {
    id: 'act2',
    style: 'calgary',
    player: 'neha',
    music: 'canada',
    name: 'ACT 2 \u2014 CALGARY',
    chapter: ['ACT 2 \u2014 CALGARY', '', '2024. NEHA, CANADA.', 'NEW CITY. NEW SNOW.', 'SAME 2 AM CALLS.'],
    clearLine: ['ACT 2 CLEAR \u2726', '', 'BOARDING: YYC \u2708 JAPAN', 'TWO FLIGHTS.', 'ONE DESTINATION.'],
    nextLabel: '\u25B6 TOGETHER NOW',
    endScene: 'boarding',
    speed: 180,
    flagX: 3600,
    tokenIndex: 6,
    tokenToast: '\u2726 Memory unlocked: 2024 \u2014 Calgary, an ocean away',
    monster: { x: 2870, hp: 5, name: 'IT FOLLOWED HER ACROSS THE OCEAN',
               toast: '\u{1F498} Distance: defeated. FOREVER.' },
    platforms: [
      { x: 560,  y: 352, w: 54, kind: 'icefloe', move: { dy: 5,  speed: 2.1 } },
      { x: 640,  y: 348, w: 54, kind: 'icefloe', move: { dy: 6,  speed: 1.8 } },
      { x: 720,  y: 352, w: 54, kind: 'icefloe', move: { dy: 5,  speed: 2.3 } },
      { x: 1150, y: 330, w: 120, kind: 'rooftop' },
      { x: 1520, y: 300, w: 46, kind: 'skilift', move: { dy: 22, speed: 1.1 } },
      { x: 1660, y: 280, w: 46, kind: 'skilift', move: { dy: 22, speed: 1.1 } },
      { x: 2050, y: 336, w: 110, kind: 'rooftop' },
      { x: 3120, y: 352, w: 54, kind: 'icefloe', move: { dy: 5,  speed: 2.0 } },
      { x: 3200, y: 348, w: 54, kind: 'icefloe', move: { dy: 6,  speed: 1.7 } },
      { x: 3280, y: 352, w: 54, kind: 'icefloe', move: { dy: 5,  speed: 2.2 } }
    ],
    blocks: [
      { x: 480,  y: 316, drop: 'heart' },
      { x: 1210, y: 270, drop: 'heart' },
      { x: 2100, y: 276, drop: 'prop:scarf' },
      { x: 3160, y: 300, drop: 'prop:coffee' },
      { x: 3340, y: 316, drop: 'heart' }
    ],
    enemies: [
      { x: 1350, kind: 'plow' },
      { x: 2260, kind: 'plow' }
    ],
    icicles: [ { x: 980 }, { x: 1445 }, { x: 2330 }, { x: 3060 } ],
    physics: {},
    items: [
      { t: 'snowdrift', x: 380 },
      { t: 'heartc', x: 470,  dy: -46 },
      { t: 'heartc', x: 585,  dy: -80 },
      { t: 'heartc', x: 665,  dy: -84 },
      { t: 'heartc', x: 745,  dy: -80 },
      { t: 'blackice', x: 900 },
      { t: 'gate',   x: 1030 },
      { t: 'heartc', x: 1180, dy: -95 },
      { t: 'heartc', x: 1230, dy: -95 },
      { t: 'clock',  x: 1400 },
      { t: 'heartc', x: 1540, dy: -120 },
      { t: 'token',  x: 1685, dy: -150 },
      { t: 'snowdrift', x: 1840 },
      { t: 'blackice', x: 1900 },
      { t: 'heartc', x: 1990, dy: -40 },
      { t: 'heartc', x: 2080, dy: -100 },
      { t: 'heartc', x: 2130, dy: -100 },
      { t: 'gate',   x: 2280 },
      { t: 'heartc', x: 2400, dy: -46 },
      { t: 'heartc', x: 2440, dy: -68 },
      { t: 'heartc', x: 2480, dy: -46 },
      { t: 'snowdrift', x: 2570 },
      { t: 'heartc', x: 3145, dy: -80 },
      { t: 'heartc', x: 3225, dy: -84 },
      { t: 'heartc', x: 3305, dy: -80 }
    ],
    taunts: [
      { x: 320,  text: 'CALGARY. -30\u00B0C.' },
      { x: 840,  text: 'BLACK ICE!' },
      { x: 1550, text: 'TIME ZONES SUCK' },
      { x: 2450, text: 'MISS YOU' },
      { x: 3150, text: 'YYC AIRPORT \u2192' }
    ]
  },

  act3: {
    id: 'act3',
    style: 'japan',
    player: 'both',
    music: 'japan',
    name: 'ACT 3 \u2014 TOGETHER',
    chapter: ['ACT 3 \u2014 TOGETHER', '', 'TWO FLIGHTS LAND.', 'SAME CITY. SAME ROAD.', 'TWO HANDMADE RINGS.', '', 'ONE TAP, BOTH JUMP.', 'HIT THE \u2726 BLOCKS \u2014', 'THE INVITATION IS INSIDE.'],
    clearLine: ['IT\u2019S NOT GAME OVER.', 'IT\u2019S GAME START. \u2726'],
    landing: true,
    endScene: 'torii',
    speed: 180,
    flagX: 3600,
    tokenIndex: 7,
    tokenToast: '\u2726 Memory unlocked: Lake Kawaguchiko',
    hasRing: true,
    boost: { x: 2600 },
    platforms: [
      { x: 500,  y: 340, w: 130, kind: 'station' },
      { x: 900,  y: 320, w: 160, kind: 'shinkansen' },
      { x: 1450, y: 330, w: 100, kind: 'station' },
      { x: 1800, y: 350, w: 60,  kind: 'station' },
      { x: 2620, y: 250, w: 90,  kind: 'station' }
    ],
    blocks: [
      { x: 600,  y: 276, drop: 'invite:date' },
      { x: 1500, y: 280, drop: 'invite:venue' },
      { x: 2000, y: 316, drop: 'invite:dress' },
      { x: 3300, y: 316, drop: 'invite:rsvp' }
    ],
    enemies: [],
    icicles: [],
    physics: {},
    items: [
      { t: 'heartc', x: 380,  dy: -46 },
      { t: 'heartc', x: 420,  dy: -68 },
      { t: 'heartc', x: 460,  dy: -46 },
      { t: 'lantern', x: 720 },
      { t: 'heartc', x: 930,  dy: -110 },
      { t: 'heartc', x: 1000, dy: -110 },
      { t: 'heartc', x: 1070, dy: -110 },
      { t: 'traindoor', x: 1180 },
      { t: 'vending',   x: 1300 },
      { t: 'heartc', x: 1480, dy: -100 },
      { t: 'ring',   x: 1640, dy: -60 },
      { t: 'heartc', x: 1850, dy: -80 },
      { t: 'lantern', x: 1950 },
      { t: 'traindoor', x: 2220 },
      { t: 'heartc', x: 2350, dy: -46 },
      { t: 'heartc', x: 2390, dy: -68 },
      { t: 'heartc', x: 2430, dy: -46 },
      { t: 'token',  x: 2660, dy: -158 },
      { t: 'heartc', x: 2650, dy: -180 },
      { t: 'heartc', x: 2690, dy: -180 },
      { t: 'vending', x: 2850 },
      { t: 'heartc', x: 2980, dy: -50 },
      { t: 'heartc', x: 3020, dy: -74 },
      { t: 'heartc', x: 3060, dy: -50 },
      { t: 'lantern', x: 3180 },
      { t: 'heartc', x: 3420, dy: -44 },
      { t: 'heartc', x: 3460, dy: -44 }
    ],
    taunts: [
      { x: 320,  text: 'JAPAN, TOGETHER' },
      { x: 850,  text: 'SHINKANSEN \u2014 HOP ON!' },
      { x: 1580, text: 'RING STUDIO \u2726' },
      { x: 2520, text: 'BOOST! \u2191' },
      { x: 3250, text: 'THE TORII AWAITS\u2026' }
    ]
  },

};
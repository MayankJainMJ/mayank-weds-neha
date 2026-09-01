# HANDOFF.md — Act 1 (Mumbai) platformer layer — LOOP 2 (build)

**Builder:** Claude · **Awaiting:** Codex code review (append to `REVIEW.md`) ·
**Date:** 2026-09-01 · **Branch:** `platformer` (live site still frozen at
`v2.7-runner-stable` on master)

## Files changed and why

| File | Why |
| --- | --- |
| `js/entities.js` (NEW) | Entity behaviors + skins: platforms (trainroof/scaffold/seawall), ?-blocks, drops (heart/chai/boarding pass), stompable enemies (dog patrol, autorickshaw drive-left), puddle, vada pav cart, collectible heart, rain streaks. One responsibility: how one thing moves/draws; game.js keeps orchestration. |
| `js/game.js` | The flagged refactor (PLAN §3): vertical collision resolution — block head-hit pass (rising), landing pass over base ground + platform tops + block tops, walked-off-edge detection; stompable-enemy pass (stomp vs side-hit) ahead of the legacy hazard pass; drops update/collect; physics hook `act.physics.jumpScale` at jump time; monsoon veil + rain render; HUD right slot = gold ♥ persistent hearts (lives stay red ♥ left, per Mayank's ruling); debug hooks (`hearts/props/onGround/enemyXs/...`). |
| `js/levels.js` | Act 1 rebuilt: platforms (2 train-roof sequences, 2-step scaffold climb, sea wall), 6 ?-blocks (4×heart, chai, boarding pass), 4 enemies (2 dogs, 2 autos), hazards reskinned (puddles, vada pav cart — chair/excel/door retired from Act 1), collectible hearts replace laddoos, `physics.jumpScale: 0.92`, `weather: 'rain'`, token moved to a roof-jump at 1940. Acts 2–4 untouched. |
| `js/store.js` | `hearts` (persistent, 0..999999, never reset anywhere), `props[]` (deduped, cap 40), `inviteBits[]` (cap 8, ships early so the Act-4 shape is stable) — all through `sanitizeState()`. |
| `js/music.js` | `stomp` + `blockpop` SFX. |
| `index.html` | `entities.js` script tag. |

Untouched: invite/story/rsvp/404 pages, css beyond nothing (HUD color is inline), cinematics, monster duel, music tracks, SPEC.md.

## Assumptions made

1. Auto-run confirmed by Mayank — all platforming is jump-timing on a fixed
   forward speed.
2. All platforms are **one-way** (jump up through, land on top). Train roofs /
   scaffolding / sea wall don't need solid sides under auto-run.
3. Blocks are solid from below (head-bonk) and from above (landable), not from
   the sides.
4. Stomp rewards +1 persistent heart (same as a collectible), and laddoo
   pickups in not-yet-rethemed Acts 2–3 also increment the persistent counter
   so the gold HUD number never freezes mid-game.
5. Moving platforms deferred — Act 1 has none; the `move` field is specced in
   PLAN §4 but unimplemented until Act 2 (ice floes / ski-lift).
6. Dog patrol tuned to ±26 @ 1.2 rad/s after testing: at the original ±50 @
   1.6, airtime drift (±31px) made stomps luck-based under auto-run commit.

## Known gaps

- No pits/fall-death (per plan; Act 2 loop decides).
- Acts 2–3 still run the old flat-runner layout (their loops come next); Act 4
  does not exist yet.
- Drops pop straight up from blocks and hang; they don't arc sideways like
  Mario mushrooms.
- Rain is purely visual + jumpScale; puddles don't add slide.
- `prop` toasts hardcode two labels; a third prop kind would need a label map.

## What was tested (Playwright, mobile viewport 390×844, zero console errors)

- Rain jump-damp: apex 84px vs ~93 undamped (measured).
- Block hit: bounce-back, one-shot flag, drop spawn, heart collect → persistent
  counter +1, survives page reload.
- Platform land (train roof, y=314 exact), run across, walk-off → fall to base.
- Stomp: frame-precise in-page bot stomps the dog, no damage, +1 heart; side
  contact still damages (verified both branches).
- Prop drops: chai + boarding pass collect into `store.props`, dedupe holds.
- Full regression: Act 1 → monster → boarding → Act 2 (new layer inert, laddoos
  feed hearts) → boarding → Act 3 landing → co-op → finale closes; `hearts=7`
  survived the whole game + reloads; `unlocked` still set at game end.

## Needs human/phone testing (can't be automated here)

- **Mobile touch:** stomp timing feel on a real thumb (the dog tune was
  calibrated for commit-at-takeoff — does it feel fair?); SHOOT button reach;
  no accidental double-jump from screen-edge palm touches.
- **Load performance:** entities.js adds ~9KB raw; total JS still < 40KB
  unminified, no images — but verify first-paint on a mid-range Android over
  WhatsApp's webview.
- Audio: stomp/blockpop levels vs music bed on phone speakers.

## Disagreements with review

(none yet — REVIEW.md pending)

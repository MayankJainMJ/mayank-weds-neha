# PLAN.md — Act 1 (Mumbai) platformer retheme — LOOP 1 (design)

**Builder:** Claude · **Awaiting:** Codex review in `REVIEW.md` · **Date:** 2026-09-01
**Branch:** `platformer` (master + live site frozen at tag `v2.7-runner-stable`)
**Scope of this plan:** engine deltas needed by ALL four acts (data shapes must
hold across acts — Codex please judge that), plus Act 1 implementation detail.
Acts 2–4 get their own loop each.

---

## 1. What I will reuse (not rewrite)

| Existing | Reused as |
| --- | --- |
| `js/game.js` fixed-timestep loop, rAF, canvas fit, HUD, overlays, chapter cards, pause | unchanged orchestration |
| AABB collision + forgiveness pad | extended with vertical resolution (§3) |
| `js/levels.js` data-driven acts (style/music/speed/items/taunts) | same file, new arrays per act (§4) |
| Parallax scenery + monuments (Gateway/CST/Taj/Sea Link etc.) | Act 1 far/mid layers as-is; add near-layer props (§5) |
| Boarding/landing cinematics, monster duel, mandap draw | kept; boarding = the "plane-takeoff card" the brief asks for; mandap moves to Act 4 in its own loop |
| `js/music.js` (india/canada/japan tracks + SFX) | unchanged; add `stomp` + `blockpop` SFX (2 lines) |
| `js/store.js` mwn.v1 + sanitizer | extended (§6) — sanitizer rule respected |
| invite/story/rsvp pages, skip links, never-gate rule | untouched, non-negotiable |

## 2. Mechanics decision (needs Codex sign-off)

Keep **auto-run** (one-thumb portrait play — the P1 phone-feel gate passed on
this). Add platformer verticality ON TOP of auto-run rather than free
left/right control: jump onto platforms, stomp enemies, hit blocks from below.
Rationale: preserves the validated mobile input model; "side-scroller feel"
comes from level topology, not a d-pad. **Open question #1 if Codex disagrees.**

## 3. Engine deltas (`js/game.js`) — one refactor, flagged per instructions

This is the only structural refactor of the retheme; per instructions I am
asking BEFORE doing it. Current collision is "everything is a ground-level
hazard or collectible." New resolution order per fixed step:

1. integrate vy/y
2. platform pass (solid + one-way): if falling and feet cross platform top →
   land (`player.ground = platform.y`), moving platforms carry the player by
   their dx
3. block pass: if rising and head crosses block bottom → bounce vy=+80, mark
   hit, spawn drop (heart/prop), `blockpop` SFX
4. enemy pass: if falling and feet hit enemy top → stomp (enemy dies, vy=-320
   mini-bounce, +1 heart, `stomp` SFX); side contact → damage (existing
   lives/invincibility path unchanged)
5. hazard/collectible pass: existing code path, unchanged

Ground is no longer a constant: `groundY(x)` = base 400 or platform under
player. Fall-off-platform → fall to base ground (no pits in Act 1; pits are an
Act 2+ question, OQ#4).

Physics modifiers hook: `act.physics = { jumpScale: 0.92 }` applied at jump
time (Act 1 rain-damp). Friction modifier (Act 2 black ice) lands in Act 2's
loop, but the shape ships now so Codex can judge it: `{ jumpScale?, slideMs? }`.

## 4. Data shapes (`js/levels.js`) — must hold for all four acts

```js
platforms: [{ x, y, w, kind: 'trainroof'|'scaffold'|'seawall'|/*act2+*/'icefloe'|'skilift'|'rooftop'|'shinkansen',
              move?: { dx, dy, range, speed } }]   // moving = shinkansen, ski-lift, floes
blocks:    [{ x, y, drop: 'heart' | 'prop:chai' | 'prop:boardingpass' | /*act4*/ 'invite:date'|'invite:venue'|'invite:dress'|'invite:rsvp' }]
enemies:   [{ x, kind: 'dog'|'auto'|/*act2*/'snowplow'|..., patrol?: range, stompable: true }]
items:     existing hazards/collectibles array, unchanged shape
physics:   { jumpScale?: number, slideMs?: number }
goal:      existing flagX/boarding — unchanged
```
Y coordinates: platform y = its top surface, world px (base ground = 400).
Blocks float at y ≈ 300–330 (head-hittable from ground or platform).

## 5. Act 1 (Mumbai) level content

- **Palette/parallax:** existing warm morning → shift to ochre/monsoon gray
  via palette tweak in `renderSky`; far = existing Gateway/Taj + CST; mid =
  Marine Drive streetlight row (new small draw) + existing Sea Link; near =
  chawl windows + hoarding boards + dabbawala cart (3 new scenery draws).
- **Rain:** light diagonal rain streaks (screen-space, like Act 2 snow) +
  `physics.jumpScale: 0.92` (rain dampens jump). Puddles = existing low-hazard
  skin.
- **Platforms:** local-train roofs (2 sequences of 3 cars, static), bamboo
  scaffolding steps (2 climbs), sea-wall ledge (1 long).
- **Enemies (stompable):** stray dog (patrols 60px), autorickshaw (drives
  left, faster). Vada pav cart + puddles stay non-stompable hazards (skin
  swap of chair/excel).
- **Blocks:** 6 — drops: 4 hearts, `prop:chai`, `prop:boardingpass`.
- **Collectible hearts** replace laddoos in level data (draw = existing heart
  pixels; laddoo draw retired from Act 1).
- **Goal:** existing airport-gate boarding cinematic, reskinned label "GATE 8
  — BOM ✈". Monster duel stays where it is (unchanged).

## 6. State (`js/store.js`) — additive, sanitizer updated same commit

```js
hearts: 0,        // PERSISTENT collectible count — never resets, survives
                  // acts, deaths, continues, and sessions (int 0..99999)
props: [],        // collected story props, deduped ids
inviteBits: []    // act 4 only; ships now so the shape is stable
```
HUD: heart icon + `hearts` (persistent) replaces laddoo count; lives display
unchanged. Scoring: hearts collected this run keep feeding `score` exactly as
laddoos did (10 pts) so the leaderboard math survives.

## 7. Files touched (Act 1 loop only)

| File | Change |
| --- | --- |
| `js/game.js` | collision resolution §3, physics hook, rain layer, HUD heart counter |
| `js/entities.js` (NEW) | draw + update for platforms, blocks, drops, stompable enemies (one responsibility: entity behaviors; game.js keeps orchestration) |
| `js/levels.js` | act1 gains platforms/blocks/enemies/physics; hazards reskinned (puddle, vada pav cart); hearts replace laddoos |
| `js/store.js` | §6 fields + sanitizer entries |
| `js/music.js` | `stomp`, `blockpop` SFX |
| `index.html` | +1 script tag (entities.js) |

Not touched: invite/story/rsvp/404 pages, css (except HUD heart color if
needed), SPEC.md, STATUS.md (until loop closes), cinematics, monster, music
tracks.

## 8. Test plan (previews HANDOFF.md)

`node --check` all JS; Playwright: land-on-platform, fall-off, one-way jump-up-
through, block hit (bounce + drop + persistence of `hearts` across reload),
stomp vs side-hit on dog, moving-carry (deferred to Act 2 if no mover in Act 1
final layout), rain jumpScale measurably lowers apex, full Act 1 run → boarding
→ Act 2 unchanged, hearts NOT reset by continue/death/act change, 0 console
errors, 390×844.

## Open Questions

1. **Auto-run vs free movement** (§2). Plan assumes auto-run stays. If Codex
   overrules, the refactor grows a lot (camera, backtracking, level redesign) —
   want explicit sign-off either way.
2. **Hearts vs lives naming collision.** Lives are currently drawn as ♥ in the
   HUD. Plan: lives become pixel shields/diyas (tiny CSS/emoji change), hearts
   take the ♥ glyph as the collectible. OK?
3. **Stomp on the monster duel?** Brief adds stomp mechanic; monster duel is
   SHOOT-based. Plan: monster stays shoot-only (it's a set piece). Confirm.
4. **Pits/fall-death** are absent from Act 1 plan (base ground always catches
   you). Acts 2–3 (ice floes over the Bow River, shinkansen gaps) imply pits.
   Defer pit rules to Act 2 loop?
5. **"Hearts never reset"** — interpreted as persisting across sessions
   (localStorage), not just acts. Confirm intended semantics.
6. **Score vs hearts double-counting:** hearts feed both the persistent
   counter and the per-run score (as laddoos did). Confirm.
7. I could not verify how the existing `unlocked` gate should interact with
   the new Act 4 — does the invitation unlock at Act 3's proposal cutscene or
   only after Act 4's block-hit reveal? Plan assumes: unlock stays at
   final-act completion (Act 4), skip links unchanged (invite never gated).

# HANDOFF.md — Act 2 (Calgary) — LOOP 2 (build)
**Date:** 2026-09-01 · branch platformer

## Changed
- entities.js: floe/skilift/station/shinkansen platform skins, black ice, icicle
  (hang→warn-shake→fall→shatter), snowplow enemy, off-screen enemy despawn.
- game.js: moving-platform bob + support-ref carry (replaces stateless walk-off),
  shinkansen camX boost hook (used in Act 3), black-ice jump suppression,
  icicle lifecycle + damage, endScene generalization (boarding/torii/mandap),
  drawBigTorii, torii-finale branch, continue = full act rebuild, _freeze/_go
  test hooks.
- levels.js: Act 2 rebuilt — floes ×3 (bobbing), rooftops ×2, ski-lift chairs
  ×2 (±22 bob) with token on chair 2, blocks (3 heart + scarf + coffee), plows
  ×2, icicles ×4, black ice ×2, hearts replace laddoos.

## Bugs found & fixed during build (Codex A2-B)
1. [HIGH] Enemy migration state-leak: autos/plows drove left forever; after
   minutes they ambushed the player anywhere (insta-death chains). Fix:
   despawn once 70px behind camera. Applies to Act 1 autos too.
2. [HIGH] `continue` kept stale enemy/icicle state — now rebuilds the act.
3. [MED] Icicle at 90px lead hit grounded runners with no warning — added
   0.25s shake 'warn' state at 110px; jumping the impact zone dodges it.

## Verified
Floe land + bob carry (22 frames icefloe support) · black ice 32-frame zone,
jump suppressed while sliding · icicle warn→fall triggers · ski-lift token
reachable (bot: 3rd of 4 tries — DEMANDING, acceptable for optional bonus) ·
plow despawn behind camera · full run → monster → YYC boarding · Act 1
platform regression green after support refactor · 0 console errors.

## Gaps / phone-test
Chair-hop difficulty feel; scarf/coffee block collection untested by bot
(same code path as chai/boarding pass — Act 1 verified); load perf.

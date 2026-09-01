# HANDOFF.md — Acts 3+4 (Japan co-op + Pawna Finale) — LOOP 2 (build)
**Date:** 2026-09-01 · branch platformer

## Changed
- levels.js: Act 3 rebuilt (station ledges, SHINKANSEN boost platform, ring
  studio, boost set piece @2600, boost-only Kawaguchiko token ledge, torii
  goal) + NEW act4 (Pawna: speed 120, 6 rising terraces, 4 invitation
  ?-blocks: date/venue/dress/rsvp, no enemies/monster/hazards). acts[] = 4.
- game.js: boostwait mode (TAP TO BOOST prompt, kneel + launch vy -760,
  rejoin on landing), shinkansen support boost (+120px/s, measured 288 total),
  endScene 'torii' (proposal = ring scene under drawBigTorii → interstitial),
  pawna sky/ground/scenery (Sahyadri ridges, Pawna Lake glints, marigolds),
  invitation recap on the final overlay ('? ? ?' for missed bits), CLAIM YOUR
  SPOT button, invite bits GRANT ON BLOCK-HIT (fix below), _tick(ms)
  deterministic test driver (rAF-throttling-proof).
- entities.js: terrace skin. music.js: pawna track (slow Bhupali, 92bpm).

## Bugs found & fixed (Codex A34-B)
1. [high] Invitation bits granted on drop-collect, but drops float above head
   height → hits felt dead and bits were missable. Now grant ON the bonk;
   the envelope pop is decorative (deco drops never collide, cull 1.2s).
2. [test-infra] rAF suspension in occluded windows froze validation; _tick(ms)
   drives the fixed-step engine synchronously. Ships in prod (harmless, tiny).

## Verified (deterministic driver, 0 console errors)
Shinkansen: land on roof → support 'shinkansen', 288px/s vs 180 base ·
boostwait triggers at cam 2442 → tap launches → boost-ledge token collected ·
torii scene → 'SHE SAID YES. AGAIN.' interstitial → act4 · terrace staircase
landing · invite blocks 1-3 bonked → bits stored + toasts; block 4 skipped
deliberately → '? ? ?' in recap · mandap finale closes: 'IT'S NOT GAME OVER.
IT'S GAME START.' + recap + invitation unlock · hearts persist E2E.

## Gaps / phone-test
Terrace-6 (rsvp block) requires the full staircase route — verify feel; boost
prompt discoverability; overall run length (~4-5 min with cutscenes).

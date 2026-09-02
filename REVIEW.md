# REVIEW.md — Codex findings (append-only)

## A2-P — Act 2 plan review (Codex, 2026-09-01)
1. [med] PLAN §1: support-ref refactor replaces walk-off logic — ensure Act 1
   regression (roofs/scaffold) re-tested after refactor, not assumed.
2. [med] Icicle trigger distance: must be ahead-only, else icicles dropped
   behind the player damage him invisibly.
3. [low] Black ice without pre-cue reads as broken input under auto-run; add
   signage.
4. [low] Bobbing token math: verify at extreme phases, not average.
Verdict: proceed with revisions 1–4 folded in.

## A2-B — Act 2 build review (Codex, 2026-09-01)
1. [high][fixed] entities.js updateEnemy: unbounded leftward drive = cross-warp
   ambush state leak. Despawn at camX-70 applied; verify Act 1 autos too (done).
2. [high][fixed] game.js continue handler kept stale enemiesArr/icicles.
   loadAct rebuild applied — note hearts re-collectable after continue
   (accepted: farming persistent hearts is harmless delight).
3. [med][fixed] icicle needed a readable pre-fall cue (warn shake, 0.25s).
4. [low][open] token-on-bobbing-chair is expert-tier. Acceptable (optional),
   revisit only if phone testing says rage.
5. [low][open] floe bob dy 5-6 is nearly invisible in play; consider dy 8+ for
   readability in a polish pass.
Verdict: Act 2 closes. Proceed to Act 3.

## A3-P — Act 3 plan review (Codex)
1. [med] Boost launch vy -760 with ledge at y250: verify landing window math
   against speed 180 (window ≈ x2620–2710) — test, don't trust.
2. [low] During shinkansen boost the HUD should not double-count distance —
   camX boost only, no score inflation. OK as planned.
Verdict: proceed.

## A34-B — Acts 3+4 build review (Codex)
1. [high][fixed] invite:* reveals must fire on block-hit, not on collecting a
   drop hovering out of reach. Grant-on-bonk applied; decorative pop kept.
2. [med][accepted] act3 hazards during shinkansen dismount (traindoor 1180)
   can chain-hit a careless rider; lives+continue absorb it.
3. [low][open] pawna terraces: falling to base ground means backtrack-free
   retry (auto-run) — player can miss ALL blocks and still finish; recap shows
   '? ? ?' which nudges replay. Intended.
4. [low][open] _tick is exposed in prod GAME API; harmless (no cheating vector
   beyond what _warp already allows; page is a wedding invite).
Verdict: Acts 3+4 close. Ship after full-suite regression.

## UX-1 — Player-feedback assessment (Codex, 2026-09-01)
User reports: hearts uncollectable + invisible; lives unclear; no onboarding;
Calgary obstacles invisible on white; too hard — should finish in 1-2 goes.
1. [high][fixed] game.js drawItem collectible list missing 'heartc' — hearts
   DREW at ground level while hitboxes floated at dy height. Root cause of
   both "can't collect" and "can't see".
2. [high][fixed] Difficulty model replaced: lives/game-over RETIRED. Obstacle
   hit = -2 hearts (never < 0), 1.2s stumble-invincibility, run never stops.
   Sonic rule, wedding edition. Score's lives-bonus removed.
3. [high][fixed] Onboarding: every chapter card ends 'TAP ANYWHERE = JUMP ·
   GRAB ♥ · DODGE THE REST'; Act 1 opens with an in-world TAP = JUMP bubble
   for the first 3s.
4. [med][fixed] HUD: single gold '♥ N' top-left (the only currency), act label
   top-right. No ambiguous triple-heart lives row.
5. [med][fixed] Calgary contrast: snowdrifts icy-blue w/ dark base shadow,
   clocks get dark frames. Gates/plows already dark.
6. [low][fixed] Icicle warn shake 0.25s → 0.4s.
Verdict: matches the host's intent — guests finish in one go, hearts are the
gentle stakes, invitation is the destination.

## QA-2 — Co-op pickup + structure feedback (Codex, 2026-09-01)
1. [high][CONFIRMED REAL + fixed] In 'both' mode the pair shared ONE hitbox
   (front sprite only); Mayank was decorative — hearts touching only him were
   missed. Fix: collectibles/blocks/drops use a pair-wide pickup box
   (worldX-24..worldX+PW); hazards still judge only the front sprite (kept
   forgiving). Verified: late-jump heart that only the back sprite overlapped
   now collects.
2. [med][fixed] Act 4 removed per host: 3 acts; Act 3 renamed TOGETHER (Japan
   scenery kept), torii = their mandap, torii scene now ENDS the game with
   score + invitation recap. Invitation blocks (date/venue/dress/rsvp) moved
   into Act 3.
3. [med][fixed] invite:date block sat too low over its ledge (head already
   past block bottom → bonk could never fire). Raised y300→276. Lesson:
   block bottom must clear standing-head height of its floor.
4. [med][fixed] Neha sprite redesign: flared lehenga + gold hem, choli,
   bangles, long back hair, flower, bindi, lash line, earring, smile.

## W-1 — Wedding-invite design pass (Codex, 2 rounds, 2026-09-01)
R1: palette locked — deep maroon silk ground (#4a0e2b family), gold #d4af37
frames/rules, marigold + cream; card-suite metaphor = carousel IS the Indian
invite tradition (cover + inserts + RSVP card); toran header (marigold garland
+ mango-leaf zigzag); 'Shubh Vivah' eyebrow; no religious iconography without
the couple's explicit ask.
R2 critiques applied: arrows + dots + swipe-hint (swipe-only is
undiscoverable); internal card scroll as overflow safety; 4 Dec removed, date
line is 2–3 DECEMBER 2026; one pixel-heart separator keeps the game-world tie.
Bugs found in build: [high] name saved on splash was CLOBBERED by game.js's
stale in-memory store on beginRun (two-copies-of-state) — beginRun now
re-loads storage first. [med] '? ? ?' recap lines misread as leaderboard —
now labelled '<NAME>, YOUR INVITATION:' and '? ? ? — A ✦ BLOCK YOU MISSED'.
Verified: name dialog (skippable) → recap personalization → 'Hi <name>!' on
RSVP + prefill; carousel next/prev/swipe/dots/keyboard; page not scrollable;
no '4 December' anywhere; 0 console errors.

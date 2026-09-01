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

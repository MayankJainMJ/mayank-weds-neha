# PLAN.md — Act 2 (Calgary) — LOOP 1 (design)

**Builder:** Claude · **Date:** 2026-09-01 · **Branch:** platformer

## Engine deltas (serve Acts 2–4)
1. **Moving platforms** (PLAN-act1 §4 `move` field, now implemented): vertical
   bob `y = baseY + sin(runTime*speed + phase)*dy` for ski-lift chairs + ice
   floes. Requires a **support reference** (player carried by the platform he
   stands on) replacing the stateless walk-off check.
2. **Black ice**: ground zones where jumping is suppressed while sliding over
   (auto-run translation of "reduced friction" — you must jump BEFORE the
   patch). Non-damaging. Visual: glossy patch + sparkle.
3. **Falling icicles**: hang from eaves; when the runner is ~90px away they
   drop (gravity), damage while falling, shatter harmlessly on the ground.
4. Snowplow = big stompable driver (auto pattern, slower, wider).

## Act 2 layout
Ice-floe hop (3 bobbing floes) → black ice + departure gate → rooftop with
?-block → icicle alley → two ski-lift chairs (big bob) with the 2024 token at
the top of chair 2 → rooftop 2 with prop:scarf block → gates/drifts → monster
(unchanged) → floes finale + prop:coffee block → boarding YYC.
Blocks: 4×heart + prop:scarf + prop:coffee. Laddoos→hearts in act 2 data.

## Open Questions → self-answered (running both roles per Mayank)
- Floes bob over solid ground (no pits) — river is scenery. Pits deferred forever;
  auto-run + pits + 3 lives = rage on a wedding invite.
- Ski-lift reachability: chairs bob ±24; land window exists at all phases (checked
  against 88px jump apex).

## Codex plan-critique (REVIEW.md #A2-P) — applied revisions
- R1: support-ref must also fix Act-1 latent bug (carried player on moving
  surface); applied globally, act1 unaffected (no movers) but code path shared.
- R2: icicle trigger must not fire while player is airborne above it → trigger
  window checks horizontal distance only ahead of player (behind = never).
- R3: black ice + jump suppression MUST have a visible cue before the patch
  (taunt sign 'BLACK ICE!') or it reads as an input bug. Added.
- R4: token on a bobbing chair risks unfair misses → token hitbox generous
  (16px + bob amplitude accounted: dy -150 reachable at any phase). Verified in build tests.

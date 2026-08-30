# STATUS — Mayank Weds Neha wedding invite site

Spec: [`PLAN.md`](./PLAN.md) · Live target: https://mayankjainmj.github.io/mayank-weds-neha/

## Phases

| Phase | Deliverable | Status | Notes |
| --- | --- | --- | --- |
| P0 | Repo + deploy; `invite.html` (card/schedule/travel/FAQ, Khanna Pawna Estate maps link); `story.html` (dual-voice draft v1, illustration-only); `rsvp.html` (localStorage + saved-locally banner, song request); splash + skip; `404.html`; weblinks card | **DONE 2026-08-31** | live at https://mayankjainmj.github.io/mayank-weds-neha/ · 2 build/validate rounds run, zero console errors · travel times on invite are estimates — Mayank to verify |
| P1 | One-act runner prototype — real-phone feasibility GATE | not started | go/no-go for the game concept |
| P2 | Full game: 3 acts, chapter cards, illustrated de-rez postcards, havaldar, dragon boss, tokens ×8, scrapbook, vault, eggs E1/E2/E3/E5 | not started | needs P1 pass; no photo dependency (placeholder slots) |
| P3 | Firebase: anon auth, guest doc, score/tokens, RSVP write, leaderboard + 👑/💎 | not started | needs Mayank's console steps (PLAN §12) + firebaseConfig |
| P4 | Art/music polish, eggs E4/E7, OG tags, day-arc tuning, QA | not started | |

## Open decisions (from PLAN §14)

1. Venue maps link — **RESOLVED**: Khanna Pawna Estate
2. WhatsApp RSVP fallback — **DROPPED**: localStorage save + auto-resync
3. Photos — **DROPPED entirely (v2.2)**: illustration/pixel art only; any photo idea = separate future spec
4. Story beats draft v1 — **accepted as-is (v2.2)**; polish pass later
5. Blessings line vs parents' names — pending
6. Wedding hashtag — pending
7. Sprite art source — pending
8. Music source — pending
9. RSVP deadline print date (assume 31 Oct 2026) — pending confirm
10. Neha preview before guests — pending

## Changelog

- 2026-08-31 — Spec v1: folder created, 2 designer/builder loops, journey + phasing defined.
- 2026-08-31 — Spec v2: web research (game-invite precedent, section checklists, dual-voice story pattern, Indian invite culture, RSVP UX — Appendix A); mined `../proposal/` for the real 8-year beat sheet; ran 2 storyline loops (candidates A/B/C → B+ won); added `story.html`, memory tokens → scrapbook → vault, day-arc palette, de-rez transition, easter-egg registry E1–E9, bonfire-playlist song request. No code yet.
- 2026-08-31 — v2.1: Mayank's answers — venue resolved (Khanna Pawna Estate); WhatsApp fallback dropped (localStorage + auto-resync); story beats draft v1 (both voices) written for review. **P0 unblocked.**
- 2026-08-31 — v2.2: photos removed from the design entirely (no slots, no fill-later — illustration/pixel art only; photo ideas parked as separate future spec); story draft v1 accepted as-is, polish later.
- 2026-08-31 — **P0 shipped.** Built splash (pixel scene + press-start dialog + skip), invite (schedule/travel/FAQ), story (6 dual-voice beats, pixel icons), RSVP (full local flow: prefill, guards, party stepper, song request, decline path), 404, egg E4. Two Claude-build → Codex-validate rounds: R1 found 6 issues (reveal bug on rsvp, favicon 404, 2 contrast fails, deadline placement, aria-live) — all fixed; R2 clean pass (0 console errors, all flows verified, mobile 390×844 + desktop). Deployed: repo `MayankJainMJ/mayank-weds-neha`, Pages enabled, all pages 200 live, custom 404 serving, root still blank, weblinks card added.

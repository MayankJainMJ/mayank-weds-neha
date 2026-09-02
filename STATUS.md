# STATUS — Mayank Weds Neha wedding invite site

Spec: [`SPEC.md`](./SPEC.md) · Live target: https://mayankjainmj.github.io/neha-weds-mayank/

## Phases

| Phase | Deliverable | Status | Notes |
| --- | --- | --- | --- |
| P0 | Repo + deploy; `invite.html` (card/schedule/travel/FAQ, Khanna Pawna Estate maps link); `story.html` (dual-voice draft v1, illustration-only); `rsvp.html` (localStorage + saved-locally banner, song request); splash + skip; `404.html`; weblinks card | **DONE 2026-08-31** | live at https://mayankjainmj.github.io/neha-weds-mayank/ · 2 build/validate rounds run, zero console errors · travel times on invite are estimates — Mayank to verify |
| P1 | One-act runner prototype — real-phone feasibility GATE | **built + deployed 2026-08-31; awaiting Mayank's real-phone test** | Act 1 Mumbai live: tap-jump, 3 obstacle types, laddoos, 2018 token, flag clear, continue flow. 2 build/validate rounds (bg-reads-as-obstacle fix, button hierarchy, tap-anywhere GO). GATE closes only after Mayank plays it in WhatsApp's browser on his phone |
| P2 | Full game: 3 acts, chapter cards, illustrated de-rez postcards, havaldar, dragon boss, tokens ×8, scrapbook, vault, eggs E1/E2/E3/E5 | not started | needs P1 pass; no photo dependency (placeholder slots) |
| P3 | Firebase: anon auth, guest doc, score/tokens, RSVP write, leaderboard + 👑/💎 | not started | needs Mayank's console steps (SPEC §12) + firebaseConfig |
| P4 | Art/music polish, eggs E4/E7, OG tags, day-arc tuning, QA | not started | |

## Open decisions (from SPEC §14)

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

- 2026-09-02 — **v4.0: two acts, one mountain.** Act 3 + planes + boost + co-op deleted. Both acts climb golden-hour terraces to the Torii-Gate Mandap: he arrives and waits (Act 1), she finds him there (Act 2) — rings appear at the finale with a marigold-petal shower; diyas, bonfire, marigold string and sakura dress the mandap; koto track scores the climb. New long-distance sign lines (EXCEL BHEJ DO out). Invite blocks split across acts. Invite deck: wedding countdown, Add-to-Calendar, Share buttons; end screen gains SHARE THE INVITE.

- 2026-09-01 — **v3.6: story page 'family album' redesign (Codex proposal, approved: scroll + thread, copy frozen).** Maroon-silk world + toran header; each beat is a cream double-gold-framed album card with ✦ corners; gold year-medallions ride a vertical gold timeline thread connecting all six beats + closing card; pixel icons in gold-ringed medallions; his bubbles maroon-tinted sliding in from the left, hers rose-tinted from the right (voices converge); closing card: Claim your spot (primary) / Back to the invitation / Play the game; gold footer. Copy untouched.

- 2026-09-01 — **v3.5: end-screen redesign (Codex Option C, approved).** Final overlay reduced to the thesis + '<NAME> · SCORE n' + single 'OPEN YOUR INVITATION →' button (torii line, Claim Your Spot, Run It Again, and skip-link removed; overlay 1s earlier). TOP PLAYERS ✦ moved to the RSVP page's leaderboard block (device-local top 5, empty-state copy, 'Beat them — play the game' link) — the slot where the future Firebase global board lands.

- 2026-09-01 — **v3.4: Top Players board on the final screen.** Invitation-bits list ('? ? ?' lines) removed from the game-end overlay; replaced with a device-local TOP PLAYERS ✦ leaderboard (top 3, upsert-by-name best score, stored as `scores[]` in mwn.v1 through the sanitizer). Invitation reveals still toast during play. Global cross-guest leaderboard remains gated on the Firebase console steps (SPEC §12).

- 2026-09-01 — **v3.3: wedding-card redesign + personalization (2 Codex rounds).** Invite page rebuilt as a swipeable card carousel (cover / 2 Dec / 3 Dec / getting there / good to know / RSVP) on maroon silk with gold double-framed cream cards, toran header, Shubh Vivah cover; 4 Dec removed. Player name captured at PRESS START (skippable) → personalized final recap and 'Hi <name>!' + prefill on RSVP (gold-framed form). Fixed state-clobber bug that erased the name; recap '? ? ?' relabelled as missed-block invitation lines.

- 2026-09-01 — **v3.2: co-op pickup fix + 3-act structure.** Pair-wide collectible hitbox in TOGETHER act (real bug — back sprite was decorative); Act 4 removed, Act 3 renamed TOGETHER and now ends the game at the torii ("their mandap") with the invitation recap; invitation ?-blocks moved into Act 3 (date block geometry fixed); Neha sprite redesigned (lehenga, long hair, flower, bindi).

- 2026-09-01 — **v3.1: guest-experience pass (player feedback via Codex).** Fixed heart draw-vs-hitbox mismatch (uncollectable/invisible hearts). Lives + game-over removed: obstacle hits cost 2 hearts, run never stops — completable in one go. Onboarding: chapter-card control hints + in-world TAP = JUMP bubble. HUD simplified to gold ♥ count + act label. Calgary obstacle contrast recolor. Icicle warning lengthened.

- 2026-09-01 — **v3.0: PLATFORMER RETHEME (4 acts) — two-loop workflow, all acts.** Engine: one-way platforms + support-ref carry, moving platforms (bobbing floes/ski-lifts, shinkansen +120px/s boost roof), ?-blocks (bonk-from-below, land-on-top), stompable enemies (dog/auto/plow) w/ off-screen despawn fix, black-ice jump-suppress zones, warn-then-fall icicles, TAP-TO-BOOST set piece, endScene system (boarding/torii/mandap), persistent gold-heart counter (never resets, feeds score), story props + invitation bits in sanitized state, _tick deterministic test driver. Act 1 Mumbai monsoon (rain jump-damp, train roofs, scaffolding, sea wall, dogs/autos/puddles/vada pav cart, chai + boarding-pass blocks). Act 2 Calgary (floes, rooftops, ski-lift token, plows, icicles, black ice, scarf + coffee blocks). Act 3 Japan co-op (shinkansen ride, ring studio, boost-only Kawaguchiko token, TORII PROPOSAL: 'She said yes. Again.'). FINALE Pawna (slow terrace climb, gold sundowner, Sahyadri ridges + lake glints, invitation revealed via block-hits: date/venue/dress/RSVP — granted on bonk — mandap ending + recap + Claim Your Spot). Bugs fixed via loops: enemy migration leak, stale continue state, icicle no-cue, invite-on-drop-collect. Revert: tag v2.7-runner-stable.

- 2026-08-31 — **v2.7: themed music + monuments.** Audio unlock hardened (AudioContext resumed on PRESS START, every overlay tap and canvas tap — fixes silent-music reports); three genuinely themed tracks replace the generic ones: Act 1 = Bhupali-raga chiptune w/ tanpura drone (160bpm square), Act 2 = Canadian winter-folk lilt w/ sleigh ticks (104bpm triangle), Act 3 = hirajoshi koto-pluck theme (128bpm). Monument skylines added: Mumbai — Gateway of India, CST clock tower, Taj hotel dome, Sea Link pylons+cables; Calgary — Saddledome, Peace Bridge (+ existing Calgary Tower/Rockies); Japan — five-storey pagoda, Tokyo Tower, Himeji-style castle (+ existing Fuji/torii/lake). Verified: ctx running post-gesture, distinct track per act (160/104/128), monuments render, 0 console errors.

- 2026-08-31 — **v2.6: Long-Distance Monster.** Mini-boss duel in Acts 1+2 before each airport: auto-pause, SHOOT button (+ canvas/Space), heart projectiles, HP pips, hit-flash, death fade, +200/kill, auto-resume to boarding. Duel arenas cleared of obstacles in level data; shoot/boom SFX added to music.js. Validated: both duels, kill bonuses in final score (774 run), Act 3 unaffected, 0 console errors.

- 2026-08-31 — **v2.5 build (P2 core).** Three acts + airport cinematics: Act 1 Mumbai (him) ends boarding BOM ✈ JAPAN; Act 2 Calgary (her — Rockies/Calgary Tower/pines/live snowfall, snowdrift/clock/gate obstacles, 2024 token) ends boarding YYC ✈ JAPAN; Act 3 both planes land in Japan, co-op run (one tap, both jump), ring studio, Kawaguchiko token, **mandap-on-a-hill finale**: "It's not game over. It's game start." Original chiptune per act + SFX + HUD mute (js/music.js, Web Audio, no assets). RSVP reduced to minimal contract: name/coming/day/+1 yes-no + name (song + note fields removed, sanitizer updated). 2 Codex story rounds + 2 validation rounds; 0 console errors.

- 2026-08-31 — **v2.3 feedback build (P1.5).** Intimate RSVP: +1 max (stepper 1–2, sanitizer bounds, copy: "It's an intimate one — you and your +1", "Who's your +1?"). 50-50 pass: splash retitled NEHA ♥ MAYANK, story beats alternate who speaks first, beat 5 adds ring-making + Lake Kawaguchiko. Game is now two acts: Act 1 (him, Mumbai) ends "He reached the flag. And he waited." → Act 2 (her, Japan-themed): sakura/torii/Fuji-over-Kawaguchiko/shinkansen, suitcase/lantern/train-door obstacles, RING STUDIO pickup (+150), Kawaguchiko token (index 7), Mayank waiting at the flag, ring-exchange finale with hearts. 2 validation rounds: taunt-box clipping in finale fixed; ring + token deterministically collectable; +1 cap verified; 0 console errors.

- 2026-08-31 — **P1 built + deployed.** `js/game.js` (fixed-timestep runner engine, AABB, lives/score/pause/continue) + `js/levels.js` (Act 1 data: chairs, Excel sheets, train doors, laddoo arcs, 2018 token above the chair, taunt bubbles, flag at 3600). Splash PRESS START now launches the real game. Round 1 Codex: buildings read as obstacles (washed out + haze), clear-screen button hierarchy, tap-anywhere GO — fixed. Round 2: clean pass, live URL verified running with 0 console errors. **Feasibility gate now awaits Mayank's real-phone WhatsApp-browser test.**

- 2026-08-31 — Spec v1: folder created, 2 designer/builder loops, journey + phasing defined.
- 2026-08-31 — Spec v2: web research (game-invite precedent, section checklists, dual-voice story pattern, Indian invite culture, RSVP UX — Appendix A); mined `../proposal/` for the real 8-year beat sheet; ran 2 storyline loops (candidates A/B/C → B+ won); added `story.html`, memory tokens → scrapbook → vault, day-arc palette, de-rez transition, easter-egg registry E1–E9, bonfire-playlist song request. No code yet.
- 2026-08-31 — v2.1: Mayank's answers — venue resolved (Khanna Pawna Estate); WhatsApp fallback dropped (localStorage + auto-resync); story beats draft v1 (both voices) written for review. **P0 unblocked.**
- 2026-08-31 — v2.2: photos removed from the design entirely (no slots, no fill-later — illustration/pixel art only; photo ideas parked as separate future spec); story draft v1 accepted as-is, polish later.
- 2026-08-31 — **P0 shipped.** Built splash (pixel scene + press-start dialog + skip), invite (schedule/travel/FAQ), story (6 dual-voice beats, pixel icons), RSVP (full local flow: prefill, guards, party stepper, song request, decline path), 404, egg E4. Two Claude-build → Codex-validate rounds: R1 found 6 issues (reveal bug on rsvp, favicon 404, 2 contrast fails, deadline placement, aria-live) — all fixed; R2 clean pass (0 console errors, all flows verified, mobile 390×844 + desktop). Deployed: repo `MayankJainMJ/neha-weds-mayank`, Pages enabled, all pages 200 live, custom 404 serving, root still blank, weblinks card added.

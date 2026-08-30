# Mayank Weds Neha — Wedding Invite Website — SPEC (v2)

**Status:** build-ready (P1 gated) · **Date:** 2026-08-31 (v2 same day — storyline finalized after research + 2 validation loops) · **Author:** Mayank + agents
(Codex as Indian-wedding invitation planner/validator, Claude as researcher/builder — 2 loops per round)
**Live target:** `https://mayankjainmj.github.io/mayank-weds-neha/` · **Progress:** [`STATUS.md`](./STATUS.md)
**Hosting runbook:** `../Shoulder Rehab/NEW-WEBSITE-PLAYBOOK.md` · **Story source:** `../proposal/` (repo `for-neha`)

> A wedding invitation disguised as a 90s retro game, telling a true 8-year
> story. The **load-bearing idea**: one unified metaphor — **"The Road to Pawna,
> Eight Years in the Making"** — the game is the journey (with the couple's real
> memories hidden inside it), the invitation is the golden-hour arrival, the
> RSVP is claiming your seat on the hill; and the **invitation is never gated by
> the game**. The signature transition is the **de-rez** (pixel art resolving
> into soft illustrated postcard panels — the site is illustration-only, no
> photographs); the site's palette follows the wedding day
> itself, morning → sundowner → bonfire night. The **go/no-go gate**: P1 — a
> one-act runner prototype must play well one-thumbed, portrait, in WhatsApp's
> in-app browser on a real phone.

---

## §0 — TL;DR + locked decisions

Four content pages: `index.html` (splash + 3-act game) → `invite.html` (card,
schedule, travel, FAQ) → `story.html` ("Eight Years in the Making"
scrollytelling) → `rsvp.html` (RSVP + Baraati Leaderboard). Plus two unlockable
pages: `scrapbook.html` (memory tokens) and `vault.html` (all-8-tokens secret).
Canvas auto-runner (tap = jump), chapter cards + memory postcards carry the
real story, boss = Log-Kya-Kahenge Dragon, finale "IT'S NOT GAME OVER. IT'S
GAME START." Firebase = Firestore + Anonymous Auth; one `guests/{uid}` doc
holds name, best score, tokens, RSVP, song request.

Locked with Mayank:
- 2026-08-31: URL/repo/folder **`mayank-weds-neha`**; wedding facts (Pawna
  hilltop, 2–4 Dec 2026, wedding 3 Dec 4 PM sundowner, RSVP deadline end Oct);
  runner mechanics; original pixel art only; Anonymous Auth; game never blocks
  content; pure static, no build tools.
- 2026-08-31 (v2): storyline **"Road to Pawna — Eight Years in the Making"**
  (loop-validated, §1.1); real story beats sourced from `../proposal/`
  (`plan.md`, `ourstory.html`); memory-token/scrapbook/vault system; day-arc
  palette; dual-voice `story.html`; bonfire-playlist song request in RSVP;
  easter-egg registry (§8.5).
- 2026-08-31 (v2.1, Mayank's answers): venue = **Khanna Pawna Estate** (the
  share.google link resolves to it; maps link
  `https://maps.google.com/?q=Khanna+Pawna+Estate`); **no external RSVP
  fallback** — offline RSVP saves to localStorage and auto-syncs when
  Firebase is reachable; story beats draft v1 written.
- 2026-08-31 (v2.2, Mayank's answers): **photos are OUT of the design
  entirely** — no photo slots, no fill-in-later contract; the site is
  illustration/pixel-art only (couple has few matching photos; unrelated
  photos would break the beats). Any future photo feature is a separate idea,
  specced separately. **Story copy draft v1 accepted as-is for now** — a
  polish pass happens later; not a build blocker.

## §1 — Product narrative

**Mayank Weds Neha** — guests *play* the couple's 8-year journey to the
hilltop, discover their real memories hidden in the game, land at a
golden-hour invitation, and claim their spot on the hill.

**Personas:** friends on WhatsApp/phones (play, compete, hunt easter eggs,
RSVP) · elders/busy relatives (card, dates, story-as-scroll, directions, RSVP —
zero game) · the couple (read RSVPs + headcount + bonfire playlist from
Firestore console; see their own story told right).

### §1.1 The finalized storyline (2 research loops, Codex-validated)

**Candidates considered:** (A) one level per era incl. an unwinnable Bangalore
"let her go" level — rejected: 5-level build risk + tonal sabotage mid-invite
(grief-by-design belongs on the private `for-neha` site); (C) scrollytelling
spine with the game as bonus — rejected: kills the game-first hook and the
leaderboard→RSVP loop. **(B+) won:** 3-act runner keeps the mechanics; the
8-year story rides on chapter cards, memory postcards, hidden tokens, and a
standalone story page. Codex's three demands, all adopted: story must exist
outside the game (→ `story.html`); collectibles must mean something (→ memory
tokens → scrapbook); the site's palette follows the wedding day (→ day-arc).

**The journey:**

1. **Splash** (`index.html`) — pixel *morning* sky over a hill, marigold
   border, "MAYANK ♥ NEHA — PRESS START". Skip link: *"In a hurry? Walk
   straight to the mandap →"*.
2. **Chapter card:** *"2018. Two strangers at Endeavour, grinding through MBA
   prep."* → **Act 1 — Mayank, Mumbai (morning):** flying Excel sheets, office
   chairs, closing local-train doors, "Beta, shaadi kab?" taunt bubbles;
   laddoos = points; hidden **memory tokens** in hard-to-reach spots.
   Act ends: **memory postcard** — pixel frame de-rezzes into an illustrated
   postcard panel (Endeavour-era beat, one line of story).
3. **Handoff cutscene:** *"Meanwhile, in Neha's world…"*
4. **Chapter card:** *"Different cities. Different time zones. Same 2 AM
   calls."* → **Act 2 — Neha, the expressway (afternoon):** planes, clocks,
   missed-call icons; **Khopoli toll checkpoint** with havaldar barricade
   (easter egg: wait 5 s instead of jumping → he waves you through, "patience
   pays" bonus); a background billboard hides the **CP kiss frame** (tappable
   token). Act ends: postcard — *"September 30, 2025. Delhi. She picked him up
   at the station."*
5. **Chapter card:** *"This time, nobody let go."* → **Act 3 — Together, up the
   ghat (golden hour):** both sprites side by side, one tap jumps both;
   double-jump unlocked. Boss: **Log-Kya-Kahenge Dragon** — fireballs are real
   taunts ("log kya kahenge", "beta, shaadi kab?", "long distance kabhi
   chalta hai?"); collect hearts to fill the **pyaar-meter** → dragon retreats
   → both jump the flag.
6. **Unlock** — "IT'S NOT GAME OVER. IT'S GAME START." → 8-bit shehnai sting →
   full-screen de-rez into sundowner palette → "You have
   unlocked your invitation" → `invite.html`.
7. **Invitation** (`invite.html`, golden-hour palette) — the card: names,
   blessings line, *"getting married in the hills"*; schedule inserts: Come Up
   Early (2 Dec) · The Wedding (3 Dec, 4 PM, sundowner over Pawna Lake; "We
   eat. We drink. We dance. We sit around the bonfire. And nobody has to drive
   home.") · The Morning After (4 Dec); getting-there (Mumbai/Pune airports,
   best route, Khopoli callback, maps link); **FAQ** (dress code, what to pack
   for a hilltop night, kids, stay arrangements); link: *"How we got here →"*.
8. **Our story** (`story.html`) — "Eight Years in the Making": scroll timeline
   2018→2026, **dual-voice beats** (his side / her side, 2–3 short paragraphs
   each, warm and funny — no heartbreak dwelling), one small original pixel
   illustration per beat (no photographs, v2.2); scroll-reveal + parallax;
   ends: *"And now we want all of you on that hill."* → RSVP CTA.
9. **RSVP** (`rsvp.html`, dusk palette + bonfire glow) — "Claim your spot on
   the hill": name (pre-filled), attending, arrival 2nd/3rd, party size +1/+2
   with names (one submission per family), **"Pick one song for the bonfire
   playlist"**, note. Deadline banner 31 Oct. Fence-sitter line: *"No RSVP?
   You sleep in the camp tent. On the floor."*
10. **Baraati Leaderboard** — top 20; 👑 = RSVP'd; 💎 = all 8 tokens; replay
    CTA: *"Beat Sharma ji's beta."*
11. **Scrapbook** (`scrapbook.html`) — collected memory tokens as polaroids,
    each with a one-line true memory; 8 slots (2018–2026, one per year).
    **Vault** (`vault.html`) — unlocked at 8/8: the Japan beat, "Dooron
    Dooron" music cue, a thank-you note from the couple.

**Boundaries in plain words:** the private proposal site (`for-neha`) stays
private — this site retells the story wedding-toned, guest-safe; no
photographs anywhere, illustration/pixel art only (v2.2); no logins; no
anti-cheat beyond sanity caps.

### Capability Map

| Capability (guest sees/does) | Value | How it's built | Where | Phase |
| --- | --- | --- | --- | --- |
| Splash → play or skip to mandap | Hook + elder escape hatch | `index.html` overlay + link | §7, §8.1 | P0 |
| Read invitation, schedule, travel, FAQ | The invite works standalone | `invite.html` static + day-arc CSS | §7 | P0 |
| Read the 8-year story without playing | Story for elders; engagement for all | `story.html` scrollytelling, dual voice | §7, §8.6 | P0 |
| Fill RSVP incl. song request | Headcount + real bonfire playlist | `rsvp.html` form → localStorage → Firestore | §8.3, §8.4 | P0/P3 |
| Play Acts 1–3, one thumb, portrait | The fun | `js/game.js` engine + `js/levels.js` data | §8.1 | P1–P2 |
| Chapter cards + de-rez memory postcards | Story *inside* the game | cutscene data in `levels.js` + `js/derez.js` | §8.1, §8.6 | P2 |
| Beat dragon, flag, "game start" unlock | Emotional peak | Act 3 boss + full-screen de-rez → invite | §8.1 | P2 |
| Find memory tokens → scrapbook → vault | Replay engine beyond score; easter-egg hunt | token flags in state; `scrapbook.html`, `vault.html` | §8.2, §8.5 | P2 |
| Enter name once → leaderboard | Competition loop | anon UID → `guests/{uid}.bestScore` | §8.4 | P3 |
| 👑 for RSVP'd, 💎 for 8/8 tokens | Leaderboard nags RSVP; flexes discovery | render flags from guest docs | §8.4 | P3 |
| Easter eggs everywhere | Gimmick factor, shareability | registry §8.5 | §8.5 | P2/P4 |
| Couple reads RSVPs/headcount/playlist | The point | Firestore console over `guests` | §8.4 | P3 |
| Music: sting, vault cue, toggle | Warmth without annoyance | `<audio>` + first-interaction fallback | §6 | P4 |

## §2 — Context

`for-neha` (private-ish proposal site) already tells the full story with
dramatic weight; its `plan.md` + `ourstory.html` are the canonical beat sheet:
Endeavour 2018 → different cities, friends through everything → Canada news →
Bangalore, 4 days, no confession → let her go → she came back → **Delhi,
Sept 30 2025**, station pickup, hands in the auto, CP, the kiss → confession →
long distance India↔Canada → Japan plan → engaged → **Pawna, Dec 2026**.
Assets exist there (photos, caricatures, "Dooron Dooron") but per Mayank
(v2.2) **photos are out of the design entirely** — the wedding site is
illustration/pixel-art only; only the "Dooron Dooron" song reference (E8)
carries over.

Research (web, sourced — Appendix A): playable game-to-unlock invites are a
proven viral format; best-practice site sections (FAQ, travel, story, RSVP
deadline); dual-voice story pattern; award-winning wedding sites win on
scroll-storytelling/parallax/transitions; Indian invite culture is
WhatsApp-first, multi-event, caricature-friendly, hashtag-happy; RSVP best
practice = one submission per family + fun custom question.

## §3 — Goals / Non-goals

**Goals**
- Link-tap → RSVP in under 5 minutes, with or without playing.
- The real 8-year story reaches every guest — players get it as chapter
  cards/postcards/tokens, non-players get `story.html`.
- Gimmick-rich: every page has at least one easter egg (§8.5); the de-rez is
  the signature move.
- Leaderboard (👑/💎) drives replays, RSVPs, and token hunting.
- Couple gets headcount per day + a real crowd-sourced bonfire playlist.
- Offline-degraded: no Firebase ⇒ everything works; RSVP saves locally with
  a clear "saved on this phone" banner and auto-syncs when reachable.

**Non-goals**
- No build tools/frameworks; no Nintendo IP; no accounts; no admin dashboard.
- No republishing the proposal site's private emotional register (the
  "letting go" grief stays off the wedding site — wedding tone is celebratory).
- No photographs anywhere on the site (v2.2) — illustration/pixel art only;
  any photo feature is a separate future spec.
- No anti-cheat beyond sanity caps; no landscape layout (portrait-first).
- Not gating any wedding information behind game or tokens. Ever. (Vault
  gates only *bonus* content.)

## §4 — Load-bearing distinctions

1. **Invitation ≠ game.** The game is packaging; invite + RSVP are the
   product. Consequences: skip on splash, standalone shareable
   `invite.html`/`story.html`/`rsvp.html`, continue-on-death, RSVP never needs
   a score. (Unchanged from v1; #1 failure mode.)
2. **Wedding story ≠ proposal story.** Same facts, different register: the
   proposal site is intimate second-person ("I let you go"); the wedding site
   is warm third/dual-person for an audience. Never copy `for-neha` text
   verbatim; rewrite every beat guest-safe. Consequence: `story.html` has its
   own copy deck (§8.6), and no `for-neha` photos/assets appear (v2.2).
3. **Identity ≠ auth.** Self-typed name on an anonymous UID; one device = one
   guest doc; zero friction beats dedup edge cases.

## §5 — Architecture

```
index.html ──skip──────────────► invite.html ──► story.html ──► rsvp.html
 │ splash → game.js runner           │ card/schedule/travel/FAQ     │ form + leaderboard
 │  Act1→cut→Act2→cut→Act3→boss→flag │ "How we got here →"          │ 👑/💎 render
 │  chapter cards · postcards ·      │ (day-arc palette:            │
 │  tokens (derez.js transitions)    │  morning→sundowner→night)    │
 └─ unlock de-rez ───────────────────┘                              │
        scrapbook.html ◄── tokens ──► vault.html (8/8)              ▼
localStorage mwn.v1 (name, bestScore, tokens[], rsvp, unlocks) ◄──► Firestore guests/{uid}
                     newest-wins mirror, anon auth (shoulder-rehab pattern)
```

Page ownership: game pages never render wedding details; `invite.html`/
`story.html` never touch Firebase; `rsvp.html` is the only leaderboard reader.

## §6 — Reuse map

| Need | Reuse | Location |
| --- | --- | --- |
| Hosting/deploy/Pages/weblinks | Playbook §§1–4, 6–7 | `../Shoulder Rehab/NEW-WEBSITE-PLAYBOOK.md` |
| localStorage-first + Firestore mirror, sanitize, JSON round-trip | shoulder-rehab pattern | repo `MayankJainMJ/shoulder-rehab` |
| Audio autoplay w/ first-interaction fallback | proposal pattern | `../proposal/js/celebration.js` |
| Scroll-reveal (story page) | proposal pattern | `../proposal/js/gallery.js` |
| Story beat sheet + copy raw material | proposal content | `../proposal/plan.md`, `ourstory.html` |
| "Dooron Dooron" song reference (E8 only — no other proposal assets, v2.2) | proposal context | `../proposal/plan.md` |
| Typewriter/chapter-card text effects | proposal pattern | `../proposal/js/celebration.js` |
| JS syntax check loop | `node --check` extraction | `../Shoulder Rehab/AGENTS.md` |

Conventions preserved: pure static, lowercase-hyphen filenames, images
< 300 KB, `.DS_Store`/`.playwright-mcp/` never committed. New (justified):
Anonymous Auth (guests won't OAuth; public-read leaderboard) — rules §8.4.

## §7 — Module layout

```
mayank-weds-neha/
├── PLAN.md, STATUS.md
├── index.html          # splash + game canvas + cutscene/postcard layer + unlock
├── invite.html         # card + schedule + getting-there + FAQ (golden hour)
├── story.html          # "Eight Years in the Making" dual-voice scrollytelling
├── rsvp.html           # RSVP form + Baraati Leaderboard (dusk/bonfire)
├── scrapbook.html      # collected memory tokens (polaroid grid)
├── vault.html          # 8/8 secret: Japan beat, music cue, couple's note
├── 404.html            # "This page eloped." (GitHub Pages serves it)
├── css/style.css       # day-arc palettes, pixel + elegant themes, transitions
├── js/game.js          # engine: loop, physics, input, collisions, lives, score, states
├── js/levels.js        # DATA: acts, obstacles, chapter cards, postcards, token spots, boss, taunts
├── js/derez.js         # de-rez transition (canvas mosaic → panel/img crossfade)
├── js/story.js         # scroll-reveal + parallax for story.html
├── js/store.js         # mwn.v1 state + sanitizeState()
├── js/cloud.js         # module: anon auth, guest doc sync, leaderboard, badges
├── js/eggs.js          # easter-egg registry handlers (shared, tiny)
├── audio/              # shehnai-chiptune sting, SFX, vault cue (opus)
└── img/                # original pixel art only: sprites, marigold border, postcard panels, OG image
```

All story copy and level data live in `levels.js` / `story.html` — tuning
never touches engine code.

## §8 — Contracts

### 8.1 Game engine (`js/game.js`) — as v1, plus:

- **States:** `splash → chapter1 → act1 → postcard1 → cutscene → chapter2 →
  act2 → postcard2 → chapter3 → act3 → boss → flag → unlock`; `paused` on
  `visibilitychange`. Chapter/postcard states are tap-to-continue (auto-advance
  8 s).
- Input: tap/Space = jump; double-tap = double-jump (Act 3). Physics:
  fixed-timestep + rAF; AABB; portrait canvas, integer pixel scaling, max
  internal width 480.
- Lives/score: 3 lives; 0 → "Love finds a way. Continue?" (restart act, score
  resets, tokens KEEP — discovery is never punished).
  `score = laddoos×10 + hearts×25 + tokens×100 + timeBonus + livesRemaining×50
  (+ patience bonus 150)`; cap 9999. Hard mode (§8.5) ×2, cap still 9999.
- **Tokens:** touching a token pops a mini-postcard toast (1 s), sets
  `tokens[i]=true`, persists immediately.
- Unlock: flag → `unlocked=true` → score submit (if cloud) → full-screen
  de-rez (§8.7) → `invite.html`.

### 8.2 State (`js/store.js`, key `mwn.v1` + `mwn.v1.ts`)

```js
{ v: 1,
  name: "", bestScore: 0, plays: 0,
  unlocked: false, hardMode: false,
  tokens: [false×8],           // memory tokens, index = year 2018+i
  rsvp: null | { attending, arrivalDay:"2"|"3", partySize:1, partyNames:[],
                 song:"", note:"" },
  updatedAt: 0 }
```
Every load path through `sanitizeState()`; new fields must be added there.

### 8.3 RSVP form (`rsvp.html`)

Fields: name (required, prefilled) · attending (yes/no) · arrival day (radio:
"2 Dec — come up early" / "3 Dec — straight to the wedding") · party size
(stepper 1–6, default 1, "+1/+2") · party names · **song for the bonfire
playlist** (text, optional) · note. One submission per family (edit-in-place
on revisit). Deadline banner "RSVP by 31 October 2026". Camp-tent line below
submit. Offline/blocked Firebase: save to localStorage, show "RSVP saved on
this phone — it will sync automatically", retry sync on every later visit.
No external fallback (v2.1).

### 8.4 Firestore

`guests/{uid}` (anon-auth UID):

```js
{ name, nameLower, bestScore, plays,
  tokensCount,                  // 0–8 (💎 at 8)
  rsvp: {...}|null,             // 👑 when rsvp.attending
  updatedAt: serverTimestamp(), device }
```

Leaderboard: top 20 by `bestScore` desc; render 👑/💎 badges. Rules (public
read, own-doc write; differs from playbook):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /guests/{uid} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == uid
        && request.resource.data.bestScore is int
        && request.resource.data.bestScore >= 0
        && request.resource.data.bestScore <= 9999
        && request.resource.data.name is string
        && request.resource.data.name.size() <= 40
        && request.resource.data.tokensCount is int
        && request.resource.data.tokensCount >= 0
        && request.resource.data.tokensCount <= 8;
      allow delete: if false;
    }
  }
}
```

`cloud.js`: anon sign-in lazily (first score/RSVP/leaderboard need), debounce
1.5 s, JSON round-trip before `setDoc`, everything try/catch — site never
blocks on Firebase.

### 8.5 Easter-egg registry (each has an owner surface; findable by design)

| # | Egg | Surface | Behaviour |
| --- | --- | --- | --- |
| E1 | Havaldar patience | Act 2 checkpoint | wait 5 s instead of jumping → waved through, +150 "patience pays" |
| E2 | Dragon taunts | Act 3 boss | fireballs carry real lines ("log kya kahenge", "beta, shaadi kab?") |
| E3 | CP kiss billboard | Act 2 background | tappable billboard frame = token #7 (2025) |
| E4 | Names ×8 | invite.html | tap "Mayank ♥ Neha" 8 times → 8 confetti hearts + "eight years" toast |
| E5 | Konami-ish code | splash | ↑↑↓↓ (swipe) or M-N-M-N taps → hard mode (2× speed, 2× score) |
| E6 | 404 page | 404.html | "This page eloped. The wedding is that way →" |
| E7 | Sunset clock | invite.html | page palette matches real time of day for the viewer; at 16:00 IST a tiny "it's wedding o'clock" glint |
| E8 | Dooron Dooron | vault.html | the couple's song as the vault music cue |
| E9 | Scrapbook hints | scrapbook.html | empty slots show riddle hints ("Year 2021 hides where the clocks fly") |

Rule: eggs are bonus delight only — never required for invite/RSVP.

### 8.6 Story copy deck (`story.html`) — structure contract

Six beats, each: year chip · his-voice paragraph · her-voice paragraph (2–3
sentences each) · one small original pixel illustration (no photos, v2.2).
Beats:
Endeavour 2018 · Different cities · Bangalore, 4 days · Delhi, Sept 30 2025 ·
The proposal (link-free nod to the website he built her) · Pawna 2026 ("And
now we want all of you on that hill."). Register: warm, funny, celebratory;
facts from `../proposal/`. **Draft v1 of both voices written 2026-08-31 and
accepted as-is for the build (v2.2)** — a copy polish pass happens later and
is not a blocker. No verbatim copy from `for-neha` (§4.2).

### 8.7 De-rez transition (`js/derez.js`)

`derez(fromCanvas|fromImg, toImg, duration)` — mosaic the source into growing
pixel blocks, crossfade to target image as blocks shrink; used for act
postcards (small frame) and the grand unlock (full screen). Must degrade to a
plain crossfade if `prefers-reduced-motion`.

## §9 — Placement / flow order

Score+tokens submit at unlock and on improving replays. RSVP merges into the
same guest doc from `rsvp.html`. Leaderboard reads only on `rsvp.html`.
`story.html`/`invite.html` are network-free (static assets only). Scrapbook/
vault read only localStorage.

## §10 — Phasing (fail-safe: invite ships before game)

| Phase | Deliverable | Needs | Risk |
| --- | --- | --- | --- |
| **P0** | Repo + deploy; real `invite.html` (card/schedule/travel/FAQ, Khanna Pawna Estate maps link); `story.html` with copy deck v1 (both voices, accepted draft; pixel illustrations or plain year chips); `rsvp.html` → localStorage w/ saved-locally banner; splash + skip; `404.html`; weblinks card. Usable invite live. | — (unblocked 2026-08-31) | low |
| **P1 — GATE** | One-act runner prototype: run, jump, 3 obstacle types, laddoos, lives, score, one token. Real phone, portrait, WhatsApp browser. Go/no-go. | P0 | med |
| **P2** | Full game: 3 acts, chapter cards, illustrated postcards, de-rez (`derez.js`), havaldar+E1, boss+E2, flag, unlock, tokens ×8, scrapbook, vault, E3/E5 | P1 pass | med |
| **P3** | Firebase: anon auth, guest doc, score/tokens submit, RSVP write, leaderboard + 👑/💎 | P0 form, Firebase project (§12) | low-med |
| **P4** | Polish: sprite art pass, audio (sting/SFX/vault cue/toggle), E4/E7, OG tags for WhatsApp preview, day-arc palette tuning, QA (§11) | P2, P3 | low |

Each phase deploys green; the live site is never broken.

## §11 — Verification

Per edit: `node --check` every JS file / extracted script block. Serve
`python3 -m http.server 8765` from inside `mayank-weds-neha/`; never `file://`.

- **P0:** all four pages render at 390×844; skip works; story page scroll-
  reveals cleanly (no photo elements anywhere); RSVP (incl. song) persists
  across reload with saved-locally banner; maps link opens Khanna Pawna
  Estate; live URL 200; root blank; weblinks card present.
- **P1 gate:** real phone via LAN: steady fps, responsive jump, one-thumb
  portrait, no scroll-bounce; pause on tab switch.
- **P2:** full run ≤ ~4 min incl. cutscenes (tap-through); die → continue →
  invite reachable; each token persists + shows in scrapbook; 8/8 opens vault;
  E1 bonus fires; `prefers-reduced-motion` gets crossfades.
- **P3:** two browsers = two leaderboard rows; RSVP → 👑; 8 tokens → 💎;
  airplane mode ⇒ site fine, RSVP saved locally then syncs on reconnect
  (verify doc appears after network returns); Rules Playground rejects
  foreign-UID write and `bestScore` 10000.
- **P4:** zero console errors live; assets < 300 KB each; `index.html` total
  < ~1.5 MB; OG preview renders in WhatsApp; egg checklist E1–E9 manually
  verified.

## §12 — Firebase console steps (Mayank runs, before P3)

1. console.firebase.google.com → Add project → `mayank-weds-neha` → disable
   Analytics → Create.
2. Build → Firestore Database → Create → `asia-south1 (Mumbai)` → production.
3. Firestore → Rules → paste §8.4 → Publish.
4. Build → Authentication → Sign-in method → **Anonymous** → Enable (not
   Google — guests never see a login).
5. Authentication → Settings → Authorized domains → ensure
   `mayankjainmj.github.io`.
6. Project settings → Your apps → `</>` Web → register (no Hosting) → send me
   the `firebaseConfig` (safe to publish; security = rules).

## §13 — Risks & anti-patterns

| Failure mode | Mitigation |
| --- | --- |
| Elders bounce off the game, never RSVP | Skip on splash; share `invite.html`/`story.html`/`rsvp.html` directly in family groups |
| Runner feels bad on phones | P1 gate before Acts 2–3 |
| Private proposal content leaks to guests | §4.2 register rule; no photos on the site, period (v2.2); no verbatim `for-neha` copy |
| Story too heavy inside game → players skip-mash | Chapter cards/postcards tap-through in ≤ 1 tap, one line each; depth lives in `story.html`/scrapbook |
| Easter eggs bloat scope | Registry §8.5 is closed; new egg ideas → post-P4 backlog |
| Nintendo assets sneak in | Original sprites from day one |
| Firebase outage breaks RSVP | localStorage save + auto-resync on later visits; RSVP never lost |
| Duplicate guests (two devices) | Accepted; `nameLower` eyeball dedupe in console |
| Autoplay music annoys | Off by default, toggle, sting only at unlock |
| Canvas vs mobile browser chrome | `touch-action:none`, `user-scalable=no`, WhatsApp-browser test at P1 |

## §14 — Open decisions (Mayank)

1. ~~Venue maps link + property name~~ — **RESOLVED 2026-08-31: Khanna Pawna
   Estate**, maps link `https://maps.google.com/?q=Khanna+Pawna+Estate`.
2. ~~WhatsApp RSVP fallback~~ — **DROPPED 2026-08-31**: localStorage save +
   auto-resync only (§8.3).
3. ~~Photos~~ — **DROPPED 2026-08-31 (v2.2)**: no photos in this design at
   all (few matching photos exist; unrelated ones would break the beats).
   Any future photo idea = separate spec.
4. ~~Story beats draft v1~~ — **ACCEPTED AS-IS 2026-08-31 (v2.2)**: build
   with draft copy; polish pass later, not a blocker.
5. Blessings line vs parents' names.
6. Wedding hashtag (research says guests expect one; also feeds OG title)?
7. Sprite art: agent-drawn or commissioned?
8. Music: source a shehnai-chiptune loop, or SFX-only until found?
9. Confirm RSVP deadline print date = 31 Oct 2026.
10. Does Neha get a preview before the guest list? (Recommend: yes, she finds
    egg E8 herself.)

## §15 — Status

Track in [`STATUS.md`](./STATUS.md). Nothing built; **P0 is unblocked** as of
2026-08-31.

---

## Appendix A — Research briefing (sourced, 2026-08-31)

- **Sections checklist** — must-haves: hero names/date, venues + maps, RSVP +
  visible deadline, travel, short story, FAQ; delighters: schedule, party
  bios, insider guide, humor. Anti-patterns: registry on homepage, harsh
  no-kids wording. (Joy: withjoy.com/blog/what-to-put-on-your-wedding-website-the-complete-checklist/; Zola A–Z: zola.com/expert-advice/a-z-list-of-what-to-put-on-your-wedding-website)
- **Game invites precedent** — Mario-inspired "beat the game to unlock the
  wedding details" playable invite (two versions: play as bride or groom),
  viral 2010 (via queensberry.com/blog/8-bit-wedding-invitation); 8-bit Mario
  cartridge invites (bitrebels.com/design/retro-super-mario-8-bit-wedding-invitations/).
- **Story patterns** — dual first-person his/hers versions, similar length,
  2–3 paragraphs, conversational, no inside jokes (zola.com/expert-advice/5-creative-wedding-website-about-us-examples).
- **Motion** — Awwwards SOTD wedding site (Veley/Ross) used WebGL, parallax,
  page transitions, infinite photo canvas; category winners skew scroll-
  storytelling + microinteractions (awwwards.com/websites/wedding/).
- **Audio** — no major checklist recommends site-wide background music
  (absence notable); Indian video invites lean on music inside WhatsApp
  (riwaaz.in/blog/wedding-invitation-trends-india-2025-2026). → our call:
  music off by default, sting + toggle only.
- **RSVP UX** — one submission per party/family; deadline prominent; fun
  custom questions (song requests, memories) (zola.com/expert-advice/how-to-create-a-wedding-rsvp-website; Joy checklist).
- **Indian online invite culture** — WhatsApp-first MP4/links; multi-event
  schedule as organizing principle; caricature couple portraits mainstream;
  bilingual Devanagari+Latin type as design element; witty hashtags a genre
  (riwaaz.in; einvits.com/blog/wedding-e-invite-design-trends-2026-whats-trending-for-indian-weddings; wedmegood.com).
- Under-evidenced (not load-bearing): konami-code eggs, envelope-open
  transitions — adopted as original ideas, not "best practice" claims.

## Appendix B — Sync contract

A new capability adds a Capability Map row (§1) wired to its section; a new
state field goes into `store.js` AND `sanitizeState()` AND (if synced) §8.4
doc shape + rules bounds; a new egg gets a registry row (§8.5) with an owner
surface; a new story beat updates §8.6 AND `story.html` AND (if in-game)
`levels.js` postcards.

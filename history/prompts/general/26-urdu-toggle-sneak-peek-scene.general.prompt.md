---
id: 26
title: Add Urdu toggle for sneak peek scene
stage: general
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: sneak-peek
branch: n/a
user: missa
command: general
labels: ["sanity", "sneak-peek", "urdu", "rtl", "font", "novelparent", "pdf"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/sanity/schemaTypes/novelparent.ts
  - src/sanity/schemaTypes/pdf.ts
  - src/app/novel/[slug]/page.tsx
  - src/app/short-stories/[slug]/page.tsx
  - src/app/pdf/[slug]/page.tsx
  - src/app/download/[slug]/page.tsx
  - src/app/components/novelPage/SneakPeeks.tsx
  - src/app/components/NovelSpotlight.tsx
tests:
  - npx tsc --noEmit -> EXIT 0
  - GET /novel/mein-tehra-raha -> 200
  - GET /pdf/keh-do-mujhay-jo-piya-free-pdf -> 200
  - GET /studio -> 200
---

## Prompt

Acha har novel ka jo sneak peek hey woh urdu mein hoga, to us feild pr ek toggle lgaa do kay urdu side chlaa jaye or urdu ka font use ho..

## Response snapshot

Sneak-peek scenes are in Urdu, so added a per-peek toggle that switches the scene text to the RTL Urdu side using the existing Nastaliq Urdu font.

Schema (both content types):
- `novelparent.ts` and `pdf.ts`: inside the `sneakPeeks[]` object, added a boolean `sceneIsUrdu` ("Scene is in Urdu (RTL + Urdu font)") right after the `scene` field, default false.

Data projections (added `sceneIsUrdu` to `sneakPeeks[]{...}`):
- `src/app/novel/[slug]/page.tsx`
- `src/app/short-stories/[slug]/page.tsx`
- `src/app/pdf/[slug]/page.tsx`
- `src/app/download/[slug]/page.tsx` (spotlight query)

Rendering:
- `src/app/components/novelPage/SneakPeeks.tsx`: added `sceneIsUrdu?` to the type; the grid card scene and the lightbox/modal scene now set `dir="rtl"` and add the `font-urdu` class when the toggle is on (card keeps `text-start`; modal uses `text-right` instead of `text-center`).
- `src/app/components/NovelSpotlight.tsx`: added `sceneIsUrdu?` to the `Peek` type; computed `excerptIsUrdu = Boolean(peek?.scene && peek.sceneIsUrdu)` so the Urdu styling applies only when the excerpt actually comes from the scene (not when it falls back to the English `shortdescription`); excerpt `<p>` gets `dir="rtl"` + `font-urdu text-right` when on.

Notes:
- The existing `.font-urdu` CSS class already sets `font-family: var(--font-urdu), serif` AND `direction: rtl` (globals.css), so applying it covers both the Urdu font and the RTL side. `dir` is also set explicitly for clarity.
- Toggle applies to the `scene` text only (not `caption` / `chapterReference`).

Verification: tsc EXIT 0; `/novel/<slug>`, `/pdf/<slug>`, `/studio` all 200. No new runtime errors in the dev log (only pre-existing image-quality warnings).

## Outcome

- ✅ Impact: Editors can mark any sneak-peek scene as Urdu; it then renders RTL with the Nastaliq Urdu font on novel, short-story, PDF detail pages and the download-page spotlight — consistent with existing `descriptionlanguage` / `authornotelang` behaviour.
- 🧪 Tests: tsc PASS; targeted routes 200.
- 📁 Files: 2 schemas, 4 query projections, SneakPeeks.tsx, NovelSpotlight.tsx.
- 🔁 Next prompts: none required; existing sneak peeks stay LTR until an editor turns the toggle on.
- 🧠 Reflection: reuse the established `font-urdu` + `dir` pattern rather than inventing a new style hook, and guard the spotlight excerpt so the Urdu font never applies to the English fallback description.

## Evaluation notes (flywheel)

- Failure modes observed: in `NovelSpotlight` the excerpt falls back to `shortdescription`; naively keying the font off the toggle would have styled the English fallback as Urdu. Guarded with `Boolean(peek?.scene && peek.sceneIsUrdu)`.
- Graders run and results (PASS/FAIL): tsc PASS; HTTP checks PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): set `sceneIsUrdu` on one peek in Studio and confirm the RTL + Nastaliq rendering in the SneakPeeks card and lightbox.

---
id: 82
title: Hero Background Image More Visible
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [homepage, hero, slider, background-visibility, constitution-s12]
links:
  spec: docs/constitution.md (section 12)
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/AuthorHero.tsx (modified)
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - npm run build ("Compiled successfully in 76s")
  - SSR /: bg opacity-90, gradient from-95 via-80 to-40, no background blur, 1 <h1>
---

## Prompt

background image achay sy visible nahi hey.. opacity set kro kay background image visible ho

## Change (`src/app/components/AuthorHero.tsx`)

The hero backdrop cover was still washed out by the overlay. Adjusted:
- Backdrop image `opacity-40 blur-sm` → **`opacity-90`**, no blur (fully sharp, near-full opacity).
- Overlay gradient `from-brand-deep via-brand-deep/85 to-brand-deep/55` → **`from-brand-deep/95 via-brand-deep/80 to-brand-deep/40`** — keeps the text column dark enough for contrast while the right side shows the cover almost unobstructed.

## Checks — actual results
- `tsc --noEmit`: **pass** (exit 0).
- `npm run build`: **pass** — "Compiled successfully in 76s".
- SSR `/`: background `opacity-90`, gradient present, background blur removed (only an unrelated `backdrop-blur-sm` glass token remains), exactly 1 `<h1>`.

## Notes
- Text readability preserved via the left-dark gradient; palette/CTAs/dedup unchanged.
- Verified via rendered markup/classes, not a pixel screenshot.

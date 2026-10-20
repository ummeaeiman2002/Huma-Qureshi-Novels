---
id: 81
title: Hero Landscape Cover And Visible Background
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [homepage, hero, slider, landscape-cover, background, constitution-s12]
links:
  spec: docs/constitution.md (section 12)
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/AuthorHero.tsx (modified)
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - npm run build ("Compiled successfully in 64s")
  - SSR /: card aspect-video present, old aspect-[3/4] removed, bg opacity-40 blur-sm, 1 <h1>
---

## Prompt

hero section ki novel image card size landscape mein kro or background mein bhi put kro takey proper visisble ho.....card image ko landscepe kro

## Changes (`src/app/components/AuthorHero.tsx`)

1. **Hero book cover card → landscape**
   - Changed the card image wrapper from `aspect-[3/4]` (portrait) to `aspect-video` (16:9 landscape), matching the existing `Novel` card style used elsewhere on the site.
   - Card now spans `w-full max-w-md` (wider) instead of fixed `w-52/w-60/w-72`.
   - Updated the grid to `lg:grid-cols-[1.1fr_1fr]` so the wider landscape cover gets more room.
   - Updated the `next/image` `sizes` to `(max-width: 1024px) 90vw, 520px`.

2. **Background cover now clearly visible**
   - Backdrop image changed from `opacity-25 blur-2xl` (nearly invisible) to `opacity-40 blur-sm` so the real cover is properly visible.
   - Replaced the flat `bg-brand-deep/80` veil with a directional gradient `from-brand-deep via-brand-deep/85 to-brand-deep/55` — darker on the text side for readability, lighter on the image side so the background shows through.

## Checks — actual results
- `tsc --noEmit`: **pass** (exit 0).
- `npm run build`: **pass** — "Compiled successfully in 64s".
- SSR `/`: card `aspect-video` present, old `aspect-[3/4]` gone, background `opacity-40 blur-sm` + new gradient present, exactly 1 `<h1>`, carousel intact.

## Notes
- Palette, copy, CTAs, dedup logic, and other homepage sections unchanged.
- Visual result verified via rendered markup/classes, not a pixel screenshot.

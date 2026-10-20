---
id: 84
title: Homepage Website Summary Section With Portrait Images
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [homepage, site-summary, sanity-schema, portrait-images, bilingual, siteSettings]
links:
  spec: docs/constitution.md
  ticket: null
  adr: null
  pr: null
files:
 - src/sanity/schemaTypes/siteSettings.ts (modified)
 - src/lib/sanity/siteSettings.ts (modified)
 - src/app/page.tsx (modified)
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - npm run build ("Compiled successfully in 54s")
  - SSR /: summary section id, eyebrow, EN title/text, UR title/text (dir=rtl x2), Featured + Latest Episodes intact
---

## Prompt

homepage pr website summary add krdo..with potrait size pics...width 2500 and height is 3000.....also add feild in sanity... but push mat karna jab tak mein na kahun

## Clarifications (question tool)
- Content source: **new Sanity field + images** (edited in Studio).
- Images: **uploaded to Sanity** image assets (not URL strings).
- Layout: **2–3 portrait images in a row**.
- Language: **English + Urdu fields**.

## Changes

### 1. Sanity schema — `src/sanity/schemaTypes/siteSettings.ts`
Added fields to the `siteSettings` singleton:
- `summaryEyebrow` (string) — small section label.
- `summaryTitle` / `summaryText` (string/text, EN).
- `summaryTitleUrdu` / `summaryTextUrdu` (string/text, UR).
- `summaryImages` — array of `image` (hotspot), each with an optional `alt` field; **validated `Rule.max(3)`**, description recommends **2500 x 3000 px (5:6)**.

### 2. Data loader — `src/lib/sanity/siteSettings.ts`
Added `SiteSummary` / `SiteSummaryImage` types, `EMPTY_SITE_SUMMARY`, a `SITE_SUMMARY_QUERY` (projects `summaryImages[].asset->url` + `alt`), and `getSiteSummary()` (cached, `revalidate: 300`, tag `siteSettings`, safely slices to 3 images, try/catch → empty). Left the existing `getSiteSettings` / `SiteImages` path untouched.

### 3. Homepage — `src/app/page.tsx`
- Imported `getSiteSummary`, fetched `summary` in `HomePage`.
- Added a **“Website Summary” section** between the hero and Featured Novels: cream band, left column = eyebrow + EN title + EN paragraphs (split on blank lines) + optional Urdu title/text in `font-urdu` with `dir="rtl" lang="ur"` + an “Explore My Novels” button; right column = **2–3 portrait images** (`aspect-[5/6]`, `object-cover`, gold ring on hover). Section auto-hides when no summary data exists.

### 4. Sanity content seeded (studio-editable, genuine copy)
Created the `siteSettings` doc and set the summary English + Urdu text (drawn from the existing About copy — no fabricated claims). **Portrait images left empty** for you to upload in Studio (recommended 2500x3000).

## Bug fixed during the task
After seeding, the homepage still did not show the section because **Next's on-disk fetch cache (`.next/cache`) had stored the earlier empty result** for the summary query (the doc did not exist at first fetch). Restarting the dev server was not enough; clearing `.next/cache` made it render. (This is a dev-cache artifact, not a production concern — `revalidate: 300` refreshes it.)

## Checks — actual results
- `tsc --noEmit`: **pass** (exit 0).
- `npm run build`: **pass** — "Compiled successfully in 54s".
- SSR `/`: `id="summary"` present; eyebrow, EN title, EN text, UR title, UR text all present; `dir="rtl"` x2; Featured Novels + Latest Episodes still intact; page ~294KB.

## Notes / next
- **Not pushed** (per instruction — waiting for go-ahead).
- To finish: upload 1–3 portrait images (2500x3000) to the `siteSettings` → “Summary — Portrait Images” field in Studio; layout handles 1, 2 or 3.
- First image is rendered larger when exactly 3 images are supplied (spanning 2 cells).

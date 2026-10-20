---
id: 74
title: Remove Hero Slider and Dedupe Home Listings
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [homepage, dedupe, hero-slider, adsense, ux]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/page.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - npm run build ("Compiled successfully in 77s")
  - SSR home audit: 11 cards, 11 unique, 0 duplicate titles
  - hero slider markup gone ("Previous slide" absent), 1 visible h1
---

## Prompt

ok home page ko is trhan kro pehlay...2. The same novels appear repeatedly

Some books appear in the trending, featured, latest uploads and other listing sections. This makes the homepage longer without necessarily adding new value.

Fix: Keep one main featured section, one latest uploads section and one latest episodes section. Remove any redundant section that displays substantially the same books.

## Context

The library only holds ~12 published novels, so hero (5 covers), Featured (6) and Latest Uploads (8) were all drawing from the same pool — the same titles appeared 2-3 times and the homepage was unnecessarily long.

## Change (`src/app/page.tsx`)

- Removed the `HeroSlider` section entirely (and its import); the slider only re-showed the newest novels already listed below.
- Made the "About the Library" block the first section and its heading the single visible `<h1>` (`id="welcome-heading"`, same measured copy, AdSense-safe word count preserved).
- `featuredNovels` = top 6 by `totalViews` (no slices duplicated downstream).
- `latest` = newest novels + PDFs **with featured IDs filtered out**, still respecting the genre/type filters, capped at 8.
- Kept: Featured Novels + Latest Episodes aside, Explore by Genre, Browse Novels & PDFs / Latest Uploads. Removed only the redundant hero listing.

## Outcome

- Homepage = About/h1 → Featured Novels (6) + Latest Episodes → Explore by Genre → Latest Uploads (5) = 11 cards, zero repeated titles.
- No hero markup ("Previous slide" absent), exactly 1 h1; featured/latest/episodes/genres sections all present.
- tsc exit 0; production build compiled successfully.

## Follow-ups
- Latest Uploads is shorter now (only titles not already featured) — expected with a 12-book library; it grows with new uploads.
- `HeroSlider.tsx` remains in the repo unused; can be deleted later or reused on another page.

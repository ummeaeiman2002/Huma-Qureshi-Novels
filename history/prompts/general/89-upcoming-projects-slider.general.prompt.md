---
id: 89
title: Upcoming Projects Premium Slider Section
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [homepage, slider, sanity, schema, upcoming, coming-soon, humaqureshinovels]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/sanity/schemaTypes/upcomingProject.ts (new)
 - src/sanity/schemaTypes/index.ts (register type)
 - src/app/components/UpcomingProjects.tsx (new)
 - src/app/page.tsx (query + section)
tests:
 - node node_modules/typescript/bin/tsc --noEmit (exit 0)
 - npm run build (✓ compiled successfully, 19 static pages)
 - curl home / (200)
 - home HTML: Upcoming hidden (0 docs), Featured/Latest Episodes/Genre still render
---

## Prompt

Continue if you have next steps, or stop and ask for clarification if you are unsure how to proceed.

## Context / Approval

Before implementing, per user requirement, I (1) inspected the current homepage for live colors/typography/components/layout, (2) inspected existing Sanity schemas, and (3) explained the proposed implementation + schema changes and **awaited approval**. User confirmed via question tool:
- **Schema:** new `upcomingProject` document type (isolated; existing schema untouched).
- **Cover ratio:** 5:6 portrait (2500x3000 source).
- **Autoplay:** on.

## Implementation

### New Sanity schema — `src/sanity/schemaTypes/upcomingProject.ts`
Fields: `title` (req), `slug`, `coverImage` (image, hotspot, alt — 2500x3000 / 5:6), `genre` (ref → genre), `teaser`, `teaserUrdu`, `releaseNote`, `order`, `featured`. Orderings + preview added. Registered in `schemaTypes/index.ts`. **No existing schema or page modified.**

### New client slider — `src/app/components/UpcomingProjects.tsx`
Reuses only existing design tokens (brand/brand-deep/gold/gold-dark/line/surface/cream/muted) and the AuthorHero slider behaviour:
- Portrait `aspect-[5/6]` cover with "Coming Soon" badge (`rounded-full border border-gold/30 bg-brand-deep/75 text-gold`), gold hairline, `brand-deep` fallback with `hero-pattern`.
- Title (`font-display`), genre pill (gold/10 pattern), teaser (`line-clamp-5`), optional Urdu teaser (`font-urdu`, rtl), `releaseNote` pill (`bg-brand text-white`).
- Arrows + dots (`role="tab"`/`aria-selected`), `aria-roledescription="carousel"`, autoplay 8s paused on hover/focus, `prefers-reduced-motion` respected, **touch swipe** (40px threshold).
- Returns `null` when empty → never renders an empty section.

### Homepage wiring — `src/app/page.tsx`
- Imports component; GROQ adds `"upcomingProjects": *[_type == "upcomingProject"] | order(order asc, _createdAt desc){ _id, title, teaser, teaserUrdu, releaseNote, "cover": coverImage.asset->url, "coverAlt": coverImage.alt, genre->{genrename} }`.
- Maps to typed props; renders `<section id="upcoming">` with `SectionHeading` after Latest Episodes, before Genre. Section hidden when no docs.

## Checks
- `tsc --noEmit` exit 0; `npm run build` ✓ compiled successfully.
- Home `/` → 200. With 0 `upcomingProject` docs: `Upcoming Projects` absent; `Featured Novels`, `Latest Episodes`, `Explore by Genre` all still render → existing sections/data preserved.
- No new colors/palettes introduced (no emerald); reuses existing cream/gold that were already live.

## Follow-ups
1. User must add `upcomingProject` docs in Studio (upload 2500x3000 covers) for the slider to appear.
2. Nothing committed/pushed yet — awaiting user go-ahead.
3. `npm run lint` remains broken repo-wide (Next 16 removed `next lint`) — unrelated pre-existing failure.

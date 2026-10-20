---
id: 75
title: Improve Novel Page Structure for AdSense Readiness
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [novel-page, adsense, filters, search, cards, accessibility, sanity]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/novel/page.tsx
 - src/app/novel/NovelPageClient.tsx
 - src/app/components/NovelFilters.tsx
 - src/app/components/Cards/Novel.tsx
 - src/app/components/Cards/PDF.tsx
 - src/lib/sanity/queries.ts
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - npm run build ("Compiled successfully in 78s"; route ○ /novel 5m)
  - SSR /novel: 18 cards, h1 "All Urdu Novels by Huma Qureshi", 18 Read links + 6 PDF links all valid
  - Live search: ?q=keh+do -> 1 card, ?q=zabardast -> 0, ?q=short+story -> 3
  - detail links /privacypolicy /terms /about /contact / /novel + 2 detail pages all 200
---

## Prompt

# Task: Improve the `/novel` Page Structure for AdSense Readiness
(full spec: heading "All Urdu Novels by Huma Qureshi", given intro, browse/filter section, detail-rich cards, pagination/load-more, short closing intro, footer/nav preservation, AdSense content-quality, technical + validation requirements)

## Data audit (Sanity, live)

- 12 published `novelparent`, 6 published `pdf`.
- `novelstatus` is empty on every novel (cannot show Completed/Ongoing).
- 7 of 12 novels have the real `isShortStory` flag = true.
- 4 of 7 genres have zero items; real genres with items = Romance 12, Thriller 3, Cultural Fiction 3.
- All novels/PDFs have a full `noveldescription`; every card summary comes from `textSummary()`.
- Real `episodeCount` available (1–50); 14 items have a YouTube URL.

## Changes

**`src/lib/sanity/queries.ts`** — the `getPaginatedNovels` projection now returns `novelstatus` and `isShortStory`; each novel gets `episodeCount` (count of its episode docs).

**`src/app/novel/page.tsx`** — title/metadata use "All Urdu Novels by Huma Qureshi" + the supplied introduction; data sorted by real release date (`date`); passes only `initialNovels` + `genres` (dropped fabricated-free `writers`/`totalNovelCount`).

**`src/app/components/NovelFilters.tsx`** (new) — search-by-title input (aria-labelled, live), Content type select with real counts (Episodic / Complete PDF / Short story / Audio), Sort by (Newest / Oldest / Title A–Z), YouTube-only toggle, genre chips with per-genre counts, `aria-live` "Showing X of Y" + Reset Filters. Built only on existing tokens/components (no new deps).

**`src/app/novel/NovelPageClient.tsx`** — rewritten: one `<h1>` PageHero using the required heading + intro and real highlight stats (Novels & Stories / PDF Books / Genres / On YouTube); live client-side filtering + sorting over all items (Rec fehrist, filters work together, no duplicates); URL sync via `replaceState` (`q`,`type`,`genre`,`yt`,`sort`); typed empty state with reset; genre-count-aware sidebar; and a ~75-word closing section. Removed the redundant "What Are Episodic Urdu Novels", "Why Read Online", "How to Read", YouTube and FAQ sections.

**`Cards/Novel.tsx`** — removed the fabricated per-book fallback summary; summary now renders only from real Sanity text. Added **Episodes** and **Language** rows, optional status pill, CTA now "Read Novel". Alt text `${title} cover` retained.

**`Cards/PDF.tsx`** — same fallback removal; added **Pages**/**Language** rows.

## Acceptance checks
- [x] Accurate counts (18 = 12 novels + 6 PDFs), no duplicates (12 Read + 6 PDF links). 
- [x] Search/filters/sort combine correctly; result count updates.
- [x] Clear empty state + Reset Filters.
- [x] Every Read link → correct detail page (all 200).
- [x] No fabricated titles/summaries/statuses/social proof.
- [x] Footer/header + Privacy/Terms/About/Contact links preserved.
- [x] Bilingual LanguageToggle untouched.

## Follow-ups / risks
- No pagination implemented — only 18 items; the grid renders all, crawlable server-side (not hidden behind JS).
- `getAllNovels`/`getAllPDFs` still fetch limit 1000 (fine at this size; revisit when the library grows).
- `novelstatus` stays empty until filled in Sanity; cards omit the pill when unset (no invented status).

## Issue needing manual verification
- `npm run lint` fails in this repo for an unrelated reason (`next lint` is removed in Next 16): `Invalid project directory ... \lint`. Type-check and production build both pass.

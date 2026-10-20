---
id: 78
title: Restructure Homepage Remove Redundant Sections
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [homepage, dedupe, adsense, sanity, latest-episodes, featured]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/page.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - npm run build ("Compiled successfully in 73s"; route ○ /)
  - SSR home: 10 cards, 10 unique, 0 duplicate titles
  - 15 detail links (novel/pdf/episode) all 200
  - section order: About the Library -> Featured Novels -> Latest Uploads -> Latest Episodes -> Explore by Genre
---

## Prompt

# Task: Improve the Homepage Structure of Huma Qureshi Novels
(full spec: remove repeated novel sections, keep Featured/Latest Uploads/Latest Episodes, reduce generic explanatory text, keep one short intro + optional 3-step instructions, preserve design/Sanity, validate)

## Data audit (live Sanity)

- 12 published novels, 6 published PDFs.
- **`featured == true` is set on 0 documents**; **`trending` is true on only 2 PDFs** (no novels).
- `episodeCount` per novel is real (1–50); 157 episodes have an `episodereleasedate` (2 undated).
- The newest 18 episodes all belong to **one** novel ("Haraa Junoon"), so ordering by date alone returned a single-novel list.

## Changes (`src/app/page.tsx` only)

**Removed / consolidated**
- Dropped the two generic "About the Library" paragraphs and the "Read Urdu Novels Online, Free — Chapter by Chapter" heading; replaced with the concise supplied introduction (one paragraph) and heading "Read Urdu Novels by Huma Qureshi Online". Stats panel kept.
- Removed the whole "Browse Novels & PDFs" section (its `HomeFilter` + result counter + nested "Latest Uploads") — it duplicated the Latest list and is already served by `/novel`.
- No Trending/Popular/New Releases sections were added (no real data supports them).

**Retained / improved**
- **Featured Novels** — now 4 books (was 6). Uses `featured == true` when any exist; otherwise a deterministic fallback to the most-viewed published novels. Never labels the whole catalogue as featured.
- **Latest Uploads** — promoted to its own section; items sorted by real publication date (`novelreleasedate` / `pdfreleasedate`), **excluding featured IDs** (overlap only if fewer than 4 distinct items remain).
- **Latest Episodes** — now one card per novel (newest episode), so the list spans 5 different novels instead of 8 chapters of one; each card shows episode name, date, parent novel and a correct episode link.
- **Explore by Genre** — kept (distinct navigation); moved into a small async `GenreSection` component.

## Acceptance checks
- [x] Home has exactly one Featured Novels, one Latest Uploads, one Latest Episodes.
- [x] 10 cards, 10 unique — zero duplicate titles across sections.
- [x] Featured = 4, Latest Uploads = 6, Latest Episodes = 5 (5 distinct novels).
- [x] All 15 rendered detail/episode links return 200.
- [x] Generic repeated SEO text removed; section order matches the spec.
- [x] Header, footer, language switcher, palette, fonts untouched; tsc + build pass.

## Follow-ups / risks
- Featured currently falls back to most-viewed because no document has `featured == true`; the author can curate by ticking that field in Sanity.
- Latest Episodes fetches all matching episodes then de-dupes in JS (157 rows — cheap); revisit if the catalogue grows substantially.
- `src/app/components/HomeFilter.tsx` is now unused by the homepage but left in place (no breakage); can be deleted later.

## Issue needing manual verification
- `npm run lint` cannot run in this repo (Next 16 removed `next lint`): `Invalid project directory ... \lint`. Type-check and production build both succeed.

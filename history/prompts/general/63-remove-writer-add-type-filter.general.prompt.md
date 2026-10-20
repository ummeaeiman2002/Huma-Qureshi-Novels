---
id: 63
title: Remove Writer Filter, Add Type Filter
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [filters, ui, ux, home, all-novels]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/HomeFilter.tsx
 - src/app/novel/NovelPageClient.tsx
 - src/app/page.tsx
 - src/app/components/RelatedContent.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - / ?type=PDF -> "Showing 4 results · PDF"; ?type=Episodic -> 8; ?type=Audio Books -> 8
  - / and /novel render Type dropdown (Episodic/PDF/Audio Books); no Writer, no "Sort By", no "YouTube Novels" toggle
  - npm run build (compiled successfully, 18/18 pages)
---

## Prompt

filters mein.. writer tu just ek hi hey web pr s.. writer ka filter nahi hona chahiye..sort by mein...episodic, PDF or Audio books hona chahiye na kay popula or trending waghaira..

## Response

Removed the Writer filter (only one writer exists) and replaced the "Sort By" dropdown with a **Type** filter on both the Home browse and `/novel` listings.

- Options: **Episodic** (novelparent cards), **PDF** (pdf cards), **Audio Books** (items with a YouTube audio link).
- Dropped the standalone **YouTube Novels** toggle — its behaviour is now the "Audio Books" type.
- Dropped Latest/Trending/Popular sorting; both listings keep newest-first ordering.
- URL param changed to `type` (`/?type=PDF`, `/?type=Audio%20Books`); `writer`/`sort`/`yt` params no longer read.
- Active-filters chips updated to show Type + Genres (Writer/Sort/Source chips removed).

## Outcome

- tsc exit 0; `npm run build` compiled successfully (18/18 pages).
- Verified on the dev server: `/?type=PDF` → "Showing 4 results · PDF"; `/?type=Episodic` → 8; `/?type=Audio Books` → 8; chip row renders with a removable "Type" pill. `/`, `/novel`, `/about`, `/contact`, `/privacypolicy`, `/writer/huma-qureshi` all 200.
- `RelatedContent.tsx` writer pills (only rendered with >1 writer, so inert) now link to `/novel` instead of a dead `?writer=` param.

## Outcome notes
- `/novel` client-side type filter applies to `_kind` (`novel`/`pdf`) and `youtubeurl` presence; genre pre-apply via `?genre=` still works.
- StatsBar on `/novel` still shows the Writers count (single writer) — no UI filter.
- Dead `getShortStories()`/`getWriterNames`-style helpers untouched (minimal diff).

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): show the current selection inline in the Type dropdown label (e.g. "Type: Audio Books") or count-per-option in the dropdown.

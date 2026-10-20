---
id: 76
title: Show All Novels Including Undated One
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [novel-page, completeness, sanity, graceful-degradation, empty-state]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/lib/sanity/queries.ts
 - src/app/components/Cards/Novel.tsx
 - src/app/novel/NovelPageClient.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - npm run build ("Compiled successfully in 56s")
  - /novel: 13 novel cards + 6 PDF cards = 19
  - ?q=tehra / ?q=kahan -> 1 card; ?q=zzzznotfound -> empty message
  - /novel/mein-tehra-raha link present, letter placeholder rendered
---

## Prompt

no..All novels page means all novels on website show here

## Root cause

An audit of Sanity found **13 `novelparent` documents** but only 12 rendered on `/novel`. The missing one — **"MEIN TEHRA RAHA"** — has **no `novelreleasedate`**, so the query's `defined(novelreleasedate)` predicate excluded it. (The doc is otherwise empty: no description, banner, genre reference value, or episodes; its detail page is already `noindex`.)

## Change

**`src/lib/sanity/queries.ts`** — `getPaginatedNovels` and `getPaginatedPDFs` now include items with no release date (condition changed to `(!defined(novelreleasedate) || novelreleasedate <= now())`, same for PDFs). Undated items remain sorted by `_createdAt desc`.

**`src/app/components/Cards/Novel.tsx`** — when a novel has no banner, the card now renders a graceful branded placeholder (dark panel with the title's initial and the same gold hairline) instead of collapsing to a text-only block. Real covers are unchanged.

**`src/app/novel/NovelPageClient.tsx`** — no logic change needed; `buildCard` already falls back to `_createdAt` for ordering and omits the date chip when there is no release date.

## Acceptance checks
- [x] `/novel` lists all 13 novels + 6 PDFs (19 cards); earlier it showed 18.
- [x] Undated "MEIN TEHRA RAHA" appears, searchable (?q=tehra → 1), with a valid `/novel/mein-tehra-raha` link.
- [x] Empty state and filters still work; tsc + build pass.

## Follow-ups / risks
- The card for the empty doc legitimately shows only title / genre / writer — it has no real summary, cover, date or episodes. It will look complete once the document is filled in Sanity.
- Home page (`/`) is unaffected — its own queries still filter by release date; it continues to show only dated novels.

## Issue needing manual verification
- Confirm the author wants this empty document visible at all, or fill/delete it in Sanity. It is a real published record so it is shown, per the "all novels" requirement.

---
id: 73
title: Confirm Old Pages Removed and Purge Dead Code
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [cleanup, dead-code, short-stories, bookmarks, pdf-library, verification]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/lib/sanity/queries.ts
 - src/lib/sanity/cache.ts
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - / /novel /pdf/<slug> all 200
  - grep short-stories|bookmarks|getShortStories across src -> 0 route/file references
  - sitemap: 0 short-stories, 0 bare /pdf index, 0 bookmarks URLs (190 remaining URLs all 200)
---

## Prompt

old paes, like short stories, pdf library , book marks pages complt dlt ?

## Verification

- **Short Stories**: `src/app/short-stories/` (page, client, `[slug]`) fully deleted in commit `7bbba0c`; no links, no sitemap entries.
- **Bookmarks**: `src/app/bookmarks/` + `BookmarkButton.tsx` fully deleted; zero references anywhere.
- **PDF library index**: `src/app/pdf/page.tsx` + `PDFPageClient.tsx` deleted (PDFs live in `/novel` with the Type filter). **`/pdf/[slug]` detail pages intentionally kept** — 6 in the sitemap, all 200, and they are the target of card links and the search dropdown (`Search.tsx:64`).

## Change

Removed the dead code left behind by the Short Stories removal:
- `src/lib/sanity/queries.ts`: deleted unused `getShortStories()` (only self-referenced).
- `src/lib/sanity/cache.ts`: deleted `getShortStories`/`setShortStories` cache methods, the `shortStoriesCache` variable and its line in `clear()`.

## Outcome

- tsc exit 0; `/`, `/novel`, `/pdf/<slug>` all 200; grep for `getShortStories|setShortStories|shortStoriesCache` → 0 hits.

## Outcome notes
- Sanity still holds the short-story documents as `novelparent` items with `isShortStory` — they simply surface in the normal `/novel` listing now, which is intended.
- `/pdf/[slug]` must stay: deleting it would break every PDF card and search result.

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): none needed — old pages confirmed gone.

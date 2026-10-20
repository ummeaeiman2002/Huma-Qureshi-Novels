---
id: 57
title: Remove Short Stories Page And Links
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [cleanup, routing, sitemap, navigation, seo]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/short-stories/page.tsx
 - src/app/short-stories/ShortStoriesClient.tsx
 - src/app/short-stories/[slug]/page.tsx
 - src/app/components/PageHero.tsx
 - src/app/writer/[slug]/page.tsx
 - src/app/sitemap.ts
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0, after clearing stale .next generated types)
  - /short-stories -> 404, /short-stories/foo -> 404, /novel -> 200, /about -> 200
  - /privacypolicy no longer contains a "short-stories" link
---

## Prompt

check footer, remove useless/pointless ones

[Clarification answer] Remove page + its links

## Response

Removed the orphaned `/short-stories` route and every reference to it:

- Deleted the route directory `src/app/short-stories/` (`page.tsx`, `ShortStoriesClient.tsx`, `[slug]/page.tsx`).
- `src/app/components/PageHero.tsx`: dropped "Short Stories" from `DEFAULT_LINKS` (this removed it from the Privacy, Terms and 404 heroes).
- `src/app/writer/[slug]/page.tsx`: removed `hrefBase="/short-stories"` from the "Stories by" cards so they default to `/novel/<slug>` (the novel detail query does not filter `isShortStory`, so short-story records still render via the novel template).
- `src/app/sitemap.ts`: removed `/short-stories` from the static page list.
- Cleared stale `.next/dev/types` and `.next/types` so `tsc` no longer read generated types for the deleted route.

## Outcome

- tsc exit 0.
- `/short-stories` and `/short-stories/foo` now return 404; `/novel` and `/about` still 200.
- Privacy page no longer emits any `short-stories` link.

## Outcome notes
- `getShortStories()` in `src/lib/sanity/queries.ts` (and `NovelCache.getShortStories` in `src/lib/sanity/cache.ts`) are now unused; left in place to keep the diff minimal. Safe to remove later if desired.
- Short-story novels remain reachable at `/novel/<slug>` because the novel detail query does not filter on `isShortStory`.

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): remove the dead `getShortStories` function and its cache method.

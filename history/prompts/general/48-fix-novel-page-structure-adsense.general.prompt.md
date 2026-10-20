---
id: 48
title: Fix Novel Page Structure and AdSense Issues
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [adsense, seo, accessibility, comments, moderation, markup, noindex]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/novel/NovelPageClient.tsx
 - src/app/short-stories/ShortStoriesClient.tsx
 - src/sanity/schemaTypes/comment.ts
 - src/app/actions/Comments.ts
 - src/app/novel/[slug]/page.tsx
 - src/app/novel/[slug]/NovelPageClient.tsx
 - src/app/novel/[slug]/[episodeslug]/page.tsx
 - src/app/novel/[slug]/[episodeslug]/EpisodePageClient.tsx
 - src/app/pdf/[slug]/page.tsx
 - src/app/pdf/[slug]/PDFComments.tsx
 - src/app/short-stories/[slug]/page.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - curl /novel /short-stories /novel/mein-tehra-raha /pdf/keh-do-mujhay-jo-piya-free-pdf : 200
  - curl /novel/haraa-junoon-long-episodic-novel/last-episode : 200
  - /novel HTML has no <ul> wrapping <article> cards
  - /novel/haraa-junoon-long-episodic-novel robots=index,follow; /novel/mein-tehra-raha (empty) robots=noindex, follow
---

## Prompt

adce will be automated.. it will shown by own.. oetherwise fix others errors

(Context: user confirmed AdSense Auto Ads will handle ad serving, so skip ad-unit work and fix the other issues found in the AdSense/structure review.)

## Response

Fixed the non-ad issues found in the review:

1. **Invalid list markup** — the `/novel` and `/short-stories` grids rendered `<article>` cards inside a `<ul>`. Changed both wrappers to `<div>` (valid HTML + better accessibility).
2. **Comment moderation (UGC):** added an `approved` boolean to the `comment` schema (default false, editor-facing description); `addCommentAction` now writes `approved: false`; all four comment projections (`novel/[slug]`, `[episodeslug]`, `pdf/[slug]`, `short-stories/[slug]`) now use a reverse lookup `*[_type == "comment" && references(^._id) && approved != false] | order(_createdAt asc)`, so only approved comments render and pre-existing comments (no field) stay visible. The three submit handlers (novel, episode, PDF) no longer append optimistically and now confirm "submitted and will appear after review".
3. Thin-page protection — `generateMetadata` for `/novel/[slug]` now counts episodes and checks for body copy (description/about/storyintro/tagline); pages with neither render `robots: noindex, follow`.
4. Removed the empty leftover `<div>` in the PDF detail hero.

## Outcome

- Listing markup is valid; comment UGC is now moderated by default; empty novel pages are kept out of the index while content-rich pages stay indexable.
- Verified: tsc 0; key routes 200 (incl. episode + PDF detail exercising the new GROQ); `/novel/haraa-junoon-long-episodic-novel` = index, `/novel/mein-tehra-raha` (no description, no episodes) = noindex.
- Auto Ads handled separately by the user, so no `<ins>` slots added.

## Outcome notes
- Editors must toggle "Approved" in Sanity Studio for user comments to display going forward.
- `?page=` episode canonical (all point to page 1) left unchanged (client-side paging, low priority).

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): add a Studio "Pending comments" list/desk structure to make approval one-click.

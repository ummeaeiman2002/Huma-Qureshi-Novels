---
id: 22
title: Enrich low-content pages with novel suggestions
stage: green
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: content-enrichment
branch: n/a
user: missa
command: general
labels: ["content", "suggestions", "sneak-peek", "download-page", "about", "bookmarks", "seo"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/app/components/NovelSpotlight.tsx (new)
  - src/app/components/RelatedContent.tsx
  - src/app/download/[slug]/page.tsx
  - src/app/about/page.tsx
  - src/app/bookmarks/page.tsx
  - src/app/bookmarks/BookmarksClient.tsx (new)
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)
  - prod crawl -> /download shows sneak peek + novel/pdf suggestion grids; /about shows "Explore Urdu Novels"; /bookmarks shows "Popular Novels to Read"; no SSR errors

---

## Prompt

Actual PDF jahan sy download hota hey wahan sy us page ko check kro bht blank hey.. wahan novel suggestion waghira add kro...kisi novel ka sneak peek something like that. sb pages check kro jahan bhi content low lgy wahna novels suggestions add kro rich content bnao website ko.. structure clean or well up to date rakhna hey hamein.

## Response snapshot

Enriched low-content pages with novel/PDF suggestions and a sneak-peek teaser.

- New reusable `NovelSpotlight` component: shows a featured novel's sneak-peek scene + image, title, genre, author, and a "Read …" CTA.
- Made `RelatedContent`'s `heading` prop actually work (it was declared but ignored); default kept as "You May Also Like These Novels" so existing callers are unchanged.
- `/download/[slug]`: added a server-side suggestion fetch (latest 6 novels, 3 PDFs, plus a spotlight novel with sneak peeks), then rendered a "Sneak Peek from a Novel" spotlight and "More Urdu Novels to Download" / "More PDF Novels" grids. Page grew ~80KB → ~155KB, no SSR errors.
- `/about`: added an "Explore Urdu Novels by Huma Qureshi" suggestions block (server fetch + RelatedContent).
- `/bookmarks`: split into a server wrapper (`page.tsx`, fetches popular novels/PDFs) + client (`BookmarksClient.tsx`); the empty/loading state now shows "Popular Novels to Read" suggestions (renders in SSR too).

Audited all routes: home, novel/PDF detail, short-story detail (reuses NovelPageClient), listings and episode pages already carry rich content/suggestions — only the download page, about and bookmarks empty state were thin.

## Outcome

- ✅ Impact: Much richer, less "blank" pages; readers are always offered another novel/book; better internal linking and SEO content.
- 🧪 Tests: tsc PASS, build PASS (21/21), prod crawl PASS, no SSR errors.
- 📁 Files: 2 new components/files, 4 modified.
- 🔁 Next prompts: optionally add "More from this novel" suggestions to episode pages and writer page.
- 🧠 Reflection: reuse existing RelatedContent instead of building parallel grids; fix latent unused props rather than duplicating.

## Evaluation notes (flywheel)

- Failure modes observed: first spotlight GROQ filter (`count(sneakPeeks) > 0 || defined(shortdescription)`) matched nothing → spotlight hidden; relaxed to newest novel + description fallback via `cleanDescriptionLong`.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS, prod crawl PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): add episode-page suggestions using the same RelatedContent.

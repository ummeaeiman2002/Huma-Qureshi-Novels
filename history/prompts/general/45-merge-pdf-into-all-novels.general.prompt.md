---
id: 45
title: Merge PDF Library into Unified All Novels Page
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [novel, pdf, listing, redirect, seo, adsense, refactor]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/lib/sanity/queries.ts
 - src/app/novel/page.tsx
 - src/app/novel/NovelPageClient.tsx
 - src/app/components/Cards/PDF.tsx
 - next.config.ts
 - src/app/components/headerComponents/navLinks.ts
 - src/app/components/headerComponents/Footer.tsx
 - src/app/components/PageHero.tsx
 - src/app/components/HeroSlider.tsx
 - src/app/short-stories/ShortStoriesClient.tsx
 - src/app/download/[slug]/page.tsx
 - src/app/pdf/[slug]/page.tsx
 - src/app/sitemap.ts
deleted:
 - src/app/pdf/page.tsx
 - src/app/pdf/PDFPageClient.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - curl /novel : 200; contains "All Urdu Novels"; 15 /novel/ + 10 /pdf/ detail links
  - curl /pdf : 308 Permanent Redirect -> location /novel
  - curl /pdf/keh-do-mujhay-jo-piya-free-pdf : 200; back link "Back to All Novels"
  - curl /sitemap.xml : no static /pdf entry; 10 /pdf/ detail entries retained
  - /novel rendered HTML has no Pagination nav
---

## Prompt

Continue if you have next steps, or stop and ask for clarification if you are unsure how to proceed.

(Context carried over: merge the `/pdf` listing into a single "All Novels" page on `/novel` with no pagination, keeping `/pdf/<slug>` detail pages; part of the AdSense-friendly premium build.)

## Response

Unified the episodic-novel and PDF libraries into one "All Novels" page with no pagination:

- `src/lib/sanity/queries.ts`: added `getAllNovels()` and `getAllPDFs()` that delegate to `getPaginatedNovels/PDFs(0, 1000)` and tag each item with `_kind` ("novel"/"pdf") plus a normalized `date` field.
- `src/app/novel/page.tsx`: now fetches novels + PDFs + metadata in parallel, merges and sorts by `_createdAt` desc, and passes the combined array to the client (dropped `currentPage`/`totalPages`, wrapped client in `Suspense`).
- `src/app/novel/NovelPageClient.tsx`: renders mixed `Novel`/`PDF` cards by `_kind`; removed `Pagination`, `categoryParam`, and `paginationParams`; added `useSiteSettings()` for `defaultBanner` fallback; added `?writer=` pre-filter alongside `?genre=`; updated hero title to "All Urdu Novels", stats label, and breadcrumb.
- `src/app/components/Cards/PDF.tsx`: genre link `/pdf?genre=` → `/novel?genre=`.
- Deleted `src/app/pdf/page.tsx` and `src/app/pdf/PDFPageClient.tsx`; added a permanent `/pdf` → `/novel` redirect in `next.config.ts`.
- Updated every `/pdf` listing link to `/novel`/"All Novels": `navLinks.ts`, `Footer.tsx` (2 spots), `PageHero.tsx` DEFAULT_LINKS, `HeroSlider.tsx`, `ShortStoriesClient.tsx`, `download/[slug]/page.tsx` (2 spots), `pdf/[slug]/page.tsx` breadcrumb + back link; removed `/pdf` from `sitemap.ts` staticPages (detail URLs still emitted).

## Outcome

- Episodic novels and PDF books now appear in one reverse-chronological "All Novels" grid with no pagination; `/pdf/<slug>` detail routes and their sitemap entries are preserved.
- Verified: tsc exit 0; `/novel` 200 with mixed 15 novel + 10 PDF cards; `/pdf` 308 → `/novel`; `/pdf/<slug>` 200; sitemap clean of the old listing URL; no pagination markup in `/novel`.
- Note: a stale `.next/types/validator.ts` referencing the deleted page caused a transient tsc error; removing `.next/types` and re-running returned exit 0.

## Evaluation

- Graders run and results (PASS/FAIL): tsc PASS; route status PASS; redirect PASS; sitemap PASS; pagination-removed PASS.
- Prompt variant: n/a
- Next experiment (smallest change to try): confirm Google recrawls the 308 redirect and that `/novel` internal linking keeps PDF detail pages discoverable; optionally add `/pdf` (and any legacy aliases) to a rewrite audit if 301 semantics are preferred.

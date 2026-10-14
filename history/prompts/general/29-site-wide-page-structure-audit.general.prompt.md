---
id: 29
title: Site-wide page structure and SEO audit
stage: general
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: seo
branch: n/a
user: missa
command: general
labels: ["audit", "seo", "structure", "canonical", "pages"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files: []
tests:
  - crawl 15 public URLs -> all 200
  - each page exactly 1 H1, meta description present, canonical present
  - canonical values inspected per page
---

## Prompt

ok all others pages are well structured ?

## Response snapshot

Crawled all public pages (dev server http://localhost:3000). Every page returned 200 with exactly one H1, a meta description and a canonical tag. Word counts: home 2649, /about 1180, /contact 204, /novel 2235, /pdf 1750, /short-stories 1051, /bookmarks 918, /privacypolicy 614, /terms 730, /writer/huma-qureshi 1379, /novel/<slug> 1640, /novel/<slug>/<episode> 1340, /pdf/<slug> 840, /short-stories/<slug> 997. Reviews render on all content pages (novel, pdf, episode, short-story) plus the home page.

Checked canonical VALUES (not just presence) and found two pages inheriting the layout default canonical = SITE_URL (home):
- `/bookmarks` -> canonical home (already noindex, so harmless but messy).
- `/download/<slug>` -> canonical home AND inherited robots index:true (real issue: near-duplicate utility pages indexable with home canonical).

Root cause: `src/app/layout.tsx` sets `alternates.canonical = SITE_URL` and `robots.index = true` as defaults; any route without its own metadata inherits both. All other routes set their own canonical (static `metadata` or `generateMetadata`).

Also noted `/download/<slug>` earlier returned ERR on first crawl due to first-hit compile timeout; re-tested 200.

## Outcome

- ✅ Impact: confirmed site pages are well structured/AdSense-friendly; identified 2 canonical/robots issues to fix.
- 🧪 Tests: 15/15 pages 200; H1/desc/canonical checks PASS.
- 📁 Files: none (read-only audit).
- 🔁 Next prompts: fix canonical/robots for /bookmarks and /download/[slug].
- 🧠 Reflection: layout-level canonical/robots defaults leak onto routes that forget to override them; prefer explicit per-route metadata.

## Evaluation notes (flywheel)

- Failure modes observed: layout default canonical pointing everything at home for routes without their own canonical.
- Graders run and results (PASS/FAIL): crawl PASS except noted canonical quirks.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): consider removing the layout-level canonical default so only pages that define it emit one.

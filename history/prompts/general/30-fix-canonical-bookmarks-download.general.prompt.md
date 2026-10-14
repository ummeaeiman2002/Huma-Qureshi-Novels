---
id: 30
title: Fix canonical and robots for bookmarks and download pages
stage: general
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: seo
branch: n/a
user: missa
command: general
labels: ["seo", "canonical", "robots", "noindex", "metadata"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/app/bookmarks/page.tsx
  - src/app/download/[slug]/page.tsx
tests:
  - npx tsc --noEmit -> EXIT 0
  - GET /bookmarks -> canonical .../bookmarks, robots noindex, follow
  - GET /download/dhoop-chaoon-sa-harjai-complete-urdu-novel-pdf -> canonical .../download/<slug>, robots noindex, follow
---

## Prompt

yes fix it first

(following the audit finding that /bookmarks and /download/<slug> canonicalised to the home page)

## Response snapshot

Fixed both routes so they no longer inherit the layout default canonical (home) / indexable robots:

1) `src/app/bookmarks/page.tsx`
- Added `absoluteUrl` import from `@/lib/seo`.
- Added `alternates: { canonical: absoluteUrl("/bookmarks") }` to the existing metadata (kept `robots: { index: false, follow: true }`).

2) `src/app/download/[slug]/page.tsx`
- Replaced static `export const metadata` with `export async function generateMetadata({ params })` returning:
  - `title: "Download Your Novel PDF"`, same description
  - `alternates: { canonical: absoluteUrl(`/download/${slug}`) }`
  - `robots: { index: false, follow: true }`
- Added `import type { Metadata } from "next"` and `absoluteUrl` to the `@/lib/seo` import.

Rationale: /bookmarks is private/user-specific; /download/<slug> pages are near-duplicate utility pages (identical title/guide for every slug) -> noindex is correct, and each now emits its own canonical instead of the home URL.

Verified after edits: tsc EXIT 0; `/bookmarks` -> canonical `https://humaqureshinovels.com/bookmarks`, robots `noindex, follow`; `/download/dhoop-chaoon-sa-harjai-complete-urdu-novel-pdf` -> canonical `.../download/dhoop-chaoon-sa-harjai-complete-urdu-novel-pdf`, robots `noindex, follow`.

## Outcome

- ✅ Impact: removed erroneous home canonical from two routes; made private/duplicate pages non-indexable.
- 🧪 Tests: tsc PASS; HTTP canonical/robots checks PASS.
- 📁 Files: `src/app/bookmarks/page.tsx`, `src/app/download/[slug]/page.tsx`.
- 🔁 Next prompts: optionally remove the layout-level canonical default to prevent future leaks.
- 🧠 Reflection: for dynamic routes, use `generateMetadata` so the canonical can be per-slug.

## Evaluation notes (flywheel)

- Failure modes observed: none after fix.
- Graders run and results (PASS/FAIL): tsc PASS; HTTP PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): audit any remaining route without explicit canonical.

---
id: 25
title: Add Sanity Category schema separate from Genre
stage: general
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: category
branch: n/a
user: missa
command: general
labels: ["sanity", "category", "genre", "schema", "homepage", "filtering"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/sanity/schemaTypes/category.ts
  - src/sanity/schemaTypes/index.ts
  - src/sanity/schemaTypes/novelparent.ts
  - src/sanity/schemaTypes/pdf.ts
  - src/app/page.tsx
  - src/lib/sanity/queries.ts
  - src/app/novel/page.tsx
  - src/app/novel/NovelPageClient.tsx
tests:
  - npx tsc --noEmit -> EXIT 0
  - GET / -> 200
  - GET /studio -> 200
  - GET /novel -> 200
  - GET /novel?category=nonexistent-test -> 200
---

## Prompt

sanity mein har novel ki feild mein genere kay sath cateogy ki feild bhi bnaa do genre alg hey or catgory alg

(Follow-up: "naye category bnao but filter mein na lgao" — use the new Category for the homepage Categories section, but do NOT add a Category option to the visible /novel filter controls.)

(Clarifying answer when asked how a homepage category click should behave: "Us category ke novels filter hon (URL se)" — clicking a category should filter that category's novels via the URL, without exposing it in the filter UI.)

## Response snapshot

Added a Category concept to Sanity, fully separate from Genre.

Schema:
- New `category` document type (`src/sanity/schemaTypes/category.ts`): `categoryname` (required), `categoryslug`, optional `categoryimageurl`; preview on categoryname.
- Registered in `src/sanity/schemaTypes/index.ts`.
- Added a `category` reference field (to `category`) right below `genre` in both `novelparent.ts` and `pdf.ts` (Basic Information group). Genre (reference to `genre`) is untouched; the two are independent. `structure.ts` is generic, so Category appears in the Studio sidebar automatically next to Genre.

Homepage:
- `src/app/page.tsx`: added a `categories` fetch (`*[_type == "category"] | order(categoryname asc) { categoryname, "slug": categoryslug.current, "count": count(*[_type in ["novelparent","pdf"] && references(^._id)]) }`).
- The end-of-page Categories section now maps `categories` (text pills only, no images) and links to `/novel?category=<slug>`. Section hides when no categories exist. Uses `allGenres` nowhere now (still used by HomeFilter).

URL-based category filtering (no visible filter control added):
- `src/lib/sanity/queries.ts`: new `getNovelsByCategory(categorySlug)` — fetches novels where `category->categoryslug.current == $categorySlug`, computes totalViews/totalMonthlyViews from episodes, includes `category->{categoryname, "slug": ...}`.
- `src/app/novel/page.tsx`: reads `?category=<slug>`; when present, `initialNovels = getNovelsByCategory(slug)`, `totalNovelCount = novels.length`, `totalPages = 1`; otherwise keeps the existing paginated path.
- `src/app/novel/NovelPageClient.tsx`: reads `categoryParam` and hides numbered pagination when present. The visible Filter section (writers / sort / genre checkboxes / YouTube toggle) is unchanged — Category is NOT added there, matching the user's instruction.

Verification: tsc clean; `/`, `/studio`, `/novel`, `/novel?category=nonexistent-test` all return 200. Transient dev errors observed mid-edit (`cachedWriters/cachedGenres is not defined`) were fixed; final `getAllMetadata` verified intact.

## Outcome

- ✅ Impact: Editors can create Categories in Studio and assign them per novel (novelparent + pdf), independent of Genre; homepage ends with a simple Categories list; each category links to a working, URL-filtered novel listing.
- 🧪 Tests: tsc EXIT 0; routes 200 (/, /studio, /novel, /novel?category=...).
- 📁 Files: category.ts (new), index.ts, novelparent.ts, pdf.ts, page.tsx, queries.ts, novel/page.tsx, NovelPageClient.tsx.
- 🔁 Next prompts: user must create Category docs and assign them (and give them slugs) in Studio for the homepage section to appear; optionally later expose Category as a visible filter option if desired.
- 🧠 Reflection: reusing the existing `<Filter>` state for URL params vs. fetching a pre-filtered set server-side are different concerns; the latter avoids the page-1-only limitation and keeps the filter UI untouched.

## Evaluation notes (flywheel)

- Failure modes observed: (1) mid-edit transient ReferenceErrors in queries.ts while restructuring `getAllMetadata`; resolved by verifying final content. (2) Homepage Categories section silently hides until at least one category doc with a slug exists.
- Graders run and results (PASS/FAIL): tsc PASS; HTTP checks PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): create one category in Studio, assign it to a novel, then re-load `/` to confirm the section renders and the link filters correctly.

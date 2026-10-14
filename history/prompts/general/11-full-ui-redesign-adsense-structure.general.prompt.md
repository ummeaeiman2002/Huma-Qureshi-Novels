---
id: 11
title: Full UI redesign with clear structure and AdSense-friendly layout
stage: refactor
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: none
branch: n/a
user: missa
command: general
labels: ["design-system", "adsense", "breadcrumbs", "pagination", "sidebar", "short-stories", "pagination"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/app/components/ui/Breadcrumbs.tsx
  - src/app/components/ui/Pagination.tsx
  - src/app/components/AdSlot.tsx
  - src/app/components/AuthorCard.tsx
  - src/app/components/PopularTags.tsx
  - src/app/components/ListingSidebar.tsx
  - src/app/components/Cards/Novel.tsx
  - src/app/components/Cards/PDF.tsx
  - src/app/novel/page.tsx
  - src/app/novel/NovelPageClient.tsx
  - src/app/pdf/page.tsx
  - src/app/pdf/PDFPageClient.tsx
  - src/app/short-stories/ShortStoriesClient.tsx
  - src/app/short-stories/[slug]/page.tsx
  - src/app/novel/[slug]/page.tsx
  - src/app/novel/[slug]/NovelPageClient.tsx
  - src/app/pdf/[slug]/page.tsx
  - src/app/page.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages, /short-stories/[slug] generated)

---

## Prompt

ok so now read docs file...Design UI according to these both file. first is text and second is UI design... make clear struture.. + adsence freindly also

(follow-up answers) Scope: Full redesign — all 4 pages + global. Ads: "its auto add.. it will show any where.. so design UI according to text".

## Response snapshot

Read `docs/text` (1142-line UI spec) and mapped it against the existing emerald/cream/gold
implementation. The UI image (`docs/Urdu Novels Website UI Showcase.png`) could not be viewed
because the model has no image input; followed the written spec instead.

Implemented a full structural redesign across all four pages plus global components:

- New reusable components: `Breadcrumbs` (with BreadcrumbList JSON-LD), `AdSlot`
  (clearly-labelled reserved ad region: sidebar/in-article/banner/leaderboard; renders the real
  AdSense unit when `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` is set, otherwise a labelled reserved box),
  `Pagination` (numbered Previous/1/2/…/Next with clean URLs), `AuthorCard`, `PopularTags`, and
  `ListingSidebar` (sticky desktop sidebar = one labelled ad + popular tags + featured author).
- Novels (`/novel`) and PDF (`/pdf`): added breadcrumbs, a desktop Main-content + Sidebar grid,
  mid-page and lower-page ad slots, numbered server-driven pagination via `?page=` (replacing the
  infinite scroll that loaded hundreds of novels into one long page), a dynamic "All Novels (X)"
  count, and preserved all existing filter + SEO sections.
- Cards: converted to valid stretched-link markup (whole card clickable, genre remains a separate
  clickable link), added descriptive alt text, PDF badge, and "Read"/"View Details" CTAs.
- Short Stories: breadcrumbs, spec hero copy, "Read More" CTA, `?` detail flow at new
  `/short-stories/[slug]` route reusing the novel detail client (canonical points at the primary
  `/novel/...` URL to avoid duplicate content), plus mid/lower ads.
- Home: added mid-page and lower-page ad slots.
- Detail pages (`/novel/[slug]`, `/pdf/[slug]`): breadcrumbs and an in-article + lower ad slot.

Fixed typed-routes errors (Route casts for generated query-string hrefs, typed pagination params).

## Outcome

- ✅ Impact: All 4 pages share one layout system; ads have reserved, clearly-labelled regions; listing pages are paginated (AdSense-friendly) with breadcrumbs and a useful sidebar.
- 🧪 Tests: tsc PASS, build PASS (21/21 routes).
- 📁 Files: 18 files (7 new components/routes + 11 updated).
- 🔁 Next prompts: verify category/genre landing content depth; consider server-side filtering so filters span the whole library rather than the current page.
- 🧠 Reflection: Numbered pagination was required by the spec (§3E, §4E) but changes client-filter scope to the loaded page; a future iteration could move filters to URL/server state.

## Evaluation notes (flywheel)

- Failure modes observed: `next lint` is removed in Next 16 (interprets "lint" as a directory); relied on the build's TypeScript check instead.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): move listing filters to server-side URL state so they apply to the full library.

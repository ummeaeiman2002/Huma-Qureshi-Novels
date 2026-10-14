---
id: 4
title: Redesign static and listing pages to match homepage design
stage: refactor
date: 2026-10-13
surface: agent
model: opencode/big-pickle
feature: none
branch: n/a
user: missa
command: general
labels: ["design-system", "pages", "listing", "static", "refactor"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/app/components/PageHero.tsx
  - src/app/components/StatsBar.tsx
  - src/app/about/page.tsx
  - src/app/contact/page.tsx
  - src/app/terms/page.tsx
  - src/app/privacypolicy/page.tsx
  - src/app/novel/NovelPageClient.tsx
  - src/app/pdf/PDFPageClient.tsx
  - src/app/short-stories/ShortStoriesClient.tsx
  - src/app/components/YouTubeSection.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages) after a transient Sanity DNS error

---

## Prompt

just home page dedign kia hey.. what about other pages?

(follow-up) Which pages to redesign? -> user selected: "Listing pages (Novel/PDF/Short Stories)" and "Static pages (About/Contact/Privacy/Terms)"

(also) working?

## Response snapshot

Created shared `PageHero` (deep-emerald banner: optional gold badge, display title, cream
description, optional gold accent + children) and `StatsBar` (deep-emerald card, gold numbers,
cream labels). Swapped every legacy `rounded-3xl bg-brand` hero band on About, Contact, Terms,
Privacy, Novel, PDF and Short Stories pages for `PageHero`; replaced the surface stats bars with
`StatsBar`. Removed double horizontal padding (`mx-4 lg:mx-0`, `px-5 lg:px-10`, `px-3 sm:px-4`)
since the root layout already pads. Normalized content panels from `border-2` to `border` to match
homepage tint panels, and dark "Let's Connect"/"Follow Me" cards switched to `bg-brand-deep` to
match footer/quote cards. `tsc` and `next build` both PASS (build hit a transient Sanity
`EAI_AGAIN` DNS error once, passed on retry).

## Outcome

- ✅ Impact: Static + listing pages now share the homepage's design language (deep emerald banners, gold accents, consistent panels/spacing).
- 🧪 Tests: tsc PASS, build PASS (21/21).
- 📁 Files: 2 new components + 8 pages/components updated.
- 🔁 Next prompts: detail/reader pages + bookmarks/download polish; add real language switcher.
- 🧠 Reflection: extracting PageHero/StatsBar removed ~120 lines of duplicated banner markup across 7 pages.

## Evaluation notes (flywheel)

- Failure modes observed: build prerender of /novel failed once on transient Sanity CDN DNS (EAI_AGAIN) — environmental, not code; retry succeeded.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Convert cards' `border-2` interactive pills to a shared Button variant across all pages.

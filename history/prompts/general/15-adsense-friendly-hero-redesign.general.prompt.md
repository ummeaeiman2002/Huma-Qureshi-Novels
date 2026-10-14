---
id: 15
title: AdSense-friendly richer page hero redesign
stage: green
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: site-ui
branch: n/a
user: missa
command: general
labels: ["ui", "hero", "adsense", "design-system", "internal-linking"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/app/components/PageHero.tsx
  - src/app/globals.css
  - src/app/novel/NovelPageClient.tsx
  - src/app/pdf/PDFPageClient.tsx
  - src/app/short-stories/ShortStoriesClient.tsx
  - src/app/page.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)

---

## Prompt

all pages kay hero sections .. itnay boring q hein? inhein adsence freindly.. means adsence jldi approve hojaye kuch aisa structural design kro..

## Response snapshot

Redesigned the shared hero to be richer and more AdSense/SEO friendly; because every page uses
`PageHero`, all of them upgrade at once.

`PageHero.tsx` (rewritten, backwards compatible):
- Two-column composition: main copy on the left, a side panel on the right (lg+).
- Decorative layers: emerald blurs, a new dot-grid pattern, gold top/bottom hairlines, ring border.
- Eyebrow badge with pulse dot, larger display H1, gold rule, description + accent, and a row of
  trust chips ("100% Free to Read", "No Sign-up Needed", "Read Online & Offline").
- New optional props: `chips`, `highlights` (stat tiles), `actions` (CTA buttons), `aside`
  (custom panel), `align`.
- Default side panel = "Explore the Library" quick links (Novels / PDF / Short Stories) on every
  page -> stronger internal linking & crawlability (helps AdSense review).
- Existing props (`title`/`description`/`accent`/`badge`/`children`) unchanged, so about, contact,
  terms, privacy and bookmarks pages all adopt the new look automatically.

`globals.css`: added `.hero-pattern` dot-grid utility.

Listing heroes got cross-link CTAs; homepage hero got matching trust chips.

## Outcome

- ✅ Impact: All hero sections (novel, pdf, short-stories, about, contact, terms, privacy, bookmarks) look modern and carry more value content + internal links.
- 🧪 Tests: tsc PASS, build PASS (21/21).
- 📁 Files: 6.
- 🔁 Next prompts: consider AdSense review checklist — substantial original content per page, working Privacy/About/Contact, sitemap, and no excessive ads above the fold.
- 🧠 Reflection: upgrading the one shared hero component de-bored every page with a single small diff.

## Evaluation notes (flywheel)

- Failure modes observed: none. New props optional; existing usages render unchanged.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): pass `highlights` to listing heroes and drop the now-redundant StatsBar.

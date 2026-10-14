---
id: 5
title: Continue docs/text full-site redesign across detail pages
stage: refactor
date: 2026-10-13
surface: agent
model: opencode/big-pickle
feature: none
branch: n/a
user: missa
command: general
labels: ["design-system", "spec", "detail-pages", "bookmarks", "pdf"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/app/pdf/PDFPageClient.tsx
  - src/app/bookmarks/page.tsx
  - src/app/novel/[slug]/NovelPageClient.tsx
  - src/app/novel/[slug]/[episodeslug]/EpisodePageClient.tsx
  - src/app/pdf/[slug]/page.tsx
  - src/app/download/[slug]/page.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)

---

## Prompt

docs ki text file read kro or working kro us par

## Response snapshot

Re-read `docs/text` (full-site redesign spec: audit, shared design system, homepage, novels
listing, PDF page mandatory, short stories, novel detail, episode reading, short-story detail,
category pages, about/contact/privacy/terms, other routes, functional, SEO/a11y). Applied the
remaining consistency work: PDF listing heading renamed to "PDF Novels Library" with a fuller
intro (spec §5); Bookmarks hero swapped to the shared `PageHero`; detail/download pages
(novel detail, episode, PDF detail, download) had double padding removed and panels normalized
from `border-2` to `border`. Confirmed reading typography already complies with spec §8
(`NovelBody`: `dir="rtl"`, `font-urdu`, `leading-9`; globals `.font-urdu` line-height 2.2, RTL).
`tsc` and `next build` PASS (21/21).

## Outcome

- ✅ Impact: PDF page, bookmarks, and detail/download pages now visually consistent with the design system.
- 🧪 Tests: tsc PASS, build PASS (21/21).
- 📁 Files: 6 pages/components updated.
- 🔁 Next prompts: Short Stories needs a distinct layout (spec §6 says do not just reuse novels page); add prev/next episode links (spec §8); category page intros (§10); deeper SEO audit (§14).
- 🧠 Reflection: Detail pages already shared a soft-emerald hero + tokens, so only spacing/border polish was needed rather than a full rebuild.

## Evaluation notes (flywheel)

- Failure modes observed: `docs/text` is truncated at "## 15" — sections 15+ unavailable.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Give ShortStoriesClient its own card/list layout distinct from the novels grid.

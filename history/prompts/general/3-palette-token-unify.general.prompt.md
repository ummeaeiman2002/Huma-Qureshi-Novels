---
id: 3
title: Unify legacy hardcoded palette tokens across all pages
stage: refactor
date: 2026-10-13
surface: agent
model: opencode/big-pickle
feature: none
branch: n/a
user: missa
command: general
labels: ["design-system", "color-tokens", "refactor", "consistency"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/app/about/page.tsx
  - src/app/bookmarks/page.tsx
  - src/app/contact/page.tsx
  - src/app/terms/page.tsx
  - src/app/privacypolicy/page.tsx
  - src/app/download/[slug]/page.tsx
  - src/app/novel/NovelPageClient.tsx
  - src/app/novel/[slug]/NovelPageClient.tsx
  - src/app/novel/[slug]/[episodeslug]/EpisodePageClient.tsx
  - src/app/pdf/PDFPageClient.tsx
  - src/app/pdf/[slug]/page.tsx
  - src/app/short-stories/ShortStoriesClient.tsx
  - src/app/components/Cards/Episode.tsx
  - src/app/components/Cards/Novel.tsx
  - src/app/components/Cards/PDF.tsx
  - src/app/components/headerComponents/Search.tsx
  - src/app/components/novelPage/CommentForm.tsx
  - src/app/components/novelPage/DownloadPDFButton.tsx
  - src/app/components/BookmarkButton.tsx
  - src/app/components/CookieConsent.tsx
  - src/app/components/Filter.tsx
  - src/app/components/Heading.tsx
  - src/app/components/HomeFilter.tsx
  - src/app/components/NewUploadAlert.tsx
  - src/app/components/Reactions.tsx
  - src/app/components/RelatedContent.tsx
  - src/app/components/YouTubeSection.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)

---

## Prompt

home page or baqi pages ka green color different hey why?

(follow-up question) Kaunsa fix karun taake green har page par ek jaisa ho? -> user selected: "Upgrade all pages to new tokens (Recommended)"

## Response snapshot

Root cause: home page uses the new emerald/gold tokens (`--color-brand` #1E5D50, `--color-brand-deep`
#0B3B34, `--color-gold` #C9A96E) while all other pages still had legacy hardcoded hex classes
(`bg-[#1E5D50]`, `text-[#C9A96E]`, `bg-[#FFFDF9]`, etc.). Ran a scripted migration
(`migrate-colors.ps1`) across 27 TSX files (402 replacements) mapping hex -> token utilities:
#1E5D50->brand/brand-dark, #0B3B34->brand-deep, #2F7565->brand-soft, #C9A96E->gold, #8B6914->gold-dark,
#FFFDF9->surface, #FAF7F2->cream-soft, #DCCFC2->line, #111111->ink. Manually fixed two leftovers
(gradient `from-surface to-gold/15` in NovelPageClient, `bg-line` in Search). SVG stroke/JS palette
values left as exact brand hex (identical). `tsc` and `next build` both PASS.

## Outcome

- ✅ Impact: Whole site now renders on one emerald/gold/cream design system.
- 🧪 Tests: tsc PASS, build PASS.
- 📁 Files: 27 TSX files migrated (402 replacements).
- 🔁 Next prompts: polish static pages' layout to match new design (not just colors).
- 🧠 Reflection: resource-constrained bulk refactors are safer as a reviewed script than hundreds of manual edits; Tailwind v4 theme tokens all existed so utilities generated on-demand.

## Evaluation notes (flywheel)

- Failure modes observed: PowerShell recursion skips directory names containing brackets (`[slug]`) — explicitly appended those paths; gradient colors (`#FFF3D6`) and svg stroke props are not class replacements.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Also normalize remaining `text-tertiary`/`text-secondary`/`bg-primary` legacy token usages.
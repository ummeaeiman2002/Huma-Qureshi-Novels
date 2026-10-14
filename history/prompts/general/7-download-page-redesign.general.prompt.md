---
id: 7
title: Redesign download page UI per docs/text
stage: refactor
date: 2026-10-13
surface: agent
model: opencode/big-pickle
feature: none
branch: n/a
user: missa
command: general
labels: ["design-system", "spec", "download-page", "pagehero"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/app/download/[slug]/page.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)

---

## Prompt

now read docs folder text file and deign UI of download page

## Response snapshot

Redesigned the `/download/[slug]` guide page to match the premium design system and the
`docs/text` shared identity:
- Swapped the light soft-emerald hero for the shared dark-emerald `PageHero` with a dynamic
  badge ("PDF Download"/"Download Guide"), title kept as "Download & Read Your Urdu Novel".
- Download CTA panel polished: added a "Ready to Download" badge, gold corner glow, larger
  emerald button with stronger hover shadow.
- Steps section rebuilt as a 2-column grid of cream cards with gradient gold→brand numbered
  badges, hover lift, and a short intro line (spec-readable, informative).
- Normalized the remaining `border-2 border-gold/30` panels to `border border-gold/30`
  (Why PDF + Sanity CMS section) for border-weight consistency.
- Preserved all content, the real Sanity `downloadSection` block, valid-PDF gate, and the
  `?pdf=&type=` search-param flow.

## Outcome

- ✅ Impact: download page now reads as a premium, consistent part of the site.
- 🧪 Tests: tsc PASS, build PASS (21/21).
- 📁 Files: 1 page updated.
- 🔁 Next prompts: apply the same hero treatment to `/pdf/[slug]` and `/novel/[slug]` if "page-first" look is preferred over the current soft-emerald detail hero; deeper a11y/OG audit.
- 🧠 Reflection: `PageHero` is server-safe (plain component), so it can be used directly in async pages.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): unify the detail-page hero choice across novel/pdf detail pages.
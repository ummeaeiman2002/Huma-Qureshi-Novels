---
id: 2
title: Implement detailed UI spec for homepage and header
stage: refactor
date: 2026-10-13
surface: agent
model: opencode/big-pickle
feature: none
branch: n/a
user: missa
command: general
labels: ["design-system", "homepage", "header", "tailwind", "spec", "accessibility"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/app/components/headerComponents/socials.ts
  - src/app/components/headerComponents/TopUtilityBar.tsx
  - src/app/components/headerComponents/navLinks.ts
  - src/app/components/headerComponents/DesktopHeader.tsx
  - src/app/components/headerComponents/MobileHeader.tsx
  - src/app/components/headerComponents/Footer.tsx
  - src/app/layout.tsx
  - src/app/page.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)
---

## Prompt

ok.... so UI some instrutions is here...

bc260418496

Now read docs folder text file.. and deisgn better UI of website according to text

## Response snapshot

Read `docs/text` (full UI spec) and implemented it: added a dark-emerald top utility bar
(About/Contact/Privacy/Terms + FB/YouTube/Instagram) and converted the main header to a
cream bar with centered nav + search + bookmarks (nav now Home/Novels/Short Stories/About/
Contact). Rebuilt the homepage: two-column hero (text left, image right), genre quick-links
row, two-column Featured Novels + Latest Episodes, Explore-by-Genre with real counts plus an
author quote card beside it, and a 3-column About section (image / bio / real stats) replacing
the standalone stats band. Shared socials extracted to `socials.ts`. `tsc` and `next build`
both pass. Language switcher intentionally omitted (existing toggle is non-functional).

## Outcome

- ✅ Impact: Homepage + global header now follow the written design spec; real data only.
- 🧪 Tests: tsc PASS, build PASS.
- 📁 Files: 6 new/edited + layout + homepage.
- 🔁 Next prompts: wire a real Urdu/English language switcher if desired; apply same polish to listing/static pages; add AdSense slots.
- 🧠 Reflection: Spec asks for a language switcher, but adding a non-functional control would violate the "no fake features" rule, so it was deferred.

## Evaluation notes (flywheel)

- Failure modes observed: Spec §6 (two-column featured with 4-per-row featured grid) is geometrically tight; used 3-per-row at xl to avoid card overflow.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Add i18n dictionary + context to make the language switcher real.

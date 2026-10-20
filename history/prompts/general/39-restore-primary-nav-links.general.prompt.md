---
id: 39
title: Restore Primary Nav Links (Home/Novels/PDF) in Header
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [navigation, header, revert]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/headerComponents/DesktopHeader.tsx
 - src/app/components/headerComponents/MobileHeader.tsx
tests:
 - node node_modules/typescript/bin/tsc --noEmit (exit 0)
 - curl /pdf: aria-label="Primary" present; labels = Home, Novels, PDF
---

## Prompt

header sy home, pdf or novels ka page q remove kardia hey? woh to heade mein lazmi hoatey hein. wapis lao

## Response snapshot

Previous step ("Navbar hi remove kardo" -> "Sirf nav links hatao, logo + search rakho") removed the primary nav entirely. User clarified that Home/Novels/PDF are essential in the header. Restored the nav rendering in both DesktopHeader (centered nav in 3-col grid) and MobileHeader (hamburger + slide-in drawer), mapping over the existing `NAV_LINKS` (Home/Novels/PDF only). Logo + Search placement unchanged.

## Outcome

- ✅ Impact: High — primary site navigation restored on desktop and mobile.
- 🧪 Tests: tsc --noEmit (0 errors); rendered /pdf shows aria-label="Primary" with Home, Novels, PDF.
- 📁 Files: DesktopHeader.tsx, MobileHeader.tsx.
- 🔁 Next prompts: Deploy cleaned build to live; add AdSense ad units; fix sitemap.
- 🧠 Reflection: `navLinks.ts` was already correct (Home/Novels/PDF) — only the rendering had been removed, so restore was re-adding the nav block + imports.

## Evaluation notes (flywheel)

- Failure modes observed: Over-scoped earlier removal of the entire primary nav instead of just the extra links.
- Graders run and results (PASS/FAIL): tsc PASS; render check PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a

---
id: 38
title: Remove Top Utility Bar Links
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [navigation, header, ui-spec]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/headerComponents/TopUtilityBar.tsx
tests:
 - node node_modules/typescript/bin/tsc --noEmit (exit 0)
 - curl /pdf: aria-label="Utility" absent; main nav = Home, Novels, PDF
---

## Prompt

ok... PDf menu mein just home, novels, and PDF ka page visible rakho. baqi remove krdo

(Clarified via question: user chose to also remove the top utility bar text links.)

## Response snapshot

Removed the `UTILITY_LINKS` navigation (About the Author, Contact, Privacy Policy, Terms & Conditions) from `TopUtilityBar`. The strip now shows only the social icons, right-aligned. Main nav already trimmed to Home/Novels/PDF. Legal pages remain reachable via the footer.

## Outcome

- ✅ Impact: Medium — header region now shows only the 3 core menu links; top strip is social-only.
- 🧪 Tests: tsc --noEmit (0 errors); rendered /pdf has no Utility nav; Privacy Policy/Terms still present in footer.
- 📁 Files: src/app/components/headerComponents/TopUtilityBar.tsx.
- 🔁 Next prompts: (none required)
- 🧠 Reflection: Removed now-unused `Link` and `Route` imports to keep tsc clean.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): tsc PASS; render checks PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a

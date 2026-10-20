---
id: 37
title: Trim Navigation Menu To Core Pages
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
 - src/app/components/headerComponents/navLinks.ts
tests:
 - node node_modules/typescript/bin/tsc --noEmit (exit 0)
 - curl /pdf: nav labels = Home, Novels, PDF only
---

## Prompt

ok... PDf menu mein just home, novels, and PDF ka page visible rakho. baqi remove krdo

## Response snapshot

Trimmed the shared navigation menu (`NAV_LINKS`) to only Home, Novels, and PDF; removed About and Contact. Both DesktopHeader and MobileHeader map over NAV_LINKS, so the change applies site-wide. About and Contact remain reachable via the footer.

## Outcome

- ✅ Impact: Medium — primary nav now shows 3 core links.
- 🧪 Tests: tsc --noEmit (0 errors), live /pdf nav labels verified.
- 📁 Files: src/app/components/headerComponents/navLinks.ts.
- 🔁 Next prompts: (none required)
- 🧠 Reflection: navLinks.ts is the single source of truth for both desktop and mobile menus.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): tsc PASS; rendered nav check PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a

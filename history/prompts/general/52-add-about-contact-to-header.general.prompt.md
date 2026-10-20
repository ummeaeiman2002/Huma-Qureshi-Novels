---
id: 52
title: Add About and Contact to Header Nav
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [navigation, header, about, contact]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/headerComponents/navLinks.ts
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - homepage HTML contains href="/about" and href="/contact" in header nav
---

## Prompt

Ok... Add About me and contact page in header

## Response

Added "About" (`/about`) and "Contact" (`/contact`) entries to the shared `NAV_LINKS` array in `src/app/components/headerComponents/navLinks.ts`. Both `DesktopHeader` and `MobileHeader` render from this array, so the links appear in the desktop nav and the mobile menu automatically.

## Outcome

- Header now shows: Home, All Novels, About, Contact.
- tsc exit 0; homepage header HTML contains `/about` and `/contact` links.

## Outcome notes
- Labels used: "About" and "Contact" (kept short for the nav). Change the `label` values in `navLinks.ts` if "About Me" is preferred.

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): add active-route highlighting for the current page in the header.

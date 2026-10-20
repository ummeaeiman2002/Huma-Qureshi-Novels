---
id: 55
title: Proper Contact Page Design
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [contact, redesign, ui, form, theme, seo]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/contact/page.tsx
 - src/app/contact/ContactForm.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - /contact : 200, 1 h1 / h2s, form fields (name, subject, message), email shown
---

## Prompt

design contact page properly

## Response

Reworked the contact page into a full, polished layout consistent with the About redesign and site theme:

- `src/app/contact/ContactForm.tsx` (new client component): name/email/subject(select: General, Collaboration, Ghostwriting, Rights, Interview)/message fields with validation and an accessible live status. Submits by composing a `mailto:` link that opens the user's email app pre-filled — no backend/secret required. Fully typed, no `any`.
- `src/app/contact/page.tsx` (rewritten): `PageHero` with badge + three highlight tiles (Reply 24–48h, Global, Free consult); two-column section with the message form on the left and a right column holding Contact Details (email mailto + location, using site-settings icons) and a dark "I'm Open To" collaboration checklist; a "Connect on Social" band with icon links (site-settings icons) that open external profiles in a new tab.
- Added `openGraph` metadata; canonical retained.

## Outcome

- tsc exit 0; `/contact` returns 200 with the form and all sections rendered.

## Outcome notes
- The form intentionally uses mailto (opens the visitor's mail client) because the project has no email/API backend; this avoids inventing a non-existent endpoint or hardcoding credentials. If a real server-side sender is wanted later, add `/api/contact` + a provider (e.g. Resend/SMTP) via env vars.
- Removed the previous duplicated/placeholder-less info blocks in favor of the structured layout.

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): wire ContactForm to a `/api/contact` route with a mail provider for direct sending.

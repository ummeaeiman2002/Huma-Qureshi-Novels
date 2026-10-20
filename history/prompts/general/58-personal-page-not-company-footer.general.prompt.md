---
id: 58
title: Personal Page Not Company Footer Label
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [footer, branding, copy, build-verification, ux]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/headerComponents/Footer.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - npm run build (compiled successfully, 18/18 static pages, /short-stories absent)
  - home HTML: footer shows "Author" column, no "Company"; labels "About the Author" / "Contact Me"
---

## Prompt

huma qureshi novels its not a company... its my specific page.. so make sure it will work..

## Response

"Huma Qureshi Novels" is a personal author page, not a company, so the footer's "Company" grouping was misleading. Renamed it:

- `src/app/components/headerComponents/Footer.tsx`: "Company" → **"Author"** (heading + `aria-label`), and made the two links personal: "About Us" → **"About the Author"**, "Contact Us" → **"Contact Me"**.
- Confirmed no other "Company"/"Organization" references exist in `src` (only the footer had one); root metadata uses `applicationName` + `openGraph website`, no Organization schema, so nothing else needed changing.
- Verified the whole app still builds and runs after all recent deletions (short-stories route, etc.).

## Outcome

- tsc exit 0.
- `npm run build` → compiled successfully, 18/18 pages generated; route table no longer lists `/short-stories`.
- Dev server still serving: `/` 200, `/novel` 200.
- Home renders the footer "Author" column with "About the Author" / "Contact Me"; no "Company" text.

## Outcome notes
- Build emits a Next 16 deprecation warning: the `middleware` file convention should be renamed to `proxy` (non-blocking).
- If any other copy still reads like a business (e.g., Privacy/Terms "we"/"our"), it can be reworded to first-person for a personal page on request.

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): migrate `middleware.ts` to the `proxy.ts` convention to clear the deprecation warning.

---
id: 19
title: How to open Sanity Studio on localhost
stage: general
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: none
branch: n/a
user: missa
command: general
labels: ["sanity", "studio", "localhost", "howto"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files: []
tests: []

---

## Prompt

local host pr studio kaisy open krun mein?

## Response snapshot

Studio is embedded in the Next.js app via `next-sanity/studio` at route `src/app/studio/[[...tool]]/page.tsx`
and configured with `basePath: '/studio'` in `sanity.config.ts`.

Steps:
- Run `npm run dev` (script = `next dev --webpack`, default port 3000).
- Open http://localhost:3000/studio
- Log in with the Sanity account on first visit.
- If port 3000 is busy: `npm run dev -- -p 3001` then http://localhost:3001/studio.
- Newly added schema fields appear once the dev server recompiles the schema; restart the dev server if they don't show.

## Outcome

- ✅ Impact: none (informational answer).
- 🧪 Tests: none.
- 📁 Files: none.
- 🔁 Next prompts: fill the new PDF fields in Studio; verify the sections render on the PDF page.
- 🧠 Reflection: Studio is co-located with the site, so no separate `sanity start` is needed.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a

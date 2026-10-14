---
id: 12
title: Match Short Stories cards to other listing pages
stage: refactor
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: none
branch: n/a
user: missa
command: general
labels: ["design-system", "short-stories", "cards", "consistency"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/app/components/Cards/Novel.tsx
  - src/app/short-stories/ShortStoriesClient.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)

---

## Prompt

short STories page kay cards baqi pages card jaisy krdo..

## Response snapshot

Made the Short Stories listing use the same card style as the Novels and PDF pages.

- `Cards/Novel.tsx` is now reusable: added optional `hrefBase` (default `/novel`) and `cta`
  (default `Read`) props; the card link is built as `` `${hrefBase}/${href}` `` (cast to `Route`
  for typed routes).
- `short-stories/ShortStoriesClient.tsx`: replaced the reading-focused horizontal cards with the
  shared `Novel` card in the same `flex flex-wrap gap-5 justify-center lg:justify-start lg:px-2`
  grid used on `/novel`, passing `hrefBase="/short-stories"` and `cta="Read More"`. Removed the now
  unused `next/image`, `next/link`, and `Route` imports.

## Outcome

- ✅ Impact: Short Stories cards are visually and structurally identical to the Novels/PDF cards, giving one consistent card system site-wide.
- 🧪 Tests: tsc PASS, build PASS (21/21).
- 📁 Files: 2 files updated.
- 🔁 Next prompts: optionally add an episode/short-story badge to distinguish short stories in the shared card.
- 🧠 Reflection: extending one card component via props avoided forking a second card implementation.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): add an optional `badge` prop to the shared card to label short stories.

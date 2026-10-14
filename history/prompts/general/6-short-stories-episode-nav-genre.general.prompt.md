---
id: 6
title: Short stories layout, episode nav, genre filtering per docs/text
stage: refactor
date: 2026-10-13
surface: agent
model: opencode/big-pickle
feature: none
branch: n/a
user: missa
command: general
labels: ["design-system", "spec", "short-stories", "episode-nav", "genre-filter"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/app/short-stories/ShortStoriesClient.tsx
  - src/app/novel/[slug]/[episodeslug]/page.tsx
  - src/app/novel/[slug]/[episodeslug]/EpisodePageClient.tsx
  - src/app/novel/NovelPageClient.tsx
  - src/app/novel/page.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)

---

## Prompt

Continue if you have next steps, or stop and ask for clarification if you are unsure how to proceed.

## Response snapshot

Continued the `docs/text` full-site implementation:
- **§6 Short Stories:** replaced the reused novels grid + novel card with a distinct
  reading-focused layout — responsive two-column list of horizontal cards (3:4 cover on the
  left, genre eyebrow, title, summary, writer/date, "Read Story" pill) using `next/image`.
- **§8 Episode pages:** added functional previous/next episode navigation. Server wrapper now
  queries sibling episodes (ordered by release date, same visibility rules) via
  `getEpisodeSiblings` and passes `prevEpisode`/`nextEpisode` to the client, which renders an
  accessible `<nav aria-label="Episode navigation">` with token-styled links.
- **§10/§13 Genre links:** homepage genre shortcuts link to `/novel?genre=...` but the listing
  ignored the param. Added `useSearchParams` pre-filtering in `NovelPageClient` (validated
  against known genres) and wrapped the client in `<Suspense>` in `novel/page.tsx` to satisfy
  Next's static-generation requirement.

## Outcome

- ✅ Impact: short stories are visually distinct, episodes have prev/next navigation, and genre links now open pre-filtered collections.
- 🧪 Tests: tsc PASS, build PASS (21/21).
- 📁 Files: 5 files updated.
- 🔁 Next prompts: Heavy client JS in listings (HomeFilter/others); deeper a11y/OG audit; verify genre labels match `genrename` exactly.
- 🧠 Reflection: `useSearchParams` on a statically-rendered route requires a Suspense boundary — wrapped rather than forcing dynamic rendering.

## Evaluation notes (flywheel)

- Failure modes observed: none during build; tsconfig has `strictNullChecks: false`.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Confirm genre query names equal Sanity `genrename` values end-to-end.

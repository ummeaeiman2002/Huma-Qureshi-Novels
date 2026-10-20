---
id: 33
title: Remove Generic Homepage Data
stage: general
date: 2026-10-17
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [homepage, generic-content, cleanup, ui-spec]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/page.tsx
 - src/app/components/PageHero.tsx
 - src/app/components/headerComponents/Footer.tsx
tests:
 - node node_modules/typescript/bin/tsc --noEmit (exit 0)
 - node node_modules/next/dist/bin/next build (exit 0)
 - curl homepage: 4 sections, zero generic strings (Real Stories, Every story I write, Frequently Asked, The Home of Urdu, 100% Free to Read, No Sign-up Needed, Read Online & Offline, Discover a world, Popular original, Freshly released, Find the kind)
 - curl /novel: zero PageHero default chips remaining
---

## Prompt

Homepage sy generic data uraa do sara..

## Response snapshot

Removed all generic/fabricated homepage content per Ui.md ("no exaggerated marketing claims", "no generic SEO questions"):

- **Fake quote removed** ("Every story I write carries a piece of my heart." blockquote) — genres section now full-width grid.
- **Hardcoded FAQ removed** (5 generic Q&A objects + FAQ card).
- **Generic "About the Library" section removed** (3 SEO filler paragraphs; unused `SITE_NAME` import dropped).
- **Generic hero copy replaced** — "Real Stories. Deep Emotions." slogan and "Discover a world..." intro replaced with factual heading "Read Urdu Novels Online" + one factual line; generic trust chips ("100% Free to Read", "No Sign-up Needed", "Read Online & Offline") removed from the homepage hero.
- **Generic section subtitles removed** (Featured, Latest Episodes, Genres, Browse).
- **PageHero DEFAULT_CHIPS removed site-wide** (same generic trust pills were the default on /novel, /pdf, /about, /contact, 404, etc. — no page ever passed custom chips; `chips` prop and unused `CheckIcon` deleted).
- **Footer dead anchor fixed** — `/#about-author` (section no longer exists) → `/about`.

Homepage now renders 4 sections (Hero, Featured+Episodes, Genres, Browse+Filter+Latest) containing only real CMS-driven data.

## Outcome

- ✅ Impact: High — homepage + all PageHero pages now contain zero fabricated/generic marketing content.
- 🧪 Tests: tsc --noEmit (0 errors), next build (exit 0), live-page string scans (all generic strings 0 hits).
- 📁 Files: src/app/page.tsx, src/app/components/PageHero.tsx, src/app/components/headerComponents/Footer.tsx.
- 🔁 Next prompts: (none required)
- 🧠 Reflection: The RSC inlined 404 payload can leak component defaults into other pages' HTML source; scanning rendered HTML caught PageHero DEFAULT_CHIPS that a source-only review would miss.

## Evaluation notes (flywheel)

- Failure modes observed: none this session.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS, string-scan PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): none required.

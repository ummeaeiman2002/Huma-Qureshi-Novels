---
id: 83
title: Latest Episodes Section As Cards
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [homepage, latest-episodes, cards, groq-fix, constitution-s12]
links:
  spec: docs/constitution.md (sections 2,3,12)
  ticket: null
  adr: null
  pr: null
files:
 - src/app/page.tsx (modified)
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - npm run build ("Compiled successfully in 54s")
  - SSR /: 5 episode cards, 5 banner images, 5 "Episode" badges, "Read Episode" CTAs, 5 episode links
---

## Prompt

hompage pr latest episode wala section just text q hey? usay bhi featured or latest upload waly section ki trhan maintain kro

## Change (`src/app/page.tsx`)

**Latest Episodes is now a card section matching Featured Novels / Latest Uploads**, instead of plain text rows.

- Episode query extended to fetch the parent novel's real cover + genre:
  `"novelBanner": novelparent->banner`, `"novelGenre": novelparent->genre->genrename`.
- Replaced the `<ul>` text links with `<article>` cards that reuse the exact `Novel`/`PDF` card treatment: landscape `aspect-video` cover (parent novel banner) with dark gradient + gold hairline, an "Episode" badge and the episode date pill, the episode name as the heading, "From <Novel>" line, a detail list (Novel / Genre), and a **"Read Episode"** CTA + arrow — all linking to `/novel/<novelSlug>/<episodeSlug>`.
- Graceful letter-placeholder cover when a parent novel has no banner.

**Bug fixed during the change:** an initial attempt added `"novelEpisodeCount": count(*[_type == "novel" && references(^novelparent._id)])`, which produced a GROQ parse error (`expected ')'`) that blanked the whole homepage. Removed it (the field was unused); the query is valid again.

## Checks — actual results
- `tsc --noEmit`: **pass** (exit 0).
- `npm run build`: **pass** — "Compiled successfully in 54s".
- SSR `/`: 5 episode cards, 5 banner images, 5 "Episode" badges, "Read Episode" CTAs, 5 episode detail links.
- All homepage sections present (Featured Novels, Latest Uploads, Latest Episodes, Explore by Genre); page ~287KB (was 79KB while the query was broken — confirms the fix).

## Notes
- Dedup rule unchanged: episodes are still one-per-novel (newest), so no single novel dominates.
- Episodes remain clearly separated from complete novels/PDFs (constitution §3).
- Verified via rendered markup, not a screenshot.

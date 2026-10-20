---
id: 66
title: Reactions Feature Status Check
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [reactions, episodes, diagnostics, localStorage]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/Reactions.tsx
 - src/app/api/reactions/route.ts
tests:
  - Read Reactions.tsx and checked API routes + Sanity schemas for a reactions backend
  - curl episode page /novel/haraa-junoon-long-episodic-novel/episode-no-14 -> 200, Reactions mounts ("Loading reactions…")
---

## Prompt

Reaction emojis on episodes page is functioning or active? its work or not? means counts shown ?

## Response

**Locally chalta hai, real counts nahi dikhte.**

| Kya | Status |
|---|---|
| Buttons render/tap | works — highlight + increment |
| Global counts (other readers) | no API, no Sanity field — pure `localStorage` (`hq_reactions_<slug>`) |
| Counts shown | starts empty; only your own taps show a number |
| Selection survives refresh | bug — `loadCounts()` only read counts, always returned `userReacted: null`, never read the `_user` key that `react()` wrote |

Root cause: `src/app/components/Reactions.tsx:19-30` (localStorage only, no fetch) and `:37-42` (selection never restored). Confirmed there was no `/api/reactions` route and no Sanity schema mentioning reactions.

## Outcome

Reported findings and offered two fix levels: (1) local-only quick fix, (2) real global counts via API + Sanity.

## Outcome notes
- The component is mounted on both the episode page (`EpisodePageClient.tsx:175`) and the novel detail page (`NovelPageClient.tsx:209`).

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): choose a fix level and implement.

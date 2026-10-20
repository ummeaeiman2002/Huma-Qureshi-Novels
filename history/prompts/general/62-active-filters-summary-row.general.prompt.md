---
id: 62
title: Active Filters Summary Row
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [filters, ui, ux, component, accessibility]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/ActiveFilters.tsx
 - src/app/components/HomeFilter.tsx
 - src/app/novel/NovelPageClient.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - /?sort=Latest renders Active row with Sort chip + remove aria-label
  - /?writer=...&yt=1 renders 2 chips + "Clear all"
  - npm run build (compiled successfully, 18/18 pages)
---

## Prompt

yes active plz

(Referring to the offered follow-up: add an active-filters summary row with removable chips above the results grid.)

## Response

Added a reusable active-filters summary and wired it into both the Home browse and `/novel` listings.

- New `src/app/components/ActiveFilters.tsx` (client): renders an "Active" eyebrow plus one removable pill per active filter (label + value + ✕ button with an accessible `aria-label`), and a "Clear all" link when more than one filter is active. Returns `null` when there are no filters.
- `src/app/components/HomeFilter.tsx`: refactored to a `commit(overrides)` helper that updates state and pushes the query string (used by Apply and by chip removal, so removing a chip applies immediately). Replaced the old "Clear Filters" button with the `<ActiveFilters>` row.
- `src/app/novel/NovelPageClient.tsx`: built `activeItems` from the local `filters` state, added a `resetFilters` callback, removed the redundant "Reset Filters" button, and placed `<ActiveFilters>` between the filter card and the results header.

## Outcome

- tsc exit 0; `npm run build` compiled successfully (18/18 pages).
- Verified: `/?sort=Latest` shows the Active row with a "Sort" chip (remove aria-label present); `/?writer=Huma Qureshi&yt=1` shows two chips plus "Clear all"; `/novel` renders normally.

## Outcome notes
- Chip removal is immediate on Home (navigates); on `/novel` it updates the client-side `filters` state instantly.
- Removing the last chip hides the row ("Clear all" only shows with >1 filter, so it never duplicates a single chip's ✕).

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): make the "Showing N results" line include the active filter labels for extra clarity.

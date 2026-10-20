---
id: 61
title: Filters Column Redesign Home And Novels
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [filters, ui, redesign, theme, component]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/Filter.tsx
 - src/app/components/HomeFilter.tsx
 - src/app/novel/NovelPageClient.tsx
 - src/app/page.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - /novel renders "Filter Novels" + "Refine Your Search" + "Apply Filters" using new select/chip styles
  - / renders "Find Your Next Read" + "Apply Filters" + YouTube toggle using new styles
  - npm run build (compiled successfully, 18/18 pages)
---

## Prompt

[Scope question answer] 3

(Context: user asked whether the "Filters Column" redesign was confirmed; I explained it hadn't been done and offered scope options; option 3 = redesign both the Home filter and the All Novels (`/novel`) filter.)

## Response

Redesigned the shared filter surface so both the Home and `/novel` filters get the new premium look (single component covers both).

- `src/app/components/Filter.tsx`: rebuilt as a themed surface card (rounded-3xl, `border-line`, `bg-surface`, shadow). Added optional `title`, `description`, and `checkboxesLabel` props; dropdowns now use dark-themed `select` controls with a chevron and gold focus ring; genre checkboxes are now pill "chips" with a gold check badge when active; the toggle is a gold switch on a cream row; the Apply button is gold and right-aligned.
- `src/app/components/HomeFilter.tsx`: passes a title/description ("Find Your Next Read"), removed the centered legacy wrapper, and restyled the Clear Filters button.
- `src/app/novel/NovelPageClient.tsx`: dropped the old `bg-cream-soft` centered panel; the filter section is now `Heading "Filter Novels"` + the new Filter card ("Refine Your Search") + a restyled Reset button.
- `src/app/page.tsx`: removed the redundant cream panel wrapper around `HomeFilter` (the Filter is now its own card); kept the results count line with spacing.

## Outcome

- tsc exit 0; `npm run build` compiled successfully (18/18 pages).
- `/novel` and `/` render the new filter (verified select/chip classes present, headings present).
- Behavior unchanged (same props/state, including the `/novel` YouTube toggle fix using `handleFilterChange`).

## Outcome notes
- Dropdown empty option label changed from "Select {label}" to "All {label}" for clearer UX.
- Genres now render as selectable chips rather than plain checkboxes (still semantically checkboxes via `sr-only` inputs).

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): add an active-filters summary row with removable chips above the results grid.

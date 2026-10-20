---
id: 56
title: Footer Cleanup Remove Duplicate Links
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [footer, navigation, cleanup, ux, seo]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/headerComponents/Footer.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - home HTML: footer headings Explore/Company/Legal present, "More"/"Useful Pages" gone, About linked once
---

## Prompt

check footer, remove useless/pointless ones

## Response

Audited the footer link columns. All targets were valid routes, but the columns were redundant:

- Removed the "More" column (Browse All Novels + Contact) — both duplicated other columns.
- Removed "About the Author" (duplicated "About Us").
- Removed "Featured"/"Genres" from the old Quick Links grouping and "Home" from the old Useful Pages list, then regrouped into three clear, non-overlapping columns:
  - **Explore**: Home, All Novels, Featured (/#featured), Genres (/#genres)
  - **Company**: About Us (/about), Contact Us (/contact)
  - **Legal**: Privacy Policy (/privacypolicy), Terms & Conditions (/terms)
- Every link is now unique and points to a real route (anchors `#featured`/`#genres` exist in `src/app/page.tsx`).

## Outcome

- tsc exit 0; home renders the new Explore/Company/Legal columns; old "More"/"Useful Pages" headings gone; "About Us" appears once.

## Outcome notes
- `/short-stories` page still exists but is not linked from the header/footer; its only inbound links are `PageHero` DEFAULT_LINKS ("Short Stories", shown on Privacy/Terms/404) and the writer page. Flagged to the user rather than deleted, since it may still hold short-story content.

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): decide whether to keep `/short-stories` and link it, or remove it and drop it from PageHero's DEFAULT_LINKS.

---
id: 47
title: Remove Top Social Utility Bar
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [header, ui, cleanup, layout]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/layout.tsx
deleted:
 - src/app/components/headerComponents/TopUtilityBar.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - curl / : 200; top social strip no longer rendered (only MobileHeader first)
---

## Prompt

announcement bar hata do

(Clarified via question tool: user meant the top social bar, `TopUtilityBar`.)

## Response

Removed the top social utility strip site-wide:

- `src/app/layout.tsx`: dropped the `TopUtilityBar` import and its render (now `<MobileHeader />` is the first element).
- Deleted `src/app/components/headerComponents/TopUtilityBar.tsx`.

`socials.ts` is retained (still used by `Footer.tsx`).

## Outcome

- The thin social-icon strip above the header is gone on every page; header now starts directly with Mobile/Desktop header.
- Verified: tsc exit 0; homepage HTML 200 and no longer contains the strip markup.

## Outcome notes
- No other references to `TopUtilityBar` remain in `src`.

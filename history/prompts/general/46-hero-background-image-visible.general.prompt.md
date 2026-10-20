---
id: 46
title: Make Hero Slider Background Image More Visible
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [hero, ux, overlay, ui, slider]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/HeroSlider.tsx
tests:
  - curl / : 200
  - homepage HTML contains "from-brand-deep via-brand-deep/75 to-brand-deep/15" (new overlay), not the old "via-brand-deep/85 to-brand-deep/40"
---

## Prompt

Hero section ki background image ko zara visible kro

## Response

Reduced the two overlays that were hiding the hero background banner in `src/app/components/HeroSlider.tsx`:

- Solid tint: `bg-brand-deep/85` → `bg-brand-deep/60` (line 82).
- Directional gradient: `from-brand-deep via-brand-deep/85 to-brand-deep/40` → `from-brand-deep via-brand-deep/75 to-brand-deep/15` (line 85), keeping the left side dark for text legibility while letting the image show through on the right.

## Outcome

- Hero background image is now clearly visible without hurting readability of the overlaid title/summary.
- Verified: `/` returns 200 and rendered HTML now contains the new overlay classes; old classes gone.

## Evaluation

- Graders run and results (PASS/FAIL): route render PASS; overlay class swap PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): if readability suffers on bright banners, add a subtle `backdrop-blur-sm` to the text column instead of re-darkening the whole image.

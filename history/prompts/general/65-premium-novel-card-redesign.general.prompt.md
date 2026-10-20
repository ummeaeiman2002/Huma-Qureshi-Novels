---
id: 65
title: Premium Novel Card Redesign
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [cards, ui, ux, design, novels, pdf]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/Cards/Novel.tsx
 - src/app/components/Cards/PDF.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - / /novel /about /writer/huma-qureshi /novel/dil-ki-aawaz all 200
  - /novel renders rounded-3xl cards, font-display titles, gold banner hairline, PDF badge, genre chips, CTA + arrow
  - npm run build (compiled successfully, 18/18 pages)
---

## Prompt

Redesign the Novels cards also.. but premium look

## Response

Rebuilt the `Novel` and `PDF` cards in the same editorial-premium language as the new header/footer. Props and click behaviour are unchanged, so every listing (home featured/latest, `/novel`, writer page, related content, more-from-author) picks the new look up automatically.

**Shared shell**
- `rounded-3xl`, thin `border-line` instead of `border-2`, soft shadow, gold-tinted lift + halo on hover (`hover:-translate-y-1.5 hover:border-gold/50`), gentle `active:scale-[0.99]`.
- Full-bleed banner with a `brand-deep` bottom-up gradient, a gold hairline at the image edge, and a slow `scale-105` image zoom on hover.
- Playfair `font-display` title (replacing the glowy `.title-bright`), gold-tinted on hover.
- Meta row: gold genre chip (still independently clickable, `z-20`) + muted "by {writer}".
- Summary clamped to 3 lines; bottom row pushed with `mt-auto` so CTAs align across a row.
- Footer: dark CTA pill + a circular arrow that turns gold on hover.

**Date** moved onto the image as a gold chip over the gradient (`en-GB` gives short `dd/mm/yyyy`, so it fits); falls back to a meta-row label when a card has no banner.

**PDF-only**: gold "PDF" badge (over the image, top-left), cream date chip top-right, and `format`/`size` moved up into the meta row as spec chips.

## Outcome

- tsc exit 0; `npm run build` compiled successfully (18/18 pages).
- Verified: `/`, `/novel`, `/about`, `/writer/huma-qureshi`, `/novel/dil-ki-aawaz` all 200; `/novel` renders 20 new cards (rounded-3xl shell, `font-display` titles, gold banner hairline, PDF badges, genre chips, CTA + arrow), home renders 16.

## Outcome notes
- Full-card overlay `Link` kept with `z-10` and `rounded-3xl` so the new overflow-hidden shell matches its hit area.
- `Episode.tsx` (episode list on the novel page only) was left untouched — it is not a listing card.

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): mirror the same treatment on `Episode.tsx`, or add a subtle "newest" gold ribbon for items released in the last 7 days.

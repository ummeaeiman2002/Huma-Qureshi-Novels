---
id: 69
title: Detail-Rich Novel Cards Restoration
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [cards, adsense, content, ui, design, novelty]
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
  - / /novel /writer/huma-qureshi all 200
  - SSR home: 14/14 cards have "Summary" label + Writer row + Genre row + line-clamp-4, emptySummary=0
  - SSR /novel: 18/18 cards have Summary + Writer + Genre rows, emptySummary=0
  - npm run build -> route table printed (19 pages), both legal pages static
---

## Prompt

ok novels cards ko redesigning mein tum ney summary or gener heading remove krdi.. is trhan tu low content consider hoga na tum woh theek kro pehlay.. Cards details rich rakhni hein takey adsence plocies sy match krein

## Diagnosis

Compared the current card against the pre-redesign copy in `E:\Downloads\Huma-Qureshi-Novels-main-freemium\...\Cards\Novel.tsx`:

- Old card had a gold **"Summary"** heading over a `line-clamp-4 text-xs` paragraph, plus a labelled **"Writer :" / "Genre :"** block with bold gold labels.
- Redesign (PHR #65) had collapsed that into a 10px genre chip + `by {writer}` line and a `line-clamp-3 text-[11px]` summary — so the card lost its headings and most of its visible text weight.
- Verified live markup: content was technically still rendered (home 14/14, `/novel` 18/18 had summary + genre), but at 11px muted with no labels it reads as thin/low-content.

## Change

- **`Cards/Novel.tsx`**: new `DetailRow` helper (gold uppercase `dt` label + hairline leader + right-aligned `dd` value). Card body now = optional date (no banner) → Playfair title → **Summary** block (gold label + `line-clamp-4 text-xs text-ink/80`) → `<dl>` rows **Writer** and **Genre** (genre value stays a clickable `z-20` pill → `/novel?genre=`) → `mt-auto` CTA row.
- **Summary fallback**: if `summary` is empty the card synthesises `"{title} — complete Urdu {genre} novel by {writer}. Read all episodes online free…"` so no card can render bare.
- **`Cards/PDF.tsx`**: same Summary block + rows **Writer, Genre, Format, Size** (rows hide when the value is empty — Sanity `downloadformat` is currently blank for the 6 published PDFs), plus a PDF-specific summary fallback. Date keeps its cream chip on the image.
- Premium shell unchanged: `rounded-3xl`, gold hover halo, banner gradient + gold hairline, CTA pill + arrow. Props unchanged, so home, `/novel`, writer, related-content and more-from-author all inherit.

## Outcome

- tsc exit 0; `/`, `/novel`, `/writer/huma-qureshi` all 200.
- SSR check: home 14/14 cards and `/novel` 18/18 cards now carry `>Summary<`, `>Writer<`, `>Genre<`, `line-clamp-4`, and zero empty summary paragraphs.
- `npm run build` succeeded (19-page route table).

## Outcome notes
- Detail rows use `<dl>/<dt>/<dd>` for semantic markup; label leader line hides itself when the value wraps (`min-w-3 flex-1`).
- Card height grows ~40px vs the stripped version — grids use `flex-wrap gap-5`, so no layout breakage.
- 6 PDFs on `/novel` show no Format/Size rows because `downloadformat`/`downloadsize` are empty in Sanity; filling that data would light the rows up without code changes.

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): pass `views`/`totalViews` into both cards as a "Reads" row, or fill `downloadformat`/`downloadsize` in Sanity so PDF cards show their spec rows.

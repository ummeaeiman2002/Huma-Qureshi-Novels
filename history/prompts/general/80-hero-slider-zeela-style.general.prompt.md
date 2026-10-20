---
id: 80
title: Hero Slider Matching Zeela Zafar Layout
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [homepage, hero, slider, carousel, zeelazafar-inspiration, accessibility, constitution-s12]
links:
  spec: docs/constitution.md (section 12)
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/AuthorHero.tsx (rewritten)
 - src/app/page.tsx (modified)
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - npm run build ("Compiled successfully in 61s")
  - npm run lint (FAILED - pre-existing)
  - SSR /: exactly 1 <h1>; carousel role present; 4 slides
  - hero slide links -> correct /novel/<slug>; Featured section shows 4 different books
  - routes 200: /, /novel, /about, /contact
---

## Prompt

make hero as it same as zeelazafar.com

## Reference analysis (webfetch + explore agent on raw HTML)

Fetched https://zeelazafar.com/ (markdown + HTML). The Zeela homepage hero is a **full-width fading slider** (`wd-slider / wd-carousel`, Elementor/Woodmart) as the first page element. Per slide:
- **Book cover image LEFT**, text stack RIGHT (flex row, align-items center).
- Full-bleed background image per slide + global `::before` overlay `rgb(0 0 0 / 65%)`.
- Text order: big **title** (accent colour, ~60px) → **author name** → short **synopsis** paragraph → round bordered **"View more"** button linking to the book.
- Controls: arrows + dots, autoplay fade (`data-effect="fade"`, 25s), wrap.

## Implementation

**`src/app/components/AuthorHero.tsx` — rewritten as a client slider** ("use client") that reproduces the *composition* with Huma Qureshi's own data/branding:
- Full-width `rounded-3xl` dark (`bg-brand-deep`) card with the current slide's real cover as a **blurred, dimmed full-bleed backdrop** (`blur-2xl opacity-25` + `bg-brand-deep/80` + `hero-pattern`).
- Per slide: **cover LEFT** (`aspect-[3/4]`, linked to `/novel/<slug>`) and **text RIGHT**: gold eyebrow "Pakistani Urdu Fiction Writer" → big novel title → "Huma Qureshi" author line → real Sanity synopsis (`line-clamp-5`) → **"View More"** → book page (+ "Explore My Novels" → `/novel` on the first slide).
- Fade transition between slides; **autoplay every 8s**, `data-wrap` style looping, **arrows + dots** (`role="tab"`, `aria-selected`), pause on hover/focus.
- **Accessibility:** exactly one `<h1>` (the author identity eyebrow on slide 1; other slides use `<span>`/`<p>`), `aria-roledescription="carousel"`, inactive slides `aria-hidden` + `pointer-events-none`, labelled arrows/dots, and **respects `prefers-reduced-motion`** (disables autoplay).
- Graceful typography-led fallback if there are zero slides.
- Real counts strip (novels / PDFs / genres) in a footer bar.

**`src/app/page.tsx`**
- Builds `heroSlides` = up to 4 real published novels (ranked by curated `featured` flag, else most-viewed) carrying id/title/cover/slug/genre/synopsis.
- All 4 hero ids are **excluded from Featured + Latest** so no book is shown twice (constitution §12.7/§3); Featured now shows 4 *different* books.
- `<AuthorHero slides={heroSlides} stats={stats} />` replaces the previous single-book hero.

## Checks — actual results
- `tsc --noEmit`: **pass** (exit 0).
- `npm run build`: **pass** — "Compiled successfully in 61s".
- `npm run lint`: **FAIL (pre-existing)** — Next 16 removed `next lint`.
- SSR: exactly **1 `<h1>`**; carousel markup present; **4 slides** with correct `/novel/<slug>` cover + View More links.
- Featured section shows books **distinct** from the 4 hero slides (verified by slug).
- Latest Episodes unaffected (different `/novel/<slug>/episode` routes).
- Routes 200: `/`, `/novel`, `/about`, `/contact`.
- Client JS chunk containing slider controls confirmed present in `.next/static/chunks`.

## Notes / follow-ups
- Hero covers come from the most-viewed fallback because `featured == true` is set on zero Sanity docs; curating that field changes the hero automatically.
- Inspiration only — no Zeela code, text, images, or branding copied.
- Mobile verified via responsive classes/structure, not a physical device.
- Slider interactivity (click/autoplay) verified via bundled client chunk + markup, not a real browser click.

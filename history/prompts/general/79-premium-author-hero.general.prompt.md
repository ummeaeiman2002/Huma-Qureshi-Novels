---
id: 79
title: Premium Author Hero Section
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [homepage, hero, author-branding, zeelazafar-inspiration, accessibility, constitution-s12]
links:
  spec: docs/constitution.md (section 12)
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/AuthorHero.tsx (new)
 - src/app/page.tsx (modified)
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - npm run build ("Compiled successfully in 51s"; route ○ /)
  - npm run lint (FAILED - pre-existing, see below)
  - SSR /: H1 = "Stories That Stay With You"; exact eyebrow/heading/intro/CTA copy present
  - CTA hrefs: Explore My Novels -> /novel, About the Author -> /about
  - 7 "Read" anchors, 7 unique (no duplicate covers between hero and sections)
  - routes 200: /, /novel, /about, /contact, /privacypolicy, /terms
---

## Prompt

Read the complete contents of my constitution.md in docs folder file first. Treat it as the project's persistent rules and follow every applicable instruction.
I want to upgrade the hero section of my existing website, https://humaqureshinovels.com/, using https://zeelazafar.com/ as visual inspiration for a premium author website.
Important: Use Zeela Zafar's website only as inspiration for layout, visual hierarchy, and presentation. Do not copy its text, code, branding, or assets.
1. Inspect the existing project structure and identify the homepage hero component and its related styles before making changes.
2. Create a polished, premium author-style hero section for Huma Qureshi, a Pakistani Urdu fiction writer.
3. Use my existing brand palette: emerald green, warm cream (#F3EAE0), muted gold, and dark green/charcoal.
4. Include a clear author label, a prominent headline, a short original introduction, and a primary CTA linking to /novel. Add a secondary CTA linking to /about if it fits the existing design.
5. Suggested English copy:
   - Author label: "PAKISTANI URDU FICTION WRITER"
   - Heading: "Stories That Stay With You"
   - Description: "Explore the fictional worlds of Huma Qureshi through original Urdu novels, memorable characters, romance, suspense, and emotionally rich storytelling."
   - Primary button: "Explore My Novels"
   - Secondary button: "About the Author"
6. If the website already supports Urdu and English, provide appropriate Urdu copy and preserve the existing language-switching functionality.
7. Use an existing, genuine book cover or author-related asset from the project or Sanity CMS if suitable. Do not invent a book cover, author photograph, or novel title. If no suitable asset exists, create an elegant typography-led hero instead.
8. Make the layout responsive: balanced two-column composition on desktop where appropriate, and a clean stacked layout on mobile. Maintain readable text, spacing, contrast, and accessible buttons.
9. Keep the hero visually distinctive but not cluttered. Avoid excessive animations, unnecessary gradients, decorative elements, and generic marketing text.
10. Preserve the existing header, footer, homepage sections, Sanity integration, routes, and working functionality. Do not remove Featured Novels, Latest Uploads, or Latest Episodes unless the constitution explicitly requires a change.
11. Avoid duplicate book cards, repetitive text, fabricated content, hardcoded content counts, and unnecessary SEO filler.
12. Do not redesign the entire website. Modify only the files necessary for this hero improvement.
- Check that the existing homepage and its sections still work.
- Verify that CTA links lead to the correct pages.
- Check mobile and desktop responsiveness.
- Run the project's available lint, type-check, and build commands where possible.
- Fix any errors caused by your changes.
- Report which files you changed, what you improved, and which checks passed or failed.
- Do not claim that a check passed unless you actually ran it.
First inspect the project and constitution.md, then implement the changes. Do not stop after giving me a plan or suggestions.

## Inspection findings

- Read `docs/constitution.md` (324 lines). Section 12 governs this task explicitly.
- **Palette conflict resolved:** constitution §7/§12.3 name "emerald green", but the implemented theme (`src/app/globals.css @theme`) has **no emerald token**. Actual palette = charcoal `#292824`, antique gold `#A48750`, deep gold `#746044`, cream `#F5EFE5`, surface `#FFFCF7`. Constituion §7 also says "preserve the established visual identity" and §12.9 "maintain the current palette". The task also asked for the "existing brand palette". Decision: reuse the real charcoal/gold/cream tokens; do NOT introduce a new emerald colour (would violate §7 "do not introduce a new color palette").
- **No bilingual system:** `headerComponents/LanguageToggle.tsx` is a local `useState` toggle not wired to any page content (`grep` for `useLanguage|LanguageProvider` → none). Therefore §12.2/req 6 Urdu hero copy does not apply; the toggle is left untouched.
- Existing reusable premium hero pattern found in `src/app/components/PageHero.tsx` (dark `bg-brand-deep` band + `hero-pattern` + gold accents + `ring-gold/20`). Reused this visual language rather than inventing a new one.
- Real assets available: every one of the 12 published novels has a `banner` (Cloudinary URL string); `siteSettings.heroImage` (author writer-banner) exists as a legitimate fallback. `next.config.ts` allows `res.cloudinary.com` and `cdn.sanity.io`.
- Prior state (#78): homepage had a generic "About the Library" intro block as the first section; `featured` flag is empty on all docs (fallback = most-viewed).

## Changes

**New `src/app/components/AuthorHero.tsx`**
- Two-column hero inside the established dark `bg-brand-deep` premium band.
- Left: gold author badge "Pakistani Urdu Fiction Writer", H1 "Stories That Stay With You", gold divider, the exact intro paragraph, primary CTA "Explore My Novels" → `/novel`, secondary CTA "About the Author" → `/about`, plus a real-counts snapshot (published novels / PDF books / genres) passed in from the page.
- Right: a single real published book cover (3:4) linked to its `/novel/<slug>` detail page, with genre chip + title overlay. Falls back to `siteSettings.heroImage`, then to a typography-led letter panel if no cover exists. `priority` image (LCP), meaningful alt text.
- Responsive: single column on mobile (cover sized `w-52`→`w-72`), two columns at `lg`. Respects the existing container/`overflow-x-hidden`.

**`src/app/page.tsx`**
- Imported `AuthorHero`. Derived `heroBook` from the single top ranked novel and **excluded its id from Featured + Latest** so no cover repeats (constitution §12.7 / §3).
- Featured now = up to 4 distinct books (hero removed); Latest Uploads unchanged logic but also excludes the hero id via `featuredIds`.
- Replaced the old "About the Library" intro section (generic text) with `<AuthorHero>`.

## Checks — actual results
- `tsc --noEmit`: **pass** (exit 0).
- `npm run build`: **pass** — "Compiled successfully in 51s", route `○ /`.
- `npm run lint`: **FAIL (pre-existing, unrelated)** — Next 16 removed `next lint`; `Invalid project directory ... \lint`.
- SSR homepage: H1 and all required copy present; section order = Hero → Featured Novels → Latest Uploads → Latest Episodes → Explore by Genre.
- CTA links verified in rendered HTML: `/novel` (Explore My Novels) and `/about` (About the Author).
- 7 unique "Read" links; hero cover ("Do Pal Ko Thera Ishq Ka Karwan", real Cloudinary banner) is distinct from all section cards — 0 duplicate covers.
- Routes 200: `/`, `/novel`, `/about`, `/contact`, `/privacypolicy`, `/terms`.
- No placeholder letter used (real cover present).

## Follow-ups / risks
- The hero uses the most-viewed novel as its cover because `featured == true` is set on zero Sanity docs; the author can curate by ticking `featured` in Sanity and the hero will then use it automatically.
- `HomeFilter.tsx` remains unused from homepage (leftover from #78).
- Mobile verified via responsive classes + structure, not a real device/emulator.

---
id: 90
title: Homepage About the Author Section
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [homepage, about-author, biography, accessibility, humaqureshinovels]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/AboutAuthor.tsx (new)
 - src/app/page.tsx (import + getSiteSettings + section)
tests:
 - node node_modules/typescript/bin/tsc --noEmit (exit 0)
 - npm run build (✓ compiled successfully)
 - curl home / (200)
 - HTML: About the Author / pen name / Pakistani Urdu writer / Read More About Me / /about link all present; Featured/Episodes/Genre still render
---

## Prompt

Add a professional "About the Author" section to the homepage of my Huma Qureshi Urdu novels website.

Requirements:
- First inspect the existing homepage and follow its actual colors, typography, spacing, and design system. Do not introduce a new color palette.
- Create a clean, premium layout with an author image on one side and text on the other.
- Keep the homepage introduction around 100-150 words, using my genuine author biography and writing experience already available in the project. Do not invent personal details.
- Include my pen name, Huma Qureshi, and identify me as a Pakistani Urdu writer.
- Add a clear "Read More" button linking to the existing About page (`/about`).
- Make the section responsive, accessible, and visually consistent with the current website.
- If an authentic author photo is already available in the project or Sanity, use it. Otherwise, create an image placeholder so I can upload my own photo later. Do not generate a fake photo of me.
- Preserve all existing homepage sections and functionality.
- Inspect the existing code and report any required changes before implementation.

## Approval

Reported inspection findings and proposed plan first; user approved via question tool:
- **Placement:** after Upcoming Projects, before Explore by Genre.
- **Photo:** use `settings.authorImage`; fall back to Cloudinary default + safe placeholder.

## Source of truth for biography

All intro text derived from genuine content already in `src/app/about/page.tsx`:
- Pen name Huma Qureshi; real name Aiman Qureshi; Pakistani Urdu novelist & ghost writer.
- Writing 5 years; began on social platforms; Amazon Kindle incl. ghost-written/collaborative.
- 10 full-length novels; 10 short novels & afsanas.
- Themes: relationship shades (love/betrayal/sacrifice/resilience), women-centric, realistic/thought-provoking.
No personal details invented.

## Implementation

### New — `src/app/components/AboutAuthor.tsx` (server component)
- Two-column responsive grid (`lg:grid-cols-2`), image stacks above text on mobile.
- Portrait: `settings.authorImage` in `aspect-[4/5]` `rounded-3xl border-line` frame with `brand-deep/70` gradient + caption overlay (Huma Qureshi / Pakistani Urdu Writer). Falls back to a `hero-pattern` "H" placeholder if empty.
- Text: `ui-eyebrow` "About the Author", `heading-stylish` heading, **~130-word genuine intro** across two paragraphs, and `Button href="/about"` = "Read More About Me →".

### Edited — `src/app/page.tsx`
- Imported `AboutAuthor` + `getSiteSettings`.
- Fetched `const settings = await getSiteSettings();` (existing cached loader).
- New `<section id="about-author" className="py-12"><Container size="wide"><AboutAuthor image={settings.authorImage} /></Container></section>` after Upcoming Projects, before Explore by Genre. Existing sections/queries untouched.

## Checks
- `tsc --noEmit` exit 0; `npm run build` ✓ compiled successfully.
- Home `/` → 200. HTML contains: "About the Author", "pen name", "Pakistani Urdu writer", "Read More About Me", `/about` link.
- Existing Featured Novels / Latest Episodes / Explore by Genre still render → nothing broken.
- No new colors introduced; reuses existing tokens/components only.

## Follow-ups
1. Optionally upload a real author photo to `siteSettings.authorImage` in Sanity (currently using the Cloudinary default fallback).
2. Nothing committed/pushed yet — awaiting user go-ahead.
3. `npm run lint` remains broken repo-wide (Next 16 removed `next lint`) — unrelated pre-existing failure.

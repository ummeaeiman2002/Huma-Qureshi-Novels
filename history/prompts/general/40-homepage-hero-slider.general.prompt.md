---
id: 40
title: Rebuild Homepage Hero as Auto Slider (Zeela-style)
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [homepage, hero, slider, ui]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/HeroSlider.tsx
 - src/app/page.tsx
tests:
 - node node_modules/typescript/bin/tsc --noEmit (exit 0)
 - curl / : 200, aria-roledescription="carousel", 5 slides, arrows + dots, CTA present
---

## Prompt

homepage ka hero section hamein zeelazafar.com web jaisa bnana hey.. ok.. check kro pehlay or dekho kia samjh aya

## Response snapshot

Analyzed zeelazafar.com's hero (Woodmart/Elementor fade slider: full-bleed bg photo + 65% dark overlay, 2-col = book cover left / title(60px)+author+desc+View-more right, arrows+dots, ~25s autoplay). Built `HeroSlider.tsx` (client) replicating that layout with the site's own brand tokens (deep green + gold + cream, `font-display`). Auto-rotate every 6s with pause on hover/focus, fade transition, prev/next arrows, clickable dots, accessible (aria-roledescription carousel, aria-label per slide). Wired into `page.tsx` using the latest 5 novels from existing Sanity data (title, writer, genre, summary via cleanDescriptionLong, slug, banner as both bg and cover). Removed now-unused `Image` import and `getSiteSettings()` usage; kept a fallback static hero when no slides.

## Outcome

- ✅ Impact: High — homepage hero now matches the reference slider pattern.
- 🧪 Tests: tsc PASS; rendered homepage shows carousel with 5 slides (Do Pal Ko Thera Ishq..., Intiqam E Janaa..., etc.), arrows, dots, and Read Novel CTA.
- 📁 Files: HeroSlider.tsx (new), page.tsx.
- 🔁 Next prompts: tune timer/transition, add real cover vs background art, deploy to live.
- 🧠 Reflection: Reused existing `banner` URL field for both background and cover since only one image per novel is available; slight blur/overlay makes it work.

## Evaluation notes (flywheel)

- Failure modes observed: transient "Image is not defined" during intermediate edit (import removed before JSX replaced) — resolved in same change.
- Graders run and results (PASS/FAIL): tsc PASS; render PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): separate hero/cover image field in Sanity.

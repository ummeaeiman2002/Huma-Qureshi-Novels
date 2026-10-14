---
id: 1
title: AdSense-focused UX redesign across all routes
stage: refactor
date: 2026-10-13
surface: agent
model: opencode/big-pickle
feature: none
branch: n/a
user: missa
command: general
labels: ["design-system", "tailwind", "seo", "refactor", "adsense", "accessibility"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/app/globals.css
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/app/components/ui/Container.tsx
  - src/app/components/ui/Button.tsx
  - src/app/components/ui/SectionHeading.tsx
  - src/app/components/Logo.tsx
  - src/app/components/headerComponents/navLinks.ts
  - src/app/components/headerComponents/DesktopHeader.tsx
  - src/app/components/headerComponents/MobileHeader.tsx
  - src/app/components/headerComponents/Footer.tsx
  - src/app/components/Cards/Novel.tsx
  - src/app/components/Cards/Episode.tsx
  - src/app/components/RelatedContent.tsx
  - src/app/novel/[slug]/NovelPageClient.tsx
  - src/app/novel/[slug]/[episodeslug]/EpisodePageClient.tsx
  - src/app/download/[slug]/page.tsx
  - src/app/pdf/[slug]/page.tsx
  - deleted: src/app/components/ReaderReviews.tsx
  - deleted: src/app/components/ReadingStreak.tsx
  - deleted: src/app/components/Achievements.tsx
  - deleted: src/app/components/homePageComponents/ReaderPoll.tsx
  - deleted: src/app/components/homePageComponents/Latest.tsx
  - deleted: src/app/components/homePageComponents/Popular.tsx
  - deleted: src/app/components/homePageComponents/Trending.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 static pages generated)
  - npm run lint -> FAIL (next lint removed in Next 16; eslint not installed)
---

## Prompt

What did we do so far?

Continue if you have next steps, or stop and ask for clarification if you are unsure how to proceed.

## Response snapshot

Continued the AdSense-focused redesign. Fixed typed-routes TS errors by typing nav/button
hrefs with the generated `Route` type from `next`. Reverted the layout padding wrapper
(`px-5 lg:px-20`) and removed the duplicate padding from `Container`. Fixed invalid
`border-3` and nested `<button>`-in-`<Link>` in `Cards/Episode.tsx` and `Cards/Novel.tsx`.
Removed non-functional/fake features (ReaderPoll, ReaderReviews, ReadingStreak,
Achievements) from all detail pages and deleted their now-dead component files.
`npx tsc --noEmit` and `npm run build` both pass. `npm run lint` cannot run because the
script uses the removed `next lint` and eslint is not installed.

## Outcome

- ✅ Impact: Site-wide design system + shared header/footer applied; fake features removed; production build green.
- 🧪 Tests: tsc PASS, build PASS, lint not runnable (config issue).
- 📁 Files: ~18 edited/added, 7 dead files removed.
- 🔁 Next prompts: Align remaining static/listing pages to new tokens; wire real AdSense ad slots; set up ESLint (flat config) since `next lint` is gone.
- 🧠 Reflection: Typed routes make plain-typed hrefs fail; prefer the generated `Route` type.

## Evaluation notes (flywheel)

- Failure modes observed: `next lint` removed in Next 16; ESLint absent, so lint gate is unavailable.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS, lint N/A.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Add a minimal flat `eslint.config.mjs` with `next/core-web-vitals` and update the `lint` script to `eslint .`.

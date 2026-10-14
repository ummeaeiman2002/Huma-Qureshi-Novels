---
id: 28
title: Add reader reviews section to home page
stage: general
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: reviews
branch: n/a
user: missa
command: general
labels: ["homepage", "reviews", "testimonials", "social-proof"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/app/page.tsx
tests:
  - npx tsc --noEmit -> EXIT 0
  - GET / -> 200
  - home HTML contains "What Our Readers Say"
  - home HTML contains marquee-track and review image cards
---

## Prompt

wait homepage pr review images show nahi horhy .why?

(Clarifying answer when asked where to place the section: "FAQ / Home of Reading ke baad")

## Response snapshot

Cause: the home page (`src/app/page.tsx`) did not import or render `ReviewMarquee` / `getTestimonials` at all — reviews only existed on the novel, pdf, short-story and episode pages. Nothing was broken; the section was simply absent.

Fix (per user placement choice "FAQ / Home of Reading ke baad"):
- Added imports: `ReviewMarquee` and `getTestimonials` from `@/lib/sanity/queries`.
- Fetched `const testimonials = await getTestimonials(12);` in `HomePage`.
- Rendered a new section `<section id="reviews" className="py-14"><Container><ReviewMarquee reviews={testimonials} /></Container></section>` immediately after the FAQ / "The Home of Urdu Novel Reading" section and before "Stay Connected".

`ReviewMarquee` renders `null` when there are no review images, so the section is safe when empty; with >3 reviews it shows the animated marquee.

Verified: tsc PASS; home 200; HTML contains "What Our Readers Say", `marquee-track`, and reader review image cards.

## Outcome

- ✅ Impact: home page now shows reader review images (social proof), matching the other content pages.
- 🧪 Tests: tsc PASS; home HTML checks PASS.
- 📁 Files: `src/app/page.tsx`.
- 🔁 Next prompts: none.
- 🧠 Reflection: the reviews component was already reusable; only the home page lacked the data fetch + render.

## Evaluation notes (flywheel)

- Failure modes observed: none; component safely returns null on empty data.
- Graders run and results (PASS/FAIL): tsc PASS; HTTP PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a

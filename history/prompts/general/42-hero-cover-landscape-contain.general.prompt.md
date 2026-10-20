---
id: 42
title: Hero Cover Image to Landscape Full-View
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [hero, slider, images, ui]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/HeroSlider.tsx
tests:
 - node node_modules/typescript/bin/tsc --noEmit (exit 0)
 - curl / : 200, no aspect-[3/4], cover box max-w-[380px], object-contain
---

## Prompt

but hero sections ki image landsacpe hein but woh potrait hey to sara text cut hojata hey.. hero sections ki image ko jo actual size hey wohi hero section mein kardo takey picture complt nazr aye.. or i think woh landscape hey

## Response snapshot

Homepage hero cover used a portrait `aspect-[3/4]` box with `object-cover`, cropping landscape banners so image text was cut. Changed the HeroSlider cover to a landscape `aspect-video` box, widened the left column to `minmax(0,380px)`, and switched to `object-contain` (with `bg-black/20` backing + updated `sizes`) so the whole image shows. Verified the homepage renders without the portrait box. Flagged the novel/episode detail-page top banners (which force 1920x1080 / 16:9) as a related spot pending user confirmation.

## Outcome

- ✅ Impact: Medium — hero image no longer cropped; full/actual image visible.
- 🧪 Tests: tsc PASS; homepage 200 with landscape contain cover.
- 📁 Files: HeroSlider.tsx.
- 🔁 Next prompts: optionally fix detail-page banners (NovelPageClient.tsx:120, EpisodePageClient.tsx:169).
- 🧠 Reflection: contain guarantees "complete" but may letterbox for non-16:9 images; easy to switch to cover if bars unwanted.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): tsc PASS; render PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): read banner aspect metadata from Sanity to set the box exactly.

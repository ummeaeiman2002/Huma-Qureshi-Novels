---
id: 41
title: Make Card Images Responsive (aspect-video + fill)
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [cards, images, responsive, ui]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/Cards/Novel.tsx
 - src/app/components/Cards/PDF.tsx
 - src/app/components/NovelSpotlight.tsx
tests:
 - node node_modules/typescript/bin/tsc --noEmit (exit 0)
 - curl / : 200, no h-[112px] w-[200px], 14 aspect-video blocks, fill images
 - curl /novel/<slug> : 200, spotlight max-w-[320px] present
---

## Prompt

acha Picture size cards ka aisa nahi hoskta kay haar jaaga adjust hojaye?agar hum cards pitures size chang krdein like...Header mein or bht sarey sections mein picture size adjust nahi hota theek sy

## Response snapshot

Root cause: Novel/PDF cards and NovelSpotlight used a hardcoded image box `h-[112px] w-[200px]` with `object-cover`, so the image never scaled with the responsive card width and varied source ratios were cropped oddly. Replaced all three with a responsive `relative aspect-video w-full` box + next/image `fill` + `sizes`, keeping `object-cover` (fill/crop) per the user's choice. Confirmed via grep only these 3 spots used the fixed box (Episode card has its image commented out). Header logo left as-is (small fixed UI element, by design).

## Outcome

- ✅ Impact: Medium — card/section thumbnails now scale with their container across breakpoints.
- 🧪 Tests: tsc PASS; homepage 200 (14 aspect-video tiles, fixed size gone); novel detail page 200 with responsive spotlight image.
- 📁 Files: Cards/Novel.tsx, Cards/PDF.tsx, NovelSpotlight.tsx.
- 🔁 Next prompts: optionally standardize remaining images (header logo sizes, detail page banners) if user opts for site-wide.
- 🧠 Reflection: Existing responsive patterns (ReviewMarquee, HeroSlider) were the template — reused them instead of inventing a new approach.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): tsc PASS; render PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): widen card max-width so 16:9 covers look larger on XL grids.

---
id: 43
title: Detail-Page Banners Show Full Image (natural ratio)
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [images, banners, detail-page, ui]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/novel/[slug]/NovelPageClient.tsx
 - src/app/novel/[slug]/[episodeslug]/EpisodePageClient.tsx
 - src/app/pdf/[slug]/page.tsx
 - next.config.ts
tests:
 - node node_modules/typescript/bin/tsc --noEmit (exit 0)
 - curl /novel/<slug> : 200, banner uses width:100%;height:auto (natural ratio)
 - curl /pdf/<slug> : 200, same
 - next.config images.qualities [75,85] removes quality-85 warning after restart
---

## Prompt

but hero sections ki image landsacpe hein but woh potrait hey to sara text cut hojata hey.. hero sections ki image ko jo actual size hey wohi hero section mein kardo takey picture complt nazr aye.. or i think woh landscape hey
(follow-up answer: Haan, inhe bhi poora dikhao)

## Response snapshot

Extended the "show full image at its actual aspect ratio" fix to the detail-page top banners. Replaced the forced 1920x1080 / `object-cover` rendering in NovelPageClient, EpisodePageClient and pdf/[slug] with the Next.js unknown-dimensions pattern: `width={0} height={0}` + `sizes` + `style={{ width: "100%", height: "auto" }}`, so each banner renders at its intrinsic ratio (fully visible, no crop). Writer avatar (circular 180x180) intentionally left as-is. Also added `images.qualities: [75, 85]` to next.config.ts to silence the Next 16 "quality 85 not configured" warning.

## Outcome

- ✅ Impact: Medium — novel/episode/pdf banners no longer cropped by a forced 16:9 box.
- 🧪 Tests: tsc PASS; novel + pdf pages 200 with natural-ratio banner; quality warning gone after config-driven restart.
- 📁 Files: NovelPageClient.tsx, EpisodePageClient.tsx, pdf/[slug]/page.tsx, next.config.ts.
- 🔁 Next prompts: none required.
- 🧠 Reflection: width/height=0 + style width/height is the documented Next.js approach for remote images with unknown dimensions; may trade a little CLS for correct ratio.

## Evaluation notes (flywheel)

- Failure modes observed: brief window where dev server restarted for next.config change; requests after restart clean.
- Graders run and results (PASS/FAIL): tsc PASS; render PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): read banner aspect metadata from Sanity to reserve layout space (avoid CLS).

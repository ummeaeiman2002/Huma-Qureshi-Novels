---
id: 16
title: Novel rich content — Characters section + sneak peek scenes
stage: green
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: novel-cms-detail
branch: n/a
user: missa
command: general
labels: ["sanity", "schema", "cms", "novel-detail", "characters", "sneak-peeks", "rich-content"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/sanity/schemaTypes/novelparent.ts
  - src/app/components/novelPage/Characters.tsx
  - src/app/components/novelPage/SneakPeeks.tsx
  - src/app/novel/[slug]/NovelPageClient.tsx
  - src/app/novel/[slug]/page.tsx
  - src/app/short-stories/[slug]/page.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)

---

## Prompt

acha hum novels page open karein gy to summary, author's note or details waghira again.. characers details, or sneek peek kay liye koi scene ka feild nahi hey? humein page pr rich content rakhna hey

## Response snapshot

Added the missing rich-content fields to the novel (and short-story) detail page.

Schema (`novelparent`):
- New field group "Characters" with `characterintro` (text) and `characters[]` — each character
  has name (required), role, description and an optional image.
- Sneak peek object gained a `scene` (text) field ("Scene / Excerpt") and its image is now optional
  so a peek can be text-only (scene) or image-only.

Frontend:
- New `Characters.tsx`: responsive card grid showing a character avatar (image or gold initial
  fallback), name, role badge and description; renders only when characters exist.
- `SneakPeeks.tsx` reworked: cards now include image (if any) OR a gold quote placeholder, the scene
  excerpt, and a dark caption footer; the lightbox shows the image and the full scene text.
- `Characters` rendered in `NovelPageClient` right after the summary/about sections and before the
  author block.

Data:
- GROQ in `/novel/[slug]` and `/short-stories/[slug]` now projects `characterintro`, `characters[]`
  (with `imageUrl`) and `scene` on each sneak peek.

## Outcome

- ✅ Impact: Novel/short-story pages now carry a Characters section and scene-based sneak peeks — richer, more unique content.
- 🧪 Tests: tsc PASS, build PASS (21/21).
- 📁 Files: 6.
- 🔁 Next prompts: optionally add character image alt/ordering polish; consider a "Themes & Tropes" field next for even richer content.
- 🧠 Reflection: making the sneek-peek image optional let the same gallery hold both visual and text scenes without a second component.

## Evaluation notes (flywheel)

- Failure modes observed: none. All new fields optional; existing documents render unchanged.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): add `themes` string array rendered as pills near Tags.

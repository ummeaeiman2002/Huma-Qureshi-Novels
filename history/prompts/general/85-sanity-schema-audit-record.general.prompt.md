---
id: 85
title: Sanity Schema Audit And Portable Record
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [sanity, schema, audit, migration, documentation, novelparent]
links:
  spec: docs/constitution.md
  ticket: null
  adr: null
  pr: null
files:
 - docs/sanity-schema-record.md (created)
tests:
  - node tmp-schema-audit.js (live Sanity field-population audit across 18 document types)
  - source review of all 18 schema files + queries.ts + structure.ts + env.ts + sanity.config.ts
---

## Prompt

sanity check kro kaisy bnai hoi hey? jo novels kay main pages hein woh feild yaad rakho hum new project pr shift hongey to record bna lo scheme ka liye taky next mein issue na ho.

## What I did

**Audited the entire Sanity content model** (source + live data) and wrote a portable record at **`docs/sanity-schema-record.md`** so the new project can reproduce the schema without surprises.

### Source reviewed
- All 18 schema files in `src/sanity/schemaTypes/`, plus `index.ts`, `structure.ts`, `env.ts`, `sanity.config.ts`.
- App-side contracts: `src/lib/sanity/queries.ts`, `src/lib/sanity/siteSettings.ts`, `src/lib/siteDefaults.ts`.

### Live data audit (via a temp `@sanity/client` script, projectId 92mgyrwt)
Queried document counts + per-field population for every type:
- `novelparent` 12, `novel` 160, `pdf` 6, `genre` 7, `writer` 6, `comment` 122, `reaction` 1, `testimonial` 2, `siteSettings` 1, `premiumNovel` 1, `user` 1; `category`/`announcement`/`downloadSection`/`systemConfig`/`premiumEpisode`/`subscription`/`payment` all **0**.
- Recorded exactly which fields are populated vs empty for novelparent (e.g. populated: title, slug, novelreleasedate, banner, genre, tags, noveldescription, descriptionlanguage, writer, authornote; empty: featured, category, language, novelstatus, shortdescription, aboutnovel, characters, sneakPeeks, all download format/size fields, SEO, etc.).

### Record contents (10 sections)
1. File layout + gotchas.
2. Document-type registry table.
3. **`novelparent` — the novel main page** — all 58 fields by group + live populated/empty list.
4. `novel` (episodes) fields + live state.
5. `pdf` fields + live state.
6. Taxonomy + people (`genre`, `category`, `writer`, incl. Huma writer `_id`).
7. Supporting types (comment/reaction/testimonial/announcement/downloadSection/systemConfig) + premium/auth.
8. `siteSettings` singleton incl. the new summary fields.
9. GROQ contracts the app relies on.
10. **New-project checklist** to avoid breakage.

### Critical findings captured for migration
- Every type MUST be registered in `index.ts`.
- `siteSettings` is a **singleton** (fixed id `"siteSettings"`).
- All `writer` references use a **hard-coded readOnly `_ref`** to the Huma Qureshi doc `e261df38-9273-4bdf-bed2-6db903573be8`; the whole site filters by `writer->writername == "Huma Qureshi"` — must recreate that doc/name in the new dataset.
- Most "image" fields are **plain string URL fields** (Cloudinary), not Sanity assets — only a few use real `image` assets.
- Listing/sort logic depends on `novelreleasedate`/`pdfreleasedate`/`episodereleasedate`, `banner`, `genre`, `writer`.
- `next.config.ts` must whitelist the Cloudinary accounts + `cdn.sanity.io`.

## Checks
- Live audit script ran successfully and printed real field counts.
- `docs/sanity-schema-record.md` created (14,765 bytes).
- No source files changed (documentation only). Temp script deleted.

## Notes / next
- No code/schema changed, so no build needed; **nothing pushed**.
- If you want, I can also generate a ready-to-drop `schemaTypes/` bundle or a seed script for the new dataset.

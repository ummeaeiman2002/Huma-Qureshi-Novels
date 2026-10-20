---
id: 86
title: Drop-in Sanity Schema Bundle And Project ID Guide
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [sanity, schema-export, migration, env, project-id, documentation]
links:
  spec: docs/sanity-schema-record.md
  ticket: null
  adr: null
  pr: null
files:
 - docs/schema-export/README.md (created)
 - docs/schema-export/schemaTypes/*.ts (19 files copied)
 - docs/schema-export/lib/*.ts (3 files copied)
 - docs/schema-export/env.ts (copied)
 - docs/schema-export/structure.ts (copied)
tests:
  - file copy verification (19 schemaTypes + 3 lib + env + structure)
  - import graph check (all cross-file imports resolve within bundle; `../env` + `./client`)
  - siteSettings bundle contains new summary fields
---

## Prompt

yes.. sath mujhay yeh bhi btao new project ID kahan add karni hey?

## What I did

### 1. Created a drop-in schema bundle — `docs/schema-export/`
Copied the **real, current** schema files (not hand-retyped) so the new project reproduces the exact content model:
- `schemaTypes/` — 19 files (18 document types + `index.ts` registry), including the updated `siteSettings.ts` with the homepage summary fields.
- `lib/` — `client.ts` (next-sanity client + `optimizedClient.fetchWithTags`), `image.ts` (`urlFor`), `live.ts` (`defineLive`).
- `env.ts` — projectId/dataset/apiVersion readers.
- `structure.ts` — Studio sidebar (siteSettings singleton).
- `README.md` — install steps + project-id guide + must-fix list.

Verified: all cross-file imports resolve within the bundle (`./x` internal, `../env` → bundle-root `env.ts` = `src/sanity/env.ts`); the copy includes the new summary fields.

### 2. Answered "new project ID kahan add karni hey?"
Documented three locations, clarifying **only one is edited**:
- **`.env.local` (project root) — THE ONE YOU EDIT**: `NEXT_PUBLIC_SANITY_PROJECT_ID="..."`, `NEXT_PUBLIC_SANITY_DATASET="production"`, `NEXT_PUBLIC_SANITY_API_VERSION="2025-06-12"`, `SANITY_COMMENTS_TOKEN="..."`. `.env*` is gitignored (local only).
- `src/sanity/env.ts` — reads `process.env.NEXT_PUBLIC_SANITY_PROJECT_ID`; **no edit** (just name-match).
- `sanity.config.ts` — imports projectId from `./src/sanity/env`; **no edit**.
- For deployment: add the same vars in the host dashboard (Vercel/Netlify) Environment Variables.

### 3. Migration warnings (in README + record)
- Recreate the writer doc `_id=e261df38-9273-4bdf-bed2-6db903573be8` / `writername="Huma Qureshi"` (hard-coded readOnly `_ref` + site filter), OR update every writer initialValue + `HUMA_WRITER_FILTER`.
- Register siteSettings as a singleton; whitelist `res.cloudinary.com` + `cdn.sanity.io` in `next.config.ts`; recreate `DEFAULT_SITE_IMAGES`.

## Checks
- Bundle file counts: 19 schemaTypes + 3 lib + env.ts + structure.ts + README.
- Import graph self-contained; siteSettings summary fields present.
- Documentation only — no app source changed; **nothing pushed**.

## Notes / next
- Optional: also generate a seed script (writer + genres + siteSettings) for the new dataset. Ask user.

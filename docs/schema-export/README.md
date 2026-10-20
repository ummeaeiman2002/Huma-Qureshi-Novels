# Sanity Schema Bundle — drop-in for a new project

This folder is a **ready-to-copy** set of Sanity schema + lib/config files, extracted from the Huma Qureshi Novels project. Copy them into a new project to reproduce the exact same content model.

## Contents

```
schema-export/
├── schemaTypes/        # 18 document types + index.ts (registry)
│   ├── index.ts        # ⚠️ registry — every type must be listed here
│   ├── novelparent.ts  # THE NOVEL MAIN PAGE (58 fields)
│   ├── novel.ts        # episodes
│   ├── pdf.ts          # complete books
│   ├── genre.ts  category.ts  writer.ts
│   ├── comment.ts  reaction.ts  testimonial.ts
│   ├── announcement.ts  downloadSection.ts  systemConfig.ts
│   ├── siteSettings.ts # singleton (incl. homepage summary)
│   └── premiumNovel.ts  premiumEpisode.ts  user.ts  subscription.ts  payment.ts
├── lib/
│   ├── client.ts       # next-sanity client + optimizedClient.fetchWithTags
│   ├── image.ts        # urlFor() image builder
│   └── live.ts         # defineLive (optional)
├── env.ts              # projectId / dataset / apiVersion readers
└── structure.ts        # Studio sidebar (siteSettings = singleton)
```

## How to install in the new project

The original layout is:

```
<project>/sanity.config.ts
<project>/src/sanity/env.ts
<project>/src/sanity/structure.ts
<project>/src/sanity/schemaTypes/*.ts
<project>/src/sanity/lib/*.ts
```

So copy the folders accordingly:

```powershell
# from the new project root
Copy-Item "path\to\schema-export\schemaTypes" -Destination "src\sanity\schemaTypes" -Recurse -Force
Copy-Item "path\to\schema-export\lib"         -Destination "src\sanity\lib"         -Recurse -Force
Copy-Item "path\to\schema-export\env.ts"       -Destination "src\sanity\env.ts"       -Force
Copy-Item "path\to\schema-export\structure.ts" -Destination "src\sanity\structure.ts" -Force
```

Then create `sanity.config.ts` at the project root (same as this project):

```ts
'use client'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
})
```

Studio route: `src/app/studio/[[...tool]]/page.tsx` renders `<NextStudio config={config} />`.

---

## ⭐ WHERE TO ADD THE NEW PROJECT ID

There are **three** places the project id / dataset appear — but only **one** you actually edit: the `.env.local` file. The others read from it.

### 1. `.env.local` (THE ONE YOU EDIT) — project root

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your-new-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2025-06-12"
SANITY_COMMENTS_TOKEN="your-write-token"      # needed for writes / comments
```

- `.env*` is **gitignored** — this file is local only, per machine.
- Get the project id from **sanity.io/manage** → your project → the id shown at the top (`xxxxxxxx`).
- The token comes from manage → API → Tokens → "Add API token" (Editor permission for writes).

### 2. `src/sanity/env.ts` (DO NOT hard-code) — reads env automatically

```ts
export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,   // <-- comes from .env.local
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)
```

No edit needed — just make sure the env var name matches exactly.

### 3. `sanity.config.ts` (DO NOT hard-code) — imports from env.ts

```ts
import { apiVersion, dataset, projectId } from './src/sanity/env'
```

No edit needed — it inherits whatever `.env.local` provides.

### If you deploy on Vercel / Netlify
Add the same variables in the host's dashboard → **Environment Variables** (Production + Preview). The build has no `.env.local` there.

---

## ⚠️ Must-fix after pointing at a NEW dataset

1. **Recreate the writer doc.** Every `writer` reference field uses a hard-coded readOnly default:
   `initialValue: { _ref: "e261df38-9273-4bdf-bed2-6db903573be8" }`
   On a new dataset this `_ref` won't exist. Either
   - create a writer document with **exactly** that `_id` and `writername: "Huma Qureshi"`, or
   - update every `writer` field's `initialValue._ref` (in novelparent, novel, pdf, premiumNovel, premiumEpisode) + `HUMA_WRITER_FILTER` in the app queries.
2. The whole site filters by `writer->writername == "Huma Qureshi"` — content won't show unless that writer exists and is linked.
3. Register `siteSettings` as a **singleton** (fixed id `"siteSettings"`) — `structure.ts` already does this.
4. Whitelist image hosts in `next.config.ts` → `images.remotePatterns`: `res.cloudinary.com` and `cdn.sanity.io`.
5. Recreate `src/lib/siteDefaults.ts` `DEFAULT_SITE_IMAGES` with valid CDN URLs (or the new project's own images).

## See also
- `docs/sanity-schema-record.md` — full field-by-field schema record + live data state.

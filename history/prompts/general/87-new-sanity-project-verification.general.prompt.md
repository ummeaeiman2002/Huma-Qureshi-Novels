---
id: 87
title: New Sanity Project Connection Verification
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [sanity, migration, verification, env, project-id, deployment]
links:
  spec: docs/sanity-schema-record.md
  ticket: null
  adr: null
  pr: null
files:
 - (no source changes; verification only)
tests:
  - node tmp-newproj-verify.js (new project c03qeg7d counts + reference integrity)
  - node tmp-newproj-detail.js (sample novel/episode/pdf/siteSettings + asset inventory)
  - route curl checks (/, /novel, /about, /contact, /privacypolicy, /terms, novel detail, episode)
  - SSR content checks (homepage sections, 277 cloudinary banner refs, novel title+episode links, episode Urdu body)
  - npm run build ("Compiled successfully in 50s")
---

## Prompt

new kay sath connect hogai hey? ab old sanity project dlt kardun?

(also earlier: "Please inspect my current website code and verify: 1. Which Sanity project ID and dataset the website currently uses. 2. Whether the environment variables point to my new Sanity project. 3. Whether the current schema definitions are compatible with the imported documents. 4. Whether novel pages, episode pages, PDF/download links, images, and references will work with the new project. 5. Whether any changes are needed in Vercel environment variables. Do not delete the old project, expose secrets, or deploy changes yet. First report the findings and recommend the next steps.")

## Findings

### 1-2. Project id / dataset / env
- `.env.local` (project root) now reads: **`NEXT_PUBLIC_SANITY_PROJECT_ID=c03qeg7d`**, `NEXT_PUBLIC_SANITY_DATASET=production`, `NEXT_PUBLIC_SANITY_API_VERSION=2025-06-12`, plus `SANITY_COMMENTS_TOKEN`. → **Yes, the site is connected to the NEW project.**
- `.env*` is **gitignored and NOT tracked** — no secrets committed/exposed.
- `src/sanity/env.ts` + `sanity.config.ts` read the id from env (no hard-coded id), so only `.env.local` needed changing.

### 3. Schema compatibility
- All document types imported and match the schema: novelparent 12, novel 160, pdf 6, genre 7, writer 6, comment 122, reaction 1, testimonial 2, siteSettings 1, premiumNovel 1, user 1 (TOTAL 347 content docs + assets = 415 import count).
- **Same document _ids preserved** — including the critical Huma writer `e261df38-9273-4bdf-bed2-6db903573be8` (writername "Huma Qureshi"). The hard-coded readOnly `writer` `_ref` still resolves.
- Reference integrity: novels w/o writer = 0, w/o banner = 0; episodes w/o parent = 1 (same known orphan as before).

### 4. Pages / links / images / references
- Routes tested live: `/`, `/novel`, `/about`, `/contact`, `/privacypolicy`, `/terms` = 200; novel detail `/novel/mera-name-mohabbat-short-story` = 200 (title + banner + 5 episode links); episode `/novel/mera-name-mohabbat-short-story/part-02` = 200 (real Urdu `font-urdu` RTL body); PDF `/novel/keh-do-mujhay-jo-piya-free-pdf` = 200.
- Homepage SSR: Featured Novels + Latest Uploads + Latest Episodes + Website Summary all present; **277** `res.cloudinary.com` banner references.
- PDFs use `pdfurl` (Google Drive links) + Cloudinary `banner` — unaffected by project switch.
- Images: banners are **Cloudinary string URLs** (not project-bound). Only 6 Sanity image assets + 4 file assets live in the new project; testimonials w/ image asset = 2 (intact).
- ⚠️ **siteSettings image fields are `null`** (logo, heroImage, authorImage, defaultBanner) — the summary TEXT imported, but these image ASSETS did not. Non-breaking: `DEFAULT_SITE_IMAGES` in `src/lib/siteDefaults.ts` provides Cloudinary fallbacks.
- `next.config.ts` whitelists `res.cloudinary.com` + `cdn.sanity.io` (hostname-level wildcard) → all image hosts OK.

### 5. Vercel env vars
- **Yes, changes needed.** Vercel has no `.env.local`; the OLD project id (`92mgyrwt`) is likely still set there. Must update Vercel → Settings → Environment Variables:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `c03qeg7d`
  - `NEXT_PUBLIC_SANITY_DATASET` = `production`
  - `NEXT_PUBLIC_SANITY_API_VERSION` = `2025-06-12`
  - `SANITY_COMMENTS_TOKEN` = (new project token, if writes/comments used)
  - (Production + Preview), then redeploy.

## Answer to "old project dlt kardun?"
**Not yet.** Local dev works, but production still points at the old id until Vercel is updated + redeployed and verified. Delete the old project only AFTER the Vercel deploy with the new id is confirmed healthy. Also note the old project may still be the source for any missing assets (siteSettings images) — recover/migrate those first.

## Checks
- All 6 routes + 3 detail pages 200; SSR content real (not fallback).
- `npm run build`: pass ("Compiled successfully in 50s").
- No source changed; temp scripts deleted; **nothing pushed / nothing deleted / no deploy**.

## Recommended next steps
1. Update Vercel env vars (above) + redeploy; verify production routes.
2. Re-upload siteSettings images (logo/hero/author/default banner) on the new project, OR confirm `DEFAULT_SITE_IMAGES` fallbacks are acceptable.
3. Verify the 1 orphan episode (no parent) — fix or hide.
4. Confirm `SANITY_COMMENTS_TOKEN` belongs to the new project (comments/reactions writes).
5. Only then delete the old project.

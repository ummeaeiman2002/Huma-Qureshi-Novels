---
id: 88
title: Production Deploy Verified Against New Sanity Project
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [production, vercel, sanity, migration, verification, humaqureshinovels]
links:
  spec: docs/sanity-schema-record.md
  ticket: null
  adr: null
  pr: null
files:
 - (no source changes; production verification only)
tests:
  - curl production home (200, 195KB)
  - section/content checks (Featured/Latest Uploads/Latest Episodes/Website Summary, 265 cloudinary refs)
  - route checks /, /novel, /about, /contact, /privacypolicy, /terms (all 200)
  - detail page checks novel/episode/pdf (all 200, real Urdu content)
  - sanity asset direct load (cdn.sanity.io/images/c03qeg7d/... = 200)
---

## Prompt

variable update kardiye hein so plz check it now....humaqureshinovels.com

## Findings — production is LIVE on the new project ✅

- User updated Vercel env vars; auto-deploy from push `4020de2` succeeded.
- `https://www.humaqureshinovels.com/` → **200**, ~195KB, renders:
  - Featured Novels ✅, Latest Uploads ✅, Latest Episodes ✅
  - **Website Summary section** ("A Home for Honest Urdu Storytelling") ✅ — this text exists ONLY in the NEW project's `siteSettings`, so it definitively proves production now reads from **c03qeg7d**.
  - 265 `res.cloudinary.com` banner image refs; no empty-state, no broken-image markers.
- Routes 200: `/`, `/novel`, `/about`, `/contact`, `/privacypolicy`, `/terms`.
- Detail pages 200 with real content: `/novel/mera-name-mohabbat-short-story` (title + 155 cloudinary refs), `/novel/mera-name-mohabbat-short-story/part-02` (episode), `/novel/keh-do-mujhay-jo-piya-free-pdf` (PDF).
- Sanity-hosted asset directly loads: `https://cdn.sanity.io/images/c03qeg7d/production/...png` → **200**.
- `/novel` listing: 66 cloudinary refs (cards render).
- About page uses Cloudinary `DEFAULT_SITE_IMAGES` fallbacks (expected — siteSettings image fields are null in the new project).

## Conclusion
Migration to the new Sanity project is complete and verified in production. No code issues found.

## Remaining (optional, non-blocking)
1. Re-upload `siteSettings` images (logo / heroImage / authorImage / defaultBanner) on the new project — or accept the Cloudinary defaults.
2. Confirm `SANITY_COMMENTS_TOKEN` in Vercel belongs to the new project (needed for comment/reaction writes).
3. Investigate the 1 orphan episode (no parent) — cosmetic.
4. **Now safe to delete the old Sanity project** (92mgyrwt) once above are done — but confirm no missing assets live only there first.

## Checks
- All production routes + detail pages 200; real content confirmed.
- No source changed; nothing pushed/deleted in this step.

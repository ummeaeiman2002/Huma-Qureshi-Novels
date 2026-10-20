---
id: 49
title: Unpublish Novel via Sanity API
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [sanity, unpublish, content, api, mutation, noindex, seo]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/novel/[slug]/page.tsx
tests:
  - Sanity GROQ (published): count(novelparent slug=yeh-ishq-tum-na-karna-short-story)=0; episodes referencing parent=0; totalNovels=15
  - Sanity raw (perspective=raw): draft parent=1, episode drafts preserved
  - curl /short-stories and /novel : 200, no "Yeh Ishq" in HTML
  - curl /novel/yeh-ishq-tum-na-karna-short-story : renders "Novel not found" (soft-200, same as any missing slug)
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
---

## Prompt

Unpublish selected novels via the Sanity API — specifically "Yeh Ishq tum na karna Short Story" (parent id `2e079b6b-4f74-4d26-b6b1-972a4b1411c7`), keeping a draft.

(Follow-up user turn: "Continue if you have next steps, or stop and ask for clarification if you are unsure how to proceed.")

## Response

Unpublished the short-story parent and its 6 episode docs using the Sanity HTTP mutation API (projectId `92mgyrwt`, dataset `production`, token from `.env.local`), keeping drafts.

Steps:
1. Step 1 failed (409): a single transaction that both created episode drafts and deleted the parent violated reference integrity (`documentReferenceDoesNotExistError`). Sanity is atomic, so nothing was applied.
2. Re-ran as two phases: (a) `createOrReplace` all 7 drafts (`drafts.<id>` copies with `_rev/_updatedAt/_createdAt` stripped) — OK; (b) delete published copies — 409 because the episode drafts held strong `novelparent` refs to the parent (`documentHasExistingReferencesError`).
3. Final mutation: `patch` each episode draft to set `novelparent = { _type:"reference", _ref:"<parentId>", _weak:true }`, then `delete` the 6 published episodes + the published parent. OK.

Also added `robots: { index: false, follow: true }` to the `/novel/[slug]` not-found metadata branch so the now-empty page is not indexed.

## Outcome

- Published view: parent slug count 0, episodes referencing parent 0, `totalNovels` 16 -> 15. All 7 published docs removed from the site; drafts preserved (draft parent + 6 episode drafts, e.g. `drafts.03b917a8-...` "Ep 06").
- Listings `/novel` and `/short-stories` no longer mention the title; detail URL renders "Novel not found".
- tsc exit 0.

## Outcome notes
- Episode draft refs were set to `weak: true` so the parent could be unpublished; weak refs still resolve via `references()`/`->`, so re-publishing works, but the refs remain weak.
- The detail route returns HTTP 200 with the not-found UI even for random slugs (streaming already sent headers) — pre-existing app behavior, not caused by unpublish.

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): make `/novel/[slug]` return a true HTTP 404 for unknown slugs (move the existence check ahead of streaming / remove the segment `loading.tsx` dependency).

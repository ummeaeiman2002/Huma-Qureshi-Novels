---
id: 67
title: Global Reactions Backend Fix
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [reactions, api, sanity, backend, fix]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/sanity/schemaTypes/reaction.ts
 - src/sanity/schemaTypes/index.ts
 - src/app/api/reactions/route.ts
 - src/app/components/Reactions.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - GET /api/reactions?slug=<episode> -> {success:true,counts:{like:0,...}}
  - POST +1 fire -> fire:1; POST +1 like -> like:1; GET after -> persisted
  - POST -1 fire -> 0; POST -1 fire again -> clamped at 0 (never negative)
  - POST invalid key -> HTTP 400; GET without slug -> HTTP 400
  - npm run build -> "Compiled successfully", route ƒ /api/reactions
  - /, /novel, /novel/haraa-junoon-long-episodic-novel/episode-no-14 all 200
---

## Prompt

fix it first

(Scoping question answered by user: "Real global counts (Recommended)" — new /api/reactions route + Sanity storage so every visitor sees actual totals.)

why are you stuck?

## Response

Built real, shared reaction counts.

- **New schema** `src/sanity/schemaTypes/reaction.ts`: document with `slugkey` + integer counters `like/love/wow/sad/fire` (min 0), registered in `schemaTypes/index.ts`. Sanity Studio lists it automatically via the structure resolver.
- **New API** `src/app/api/reactions/route.ts`:
  - `GET ?slug=` → fresh counts (non-CDN client, `cache: "no-store"`), no writes.
  - `POST {slug,key,delta}` → `createIfNotExists` (id = `reaction_` + sha256(slug) slice, so ids stay short and deterministic) then an **atomic** `.inc()`; clamps back to 0 if it would go negative; returns authoritative counts. Unknown key/slug → 400.
- **`Reactions.tsx` reworked**: restores this device's choice from the `_user` key (the refresh bug), shows local counts instantly, then replaces them with the server's totals; on tap it applies an optimistic update + persists the choice locally, then POSTs and adopts the server counts as source of truth. Network failures keep the optimistic count instead of wiping it.

## Outcome

- tsc exit 0; `npm run build` → "Compiled successfully in 62s", route `ƒ /api/reactions`.
- API verified live: initial GET zeros → POST +1 fire (1) → POST +1 like (1,1) → GET persisted → POST -1 fire (0) → POST -1 fire again still 0 → invalid key 400 → missing slug 400.
- Episode page + home + `/novel` all 200, `Reactions` still mounts.
- Two test reaction documents were deleted from the dataset afterwards (`remaining reaction docs: []`), so production starts clean.

## Outcome notes
- No per-user server identity: a client can replay `delta` — counts are tamper-resistant enough for a vanity metric but not an anti-abuse system. A follow-up would be a signed session token or dedup key.
- Reaction docs are created lazily on first POST, so read-only visitors cost one lightweight GROQ read.
- Counts are not shown until the first tap on a brand-new page (there is no seeded baseline).

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): add a per-browser dedup token so a refresh cannot re-submit the same reaction, or seed a small random baseline so new pages don't read as empty.

---
id: 77
title: Delete Empty Mein Tehra Raha Document from Sanity
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: main
user: user
command: opencode
labels: [sanity, data-cleanup, novel-page, empty-document]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files: []
tests:
  - node scripts: count(*) novelparent = 12, pdf = 6, title match "TEHRA" = 0
  - /novel renders 18 cards (12 novels + 6 PDFs), "MEIN TEHRA RAHA" gone
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
---

## Prompt

ok dlt

## Context

Follow-up to PHR 76. The author chose to delete the empty "MEIN TEHRA RAHA" document rather than leave it visible.

Deletion was blocked at first because a **draft episode** (`drafts.dcf15026-caa2-4a43-a173-52bf4428db90`, `_type: novel`, "EPISODE NO 01") referenced the parent. GROQ `references()` / `novelparent._ref ==` did not surface it, so it was removed by exact `_id` via `client.delete()`.

## Change (Sanity data only — no repo files)

- Deleted draft episode `drafts.dcf15026-caa2-4a43-a173-52bf4428db90`.
- Deleted published parent `novelparent` `1d298967-1421-4ba7-adf5-279d7cb1d7e8` ("MEIN TEHRA RAHA").

## Outcome
- Sanity now holds 12 `novelparent` + 6 `pdf`; 0 documents match "TEHRA".
- `/novel` shows 18 cards (was 19); tsc passes; git tree unchanged.

## Follow-ups / risks
- The running dev server needed its 5-minute in-memory cache to expire before the change appeared; production ISR (5m / 1y) will refresh on the next revalidation.
- No code rollback needed — PHR 76's query still supports undated novels for future entries; there just are none right now.

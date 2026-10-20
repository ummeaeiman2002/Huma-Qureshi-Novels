---
id: 50
title: Unpublish Additional Novels via Sanity API
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [sanity, unpublish, data, migration, pdf, episodes]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - (none — Sanity data only)
tests:
  - per-target raw query: published=0 and drafts.<id>=1 for all 6 targets
  - Intiqam children: 3 episode drafts preserved; Woh Ik Guman children: 8 episode drafts preserved
  - published totals dropped (novelparent 15->12, pdf 10->6)
  - /novel and /short-stories no longer list Intiqam, Suroor, Aseer, Hasratein, Woh Ik Guman
  - node _unpublish.cjs (temp, deleted after run): PHASE1 17 OK, PHASE2 28 OK
---

## Prompt

also unpublish Intiqam e jana...Suroor E Ishq Mera, Aseer E Sultant ,Hara Junoon , Meri Hasratein Tamam Kar, Woh Ik Guman Sa . according to pervious method

(Clarification answers: Hara Junoon = PDF only; target list confirmed.)

## Response

Mapped the (typo'd) names to Sanity documents across both schemas, then unpublished them with the same method as PHR #49 (drafts preserved):

- Intiqam E Janaa Short Novelt — `novelparent` 846eb9f3… (+ 3 episodes)
- Suroor E Ishq Mera COMPLETE PDF — `pdf` bd8bc38a…
- Aseer E Sulatant Complete PDF — `pdf` 144831e3…
- Haraa Junoon Complete PDF Novel — `pdf` 6a6bde42… (episodic novel intentionally kept)
- Meri Hasratein Tamam Kar … EBOOK — `pdf` f8102225…
- Woh Ik Guman Sa Online Reading — `novelparent` 9ad53315… (+ 8 episodes)

Process: Phase 1 `createOrReplace` drafts for every root + child; Phase 2 patch each child draft's `novelparent` to `_weak: true` then `delete` the published copies. Ran via a temporary Node script (`_unpublish.cjs`, removed after) because PowerShell 5.1 `ConvertTo-Json` emitted invalid JSON (`invalid character '?' after object key:value pair`) and sending Sanity's internal `_system` field was rejected.

## Outcome

- 17 published documents removed (2 novelparents + 11 episodes + 4 PDFs); 17 drafts preserved (incl. all 11 episode drafts, with weak parent refs so the parents could be unpublished).
- Listings `/novel` and `/short-stories` no longer show 5 of the 6 titles; "Haraa Junoon" (episodic novel) remains by design.
- No code changes.

## Outcome notes
- Sanity's `_system` field must be stripped from a fetched doc before re-submitting it in a mutation.
- PowerShell 5.1 `ConvertTo-Json` can produce invalid JSON for portable-text payloads; use `@sanity/client` or Node `JSON.stringify` for mutations.
- The `_id match "drafts.*"` GROQ count was unreliable/inconsistent vs authoritative per-id queries; verify by explicit `_id ==`.
- Episode drafts now hold weak `novelparent` refs; re-publishing the parent restores linking.

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): add a small maintenance script/Studio action to unpublish novels (parent + episodes, drafts kept) in one click.

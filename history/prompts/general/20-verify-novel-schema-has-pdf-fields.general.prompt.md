---
id: 20
title: Verify novel schema already has PDF rich fields
stage: general
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: novel-cms-detail
branch: n/a
user: missa
command: general
labels: ["sanity", "schema", "novelparent", "pdf", "parity", "investigation"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files: []
tests:
  - schema field diff (pdf.ts vs novelparent.ts) via Select-String comparison

---

## Prompt

jitni feilds tum ney PDf waly section mein sanity mein add ki hein woh sb Episodic novel waly mein bhi add kro...

## Response snapshot

Investigated; no change needed. The rich-content fields added to the PDF schema were copied from the novel, so the
episodic novel schema (`novelparent`) already contains all of them:
- `themes` (Basic Information, line 144)
- `characterintro` + `characters[]` (Characters group, line 270)
- `readerhighlightintro` + `readerhighlights[]` (Reader Highlights group, line 320)
- `sneakPeeks[]` (Sneak Peeks group, line 453)

A field-level diff confirmed the only PDF-only fields are PDF-specific:
`pdfreleasedate, pdfshortdescription, pdfdescription, pdfnumberofpages, latest, popular, views, monthlyViews, downloadCount`.
Only `latest`/`popular` are non-PDF-specific toggles the novel lacks. Advised a dev-server restart if fields don't appear
in Studio, and offered to add `latest`/`popular` if that was the intent.

## Outcome

- ✅ Impact: none (verification only).
- 🧪 Tests: schema field diff performed.
- 📁 Files: none.
- 🔁 Next prompts: possibly add `latest`/`popular` toggles to novelparent; restart dev server to view Studio.
- 🧠 Reflection: schema parity check avoided redundant/duplicate fields.

## Evaluation notes (flywheel)

- Failure modes observed: user believed novel lacked fields; parity already existed.
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a

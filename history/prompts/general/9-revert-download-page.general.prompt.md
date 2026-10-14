---
id: 9
title: Revert download page to previous design
stage: refactor
date: 2026-10-13
surface: agent
model: opencode/big-pickle
feature: none
branch: n/a
user: missa
command: general
labels: ["revert", "download-page"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/app/download/[slug]/page.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)

---

## Prompt

nahi download waly page ko wapis pehlay jaisa kar do

## Response snapshot

Reverted the `/download/[slug]` page to its state before the PHR #7 redesign. Undid all five
edits: removed the `PageHero` import, restored the soft-emerald hero section, restored the
plain "Download Now" CTA (dropped the "Ready to Download" badge + gold glow), restored the
single-column gold-bordered steps list with `bg-gold-dark` number circles, and restored the
`border-2 border-gold/30` panels (Why-Read + Sanity `downloadSection`). Confirmed no `PageHero`
references remain and the original classes are back.

## Outcome

- ✅ Impact: download page is exactly as it was before the redesign.
- 🧪 Tests: tsc PASS, build PASS (21/21).
- 📁 Files: 1 file reverted.
- 🔁 Next prompts: user to confirm whether the PDF listing redesign (PHR #8) should also be reverted.
- 🧠 Reflection: no git repo, so reverts are manual; keeping the original Read output made an exact restore possible.

## Evaluation notes (flywheel)

- Failure modes observed: `Select-String -Path` with `[slug]` silently wildcards and returned nothing; switched to `-LiteralPath`.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): confirm PDF listing revert scope with user.

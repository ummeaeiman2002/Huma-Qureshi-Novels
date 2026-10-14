---
id: 10
title: Redesign individual PDF detail page as book detail
stage: refactor
date: 2026-10-13
surface: agent
model: opencode/big-pickle
feature: none
branch: n/a
user: missa
command: general
labels: ["design-system", "spec", "pdf-detail", "book-detail", "pagehero"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/app/pdf/[slug]/page.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)

---

## Prompt

is page ko design karna hey...http://localhost:3000/pdf/keh-do-mujhay-jo-piya-free-pdf....docs folder ka text file read kro.. or us kay according UI design kro.

## Response snapshot

Read `docs/text` (design system §2, individual content pages §5/§7, consistency §12, typed
accessible markup §16) and redesigned the individual PDF detail page (`/pdf/[slug]`):
- Replaced the stacked soft-emerald hero with a **two-column book-detail hero** on a warm
  cream card (§2 cream/ivory + gold accents): cover artwork on one side (rounded frame, cream
  border, gold ring, soft glows); title, "by author", genre/date/view meta pills, and the real
  actions (Bookmark, Download PDF, Watch on YouTube) on the other, plus a "← Back to PDF
  Library" link.
- Moved the Bookmark/Download/Watch actions up into the hero (prominent action per §5/§7) and
  removed the redundant in-hero copyright block.
- Restyled the "Why Download This PDF" section from `border-brand/30` to `border-line` panels
  with `bg-cream-soft` cards and brand hover for token consistency.
- Preserved description, author note, tags, related content, YouTube section, comments, JSON-LD
  schema, metadata, and the genuine download flow.

## Outcome

- ✅ Impact: PDF detail page now reads as a premium, structured book page; actions are prominent.
- 🧪 Tests: tsc PASS, build PASS (21/21).
- 📁 Files: 1 file updated.
- 🔁 Next prompts: apply the same book-detail hero to `/novel/[slug]` for consistency; consider moving the copyright line to the page footer area.
- 🧠 Reflection: keeping the detail hero light (not the dark PageHero) matches the user's preference shown when they reverted the download page.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): mirror the book-detail hero on the novel detail page.
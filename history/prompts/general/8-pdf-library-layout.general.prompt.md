---
id: 8
title: Structural redesign of PDF page as digital library
stage: refactor
date: 2026-10-13
surface: agent
model: opencode/big-pickle
feature: none
branch: n/a
user: missa
command: general
labels: ["design-system", "spec", "pdf-page", "library-layout", "download"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/app/pdf/PDFPageClient.tsx
  - src/lib/sanity/queries.ts
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)

---

## Prompt

pdf Ui deign kahan hoi hey? mujhay tu koi structural changes nazr nahi aye hein

## Response snapshot

User reported the PDF page looked structurally unchanged. Root cause: the PDF listing still
rendered the *same* 260px card grid as the Novels page (`Components/Cards/PDF` was a near-clone
of `Cards/Novel`), so the page read as "novels with a different heading" — a spec violation
(§5 demands a distinct digital-library experience).

Redesigned `/pdf` as a book-library layout:
- Replaced the duplicate card grid with a two-column grid of **book rows**: 3:4 cover
  thumbnail, genre eyebrow, title, writer + release date, 3-line summary, and a
  "View Details" link plus a genuine "↓ Download PDF" action when `pdfurl` exists.
- The download button mirrors `DownloadPDFButton` exactly (`/download/[slug]?type=pdf&pdf=...`)
  so the flow stays real and consistent.
- Added `pdfurl` to the `getPaginatedPDFs` projection in `src/lib/sanity/queries.ts` so each
  row can offer a real download link (was not exposed to the listing before).
- Kept PageHero ("PDF Novels Library"), StatsBar, filter, Load More, and SEO sections; the
  `Cards/PDF` import was dropped from `PDFPageClient` (still used on homepage/related).

## Outcome

- ✅ Impact: the PDF page is now visually and structurally distinct from the Novels page.
- 🧪 Tests: tsc PASS, build PASS (21/21).
- 📁 Files: 2 files updated.
- 🔁 Next prompts: mirror the same treatment on the homepage "Featured" PDF grid so it points into the new layout; verify download link opens correctly on prod.
- 🧠 Reflection: exposing the same field the detail page already exposes (`pdfurl`) is not a security regression; the URL was already public in the detail-page download flow.

## Evaluation notes (flywheel)

- Failure modes observed: none; tsc/build clean.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): add per-row "Read Online" that opens the detail page in a reading view.
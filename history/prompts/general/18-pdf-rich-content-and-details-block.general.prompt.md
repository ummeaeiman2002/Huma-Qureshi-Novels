---
id: 18
title: PDF rich content fields + PDF Details block
stage: green
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: novel-cms-detail
branch: n/a
user: missa
command: general
labels: ["sanity", "schema", "cms", "pdf-detail", "themes", "characters", "reader-highlights", "sneak-peeks", "parity"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/sanity/schemaTypes/pdf.ts
  - src/app/components/novelPage/NovelDetails.tsx
  - src/app/pdf/[slug]/page.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)
  - prod crawl /pdf/keh-do-mujhay-jo-piya-free-pdf -> HTTP 200, "PDF Details" present, no SSR errors

---

## Prompt

but this content feild not shown on PDf pages why? it will shown when i updated ? also publised details only shown epsiodic novel page not all both Pdf and short story page. why?

## Response snapshot

Diagnosed and then fixed the PDF-side gap.

Diagnosis:
- The rich-content fields (characters, themes, reader highlights, sneak peeks) existed only on `novelparent`; the `pdf`
  schema had none of them and `pdf/[slug]/page.tsx` rendered none of those sections — so they could never appear on a
  PDF page, even after editing a PDF.
- A crawled short-story page already showed "Novel Details" + "Published" (it reuses `NovelPageClient`); only the PDF
  page lacked a details block (it is a separate custom layout and the PDF schema uses different field names).

Changes:
- `pdf.ts`: added field groups "Characters", "Reader Highlights", "Sneak Peeks"; added `themes` (basic, after tags),
  `characterintro` + `characters[]`, `readerhighlightintro` + `readerhighlights[]`, and `sneakPeeks[]` — mirroring the
  `novelparent` definitions.
- `NovelDetails.tsx`: made document-agnostic (Pages `numberofpages ?? pdfnumberofpages`, Published
  `novelreleasedate || pdfreleasedate`, File Format/Size already had `downloadformat`/`downloadsize` fallbacks) and
  added an optional `title` prop.
- `pdf/[slug]/page.tsx`: extended the GROQ to fetch `themes`, characters, reader highlights, sneak peeks; imported and
  rendered `ReaderHighlights`, `Characters`, `SneakPeeks`, `NovelDetails` (title "PDF Details") and `Themes`.
- Verified with a prod crawl: PDF page now renders "PDF Details"; no server errors; build/tsc pass.

## Outcome

- ✅ Impact: PDF pages now support the same rich content (characters, themes, reader highlights, sneak peeks) and show a PDF Details block, matching novel/short-story pages.
- 🧪 Tests: tsc PASS, build PASS (21/21), prod crawl PASS.
- 📁 Files: 3.
- 🔁 Next prompts: fill the new PDF fields in Studio to see the sections; optionally add a "Published:" pill to the PDF hero; consider a shared document-details abstraction.
- 🧠 Reflection: the two schemas had drifted; making `NovelDetails` field-name tolerant avoided a PDF-specific component.

## Evaluation notes (flywheel)

- Failure modes observed: none functional. Regex crawl markers can false-positive on RSC flight payload (component names), so prefer visible-text markers.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS, prod crawl PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): add a data-driven SSR smoke test asserting "PDF Details"/"Novel Details" per page type.

---
id: 14
title: Phase 2-4 CMS — PDF download/specs, short-story content, author link
stage: green
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: novel-cms-detail
branch: n/a
user: missa
command: general
labels: ["sanity", "schema", "cms", "pdf", "download", "short-story", "author-page"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/sanity/schemaTypes/pdf.ts
  - src/sanity/schemaTypes/novelparent.ts
  - src/lib/sanity/queries.ts
  - src/app/components/novelPage/DownloadSection.tsx
  - src/app/novel/[slug]/NovelPageClient.tsx
  - src/app/components/Cards/PDF.tsx
  - src/app/pdf/PDFPageClient.tsx
  - src/app/pdf/[slug]/page.tsx
  - src/app/short-stories/[slug]/page.tsx
  - src/app/page.tsx
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)

---

## Prompt

Continue if you have next steps, or stop and ask for clarification if you are unsure how to proceed.

## Response snapshot

Completed the remaining CMS phases from `docs/text`.

Phase 2 — PDF library (schema + listing + download):
- `pdf.ts` rewritten with field groups (Basic / Description / Download / Publishing / Related / SEO)
  and new fields: englishtitle, language, pdfshortdescription, downloadfile (file asset, PDF),
  downloadtitle/description/format/size, pdfnumberofpages, externaldownloadurl, downloadbuttonlabel,
  seotitle/seodescription. All existing fields preserved.
- `getPaginatedPDFs` now selects shortdescription/format/size/pages and prefers
  `pdfshortdescription` for card summaries.
- PDF card shows Format/Size badges (new optional `format`/`size` props).
- `/pdf/[slug]`: richer query, metadata prefers seotitle/seodescription; hero shows
  format/size/page-count pills; added the shared `DownloadSection` (type="pdf") which renders the
  download button and details.

Phase 3 — short stories:
- Added `readingtime` and `storycontent` (portable text) to `novelparent`.
- `/short-stories/[slug]` selects them and renders a "Read the Full Story" section (PortableText,
  RTL/font support) with a reading-time badge.

Phase 4 — polish:
- Generalized `DownloadSection` to accept `data` + `type` ("novel" | "pdf") so it is reused by both
  detail pages; updated `NovelPageClient` usage.
- Home about-author section now fetches the Huma Qureshi writer slug and shows a "View Author Profile"
  button linking to `/writer/[slug]` (cast to `Route` for typed routes).

## Outcome

- ✅ Impact: PDFs now carry downloadable files and specs end-to-end; short stories can host full text; homepage links to the author page.
- 🧪 Tests: tsc PASS, build PASS (21/21).
- 📁 Files: 10.
- 🔁 Next prompts: set the Huma Qureshi writer slug in Studio so `/writer/[slug]` resolves; optionally add Studio tab grouping for writer; consider surfacing readingtime on short-story listing cards.
- 🧠 Reflection: naming the PDF download fields identically to the novel schema let one `DownloadSection` component serve both document types with a `type` prop.

## Evaluation notes (flywheel)

- Failure modes observed: none. All new fields optional, so existing documents render unchanged.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): add readingtime to the short-story card.

---
id: 13
title: Phase 1 CMS — novel/author schemas + novel detail sections
stage: green
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: novel-cms-detail
branch: n/a
user: missa
command: general
labels: ["sanity", "schema", "cms", "novel-detail", "author-page", "sneak-peeks", "download"]
links:
  spec: docs/text
  ticket: null
  adr: null
  pr: null
files:
  - src/sanity/schemaTypes/novelparent.ts
  - src/sanity/schemaTypes/writer.ts
  - src/sanity/structure.ts
  - src/lib/sanity/queries.ts
  - src/app/novel/[slug]/page.tsx
  - src/app/novel/[slug]/NovelPageClient.tsx
  - src/app/short-stories/[slug]/page.tsx
  - src/app/components/novelPage/SneakPeeks.tsx
  - src/app/components/novelPage/AboutAuthor.tsx
  - src/app/components/novelPage/ImportantNote.tsx
  - src/app/components/novelPage/NovelDetails.tsx
  - src/app/components/novelPage/DownloadSection.tsx
  - src/app/components/novelPage/MoreFromAuthor.tsx
  - src/app/components/novelPage/ShareButton.tsx
  - src/app/writer/[slug]/page.tsx
  - src/app/sitemap.ts
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages, /writer/[slug] generated)

---

## Prompt

docs ki text file agin read kro..wahan mazeed stural changes hein...

(follow-up decisions) Scope = Phase 1: Schemas + queries + novel detail. Short stories = extend `novelparent` (keep isShortStory). Author = new `/writer/[slug]` page.

## Response snapshot

Discovered the active spec is `docs/text` line 1145–1632 ("Complete Novel & Short Story Content
Management System") — the earlier UI spec (1–1142) is now an HTML comment. Chose a phased approach
with the user and implemented Phase 1.

Sanity schemas:
- `novelparent`: added field groups (Basic / Description / Author & Notes / Details / Sneak Peeks /
  Download / Online Reading / Related / SEO) and many new fields — englishtitle, tagline,
  additionalgenres, language, novelstatus, lastupdated, shortdescription, aboutnovel, storyintro,
  contentwarning, importantnote, numberofpages, numberofchapters, fileformat, filesize,
  readingavailability, featured, trending, `sneakPeeks[]` (image/caption/chapter/order),
  download section (downloadfile asset, downloadtitle/description/format/size,
  externaldownloadurl, downloadbuttonlabel), enableonlinereading, onlinereadingintro,
  relatednovels/relatedstories, seotitle/seodescription. All existing fields preserved.
- `writer`: added writerimage (asset), writerbio, writerbiofull, sociallinks[].
- `structure.ts`: unhid `writer` so the new author fields are editable in Studio.

Data layer:
- `queries.ts`: listing queries now prefer `shortdescription`; added getWriterBySlug + getNovelsByWriter.
- `/novel/[slug]` GROQ expanded; related now prefers manually selected relatednovels/relatedstories
  with genre/author fallback; added `moreFromAuthor`.

Frontend (`/novel/[slug]`):
- New conditional sections in spec order: Story Introduction, About the Author, Content Warning,
  Important Note, Sneak Peeks gallery, Novel Details specs, Download PDF area, More from This Author.
- New components: SneakPeeks (accessible lightbox, keyboard nav), AboutAuthor, ImportantNote,
  NovelDetails, DownloadSection, MoreFromAuthor, ShareButton.
- Hero shows English title, tagline, language/status pills, share action; episodes gated by
  enableonlinereading; removed hardcoded copyright block (spec forbids fabricated notices).
- New `/writer/[slug]` author page (bio, profile image, social links, novels + short stories) and
  sitemap entries for writers.

## Outcome

- ✅ Impact: Novel detail is now a rich, CMS-driven page; authors have a real page; Studio exposes grouped editing.
- 🧪 Tests: tsc PASS, build PASS (21/21).
- 📁 Files: 16 (schemas, queries, 6 new components, novel/short-story/writer pages, sitemap).
- 🔁 Next prompts: Phase 2 — extend PDF schema (file asset/format/size) and short-story specifics; add Studio tab grouping polish; set the Huma Qureshi writer slug so /writer page resolves.
- 🧠 Reflection: reusing episodes as the "chapters" source avoided a duplicate chapters schema; new fields are all optional so nothing breaks before content is entered.

## Evaluation notes (flywheel)

- Failure modes observed: none. All new fields optional, so existing documents build/render unchanged.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): add an editor "preview" config to novelparent schema.

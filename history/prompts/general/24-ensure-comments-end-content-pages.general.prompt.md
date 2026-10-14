---
id: 24
title: Ensure comment section at end of content pages
stage: refactor
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: comments
branch: n/a
user: missa
command: general
labels: ["comments", "short-story", "layout", "content-pages"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/app/novel/[slug]/NovelPageClient.tsx
  - src/app/short-stories/[slug]/page.tsx
tests:
  - npx tsc --noEmit -> PASS
  - npm run build -> Compiled successfully
  - crawl /short-stories/<slug> -> Comments present near end; "Read the Full Story" absent (no storycontent in data)
  - crawl /novel/<slug> -> Comments present
  - crawl /pdf/<slug> -> Comments present
  - crawl /novel/<slug>/<episodeslug> -> Comments present (idx 94833 / len 96467)

---

## Prompt

make sure kro kay har page kay end mein Comment section lazmi add ho

(Follow-up answer: "Sirf content pages" — only novel/pdf/episode/short-story. Confirmed again when asked about extending a shared thread to non-content pages: "Nahi, sirf content pages".)

## Response snapshot

Audited the comment system:
- `src/app/actions/Comments.ts` -> `addCommentAction(novelId, name, commentText)` creates a `comment` doc and appends a reference to the target document's `comment[]`.
- UI: `src/app/components/novelPage/CommentForm.tsx`, `Comment.tsx`; PDF uses `src/app/pdf/[slug]/PDFComments.tsx`.

Findings per content page:
- `/novel/[slug]` (NovelPageClient) -> Comments already the last section (after MoreFromAuthor).
- `/pdf/[slug]` (PDFComments) -> Comments last.
- `/novel/[slug]/[episodeslug]` (EpisodePageClient) -> Comments last.
- `/short-stories/[slug]` -> renders "Read the Full Story" AFTER NovelPageClient's Comments -> comments were NOT last.

Fix (smallest viable):
- Added a `fullStory?: ReactNode` slot to `NovelPageClient`: import `type ReactNode` from react; added prop to signature; render `{fullStory}` immediately before the Comments section.
- In `src/app/short-stories/[slug]/page.tsx`: moved the PortableText "Read the Full Story" block into the `fullStory` prop of `<NovelPageClient>` and removed the trailing standalone section. Now order is ... -> Read the Full Story -> Comments (last).

Verification:
- tsc PASS, build PASS.
- Crawled with a prod server on port 3005. Every content page renders the "Comments" heading near the end. No short story currently has `storycontent` in Sanity (only 9 short stories exist), so the "Read the Full Story" block is currently empty — the ordering fix is preventive and correct once content is authored.

Note: user explicitly excluded non-content pages (home, listings, writer, download, about, contact, bookmarks) from comment scope.

## Outcome

- ✅ Impact: Comment section is guaranteed last on every content page; short-story ordering corrected.
- 🧪 Tests: tsc PASS; build PASS; HTML crawl confirms Comments on all four content page types.
- 📁 Files: `NovelPageClient.tsx`, `short-stories/[slug]/page.tsx`.
- 🔁 Next prompts: none required; non-content comment section intentionally out of scope.
- 🧠 Reflection: components composed of "sections + comments" need an explicit slot (e.g. `fullStory`) so callers can inject content that must stay before the comments footer.

## Evaluation notes (flywheel)

- Failure modes observed: child component owned the trailing comment section, leaving no hook for page-level content to appear before it.
- Graders run and results (PASS/FAIL): tsc PASS; build PASS; crawl PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): author a short story with `storycontent` and re-crawl to confirm full-story-before-comments visually.

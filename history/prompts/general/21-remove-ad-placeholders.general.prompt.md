---
id: 21
title: Remove manual ad placeholder slots from UI
stage: green
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: adsense
branch: n/a
user: missa
command: general
labels: ["adsense", "auto-ads", "ui", "cleanup", "adslot"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/app/page.tsx
  - src/app/writer/[slug]/page.tsx
  - src/app/short-stories/[slug]/page.tsx
  - src/app/short-stories/ShortStoriesClient.tsx
  - src/app/pdf/[slug]/page.tsx
  - src/app/pdf/PDFPageClient.tsx
  - src/app/novel/[slug]/page.tsx
  - src/app/novel/[slug]/NovelPageClient.tsx
  - src/app/novel/NovelPageClient.tsx
  - src/app/components/ListingSidebar.tsx
  - src/app/components/AdSlot.tsx (deleted)
  - src/app/components/Ads.tsx (deleted)
tests:
  - npx tsc --noEmit -> PASS (exit 0)
  - npm run build -> PASS (exit 0, 21/21 pages)
  - prod crawl of 7 page types -> no "Reserved ad space"/"Advertisement" labels; adsbygoogle.js still present

---

## Prompt

advertising kay liye jo tum ney spce chor di hey woh remove krdo UI hey... autoadd khud place select kar ky chal jatey hein..

## Response snapshot

Removed the manually reserved advertisement placeholders (the `AdSlot` boxes labelled "Advertisement"/"Reserved ad
space") from the whole UI, since Google AdSense Auto Ads select placements themselves.

- Removed every `<AdSlot ... />` usage and its import across: home, novel listing + detail, pdf listing + detail,
  short-stories listing + detail, writer page, and the shared `ListingSidebar`.
- Removed the wrapping `<section aria-label="Advertisement">` blocks on the home page (mid + lower) so no empty padded
  sections remain.
- Deleted the now-unused `AdSlot.tsx` and `Ads.tsx` components.
- Kept the global AdSense Auto Ads script in `src/app/layout.tsx` (`ADSENSE_ID && <Script ... adsbygoogle.js ...>`),
  which is what actually runs Auto Ads.
- Verified via prod crawl: no "Reserved ad space" / "Advertisement" labels anywhere, and `adsbygoogle.js` is still
  present on every page. tsc + build pass.

## Outcome

- ✅ Impact: Cleaner UI with no empty ad placeholders; Auto Ads continue to place units automatically.
- 🧪 Tests: tsc PASS, build PASS (21/21), prod crawl PASS.
- 📁 Files: 10 modified, 2 deleted.
- 🔁 Next prompts: confirm Auto Ads render from the AdSense dashboard; optionally add `data-ad-client` if needed.
- 🧠 Reflection: manual slots are redundant (and can hurt UX/AdSense policy) when Auto Ads are enabled; the global script is sufficient.

## Evaluation notes (flywheel)

- Failure modes observed: none. Unused imports left behind would not fail build (no noUnusedLocals) but were removed for cleanliness.
- Graders run and results (PASS/FAIL): tsc PASS, build PASS, prod crawl PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a

---
id: 27
title: Home page structure review and robots.txt conflict fix
stage: general
date: 2026-10-14
surface: agent
model: opencode/big-pickle
feature: seo
branch: n/a
user: missa
command: general
labels: ["homepage", "structure", "adsense", "seo", "robots"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - public/robots.txt
tests:
  - npx tsc --noEmit -> EXIT 0
  - GET / -> 200
  - GET /robots.txt -> 500 before, 200 after
  - all internal links on home -> 200
  - home word count ~2635
---

## Prompt

acha all fine. ab pehlay home page ka structure check krlo.. all  features functinol hey.. UI well structured + adsence freindly hey? means web kay home page ka structure theek hey?

## Response snapshot

Reviewed the home page (`src/app/page.tsx`) structure, functionality and AdSense-friendliness.

Structure/order: Hero (h1 "Real Stories. Deep Emotions." + CTAs + trust chips + image) -> Featured Novels + Latest Episodes -> Explore by Genre + quote -> About the Author -> Browse (filter + Latest Uploads + Popular Reads) -> The Home of Urdu Novel Reading + FAQ -> Stay Connected -> Categories (new; hidden until category docs exist).

Functionality: all internal links on the page return 200 (about, contact, novel, pdf, short-stories, writer, privacypolicy, terms, all novel/pdf slugs, episodes). ~2635 words. Exactly 1 H1, clean H2/H3 hierarchy, all images have alt, canonical + meta description present.

AdSense: `ads.txt` present and correct (`pub-9826860279589874`), AdSense loader present (auto ads), no ad placeholders / no `<ins>` units, Privacy Policy + Terms pages exist, sitemap.xml 200.

Bug found and fixed: `/robots.txt` returned 500 due to a conflicting public file and route file ("A conflicting public file and page file was found for path /robots.txt"). Deleted `public/robots.txt`, kept the more complete dynamic `src/app/robots.ts`. `/robots.txt` now returns 200 with the full ruleset.

Remaining minor gaps noted: no JSON-LD structured data on home; no `/disclaimer` page.

## Outcome

- ✅ Impact: confirmed home page is well structured, functional and AdSense-friendly; fixed site-wide robots.txt 500.
- 🧪 Tests: tsc PASS; /robots.txt 500 -> 200; all home links 200; 1 H1; ~2635 words.
- 📁 Files: deleted `public/robots.txt`.
- 🔁 Next prompts: optionally add home JSON-LD and a /disclaimer page.
- 🧠 Reflection: next-dynamic and static files for the same path silently conflict and 500 the route; keep only one source.

## Evaluation notes (flywheel)

- Failure modes observed: duplicate robots source caused a 500 that would block crawlers.
- Graders run and results (PASS/FAIL): tsc PASS; HTTP PASS after fix.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): add WebSite/Organization JSON-LD to the home page.

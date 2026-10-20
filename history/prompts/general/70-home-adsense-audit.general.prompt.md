---
id: 70
title: Home Page AdSense Friendliness Audit
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [adsense, audit, seo, home-page, metadata, compliance]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/page.tsx
tests:
  - curl / -> 200, 1820 visible words, 1x h1 / 10x h2 / 16x h3
  - all 24 internal links on home -> HTTP 200
  - /ads.txt -> google.com, pub-9826860279589874, DIRECT, f08c47fec0942fa0
  - /robots.txt -> Allow all + Sitemap; /sitemap.xml valid
  - UTF-8 scan of rendered pages -> 0 genuine mojibake runs (home, about, contact, privacypolicy, terms, novel)
  - npm run build unaffected (tsc 0)
---

## Prompt

now check home page.. now its adsence freindly?

## Audit result

**Verdict: content/structure side is AdSense-ready; two risks remain (CMP consent, optional intro block).**

Passing:
- **Content volume**: 1820 visible words on home; cards now carry Summary heading + 4-line summary + Writer/Genre rows (PHR #69), genre section shows title counts, Latest Episodes list, footer blurb.
- **Structure**: 1× h1 (sr-only "Read Urdu Novels Online") → 10× h2 → 16× h3, no skipped levels; `lang="en"`, viewport meta, HTTPS, canonical.
- **Required pages linked from footer**: Privacy Policy, Terms & Conditions, About, Contact.
- **Ad implementation**: AdSense Auto Ads only (0 manual `<ins>` slots) → no ad-clutter/density flag; loader in `layout.tsx`.
- **ads.txt**: present and correct at `/ads.txt`.
- **robots.txt**: allows all, blocks `/studio/`, `/api/`, auth/checkout/premium paths, references sitemap.
- **Link health**: all 24 internal links on home return 200.
- **Images**: all content covers have descriptive `alt`; the 5 `alt=""` images are decorative hero backgrounds (correct a11y).

Fixed during audit:
- **`src/app/page.tsx:18` meta description contained triple-encoded characters** (`Huma Qureshi â€” free`) that would show as garbage in the Google snippet → replaced with clean ASCII: "Read original Urdu novels, episodic stories and complete PDF books by Huma Qureshi - free online, or download the PDF to read offline."

Verified non-issue:
- Apparent `â€”` in rendered HTML was PowerShell 5.1 reading UTF-8 as ANSI; re-read with `[System.IO.File]::ReadAllText(path, UTF8)` shows **0 genuine corruption** across home, about, contact, privacypolicy, terms, novel.

## Remaining risks (not fixed here)

1. **Consent management**: the site uses a basic localStorage `CookieConsent` banner, not a Google-certified CMP (TCF v2.2). Google requires a certified CMP for serving personalised ads to EEA/UK traffic (since Nov 2023) — largest compliance gap.
2. **No visible intro copy on home**: page opens straight into hero + cards; a 2–3 sentence "About this library" paragraph gives first-time reviewers original above-the-fold text (quick win).

## Outcome

- Audit report delivered with pass/fail per AdSense criterion; 1 metadata bug fixed and re-verified (meta description now clean, 0 corruption runs, 1820 words still).
- No layout/behaviour changes.

## Outcome notes
- Word count measured by stripping script/style/svg/tags from SSR HTML — not unique-prose count; card summaries duplicate their detail pages by design (acceptable for listings).
- `/premium`, `/checkout`, `/login` paths are robots-disallowed but not publicly rendered routes.

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): add an intro block under the hero (site purpose + author line + how to read/download), or integrate a Google-certified CMP (Google Funding Choices / Consent Mode v2).

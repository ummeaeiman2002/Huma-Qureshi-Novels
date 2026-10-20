---
id: 53
title: AdSense Review and Fix All Novels Page
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [adsense, seo, review, ux, opengraph, consent]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/Cards/Novel.tsx
 - src/app/components/Cards/PDF.tsx
 - src/app/novel/page.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - /novel HTML: og:title "All Urdu Novels | Huma Qureshi Novels", og:url canonical, og:image default banner, twitter:card summary_large_image, 18 article cards
---

## Prompt

Check all novels page its adsence freindly ?

(Follow-up: "ok fix it")

## Response

Reviewed `/novel` against AdSense/quality guidelines. Passing checks: unique title/description/canonical/robots, 1 h1 + 7 h2 + 32 h3 + 18 `<article>` cards, `ItemList`/`BreadcrumbList` JSON-LD, ~15k chars of original copy (episodic explainer, why-read, how-to, FAQ, YouTube section), `/pdf` 308-redirect to `/novel` (no duplicate listing), no manual ad slots (Auto Ads only), privacy/terms/contact/about linked, mobile-friendly.

Applied the safe fixes:
- Removed the copy-blocking `onCopy`/`onCut` handlers (and now-unused `React` imports) from `Cards/Novel.tsx` and `Cards/PDF.tsx` — users can copy title/summary text again.
- Added page-specific `openGraph` and `twitter` metadata (title, description, url, siteName, default banner image) to `/novel` so social cards no longer fall back to the site-default title.

## Outcome

- tsc exit 0; `/novel` now emits `og:title`/`og:url`/`og:image` and `twitter:card=summary_large_image`; 18 cards still render.

## Outcome notes
- Consent remains the top AdSense risk: `CookieConsent.tsx` is a basic "by continuing you agree" banner, not a Google-certified CMP. For EEA/UK personalized ads this must be configured in AdSense → "Privacy & messaging" (Privacy & messaging GDPR message) or a certified CMP; it is not a code change.
- Other minor notes left as-is: Auto Ads placement not controlled (page is long/dense but content is interspersed), the site is single-author original content (good).

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): wire CookieConsent to a certified CMP / add Accept|Decline gating of the GA + AdSense scripts.

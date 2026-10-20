---
id: 68
title: Privacy Policy and Terms Redesign + Content Audit
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [legal, privacy-policy, terms, redesign, content-audit, adsense, ui]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/components/LegalToc.tsx
 - src/app/components/LegalSection.tsx
 - src/app/privacypolicy/page.tsx
 - src/app/terms/page.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - curl /privacypolicy -> 200; curl /terms -> 200
  - /terms SSR: 15 TOC anchors + sections (acceptance, permitted-use, comments, dmca, removal-requests, changes)
  - /privacypolicy SSR: id="google-adsense", href="#google-adsense", adssettings.google.com, aboutads.info present; no "newsletter" string
  - rendered HTML has no literal HTML entities (e.g. &amp;rsquo;) in string-prop children
  - npm run build -> "Compiled successfully in 71s", /privacypolicy + /terms prerendered (static)
---

## Prompt

Re design privacy & policy and terms and condition page but looks legal and professinol.. also read both content its match our website

## Content audit (before coding)

Reality check of both pages against the running site:

- Privacy body had **no AdSense section** although its own metadata claimed "Google AdSense" coverage, and AdSense *is* loaded (`layout.tsx` `ADSENSE_ID`, `ca-pub-9826860279589874`) -> added.
- Google Analytics claim (`G-X7F51SY5RZ` in `layout.tsx`) is accurate -> kept.
- "We store your **newsletter**" was false (no newsletter exists) and the contact form is a `mailto:` composer (`contact/page.tsx` `EMAIL` -> `ContactForm`) -> corrected to describe the mail client flow.
- **Reader comments** (display name + text saved to Sanity by `addCommentAction`) were unmentioned -> now covered in both pages (collection note in Privacy, acceptable-use section in Terms).
- No account/checkout/subscription UI exists for end users -> deliberately did **not** add auth or payment sections.
- Cookie banner is a basic localStorage consent (`CookieConsent.tsx`), not a Google CMP -> described as such.

## Change

- **New `src/app/components/LegalToc.tsx`** (client): sticky table of contents (`lg:sticky lg:top-28`), numbered `01..NN` items, IntersectionObserver scroll-spy (`rootMargin: "-96px 0px -60% 0px"`) with `aria-current` gold active state.
- **New `src/app/components/LegalSection.tsx`** (server): exports `LegalSection` (numbered gold circle badge, Playfair `h2`, `surface` card, `scroll-mt-32`, `aria-labelledby`), plus `LegalP`, `LegalList` (gold markers), `LegalStrong`, `LegalLink` (internal vs `external` target/rel), and `LegalMeta` (effective date / website / contact meta card).
- **Both pages rebuilt** on a `max-w-6xl` two-column grid `[230px_minmax(0,1fr)]`: PageHero (badge "Legal", description, "Last updated 20 October 2026") -> TOC + document column -> `LegalMeta` card -> numbered sections. Canonical metadata unchanged, descriptions tightened.
- **Privacy = 13 sections**: Who We Are, Information We Collect (comments, contact mail, anonymous tech data, aggregate view counters, consent preference), How We Use, Cookies, Google Analytics, **Google AdSense and Advertising** (DART cookie + Google Ads Settings / aboutads.info / networkadvertising opt-outs), Data Security, Data Breach & Limitation of Liability, Third-Party Links, Children's Privacy, **Your Choices and Rights**, Changes, Contact.
- **Terms = 15 sections**: original 12 sections preserved verbatim where accurate, plus **Permitted Use** (personal reading/download licence, no scraping), **Reader Comments** (acceptable use + moderation), **Changes to These Terms**. Email `humaqureshiofficial73@gmail.com` matches the contact page; both pages cross-link each other.

## Outcome

- tsc exit 0; `npm run build` "Compiled successfully in 71s", 19/19 pages, `/privacypolicy` and `/terms` prerendered as static.
- Both routes 200; SSR verified: 15 TOC anchors on Terms, `id="google-adsense"` + opt-out links on Privacy, no "newsletter" string, no literal HTML entities in rendered HTML.
- Fixed one rendering bug found in verification: `&rsquo;` inside a plain **string** prop renders literally in React (JSX text decodes entities, string children do not) -> replaced with `\u2019`.

## Outcome notes
- Scroll-spy depends on TOC `items` identity being stable -> `SECTIONS` is a module-level const in each page.
- No smooth-scroll CSS added; anchor jumps are instant (sticky-header offset handled by `scroll-mt-32`).
- Legal copy is template-grade, not counsel-reviewed; DMCA/liability wording kept from the original pages.

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): shared `LegalDoc` wrapper so both pages get header/meta/grid from one component, or add JSON-LD `WebPage`/`FAQPage` structured data to the legal routes.

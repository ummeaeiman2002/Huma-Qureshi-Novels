---
id: 71
title: Consent Mode Banner and Home Intro Block
stage: general
date: 2026-10-20
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [adsense, consent-mode, cmp, cookies, home-page, content, compliance]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/layout.tsx
 - src/app/components/CookieConsent.tsx
 - src/app/components/CookiePreferencesButton.tsx
 - src/app/components/headerComponents/Footer.tsx
 - src/app/page.tsx
 - src/app/privacypolicy/page.tsx
tests:
  - node node_modules/typescript/bin/tsc --noEmit (exit 0)
  - / /privacypolicy /terms /about /novel all 200
  - SSR home: consent-default gtag script, "About the Library" intro + stats, footer "Cookie Preferences" button
  - SSR /privacypolicy: 6x "Cookie Preferences", "Consent Mode", "Reject non-essential"
  - home visible word count 1820 -> 1910
  - npm run build -> route table printed (19 pages)
---

## Prompt

ok fix it first

(Fixing both items left open in the PHR #70 audit: #1 cookie consent / Consent Mode, #2 missing home intro copy.)

## Change

**1. Google Consent Mode v2 + granular consent UI**
- `layout.tsx`: inline `consent-mode-default` script (`strategy="beforeInteractive"`) sets `gtag('consent','default', {ad_storage/ad_user_data/ad_personalization/analytics_storage:'denied', wait_for_update:500})` before GA and AdSense load, so both tags start in a denied state.
- `CookieConsent.tsx` rewritten: reads the stored choice, re-applies it on every visit, and pushes `gtag('consent','update', …)` (with a queue fallback that creates `window.gtag` if it is not ready yet). Choices: **Accept all / Reject non-essential / Customize** — Customize reveals three rows with switches (Strictly necessary = always on, Analytics, Advertising) and a **Save preferences** button. Stores `{necessary, analytics, advertising, ts}` as JSON under the legacy `cookie_consent` key; old `"accepted"`/`"rejected"` string values migrate automatically. Listens for a `hq:consent-open` event to reopen.
- New `CookiePreferencesButton.tsx` (client island) wired into the footer **Legal** column so consent can be changed later — required for a defensible consent flow.
- Premium styling kept: dark sheet (`brand-deep/95` + gold border), gold primary pill, outline reject, gold switches.

**2. Original intro copy on the home page** (`page.tsx`)
- New section after the hero: `ui-eyebrow "About the Library"` + h2 "Read Urdu Novels Online, Free — Chapter by Chapter" + two original paragraphs (free episodic reading, no sign-up, PDF downloads) + a dark stat panel with live Sanity counts (Novels / PDF Books / Genres).

**3. Privacy Policy updated to match reality**
- Cookies section now documents Accept all / Reject non-essential / Customize toggles, Consent Mode signalling, and the footer **Cookie Preferences** re-open link; "Your Choices and Rights" gained a withdraw-consent bullet.

## Outcome

- tsc exit 0; `/`, `/privacypolicy`, `/terms`, `/about`, `/novel` all 200.
- SSR confirms: consent-default script in head, intro section + stats rendered, footer button present, privacy mentions "Cookie Preferences" 6× and "Consent Mode".
- Home visible word count 1820 → 1910; `npm run build` succeeded (19-page route table).

## Outcome notes
- **Remaining compliance gap**: this is a Consent-Mode-compliant self-run banner, not a *Google-certified* CMP (TCF v2.2). Full EEA compliance needs a certified provider (Google Funding Choices via AdSense UI, Cookiebot, CookieYes…) — requires his account/ID, so left as a decision.
- Tags still load before consent (Google's recommended pattern is load-with-denied + update, not tag blocking).
- GA/AdSense behaviour when rejected: consent signals say denied; ad personalisation off.

## Prompt variant (if applicable): n/a
## Next experiment (smallest change to try): wire a certified CMP (Funding Choices snippet) once he provides the publisher choice ID, or block the GA script until `analytics_storage` is granted for a stricter setup.

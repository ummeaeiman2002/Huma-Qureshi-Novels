---
id: 36
title: Remove Novel Suggestions From About Page
stage: general
date: 2026-10-19
surface: agent
model: big-pickle
feature: none
branch: none
user: user
command: opencode
labels: [about, contact, legal-pages, cleanup, ui-spec]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/app/about/page.tsx
tests:
 - node node_modules/typescript/bin/tsc --noEmit (exit 0)
 - curl /about: 200, "Explore Urdu Novels by Huma Qureshi" string absent
---

## Prompt

yes about , contact,privacy and poicy, terms and conditions sb pages ko check kro or novel suggestions ko remove krdo wahan sy

## Response snapshot

Checked all four pages (About, Contact, Privacy Policy, Terms & Conditions). Only the About page contained novel/PDF suggestions (`RelatedContent`). Contact, Privacy Policy, and Terms had none.

Removed from `src/app/about/page.tsx`:
- The `RelatedContent` block (heading "Explore Urdu Novels by Huma Qureshi").
- Now-unused `getAboutSuggestions()` Sanity fetch function.
- Unused imports: `RelatedContent`, `client`, `cleanDescriptionLong`.
- Page component made non-async (no awaits left).

Suggestions remain only on legitimate content pages (pdf/[slug], download/[slug]) where related content is appropriate.

## Outcome

- ✅ Impact: Medium — About/Contact/legal pages now free of promotional card suggestions.
- 🧪 Tests: tsc --noEmit (0 errors), live /about check (suggestions absent).
- 📁 Files: src/app/about/page.tsx.
- 🔁 Next prompts: (none required)
- 🧠 Reflection: grep confirmed RelatedContent usage scoped to about + content detail pages; only about needed change.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): tsc PASS, curl string-scan PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a

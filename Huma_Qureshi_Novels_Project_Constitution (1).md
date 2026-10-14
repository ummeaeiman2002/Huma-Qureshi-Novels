# Huma Qureshi Novels — Project Constitution

**Project:** Huma Qureshi Novels  
**Stack:** Next.js + TypeScript  
**Primary goal:** Improve the site's content architecture, usability, accessibility, technical SEO, and AdSense readiness while preserving existing novels, episodes, URLs, and working features.

This document is the implementation contract for developers and AI coding agents working in this repository. Follow it before making changes.

---

## 1. Non-negotiable rules

1. **Inspect before editing.** Review the existing repository, `package.json`, app/router structure, components, styles, content schema, Sanity integration, and current routes before changing anything.
2. **Do not rebuild blindly.** Refactor the existing Next.js application incrementally. Reuse working components and data sources where possible.
3. **Preserve content and URLs.** Do not delete novels, episodes, author information, Sanity data, or existing routes. Do not rename or redirect URLs without checking inbound links and adding appropriate redirects.
4. **Never invent content.** Do not generate fake novels, fake episodes, fake publication dates, fake reviews, fake readership statistics, or unsupported author claims. Use only verified existing data.
5. **No approval guarantees.** The goal is to improve quality and policy readiness; no design or code change can guarantee Google AdSense approval.
6. **No secrets in source control.** Never expose `.env`, API keys, tokens, passwords, private Sanity credentials, or other secrets. Do not commit environment files.
7. **Use TypeScript properly.** Avoid `any` unless there is a documented, unavoidable reason. Prefer typed data models, safe null handling, and reusable components.
8. **Follow the repository's existing conventions.** Check whether it uses the App Router or Pages Router, its styling system, linting rules, and package manager before introducing new dependencies or patterns.
9. **Do not remove accessibility or SEO features** unless the replacement is implemented and verified.
10. **Make small, testable changes.** After each group of edits, run the available lint, type-check, build, and relevant tests.

## 2. Design direction

Use the supplied homepage screenshot as a visual reference, not as a source of factual content.

### Brand style
- Primary: deep emerald green.
- Background: warm cream / ivory.
- Accent: restrained muted gold.
- Typography: readable English serif/sans-serif pairing and the site's existing Urdu Nastaleeq font where available.
- Keep generous whitespace, consistent spacing, calm borders, and subtle shadows.
- Avoid excessive animation, decorative clutter, repeated text blocks, and oversized empty sections.

### Homepage structure

Build or refine the homepage in this order, using real content from the existing content source:

1. **Utility strip (optional):** only retain if it is useful and works on mobile.
2. **Main header:** logo/brand, Home, Novels, Short Stories, About, Contact, working search, and Urdu/English language switcher if already supported.
3. **Hero:** concise welcome message, clear explanation that the site publishes Huma Qureshi's Urdu novels and short stories, and a working “Browse Novels” link. Do not use unsupported claims.
4. **Genre links:** Romance, Thriller, Social Drama, Short Stories only where these categories genuinely exist.
5. **Featured novels:** real cover, title, author, genre, concise unique synopsis, and a working detail-page link.
6. **Latest episodes:** real episode titles and dates from the content source; hide this section if no valid episode data exists.
7. **Explore by genre:** functional links and accurate counts only if counts are derived from real data.
8. **About the author:** a concise, factual bio and a link to the full About page.
9. **Optional newsletter:** include only if a real, working and privacy-compliant subscription flow exists. Otherwise omit it.
10. **Footer:** working links to About, Contact, Privacy Policy, Terms, and relevant official social profiles.

Do not add a slider/carousel just for decoration. If one already exists, ensure it works with keyboard controls, reduced-motion preferences, and touch devices; otherwise prefer a simple grid.

## 3. Novel and episode page requirements

Every public novel or episode page must provide meaningful, readable content and a clear page purpose.

- Use a stable, descriptive URL slug. Preserve existing slugs whenever possible.
- Display the real title, author attribution, relevant category, and a unique description where available.
- Present the actual authorized story/episode text as readable HTML when publication rights permit. Do not make a PDF the only way to access the main content if an accessible HTML reading page is feasible.
- Keep paragraphs, dialogue, and Urdu text readable on mobile.
- Set correct Urdu language and right-to-left direction for Urdu content (`lang="ur"` and `dir="rtl"` where appropriate). Keep English UI text left-to-right.
- Provide a clear previous/next episode link only when those episodes exist.
- Add links to related stories only when they are relevant and real.
- Avoid empty pages, placeholder text, duplicated summaries, auto-generated doorway pages, and thin tag/category pages.
- If a page is intentionally unpublished, draft-only, or has no useful content, do not expose it as a low-quality public page. Handle indexing intentionally; do not blanket-hide valuable pages.

## 4. Header, navigation, and interactions

- Ensure there is one coherent primary navigation system at each viewport size.
- Check whether the utility strip and main header create accidental duplicate navigation or excessive vertical space.
- Every visible button and link must work and have a clear purpose.
- Search must return relevant existing novels/stories or show a helpful empty state.
- Genre filters must filter real data and be keyboard-accessible.
- Language switching must preserve the relevant page when a translation exists; do not show a non-functional language toggle.
- Avoid fake login, achievements, reading streaks, newsletter, and subscription controls. Remove non-working features or implement them fully.
- Use semantic elements: `header`, `nav`, `main`, `section`, `article`, and `footer` where appropriate.
- Give icon-only buttons accessible names and visible focus styles.

## 5. AdSense and content-quality readiness

The site must serve readers first. Do not attempt to manipulate AdSense review systems.

- Publish original, authorized work with enough context for readers to understand and navigate the library.
- Make the author's identity/pen name and the site's purpose clear and consistent.
- Ensure About and Contact pages contain genuine, useful information.
- Maintain a clear, accurate Privacy Policy describing the services actually used, including advertising/cookies or analytics where applicable. Do not claim services are used if they are not.
- Keep Terms and any copyright/permissions statement accurate to the site's actual practices.
- Do not copy third-party stories, scrape content, create keyword-stuffed paragraphs, or duplicate boilerplate across many pages.
- Avoid intrusive ads, deceptive buttons, misleading download labels, forced redirects, pop-ups that block content, and ad placements that resemble navigation.
- Do not add ad placeholders or load ad scripts until the site owner has chosen to do so and the required account/publisher details are available.
- Do not create fake traffic, fake engagement, fake testimonials, or fake statistics.
- Make sure all published text, images, and covers are owned, licensed, or otherwise authorized for web publication.

## 6. Technical SEO

Audit and implement these features using the current Next.js version and routing architecture:

- Unique, accurate `<title>` and meta description for each indexable page.
- Canonical URL for each public page, using the correct production domain configured by the owner.
- Open Graph metadata and suitable social-sharing image where available.
- A valid `sitemap.xml` containing canonical, public, indexable URLs only.
- A correct `robots.txt`; do not accidentally block public content or expose private/admin routes.
- Correct HTTP status codes: real 404s for missing content, no soft-404 pages, and no redirect loops.
- Consistent trailing-slash and hostname policy, with redirects where needed.
- Useful internal links between the library, categories, novels, and episodes.
- Avoid indexing internal search-result pages, duplicate URL variants, draft content, and empty filter combinations when they add no search value.
- Add structured data only when accurate and appropriate; never invent ratings, reviews, prices, or publication details.
- Verify that important story text is present in rendered HTML and is accessible to users and search crawlers.
- Test the production domain, not just the local development server.

Do not assume a metadata, sitemap, or indexing issue exists without checking the repository and Google Search Console evidence.

## 7. Performance, responsiveness, and accessibility

- Test common mobile widths, tablet, and desktop.
- Use `next/image` for local/remote images when compatible with the existing setup; configure allowed remote hosts safely.
- Set image dimensions/aspect ratios to reduce layout shift and provide meaningful alt text for informative covers.
- Optimize large images; do not load multiple oversized decorative images unnecessarily.
- Avoid unnecessary client components and JavaScript. Prefer server components when compatible with the current App Router architecture.
- Prevent horizontal overflow, tiny text, low contrast, and overlapping Urdu typography.
- Respect keyboard navigation and `prefers-reduced-motion`.
- Keep core story text accessible even if optional JavaScript enhancements fail.

## 8. Next.js and TypeScript implementation rules

- First identify the current Next.js version and whether the project uses `app/` or `pages/`.
- Use the correct metadata API for the current routing system; do not mix App Router and Pages Router patterns.
- Keep reusable UI in the repository's existing component structure.
- Use the project's current CSS/Tailwind/styling conventions unless a change is justified.
- Use typed interfaces/types for novels, episodes, categories, and navigation data based on the actual Sanity schema or existing content source.
- Validate potentially missing CMS fields before rendering.
- Avoid hydration mismatches, invalid nested links, invalid HTML, and server/client boundary mistakes.
- Do not add packages without a clear need. Explain any new dependency.
- Do not change Sanity schemas or migrate data without explaining the migration and preserving existing records.
- Keep loading, empty, error, and not-found states intentional and user-friendly.

## 9. Required implementation workflow

Before coding:
1. Inspect repository tree and `package.json`.
2. Identify router, styling framework, data source, existing pages, and current SEO setup.
3. Run existing lint/type-check/build commands if available and record baseline errors.
4. List the files that need changing and why.

While coding:
1. Implement the shared design tokens and responsive shell first.
2. Refine the header/footer and homepage sections.
3. Refine novel/episode templates without removing existing content.
4. Fix metadata, sitemap, robots, canonical URLs, and broken links based on verified findings.
5. Remove only genuinely non-functional or repetitive UI after checking dependencies.

After coding:
1. Run lint.
2. Run TypeScript type checking.
3. Run a production build.
4. Fix errors introduced by the changes.
5. Test key routes, mobile layout, search, language switcher, internal links, missing-content states, and RTL rendering.
6. Provide a summary of changes, changed files, commands run, test results, and any remaining tasks requiring the owner's credentials or Google Search Console.

If a check cannot run, state that explicitly. Never claim a successful build, test, deployment, indexing result, or AdSense approval without evidence.

## 10. Acceptance checklist

- [ ] Existing novels, episodes, and working URLs are preserved.
- [ ] Homepage matches the brand direction and prioritizes actual books and reading.
- [ ] Header, search, language switcher, category links, and footer work.
- [ ] Each public novel/episode page has useful, unique content.
- [ ] Urdu pages render correctly in RTL and are readable on mobile.
- [ ] About, Contact, Privacy Policy, and Terms pages are accurate and accessible.
- [ ] Titles, descriptions, canonical URLs, sitemap, and robots rules are checked.
- [ ] No obvious broken links, empty public pages, fake content, or non-functional controls remain.
- [ ] Lint, type-check, and production build results are reported honestly.
- [ ] No secrets or private credentials were added to the repository.
- [ ] The final changes improve reader experience and policy readiness without promising approval.

---

## Developer / AI agent instruction

**Implement the smallest safe set of changes that satisfies this constitution. Inspect first; do not overwrite the project based only on a screenshot.** Treat the supplied screenshot as a visual guide. Use the real content and existing data source, preserve current routes, and report assumptions or blockers before destructive changes.

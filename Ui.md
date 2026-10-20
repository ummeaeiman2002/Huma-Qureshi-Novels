# UI_UX_Guidelines.md

# HumaQureshiNovels.com — UI/UX Redesign Specification

## 1. Objective

Improve the existing HumaQureshiNovels.com interface without unnecessarily rebuilding the entire application.

The new interface must feel professional, polished, literary, calm, readable, consistent, and easy to navigate.

The website's main purpose is to help readers discover novels, understand each novel, and access the available reading or PDF download options.

This is a refinement of the existing website, not a request to replace it with an unrelated template.

## 2. Mandatory Instructions Before Coding

Before changing anything:

1. Inspect the existing repository structure.
2. Identify the framework, routing system, styling approach, and shared components.
3. Inspect the current Home page, Novels catalogue, individual novel pages, About, Contact, Privacy Policy, and 404 page.
4. Identify all existing routes and determine which components are reused.
5. Review the existing global styles, colour variables, fonts, breakpoints, and button styles.
6. Identify the source of duplicate homepage sections and generic descriptions.
7. Locate all Short Stories and unfinished Premium references.
8. Identify the current Bookmarks implementation and verify whether it works.
9. Inspect existing PDF download links and preserve valid functionality.
10. Inspect the current BreadcrumbList structured data and the Search Console error details.

Do not start by deleting files or rewriting the entire application.

First understand how the current implementation works.

## 3. Visual Direction

Use a modern editorial design inspired by professional literary websites and digital book libraries.

The interface should be:

- Clean and uncluttered.
- Typography-led.
- Visually consistent.
- Easy to scan.
- Focused on book covers and meaningful novel information.
- Comfortable to read on long pages.
- Responsive on mobile devices.
- Professional without excessive decoration.

Avoid:

- Excessive gradients.
- Unnecessary animations.
- Overly rounded cards everywhere.
- Too many competing accent colours.
- Oversized headings that push the content below the fold.
- Repetitive promotional sections.
- Fake counters and decorative statistics.
- Large empty spaces that serve no purpose.
- Generic AI-looking promotional copy.
- Unnecessary pop-ups and intrusive overlays.

Do not make the design visually busy merely to make it appear more sophisticated.

## 4. Design Tokens

First inspect the existing brand colours and logo.

Preserve the established brand identity where it works well. If the current colour system is inconsistent, consolidate it into a small set of reusable design tokens.

Use these suggested defaults only if they fit the existing brand:

- Page background: `#FAF8F5`
- Main surface: `#FFFFFF`
- Primary text: `#292522`
- Secondary text: `#706963`
- Primary accent: `#704535`
- Accent hover: `#583629`
- Borders: `#E8E1DB`
- Subtle section background: `#F2EDE7`
- Success feedback: an accessible green.
- Error feedback: an accessible red.

These colours are a starting point, not permission to ignore an existing coherent brand palette.

Requirements:

- Define reusable colour variables or design tokens.
- Do not scatter unrelated hex codes throughout components.
- Ensure sufficient contrast between text and backgrounds.
- Use the same primary button colour throughout the website.
- Use consistent border and focus styles.
- Avoid using colour alone to communicate errors or success.

## 5. Typography

Use a consistent typography system.

Requirements:

- Use the existing brand font if it is readable and properly loaded.
- Otherwise, use a readable system sans-serif for navigation and interface controls.
- A restrained serif font may be used for novel titles or editorial headings if it fits the existing brand.
- Keep paragraph text comfortable to read.
- Use consistent font weights and line heights.
- Avoid decorative fonts for long descriptions.
- Do not use excessively small text for metadata or footer links.

Suggested starting sizes:

- Main page heading: `2rem–2.75rem` on desktop.
- Section heading: `1.4rem–1.8rem`.
- Novel title: `1rem–1.15rem`.
- Body text: `1rem`.
- Secondary metadata: approximately `0.875rem`.

Adapt these values to the existing design system and test on mobile.

Use a sensible maximum width for long paragraphs so that lines do not become difficult to read.

## 6. Header and Navigation

Create a consistent header shared across the website.

The header should contain:

- Existing website logo or wordmark.
- Home.
- Novels.
- PDF Library, if it is a genuine, useful destination.
- About.
- Contact.

A search control may be included if it works properly.

Do not add a navigation link to a page that is empty, unfinished, or non-functional.

Remove:

- Short Stories.
- Unfinished Premium navigation.
- Any unused or broken navigation item.

Bookmarks may remain only if the feature is functional and useful.

### Header behaviour

- Use consistent alignment and spacing.
- Keep the logo legible.
- Ensure the mobile menu opens and closes correctly.
- Make all links keyboard accessible.
- If a sticky header is used, ensure it does not cover headings, anchors, or content.
- Avoid adding a sticky header if it makes the reading experience worse.
- Ensure the header does not overflow on narrow screens.

## 7. Homepage Structure

Reorganize the homepage into the following order.

### Section 1: Hero

Include:

- A concise, descriptive heading.
- A short introduction explaining what readers can find on the website.
- A primary button linking to the Novels catalogue.
- An optional secondary link to the PDF collection if that destination is functional.

Do not use exaggerated marketing claims.

The hero must not occupy so much vertical space that visitors cannot discover the actual novel collection.

### Section 2: Featured Novels

Display a small, curated selection of real novels.

Requirements:

- Use existing novel records.
- Use consistent cover image ratios.
- Display title, author where known, and a concise unique description where appropriate.
- Link each card to the correct novel detail page.
- Do not repeat the same selection immediately in another section without a clear reason.

If no real featured selection is maintained, use another meaningful heading or omit the section.

### Section 3: Browse by Genre

Show only genres that contain real novels.

Requirements:

- Each genre link must lead to a working collection or filtering result.
- Do not show empty categories.
- Do not invent genre counts.
- Keep the layout compact.

Remove the entire section if the underlying category functionality does not exist.

### Section 4: Latest Novels

Display recently added novels using actual available dates or reliable catalogue ordering.

Requirements:

- Do not fabricate publication dates.
- Do not change dates merely to make old content appear new.
- Avoid duplicating the Featured Novels section.
- Ensure all cards lead to the correct pages.

### Section 5: About the Website

Include a short, truthful introduction and a link to the full About page.

Do not repeat the complete About page on the homepage.

### Section 6: FAQ, Optional

Keep FAQs only if they answer real questions that readers may have.

Examples may include how to download an available PDF or how to find a novel.

Requirements:

- Answers must be accurate.
- Avoid repetitive or generic questions created only for SEO.
- Do not add FAQ schema automatically; implement structured data only when appropriate and compliant with current guidelines.

### Remove Redundant Homepage Sections

Remove or consolidate:

- Duplicate Featured Novels and Latest Uploads sections.
- Repeated Popular Reads sections displaying the same books without a clear purpose.
- Placeholder testimonial sections.
- Fake or unverified reader statistics.
- Repeated promotional paragraphs.
- Empty content blocks.
- Unnecessary sections for removed features.
- Any section that adds no distinct value to visitors.

The homepage must remain useful without becoming excessively long.

## 8. Novel Card Component

Use one reusable design for novel cards across the website.

Each card should include, where applicable:

1. Cover image.
2. Novel title.
3. Author name.
4. Genre or status, when accurate and useful.
5. Short novel-specific description if the card layout supports it.
6. A clear link such as "View Novel".

Requirements:

- Use consistent image ratios and predictable card spacing.
- Keep title alignment consistent.
- Ensure text wraps naturally.
- Prevent titles from overlapping images or controls.
- Use meaningful alt text for informative covers.
- Use lazy loading for below-the-fold images where appropriate.
- Avoid distorted or stretched cover images.
- Provide a sensible fallback if a cover is unavailable.
- Do not invent cover images, ratings, popularity indicators, or completion status.
- Avoid placing the same book in multiple sections without a clear editorial reason.

If a card links to a novel page, the entire interaction must be accessible and must not contain nested interactive links or buttons.

## 9. Novels Catalogue Page

The catalogue should provide a clear browsing experience.

Include:

- A descriptive heading.
- A concise introduction.
- A responsive novel grid or list.
- Working search or filtering controls only if implemented.
- Pagination when needed for a large collection.

Requirements:

- Avoid unnecessary duplicate descriptions.
- Avoid empty categories.
- Use consistent card components.
- Ensure every listed novel has a valid destination.
- Keep controls understandable on mobile.
- Preserve useful existing catalogue functionality.

Do not display a fake search box or a filter that does nothing.

## 10. Individual Novel Detail Page

Use a consistent template for all novel detail pages.

Suggested content order:

1. Breadcrumb navigation.
2. Novel title.
3. Cover image and essential metadata.
4. Unique and accurate synopsis.
5. Genre or other useful details.
6. Reading or download options.
7. PDF download button when a valid, authorized PDF is available.
8. Related novels where genuinely relevant.

Requirements:

- Make the novel title visually prominent.
- Keep descriptions readable and properly spaced.
- Avoid overwhelming visitors with unrelated sections.
- Make download controls easy to identify.
- Provide a clear route back to the Novels catalogue.
- Do not show fake availability or completion status.
- Do not create duplicate detail pages for the same title without a legitimate purpose.

### PDF Button

Use a clear label such as "Download PDF" only if the action matches the label.

The button must:

- Link to the correct file.
- Work on desktop and mobile.
- Have a visible focus state.
- Avoid deceptive redirects.
- Avoid unnecessary pop-ups.
- Preserve appropriate download or file-opening behaviour.

Confirm that the site is legally permitted to distribute the file.

## 11. About, Contact, Privacy Policy, and 404

Use the same design system for all supporting pages.

### About

- Present accurate information.
- Use clear headings.
- Avoid filler content.
- Link back to the Novels collection where useful.

### Contact

- Make the contact method visible.
- Ensure forms, if used, work properly.
- Provide accessible labels and useful error messages.
- Avoid exposing sensitive information.

### Privacy Policy

- Use readable text and headings.
- Ensure the content matches the site's actual data practices.
- Keep it accessible from the footer.

### 404

- Explain that the page was not found.
- Provide a link to Home and Novels.
- Do not disguise a missing page as a successful content page.

## 12. Footer

Create a clean, consistent footer with:

- Website identity or a short description.
- About.
- Contact.
- Privacy Policy.
- Other relevant links only where useful.

Remove links to:

- Short Stories.
- Unfinished Premium pages.
- Empty or broken destinations.
- Unused features.

Avoid excessive footer text and repeated navigation groups.

## 13. Responsive Design

Use the existing framework's responsive approach.

Test at representative viewport widths, including:

- Small mobile: approximately 320–375px.
- Standard mobile: approximately 390–430px.
- Tablet: approximately 768px.
- Desktop: approximately 1024px and wider.

These are test targets, not a requirement to hard-code a separate layout for every width.

Requirements:

- Prevent horizontal overflow.
- Keep navigation accessible.
- Use flexible grids.
- Ensure buttons have comfortable touch targets.
- Keep paragraph text readable.
- Ensure cover images retain their aspect ratios.
- Avoid oversized hero sections on mobile.
- Ensure the footer remains usable on narrow screens.

Do not rely on desktop-only styling.

## 14. Accessibility and Interaction

- Use semantic HTML.
- Provide visible keyboard focus.
- Ensure all interactive controls work with a keyboard.
- Use accessible labels for search fields and forms.
- Maintain readable colour contrast.
- Ensure buttons have clear names.
- Do not communicate essential status using colour alone.
- Respect reduced-motion preferences if animations are present.
- Do not introduce animations that interfere with reading.

## 15. Performance

- Reuse components instead of duplicating large sections of markup.
- Optimize image dimensions and file sizes.
- Avoid adding unnecessary dependencies.
- Remove unused scripts only after checking their dependencies.
- Avoid layout shifts caused by images loading without reserved dimensions.
- Avoid unnecessary animation and heavy visual effects.
- Test the production build after changes.
- Fix errors that prevent pages or controls from working.

Do not rewrite working application logic solely to make the code look different.

## 16. SEO and Structured Data Preservation

UI changes must not break SEO.

Requirements:

- Preserve correct page titles and meta descriptions.
- Preserve canonical URLs.
- Preserve intended indexability.
- Keep internal links crawlable.
- Update sitemap entries when routes change.
- Ensure visible breadcrumbs and BreadcrumbList structured data remain consistent.
- Remove obsolete structured data when a section is removed.
- Do not invent schema properties or false metadata.
- Test representative novel pages after modifying shared templates.

The current Search Console Breadcrumbs issue must be corrected based on the actual reported error, not by removing useful breadcrumbs indiscriminately.

Validate structured data after deployment.

## 17. Content Integrity

During the UI redesign:

- Do not rewrite novel plots without approval.
- Do not fabricate author information.
- Do not invent reviews, ratings, or statistics.
- Do not create generic descriptions for the sake of filling cards.
- Preserve existing accurate content.
- Flag content that needs verification rather than guessing.
- Do not distribute PDFs without the necessary rights or permission.

## 18. Implementation Procedure

Follow this order:

1. Inspect the existing code and website.
2. Document the current routes and shared components.
3. Identify duplicated sections and inconsistent styles.
4. Create or consolidate design tokens.
5. Refactor the header and navigation.
6. Refactor the reusable novel card.
7. Simplify the homepage according to Section 7.
8. Standardize the Novels catalogue.
9. Standardize the novel detail page.
10. Review About, Contact, Privacy Policy, and 404.
11. Remove Short Stories from the current launch scope.
12. Remove unfinished Premium UI.
13. Fix or hide Bookmarks depending on actual functionality.
14. Remove placeholder testimonials and unsupported statistics.
15. Check PDF downloads and preserve valid behaviour.
16. Fix responsive layout and accessibility.
17. Recheck SEO metadata, canonical URLs, and breadcrumbs.
18. Run the project's existing lint, type-check, and production build commands where available.
19. Test all affected routes and interactions.
20. Review the deployed site on desktop and mobile.

Do not claim that tests passed unless they were actually run.

## 19. Final Acceptance Checklist

- [ ] Existing application framework and architecture are preserved unless a change is justified.
- [ ] Homepage has a clear hierarchy.
- [ ] Repeated novel sections are removed or consolidated.
- [ ] Placeholder testimonials and unverified statistics are removed.
- [ ] Short Stories is absent from current public navigation.
- [ ] Unfinished Premium UI is absent.
- [ ] Bookmarks is functional or hidden from public navigation.
- [ ] Header and footer links work.
- [ ] Novel cards use consistent styling.
- [ ] Novel descriptions remain accurate and unique.
- [ ] PDF downloads work correctly.
- [ ] Individual novel pages remain useful.
- [ ] Mobile layouts work without horizontal overflow.
- [ ] Accessibility basics have been tested.
- [ ] No broken routes or imports were introduced.
- [ ] Canonical URLs and page metadata remain correct.
- [ ] Breadcrumbs and structured data have been validated.
- [ ] Production build completes successfully where the project provides a build.
- [ ] No unrequested redesign or content deletion has occurred.

## 20. Final Instruction to the Implementer

Treat this file as a mandatory implementation specification.

Do not merely describe the changes. Inspect the actual project, implement the required changes in the existing codebase, and test the result.

If an instruction conflicts with existing architecture, identify the conflict and choose the least disruptive correct solution.

Do not assume that a visual redesign alone guarantees Google AdSense approval.

The final website must provide a useful reading and discovery experience, consistent visual design, accurate content, working functionality, and sound technical SEO.
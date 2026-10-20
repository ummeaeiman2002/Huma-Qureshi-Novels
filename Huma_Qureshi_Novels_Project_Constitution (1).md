# Constitution.md

# HumaQureshiNovels.com — Website Constitution

**Project Name:** Huma Qureshi Novels  
**Website:** https://humaqureshinovels.com  
**Primary Goal:** Build a well-structured, professional, user-friendly novel website that follows SEO best practices and is prepared for Google AdSense review.

**Document Purpose:** This document defines the website's structure, page requirements, content standards, technical SEO, pages to remove, navigation rules, and implementation requirements. All website changes should follow this specification.

---

# 1. Core Website Principles

The website must follow these principles:

1. Reader experience must come before advertising or monetization.
2. Every public page must have a clear purpose.
3. Every content page must provide useful, accurate, and relevant information.
4. Novel descriptions must be unique and specific to the individual novel.
5. Navigation must be simple, consistent, and easy to understand.
6. No empty, unfinished, misleading, or unnecessary pages should be published.
7. All buttons, links, downloads, and interactive features must work correctly.
8. The website must work on desktop, tablet, and mobile devices.
9. Technical SEO and structured data must match the actual content displayed on the page.
10. Copyright, privacy, accessibility, and Google publisher policies must be respected.
11. No feature should be added merely to increase the number of pages.
12. The website must never use deceptive practices to obtain search visibility or advertising approval.

---

# 2. Final Website Structure

The public website should have a simple and organized structure.

## 2.1 Main Pages to Keep

### A. Home Page

**Route:** `/`

The Home page must introduce the website and help visitors discover novels.

It should contain:

- Website identity and a clear introduction.
- A meaningful heading explaining the website's purpose.
- Featured novels, if the selection is maintained.
- Recently added novels, if this section reflects actual publication dates.
- A clear link to the complete Novels collection.
- Relevant categories, if they are useful and functional.
- A consistent header and footer.
- Links to About, Contact, and Privacy Policy.

Requirements:

- Do not fill the Home page with repetitive promotional text.
- Do not display empty sections.
- Do not show fake statistics, fake reviews, or fabricated popularity claims.
- All novel cards must link to the correct novel pages.
- The page must provide value beyond a list of links.

### B. Novels Page

**Route:** `/novels/`

This will be the main novel catalogue.

It must contain:

- A clear page heading.
- A useful introduction to the collection.
- Novel cover images where available.
- Accurate novel titles.
- Author attribution where known.
- A concise, relevant description for each novel.
- A link to the corresponding individual novel page.

Requirements:

- Only publish entries with working detail pages.
- Do not repeat the same generic description for every novel.
- Do not include broken images or placeholder cards.
- Avoid duplicate entries for the same novel.
- Do not display empty categories or non-functional filters.
- Ensure visitors can easily navigate the collection.
- Use pagination or other browsing controls only when implemented correctly.

### C. Individual Novel Pages

Each novel must have its own meaningful detail page when an individual page is appropriate for the content.

Example URL structure:

`/novels/novel-title/`

Each page should contain the following information when applicable and verified:

- Novel title.
- Accurate author name.
- Unique novel-specific description or synopsis.
- Genre or category.
- Language, if useful.
- Completion status, if accurate.
- Cover image.
- Reading or download information.
- A clear PDF download button when a valid PDF is available.
- Relevant related novels, where useful.
- Breadcrumb navigation.
- Appropriate page title and meta description.

Requirements:

- Each novel page must have its own accurate content.
- Do not invent plot details, author credentials, publication dates, or completion status.
- Do not use the same generic paragraph across all novel pages.
- Do not create separate duplicate URLs for the same novel without a genuine purpose.
- Do not make a page consist only of a title, cover image, and download link if additional useful information is available.
- Keep the design consistent across all novel detail pages.

### D. About Page

**Route:** `/about/`

Explain:

- The purpose of Huma Qureshi Novels.
- What readers can find on the website.
- Relevant information about the website owner or author, where appropriate and accurate.
- The website's content and reading experience.

Requirements:

- Use truthful information.
- Do not invent qualifications, credentials, or publishing history.
- Avoid generic filler written only for search engines.

### E. Contact Page

**Route:** `/contact/`

Provide a functional way for visitors to contact the website owner.

Possible options include:

- A working contact form.
- A dedicated contact email address.
- Another reliable contact method.

Requirements:

- All displayed contact methods must work.
- Form validation and submission must function correctly if a form is used.
- Provide appropriate feedback after form submission.
- Do not display fake contact information.
- Protect personal information submitted through forms.

### F. Privacy Policy

**Route:** `/privacy-policy/`

The Privacy Policy must accurately explain how the website handles visitor information.

It should cover applicable topics such as:

- Information collected through forms.
- Cookies and similar technologies.
- Analytics services, if used.
- Advertising and third-party advertising services, if used.
- How visitors can manage applicable privacy preferences.
- Contact information for privacy-related questions.

Requirements:

- The policy must reflect the actual implementation.
- Do not copy irrelevant clauses for services the website does not use.
- Update the policy when the website introduces new data collection or advertising services.
- Review Google's current requirements for publishers and applicable privacy obligations.

### G. 404 Page

Provide a helpful not-found page for invalid or deleted URLs.

It should:

- Explain that the requested page could not be found.
- Offer a link to the Home page.
- Offer a link to the Novels page.
- Avoid presenting an ordinary error page as successful novel content.

---

# 3. Pages and Features to Remove or Defer

The following decisions apply to the current website launch.

## 3.1 Remove Short Stories

The Short Stories section is outside the current project scope.

Required actions:

- Remove the Short Stories link from the main navigation.
- Remove its card or promotional section from the Home page.
- Remove related links from the footer if present.
- Remove unused Short Stories categories and filters.
- Remove orphaned links that point to the deleted section.
- Remove obsolete Short Stories routes from the XML sitemap.
- Remove outdated Short Stories breadcrumb entries and structured data.
- Remove unused components and code if they are no longer needed.

Important:

Before deleting any existing URL, check whether it contains valuable original content or has external links or search visibility.

If a page has a genuinely relevant replacement, configure an appropriate permanent redirect. If no relevant replacement exists, return a proper 404 or 410 response.

Do not automatically redirect every deleted page to the Home page.

## 3.2 Defer the Premium Feature

The Premium feature will not be part of the current launch.

Do not implement or advertise:

- Premium membership pages.
- Locked novel pages.
- Unfinished payment flows.
- Premium pricing cards.
- Login screens that exist only for the deferred feature.
- Non-functional subscription buttons.
- Premium teasers that lead nowhere.

If these elements already exist, remove them from the public interface until the feature is deliberately developed later.

Do not delete unrelated authentication or payment infrastructure if another active feature genuinely depends on it. Review dependencies before removing code.

The current priority is to complete the free novel-reading and download experience.

## 3.3 Bookmarks Page

The Bookmarks page should not remain as an empty or broken public page.

Decision rule:

- If bookmarking works correctly, retain the feature and provide a useful empty state for visitors who have not saved any novels.
- If bookmarking does not work, remove the page from public navigation until the feature is ready.
- If a separate public Bookmarks URL is unnecessary, keep the functionality within the interface where it is used rather than maintaining an empty standalone page.

A useful empty state may explain how to bookmark a novel and provide a link to the Novels collection.

Do not create fake bookmarks or sample content that appears to belong to a real user.

## 3.4 Remove Other Unnecessary Pages

Remove or keep unpublished:

- Empty pages.
- Placeholder pages.
- Demo and test pages.
- Duplicate content pages.
- Unfinished feature pages.
- Broken category pages.
- Pages with no meaningful purpose.
- Routes left behind after removing a feature.

Do not remove important legal pages, functional pages, or useful original content simply to reduce the total number of URLs.

## 3.5 Review Unused Components

After removing a page or feature:

- Remove unused navigation links.
- Remove unused page components.
- Remove unused routes.
- Remove obsolete metadata and structured data.
- Remove unused sitemap entries.
- Check for broken imports and build errors.
- Confirm that remaining pages still work.

All deletions must be tested before deployment.

---

# 4. PDF Download Requirements

The Novels section may provide a direct PDF download option instead of episodic reading where the relevant novel is available as a PDF.

## Required Behaviour

- Use a clearly labelled button such as "Download PDF".
- The button must point to the correct PDF file.
- Verify that the file exists and opens or downloads correctly.
- Ensure PDF links work on mobile and desktop.
- Use descriptive file names where practical.
- Avoid misleading download buttons or fake download links.
- Do not create unnecessary redirects or intrusive pop-ups.
- Clearly communicate whether a PDF is free.
- Do not require payment or login for a file advertised as freely accessible.

## Copyright Requirements

Only distribute PDFs when the website has the necessary rights, permission, or other valid legal basis.

Do not assume that a PDF is safe to publish merely because it is available online.

## Novel Page Requirements

A PDF download button must not replace the useful information on a novel detail page.

Each page should still provide relevant information about the novel, its author where known, and the available reading or download option.

Do not create a separate thin page for every download action.

---

# 5. Content Quality Standards

Content quality is a primary project requirement.

## 5.1 Unique Novel Descriptions

Every novel description must accurately represent that particular novel.

Descriptions should explain relevant details such as:

- The premise or subject of the novel.
- Its main themes, where known.
- Its genre.
- What readers can expect.
- Other relevant details that can be verified.

Do not:

- Repeat the same generic description across multiple novels.
- Use keyword stuffing.
- Invent plot details.
- Make unsupported claims about popularity.
- Generate meaningless paragraphs merely to increase page length.
- Publish content that misrepresents the novel.

If reliable details are unavailable, write a concise and accurate description rather than inventing information.

## 5.2 No Thin or Empty Content Pages

Every indexable content page must offer a clear benefit to visitors.

Avoid pages that contain only:

- A heading with no meaningful content.
- A cover image and an unrelated generic paragraph.
- A broken download button.
- A list of links with no useful context.
- Repeated content copied from other pages.
- Placeholder text.

Not every page requires a specific word count. Quality, relevance, accuracy, and usefulness matter more than arbitrary length.

## 5.3 No Misleading Content

Never display:

- Fake testimonials.
- Fake reviews or ratings.
- False author credentials.
- Fabricated reader counts.
- False claims about free or premium access.
- Unsupported ownership or copyright claims.

All information must be truthful and relevant.

---

# 6. Google AdSense Readiness

The website must be prepared for a Google AdSense review, without assuming that any specific change guarantees approval.

## Requirements

- Provide useful content for readers.
- Ensure the website has a clear purpose.
- Complete the important public pages.
- Make navigation simple and consistent.
- Ensure that novel detail pages contain meaningful information.
- Make all download buttons and links work.
- Publish accurate About, Contact, and Privacy Policy pages.
- Resolve broken pages and technical errors.
- Ensure the website is accessible on mobile devices.
- Review applicable Google Publisher Policies before applying.
- Ensure all published material complies with copyright requirements.
- Avoid deceptive practices and artificial traffic.

## Advertising Placement

If advertisements are displayed:

- Do not make ads resemble novel covers, navigation links, or PDF download buttons.
- Do not place ads where visitors are likely to click accidentally.
- Do not encourage visitors to click ads.
- Never click your own ads or generate invalid ad traffic.
- Do not use forced redirects or deceptive overlays.
- Do not place advertisements on error pages or unfinished pages.
- Do not allow ads to obstruct the main reading experience.

The website must provide value independently of advertisements.

## Important

There is no guaranteed number of pages, word count, or waiting period that ensures AdSense approval.

Google makes the final decision based on its current policies and its review of the website.

---

# 7. Technical SEO Requirements

## 7.1 URL Structure

Use clear, stable URLs.

Examples:

- `/`
- `/novels/`
- `/novels/novel-title/`
- `/about/`
- `/contact/`
- `/privacy-policy/`

Requirements:

- Use consistent URL formatting.
- Use HTTPS.
- Avoid unnecessary duplicate routes.
- Ensure internal links use the preferred canonical URL.
- Ensure that important pages can be reached through normal navigation.
- Avoid broken internal links.

## 7.2 Page Titles

Every important indexable page must have a unique and descriptive HTML title.

Examples:

- Home: `Huma Qureshi Novels | Read Novels Online`
- Catalogue: `Novels Collection | Huma Qureshi Novels`
- Novel detail: `[Novel Title] by [Author] | Huma Qureshi Novels`

These are examples only. Final titles must accurately describe the actual page.

Do not use the same title for every novel.

Avoid keyword stuffing.

## 7.3 Meta Descriptions

Every important page should have an accurate, relevant meta description.

Requirements:

- Write a unique description for each novel.
- Summarize the actual page.
- Avoid repetitive generic descriptions.
- Avoid keyword stuffing.
- Do not use misleading promotional claims.

Meta descriptions may help search-result presentation but do not guarantee rankings or AdSense approval.

## 7.4 Heading Structure

Use semantic headings logically:

- One clear primary `h1` heading for the page's main topic.
- `h2` headings for major sections.
- `h3` headings for relevant subsections.

Requirements:

- Do not use headings merely to change font size.
- Do not skip heading levels without a meaningful reason.
- Use semantic HTML elements appropriately, including `header`, `nav`, `main`, `article`, and `footer`.

## 7.5 Canonical URLs

Every indexable page must have an appropriate canonical URL.

Requirements:

- Canonical URLs must point to the correct preferred version of the page.
- Novel pages must not all point to the same canonical URL.
- Canonical URLs must use the correct domain and HTTPS.
- Avoid conflicting canonical tags.
- Ensure internal links and sitemap URLs are consistent with canonical URLs.

Do not use canonical tags as a substitute for properly removing permanently deleted pages.

---

# 8. Breadcrumbs and Structured Data

Google Search Console has reported a Breadcrumbs structured data issue for the website. This issue must be investigated and corrected.

## Requirements

- Display breadcrumbs where they help users understand the page hierarchy.
- Ensure breadcrumb labels accurately represent the hierarchy.
- Ensure the final breadcrumb item corresponds to the current page.
- Use valid absolute URLs in structured data where required.
- Ensure the structured data matches the visible breadcrumb navigation.
- Remove invalid, placeholder, or obsolete URLs.
- Do not include deleted pages in breadcrumbs.
- Do not generate malformed JSON-LD.
- Avoid duplicate or conflicting breadcrumb structured data.

## Example Hierarchy

Home → Novels → Novel Title

The breadcrumb structure must reflect the actual website routes.

## Validation Process

1. Inspect the existing breadcrumb implementation.
2. Identify the exact error reported by Search Console.
3. Correct the underlying template or data source.
4. Validate the affected page using Google's Rich Results Test.
5. Inspect the deployed page source and generated structured data.
6. Test more than one novel page if they share the same template.
7. Recheck the Breadcrumbs report in Search Console after Google recrawls the updated pages.

Do not assume that the issue is fixed simply because the code was changed.

---

# 9. XML Sitemap and Indexing

The XML sitemap must contain only URLs intended to be indexed.

## Sitemap Requirements

Include appropriate canonical URLs for:

- Home.
- Novels catalogue.
- Published novel detail pages.
- Other useful public pages intended for indexing.

Exclude:

- Deleted pages.
- Redirecting URLs.
- Duplicate URLs.
- Development and test pages.
- Unfinished feature pages.
- URLs that are intentionally marked `noindex`.
- Broken URLs.

## Google Search Console

After deployment:

1. Open Google Search Console.
2. Review the submitted sitemap.
3. Check important page URLs with URL Inspection.
4. Verify that important pages can be crawled.
5. Request indexing for new or substantially updated important pages when appropriate.
6. Review indexing reports for errors.
7. Allow time for Google to recrawl the website.

Submitting a URL does not guarantee indexing.

Do not repeatedly request indexing without addressing the underlying problem.

---

# 10. Internal Linking and Navigation

Navigation must remain simple, consistent, and useful.

## Header

The header should provide links to the principal sections, including Home and Novels, and may include About or Contact if appropriate.

Requirements:

- Remove the Short Stories navigation item.
- Do not display the unfinished Premium feature.
- Do not link to empty or broken pages.
- Keep the mobile navigation usable.
- If the header is sticky, ensure it does not cover headings or page content.

## Footer

The footer should provide relevant links such as:

- About.
- Contact.
- Privacy Policy.
- Other useful policy pages, where applicable.

Do not use the footer to retain links to removed or unfinished sections.

## Internal Links

- Home must link to the Novels collection.
- Novel cards must link to their matching detail pages.
- Novel detail pages must provide a clear route back to the catalogue.
- Related novels must be genuinely relevant.
- Avoid orphan pages.
- Check internal links after changing routes.

---

# 11. Performance, Mobile Usability, and Accessibility

The website must provide a reliable experience on desktop and mobile devices.

## Performance

- Optimize cover images.
- Avoid unnecessarily large assets.
- Reduce unnecessary scripts.
- Prevent layout shifts where practical.
- Ensure pages load reliably.
- Fix errors that affect real visitors.
- Avoid intrusive pop-ups.

## Accessibility

- Use readable font sizes.
- Maintain adequate text contrast.
- Provide meaningful image alt text.
- Use descriptive link labels.
- Ensure buttons and menus work with a keyboard.
- Provide visible keyboard focus indicators.
- Use proper form labels and validation.
- Ensure interactive controls are accessible.

## Mobile

Verify that:

- The header and menu work.
- Novel cards display correctly.
- Descriptions remain readable.
- Buttons are easy to tap.
- PDF links work.
- No content overflows horizontally.
- Footer links remain accessible.

---

# 12. Privacy, Security, and Trust

- Keep the Privacy Policy accurate.
- Use HTTPS.
- Protect form submissions and user information appropriately.
- Do not publish fake contact information.
- Do not expose private information in URLs or public page content.
- Use only necessary third-party scripts and services.
- Keep dependencies and production configuration appropriately maintained.
- Ensure that any login or bookmarking feature does not expose private user data.
- Provide a suitable way to report copyright or content concerns when relevant.

---

# 13. Required Implementation Order

Complete the work in this sequence.

## Phase 1: Audit

- Inspect the current routes and page templates.
- Identify empty, duplicate, broken, and unfinished pages.
- Review the current Home and Novels pages.
- Inspect individual novel pages.
- Review the existing Breadcrumbs structured data issue.
- Check PDF availability and distribution permissions.

## Phase 2: Remove Unnecessary Pages

- Remove Short Stories from the current launch scope.
- Remove unfinished Premium UI.
- Decide whether Bookmarks should be completed or hidden from public navigation.
- Remove unused components and routes.
- Configure appropriate handling for deleted URLs.
- Clean up internal links and navigation.

## Phase 3: Complete Essential Pages

- Improve Home.
- Improve the Novels catalogue.
- Standardize individual novel detail pages.
- Complete About.
- Complete Contact.
- Complete Privacy Policy.
- Ensure the 404 page works.

## Phase 4: Improve Content

- Write accurate, unique novel descriptions.
- Remove generic duplicate descriptions.
- Verify author information.
- Verify novel titles and categories.
- Ensure download information is accurate.
- Remove placeholder text and unsupported claims.

## Phase 5: Technical SEO

- Fix page titles and meta descriptions.
- Verify canonical URLs.
- Correct breadcrumbs and structured data.
- Update the XML sitemap.
- Verify indexing directives.
- Repair broken links.
- Check status codes and redirects.

## Phase 6: Quality Assurance

- Test the production build.
- Test all public routes.
- Test every PDF button.
- Test mobile and desktop layouts.
- Test navigation and footer links.
- Validate structured data.
- Check for console errors and broken images.
- Verify that no unfinished pages remain publicly linked.

## Phase 7: Search Console and AdSense Preparation

- Deploy the corrected website.
- Test the live URLs.
- Submit or refresh the sitemap.
- Inspect important pages in Google Search Console.
- Monitor indexing and structured data reports.
- Review the live website against current Google Publisher Policies.
- Apply for AdSense only when the website is ready for review.

---

# 14. Final Acceptance Checklist

The implementation is ready for final review only after the relevant items below have been checked.

## Content

- [ ] Home page is useful and complete.
- [ ] Novels catalogue is functional.
- [ ] Published novel pages contain unique and accurate information.
- [ ] PDF links work correctly.
- [ ] Copyright permissions have been reviewed.
- [ ] No placeholder descriptions remain.
- [ ] No misleading claims remain.

## Pages

- [ ] Short Stories has been removed from the current launch scope.
- [ ] Premium remains deferred.
- [ ] Bookmarks works correctly or is hidden from public navigation.
- [ ] About is complete.
- [ ] Contact is functional.
- [ ] Privacy Policy reflects the actual website.
- [ ] The 404 page is helpful.
- [ ] No unnecessary empty or unfinished pages remain in navigation.

## SEO

- [ ] Page titles are unique and descriptive.
- [ ] Meta descriptions are relevant.
- [ ] Heading structure is logical.
- [ ] Canonical URLs are correct.
- [ ] Sitemap contains intended canonical URLs only.
- [ ] Internal links are working.
- [ ] Deleted URLs are handled appropriately.
- [ ] Important pages are crawlable and not accidentally marked `noindex`.

## Structured Data

- [ ] Breadcrumbs match visible navigation.
- [ ] Breadcrumb URLs are valid.
- [ ] Structured data contains no invalid placeholder URLs.
- [ ] The Breadcrumbs issue has been retested after deployment.
- [ ] Shared page templates have been tested on multiple URLs.

## User Experience

- [ ] Desktop layout works.
- [ ] Mobile layout works.
- [ ] Header and footer work.
- [ ] Download buttons are clear and functional.
- [ ] No misleading controls or intrusive overlays remain.
- [ ] No important broken images or links remain.

## AdSense Preparation

- [ ] Website has a clear purpose.
- [ ] Public pages provide meaningful value.
- [ ] Required contact and privacy information is available.
- [ ] Content and downloads meet applicable copyright requirements.
- [ ] Advertising placement, if enabled, is not deceptive.
- [ ] Current Google Publisher Policies have been reviewed.

---

# 15. Final Rule

Do not publish an unfinished feature merely because it has already been designed or partially coded.

Do not delete useful content without reviewing its purpose and URL history.

Do not create unnecessary pages to increase the website's page count.

Every implementation change must improve the website's structure, content quality, usability, technical reliability, or compliance.

**Final objective:** HumaQureshiNovels.com must be a complete, useful, well-structured novel website that is technically sound and prepared for Google AdSense review. Approval is determined by Google and cannot be guaranteed by this document.

# 16. UI/UX Design Requirements

The visual interface of HumaQureshiNovels.com must follow the separate `UI_UX_Guidelines.md` specification.

The UI/UX guidelines are mandatory implementation requirements, not optional design suggestions.

## Required UI Changes

1. Simplify the homepage and remove repeated novel sections.
2. Remove the Short Stories section and all related public navigation links.
3. Keep the Premium feature deferred and remove unfinished Premium interface elements.
4. Keep Bookmarks only if the functionality works correctly; otherwise remove its public navigation link.
5. Remove placeholder testimonials, test reviewer names, fake statistics, and unsupported claims.
6. Standardize novel cards, cover image dimensions, titles, author labels, descriptions, and action buttons.
7. Establish consistent spacing, typography, colours, border styles, and button styles.
8. Improve header navigation and footer organization.
9. Ensure that the interface is responsive across desktop, tablet, and mobile screens.
10. Ensure accessible text contrast, keyboard navigation, visible focus states, and readable font sizes.
11. Maintain clear visual distinction between website navigation, novel content, and advertising.
12. Do not add decorative sections that repeat information without helping readers.
13. Preserve useful existing functionality and content unless it is explicitly marked for removal.
14. Do not replace the entire website with a new design framework unless necessary and approved.
15. Keep all page templates visually consistent.

## Implementation Rules

- Inspect the existing repository and current components before changing code.
- Reuse existing design tokens and components when practical.
- Create shared components for the header, footer, novel cards, buttons, and page containers where appropriate.
- Do not duplicate page-specific styling when a shared component can solve the problem.
- Do not change working routes, download functionality, or content relationships unnecessarily.
- Use the existing framework and dependencies unless there is a documented technical reason to change them.
- Do not introduce unnecessary libraries.
- Do not invent novel details, reviews, ratings, or statistics during redesign.
- Do not use placeholder content in the production interface.
- Test the production build and all affected routes after implementation.

## Acceptance Criteria

The UI changes are complete only when:

- The homepage has a clear visual hierarchy.
- Repeated novel sections have been removed.
- All remaining navigation links work.
- The Short Stories and unfinished Premium sections are absent from the current public interface.
- Bookmarks is functional or excluded from public navigation.
- All displayed testimonials and statistics are genuine and verifiable, or have been removed.
- Novel cards use consistent styling.
- Individual novel pages remain readable and functional.
- PDF downloads continue to work.
- Desktop and mobile layouts have been tested.
- No broken imports, routes, images, or buttons remain.
- The implementation conforms to `UI_UX_Guidelines.md`.

AdSense approval is not guaranteed by visual redesign. Content quality, functionality, copyright compliance, and applicable Google Publisher Policies must also be reviewed.
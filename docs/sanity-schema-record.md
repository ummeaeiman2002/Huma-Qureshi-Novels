# Sanity Schema Record — Huma Qureshi Novels

> Portable reference of the Sanity content model, captured so a **new project can reproduce the same schema and data shape** without surprises.
> Captured: 2026-10-20 · projectId `92mgyrwt` · dataset `production` · apiVersion `2025-06-12`.

---

## 1. Where the schema lives

```
sanity.config.ts                     # Studio config (basePath /studio, schema, structureTool, vision)
src/sanity/env.ts                    # projectId / dataset / apiVersion from env
src/sanity/structure.ts              # Studio sidebar; siteSettings is a singleton
src/sanity/schemaTypes/index.ts      # registry — ALL document types are listed here
src/sanity/schemaTypes/*.ts          # one file per document type
src/sanity/lib/client.ts             # client + optimizedClient (fetchWithTags)
src/sanity/lib/image.ts              # urlFor() image URL builder
src/lib/sanity/queries.ts            # GROQ queries used by the app
src/lib/sanity/siteSettings.ts       # siteSettings + summary loaders
src/lib/siteDefaults.ts              # SITE_IMAGE_KEYS + default image URLs
```

**Key gotchas to preserve in the new project**
- Every type MUST be imported and added to the `schema.types` array in `index.ts` — a type not listed there is invisible to Studio.
- `siteSettings` is a **singleton**: opened directly from the sidebar, fixed document id `"siteSettings"` (see `structure.ts` `SINGLETONS`).
- `writer` reference uses a **hard-coded read-only default**: `initialValue: { _ref: "e261df38-9273-4bdf-bed2-6db903573be8" }` (the "Huma Qureshi" writer doc) with `filter: 'writername == "Huma Qureshi"'`. **On a new dataset this _ref will NOT exist** — either recreate the writer doc with this exact `_id`, or change the initialValue.
- The whole site filters content by `writer->writername == "Huma Qureshi"` (`HUMA_WRITER_FILTER` in `queries.ts`). Everything hinges on that writer name.
- Most "image" fields are actually **plain string URL fields** (`banner`, `genrecardimageurl`, `writercardimageurl`, `categoryimageurl`) pointing at Cloudinary/Sanity CDN — NOT Sanity `image` assets. Only `writer.writerimage`, `characters[].image`, `sneakPeeks[].image`, `testimonial.image`, and `siteSettings.summaryImages[]` are real Sanity image assets.
- `next.config.ts` `images.remotePatterns` must allow the CDNs actually used: `res.cloudinary.com` (multiple accounts: `desu4ek7y`, `dx1gryhqc`, `dgqt9c8af`) and `cdn.sanity.io`.

---

## 2. Document types — registry

| Type (`_type`) | File | Title | Role |
|---|---|---|---|
| `novelparent` | novelparent.ts | Novel Main Details | **Parent/novel page** (the "main pages") |
| `novel` | novel.ts | Novel Episode | Episodes/chapters belonging to a novelparent |
| `pdf` | pdf.ts | PDF | Complete downloadable book |
| `genre` | genre.ts | Genre | Genre taxonomy (referenced) |
| `category` | category.ts | Category | Separate category taxonomy (referenced) |
| `writer` | writer.ts | Writer | Author profile (referenced) |
| `comment` | comment.ts | Comment | Reader comments (moderation flag) |
| `reaction` | reaction.ts | Reaction Counts | Global like/love/wow/sad/fire counts per page key |
| `announcement` | announcement.ts | News / Announcement | Site news |
| `testimonial` | testimonial.ts | Reader Review | Review screenshots marquee |
| `downloadSection` | downloadSection.ts | Download Page Section | Download-page rich text |
| `siteSettings` | siteSettings.ts | Site Settings | **Singleton** — logos, images, icons, homepage summary |
| `systemConfig` | systemConfig.ts | System Configuration | Config id + monthly reset date |
| `premiumNovel` | premiumNovel.ts | Premium Novel | Paid content (auth feature) |
| `premiumEpisode` | premiumEpisode.ts | Premium Episode | Paid episodes |
| `user` | user.ts | Premium User | Account/subscription fields |
| `subscription` | subscription.ts | Subscription | Subscription record |
| `payment` | payment.ts | Payment Transaction | Transactions |

---

## 3. `novelparent` — THE NOVEL MAIN PAGE (most important)

`_type: "novelparent"`, title "Novel Main Details". Grouped form. **58 fields** (see file for full definitions). Grouped:

**basic**: `title` (req), `englishtitle`, `slug` (source title, ≤96), `tagline`, `novelreleasedate` (datetime), `lastupdated` (date), `banner` (**string URL**), `genre` (ref→genre), `category` (ref→category), `additionalgenres` (array ref→genre), `language` (list Urdu/English, initial "Urdu"), `novelstatus` (list Completed/Ongoing/Discontinued), `isShortStory` (bool, initial false), `tags` (array string, ≤5), `themes` (array string, ≤10)

**description**: `shortdescription` (text), `noveldescription` (array block: h2/h3/h4/quote, bullet/number, bold/italic), `aboutnovel` (array block), `storyintro` (text), `readingtime` (string), `storycontent` (array block), `descriptionlanguage` (bool)

**characters**: `characterintro` (text), `characters` (array of `character` objects: `name` req, `role`, `description`, `image` asset hotspot)

**highlights**: `readerhighlightintro` (text), `readerhighlights` (array of `readerHighlight`: `title` req, `description`, ≤6)

**author**: `writer` (ref→writer, **readOnly**, default _ref huma), `authornote` (text), `authornotelang` (bool), `contentwarning` (text), `importantnote` (text)

**details**: `numberofpages`, `numberofchapters` (number), `fileformat`, `filesize` (string), `readingavailability` (list Online/PDF Download/Both), `featured` (bool), `trending` (bool)

**sneaks**: `sneakPeeks` (array of `sneakPeek`: `image` asset, `scene` text, `sceneIsUrdu` bool, `caption`, `chapterReference`, `order`)

**download**: `pdfurl` (string), `downloadfile` (file, accept application/pdf), `downloadtitle`, `downloaddescription` (text), `downloadformat`, `downloadsize` (string), `externaldownloadurl` (url), `downloadbuttonlabel` (string)

**reading**: `enableonlinereading` (bool, initial true), `onlinereadingintro` (text), `youtubeurl` (string)

**related**: `relatednovels` (array ref→novelparent), `relatedstories` (array ref→novelparent), `comment` (array ref→comment)

**seo**: `seotitle` (string), `seodescription` (text)

### Live data state (12 docs)
Populated: `title`(12) `slug`(12) `novelreleasedate`(12) `banner`(12) `genre`(12) `tags`(12) `noveldescription`(12) `descriptionlanguage`(12) `writer`(12) `authornote`(11) `authornotelang`(9) `isShortStory`(6) `trending`(3) `youtubeurl`(8) `comment`(4) `pdfurl`(1).
**Empty/unused:** `englishtitle`, `tagline`, `lastupdated`, `category`, `additionalgenres`, `language`, `novelstatus`, `themes`, `shortdescription`, `aboutnovel`, `storyintro`, `readingtime`, `storycontent`, `characterintro`, `characters`, `readerhighlightintro`, `readerhighlights`, `contentwarning`, `importantnote`, `numberofpages`, `numberofchapters`, `fileformat`, `filesize`, `readingavailability`, `featured`, `sneakPeeks`, `downloadfile`, `downloadtitle`, `downloaddescription`, `downloadformat`, `downloadsize`, `externaldownloadurl`, `downloadbuttonlabel`, `enableonlinereading`, `onlinereadingintro`, `relatednovels`, `relatedstories`, `seotitle`, `seodescription`.

> ⚠️ The app's listing/sort logic depends on `novelreleasedate` + `writer` + `genre` + `banner` + `isShortStory` + `noveldescription`/`shortdescription`. `featured`/`trending` are read but currently **not set** (homepage falls back to release-date order). Keep those fields in the new schema even if unused.

---

## 4. `novel` — EPISODES

`_type: "novel"`, title "Novel Episode". Fields: `title` (req), `name` (req, episode number/name), `episodeslug` (slug source name, unique), `novelparent` (ref→novelparent), `episodereleasedate` (datetime), `episodeteaser` (text), `body` (text), `writer` (ref→writer readOnly default huma), `genre` (ref→genre), `youtubeurl`, `views` (number, readOnly, initial 0), `monthlyViews` (number, readOnly, initial 0), `tags` (array string ≤5), `comment` (array ref→comment).

Live state (160 docs): `title`160, `body`160, `name`159, `episodeslug`159, `novelparent`159, `episodeteaser`159, `writer`159, `genre`159, `views`159, `episodereleasedate`157, `tags`153, `monthlyViews`139, `youtubeurl`22, `comment`12.

> ⚠️ Episode route = `/novel/<novelparent.slug>/<episodeslug>`; the homepage "Latest Episodes" projects the **parent** novel's `banner` + `genre`.

---

## 5. `pdf` — COMPLETE BOOKS

`_type: "pdf"`, title "PDF". Groups: basic, description, characters, highlights, sneaks, download, publishing, related, seo. Same family as novelparent but adds: `pdfreleasedate` (datetime, replaces novelreleasedate), `pdfshortdescription`/`pdfdescription`, `pdfnumberofpages`, `pdfurl` (string, legacy), and publishing flags `trending` / `latest` / `popular` (all bool) + `views`, `monthlyViews`, `downloadCount` (all readOnly numbers).

Live state (6 docs): `title`6, `slug`6, `pdfreleasedate`6, `writer`6, `genre`6, `banner`6, `tags`6, `pdfdescription`6, `descriptionlanguage`6, `authornote`6, `authornotelang`5, `pdfurl`6, `trending`6, `latest`6, `popular`6, `youtubeurl`6, `views`6, `downloadCount`6, `comment`2, `monthlyViews`4.
**Empty:** `englishtitle`, `language`, `category`, `themes`, `pdfshortdescription`, `characterintro`, `characters`, `readerhighlightintro`, `readerhighlights`, `sneakPeeks`, `downloadfile`, `downloadtitle`, `downloaddescription`, `downloadformat`, `downloadsize`, `pdfnumberofpages`, `externaldownloadurl`, `downloadbuttonlabel`, `seotitle`, `seodescription`.

> ⚠️ Same `writer` readOnly default `_ref` issue. `downloadformat`/`downloadsize` are **empty** in live data, so card "format/size" pills render blank — keep fields but expect empty.

---

## 6. Taxonomy + people

**`genre`** (7 docs): `genrename` (string), `genreslug` (slug source genrename), `genrecardimageurl` (string URL). Live genres: Romance, Thriller, Political Crime Fiction, Cultural Fiction, Festive Romance, Gangster Based, Army Based.

**`category`** (0 docs): `categoryname` (req), `categoryslug`, `categoryimageurl` (string). Currently unused, but novelparent/pdf reference it.

**`writer`** (6 docs): `writername`, `writerslug`, `writercardimageurl` (string URL), `writerimage` (real image asset, hotspot — **all 6 empty**), `writerbio` (text), `writerbiofull` (text), `sociallinks[]` (`label`, `url` req).
The **Huma Qureshi** doc `_id = e261df38-9273-4bdf-bed2-6db903573be8`, slug `huma-qureshi`. Other writers exist (Mah Aara, Umaima Mukarram, Uzma Mushtaq, Noor-e-Arooj, Qanita Khadija) but the site filters to Huma only.

---

## 7. Supporting types

- **`comment`** (122 docs): `name`, `comment` (req), `approved` (bool, initial false — hidden until editor approves).
- **`reaction`** (1 doc): `slugkey` (req) + `like`/`love`/`wow`/`sad`/`fire` (non-negative int). Key = `novel-slug/episode-slug` for episodes, `novel-slug` for novel pages.
- **`testimonial`** (2 docs): `image` (asset, alt), `name`, `platform` (facebook/instagram/google/whatsapp/other), `rating` (1-5), `link`, `quote` (≥20), `order`, `active` (initial true), `timestamp`.
- **`announcement`** (0 docs): `title` (req), `body` (req ≥20), `announcementdate`.
- **`downloadSection`** (0 docs): `title` (req), `body` (block array, req ≥1), `isUrdu` (bool), `enabled` (bool initial true).
- **`systemConfig`** (0 docs): `configId` (req), `lastReset` (datetime).
- **`siteSettings`** (singleton, 1 doc): see §8.

### Premium/auth (present but effectively unused)
- **`user`** (1 doc), **`premiumNovel`** (1), **`premiumEpisode`** (0), **`subscription`** (0), **`payment`** (0).
- These support the paid tier: `premiumNovel` mirrors novelparent-lite; `premiumEpisode` refs `premiumNovel`; `user` has `passwordHash`/`stripeCustomerId` (hidden), subscription fields, `readingHistory`/`bookmarks`/`favorites` refs. **If the new project is free-only, these can be omitted — but the Studio config imports them in `index.ts`.**

---

## 8. `siteSettings` singleton — INCLUDING the new homepage summary

Singleton, id `"siteSettings"`. Image fields (all real Sanity image assets):
`logo`, `heroImage`, `authorImage`, `defaultBanner`; icons `socialFacebookIcon`, `socialYoutubeIcon`, `socialInstagramIcon`, `socialEmailIcon`, `locationIcon`, `searchIcon`, `backToTopIcon`, `downloadIcon`, `youtubePlayIcon`.

**Homepage "Website Summary" fields (added 2026-10-20):**
- `summaryEyebrow` (string) — small label, e.g. "Website Summary".
- `summaryTitle` (string) — EN heading.
- `summaryText` (text, 5 rows) — EN body.
- `summaryTitleUrdu` (string) — UR heading.
- `summaryTextUrdu` (text, 5 rows) — UR body.
- `summaryImages` (array of `image`, hotspot, **max 3**, each with optional `alt` string) — portrait images, recommended **2500×3000 (5:6)**.

Loader: `getSiteSummary()` in `src/lib/sanity/siteSettings.ts` projects `summaryImages[].asset->url` + `alt`. Homepage section auto-hides when empty. Existing `getSiteSettings()` returns a string-URL map merged over `DEFAULT_SITE_IMAGES` (`SITE_IMAGE_KEYS`).

---

## 9. How the app reads data (GROQ contracts)

- Writer filter constant: `HUMA_WRITER_FILTER = 'writer->writername == "Huma Qureshi"'`.
- Novels listing sorts `_createdAt desc`, filters `(!defined(novelreleasedate) || novelreleasedate <= now())`.
- Episode views are **summed across a novel's episodes** for `totalViews`/`totalMonthlyViews` (`getPaginatedNovels`).
- Homepage (`src/app/page.tsx`) fetches featured/popular/latest novels + PDFs + latest episodes in one GROQ; dedupes episodes to **1 per novel**; hero shows up to 4 books and excludes their ids from Featured/Latest.
- Image config: `next.config.ts` `remotePatterns` = `res.cloudinary.com` + `cdn.sanity.io`.

---

## 10. New-project checklist (to avoid breakage)

1. **Copy all files** in `src/sanity/schemaTypes/` and register every type in `index.ts`.
2. Recreate the **writer** doc with `_id = e261df38-9273-4bdf-bed2-6db903573be8` and `writername = "Huma Qureshi"` — OR update every `writer` `initialValue._ref` and `HUMA_WRITER_FILTER`.
3. Keep `novelreleasedate` (novelparent), `pdfreleasedate` (pdf), `episodereleasedate` (novel) — all listing/sort logic uses them; make sure they're `<= now()` for published visibility.
4. Keep `banner` (string URL) on novelparent/pdf and the parent `genre` — cards + Latest Episodes depend on them.
5. Register `siteSettings` as a **singleton** (fixed id) in `structure.ts`.
6. Whitelist the Cloudinary accounts + `cdn.sanity.io` in `next.config.ts` `remotePatterns`.
7. Set env: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, and `SANITY_COMMENTS_TOKEN` for writes.
8. Recreate `DEFAULT_SITE_IMAGES` fallbacks (new CDN URLs) so the site never renders broken images.

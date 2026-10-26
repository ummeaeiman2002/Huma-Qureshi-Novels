# Process Log — Huma Qureshi Novels

> Living document. Update after every session so work can resume if a session terminates.
> Last updated: 2026-10-21

---

## 1. Project Overview

- **Purpose:** SEO/AdSense-friendly Urdu novel site for author **Huma Qureshi** — read online, episodic stories, free PDF downloads.
- **Stack:** Next.js 16.1.1 (App Router), React 19.2.3, TypeScript, Tailwind CSS v4, Sanity CMS.
- **Repo:** `https://github.com/ummeaeiman2002/Huma-Qureshi-Novels.git` (branch `main`).
- **Local path:** `E:\Downloads\Huma-Qureshi-Novels-main_F\Huma-Qureshi-Novels-main`
- **Dev server:** `http://localhost:3000` (run `next dev`).
- **Specs (governing docs):**
  - `Huma_Qureshi_Novels_Project_Constitution (1).md`
  - `docs/Urdu Novels Website UI Showcase.png` / `Ui.md`
  - `CLAUDE.md` (SDD workflow + PHR rules)

---

## 2. Environment / Tooling Notes (Windows PowerShell)

**Unavailable:** `head`, `tail`, `grep`, `wc`, `sed`, `rg`, `python3`.
**Use instead:** `Select-Object -First/-Last`, `Select-String`, `findstr`, `Measure-Object`, `py` (Python launcher), `curl.exe`.

**Bracketed paths** (e.g. `src/app/download/[slug]/page.tsx`) break `Get-Content` — use the `read` tool, `py`, or `findstr` instead.

**Build / typecheck commands:**
```powershell
node .\node_modules\typescript\bin\tsc --noEmit          # expect TS_OK
node .\node_modules\next\dist\bin\next build             # expect BUILD_OK (use timeout >= 300000ms)
```
Both pass as of the latest commit. Build sometimes exceeds 120s — always pass a large timeout.

**DO NOT `cd` in commands** — use the `workdir` parameter of the bash tool.

---

## 3. SEO / Global Constants

- `SITE_URL = "https://humaqureshinovels.com"`, `SITE_NAME = "Huma Qureshi Novels"` — `src/lib/seo.ts:1`
- AdSense publisher ID via env `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` = `ca-pub-9826860279589874` (`.env.local:6`)
- `public/ads.txt` → `google.com, pub-9826860279589874, DIRECT, f08c47fec0942fa0` (matches env) ✓
- GA4: `G-X7F51SY5RZ`; Consent Mode v2 defaults to **denied** (`src/app/layout.tsx:59`).
- Authentic logo: Cloudinary `https://res.cloudinary.com/dx1gryhqc/image/upload/v1758662209/Logo_ox1c8z.png`
  - Resolved from Sanity `siteSettings.logo` (`src/lib/sanity/siteSettings.ts`); fallback in `src/lib/siteDefaults.ts`.

---

## 4. Locked Design Decisions

- **Cover ratio = portrait `5:6`.** Novel/PDF covers are uploaded at **2500 × 3000**. All card/hero/banner cover containers use `aspect-[5/6]`.
- Author portrait (`AboutAuthor.tsx`) stays `aspect-[4/5]` (different image, not a novel cover).
- `HeroSlider.tsx` is **dead code** (unused); left as-is, not updated.

---

## 5. Session Changes (most recent first)

### 5.1 Commit `6a94ff7` — portrait covers, Sanity uploads, index download pages

**Sanity schema — dual cover source (upload + external URL):**
- `src/sanity/schemaTypes/novelparent.ts`: added `bannerImage` (image upload, hotspot, portrait 2500×3000). Renamed `banner` → "Banner URL (External)".
- `src/sanity/schemaTypes/pdf.ts`: same `bannerImage` + `banner` (external URL) pair.
- **Precedence:** uploaded image wins; external URL is fallback.
- **All GROQ queries** now project `"banner": coalesce(bannerImage.asset->url, banner)` so components keep reading `banner` as a **URL string**.
  - Files touched: `src/lib/sanity/queries.ts`, `src/lib/sinity/queries.ts`, `src/app/page.tsx` (5 spots incl. `"novelBanner": coalesce(novelparent->bannerImage.asset->url, novelparent->banner)`), `src/app/novel/[slug]/page.tsx`, `src/app/novel/[slug]/[episodeslug]/page.tsx`, `src/app/pdf/[slug]/page.tsx`, `src/app/download/[slug]/page.tsx`, `src/app/api/latest-upload/route.ts`.

**Portrait 5:6 rollout:**
- `src/app/components/AuthorHero.tsx` — hero cover → `aspect-[5/6]`, `max-w-[300px]`, sizes `(max-width:1024px) 60vw, 300px`
- `src/app/components/Cards/Novel.tsx:59` — `aspect-[5/6]`, sizes 260px, fallback `text-4xl`
- `src/app/components/Cards/PDF.tsx:56` — same
- `src/app/page.tsx:330,358` — homepage Latest Episodes cover + fallback → `aspect-[5/6]`
- `src/app/components/NovelSpotlight.tsx:57` — `aspect-[5/6]`, `max-w-[300px]`
- `src/app/components/UpcomingProjects.tsx` — already 5:6 (no change)

**Download page fixes:**
- `src/app/download/[slug]/page.tsx:144` — bug fix: cover checked `novelBanner?.asset?.url` but `banner` is now a string → cover never rendered. Fixed to use string directly; cover → `aspect-[5/6] w-32 sm:w-36`.
- `robots: { index: true, follow: true }` (was `index:false`) — now indexable.
- `src/app/sitemap.ts` — added `/download/{slug}` URLs (deduped via `Set`, since novel/PDF slugs can collide).

**Metadata fixes:**
- `src/app/about/page.tsx` & `src/app/contact/page.tsx` — added og/twitter `images: ["/icon"]` fallback (were missing → broken share previews).
- `src/app/robots.ts` — added `disallow: "/u/"` (client-redirect pages were indexable).

**Favicon / icons (authentic logo):**
- Deleted generic `src/app/icon.png` (104 bytes) and `src/app/favicon.ico` (515 bytes).
- Added `src/app/icon.tsx` (512×512 `ImageResponse`, Sanity logo, "HQ" fallback) and `src/app/apple-icon.tsx` (180×180).
- Head emits `<link rel="icon" href="/icon" ... 512x512>` and `<link rel="apple-touch-icon" href="/apple-icon" ... 180x180>`.

**Share previews (WhatsApp/OG):**
- Enriched metadata in `src/app/layout.tsx`, `src/app/novel/[slug]/page.tsx`, `src/app/novel/[slug]/[episodeslug]/page.tsx`, `src/app/pdf/[slug]/page.tsx`: og:image 1200×630, `siteName`, `twitter:card=summary_large_image`, `/icon` fallback.

**Download link simplification (part of download refactor):**
- `src/app/components/novelPage/DownloadPDFButton.tsx` & `DownloadSection.tsx` — href simplified from `/download/${slug}?type=...&pdf=...` to `/download/${slug}`.

### 5.2 Earlier session work (pre-commit `6a94ff7`)

- **Bookmarks feature fully removed:** deleted `src/app/bookmarks/`, `src/app/components/BookmarkButton.tsx`; removed nav/footer refs, `bookmarks` field from `user.ts`, `bookmarks:[]` from `api/checkout/route.ts`; cleaned stale imports in novel/episode/PDF clients.
- **Generic homepage data removed:** fake quote, hardcoded FAQ, generic About/hero chips. `PageHero` `DEFAULT_CHIPS`/`chips`/`CheckIcon` removed. Footer `/#about-author` → `/about`. Created `src/app/not-found.tsx`. Breadcrumbs JSON-LD uses absolute URLs.
- **Premium public UI removed** (`ThemeToggle.tsx`, `PremiumThemeProvider.tsx`); Short Stories removed from public nav (internal `/short-stories` kept, relabeled "Stories").
- **Download page trimmed/restructured** (`src/app/download/[slug]/page.tsx`): novel card at top, 4 steps, 4 FAQs, uses `suggestions.spotlight`/`suggestions.novels[0]`.

---

## 6. Page Structure / AdSense Audit (2026-10-21)

All routes return 200, **exactly one `<h1>`**, canonical URL, robots tags:

| Page | Words | Indexable |
|---|---|---|
| `/` | 1694 | yes |
| `/about` | 483 | yes |
| `/contact` | 273 | yes |
| `/novel` | 1932 | yes |
| `/novel/[slug]` | 1626 | yes (thin → noindex guard) |
| `/novel/[slug]/[episode]` | 1327 | yes |
| `/pdf/[slug]` | 843 | yes |
| `/download/[slug]` | 1150 | **yes** (changed this session) |
| `/privacypolicy` | 1450 | yes |
| `/terms` | 1189 | yes |

**`noindex` pages (intentional):** `/download/*` intentionally no longer; `/novel/[slug]` only when thin; `/studio`, `/u/*`, 404.

**AdSense layer present:** ads.txt ✓, script via env ✓, Consent Mode v2 + cookie banner ✓, thin-content guards ✓, Privacy/Terms cover cookies/AdSense.

**Not yet done:** No in-content `<ins class="adsbygoogle">` ad slots exist — only the loader script. When AdSense is approved, reusable ad-slot components must be added.

**Side note:** GitHub reports 165 dependabot vulnerabilities (6 critical, 74 high) on `main` — not yet addressed.

---

## 7. Known State / Pending

- **Uncommitted (unstaged) deletions:** `docs/Huma-Qureshi-Novels-main-Record.zip`, `docs/agentack-new-main-SEO.zip`, `docs/text` — left unstaged deliberately; decide whether to commit.
- **Stale temp scripts in repo root:** `tmp-del-tehra*.js`, `tmp-verify.js`, `cleanup-routes.js`, `error.md`, `IMPLEMENTATION_SUMMARY.md` etc. — candidates for cleanup (verify before deleting).
- **Sanity Studio:** must be restarted (`/studio`) to see new `bannerImage` fields.
- **Cookie Preferences:** user confirmed KEEP (footer link + consent banner stay).

---

## 8. How to Resume

1. Read this file + `CLAUDE.md` + the Constitution doc.
2. `git log --oneline -8` to see latest state.
3. `git status` — check for uncommitted work.
4. Run dev server: `next dev` → `http://localhost:3000`.
5. Before committing: `node .\node_modules\typescript\bin\tsc --noEmit` then `node .\node_modules\next\dist\bin\next build` (large timeout).
6. Follow the PHR rule in `CLAUDE.md` — write a Prompt History Record under `history/prompts/` after each request.

### Suggested next steps
- Decide on `docs/*` deletions.
- Add reusable AdSense `<ins>` slot components (home, novel, episode, PDF).
- Review dependabot vulnerabilities (`npm audit`).
- Optionally clean temp scripts in repo root.
- Verify live rendering of 5:6 cards + download page cover in the dev server.

---

## 9. Key Files Reference

- **Cards:** `src/app/components/Cards/Novel.tsx`, `PDF.tsx`, `Episode.tsx`
- **Heroes:** `src/app/components/AuthorHero.tsx` (active), `HeroSlider.tsx` (dead), `PageHero.tsx`
- **Homepage:** `src/app/page.tsx`
- **Download:** `src/app/download/[slug]/page.tsx`
- **Detail pages:** `src/app/novel/[slug]/page.tsx`, `src/app/novel/[slug]/[episodeslug]/page.tsx`, `src/app/pdf/[slug]/page.tsx`
- **Metadata/OG:** `src/app/layout.tsx` + each route's `generateMetadata`
- **Icons:** `src/app/icon.tsx`, `src/app/apple-icon.tsx`
- **SEO:** `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`
- **Sanity schemas:** `src/sanity/schemaTypes/` (`novelparent.ts`, `pdf.ts`, `upcomingProject.ts`, `index.ts`)
- **Sanity queries:** `src/lib/sanity/queries.ts`, `src/lib/sinity/queries.ts`

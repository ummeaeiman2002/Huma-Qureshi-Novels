import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Novel from "./components/Cards/Novel";
import PDF from "./components/Cards/PDF";
import AuthorHero from "./components/AuthorHero";
import Button from "./components/ui/Button";
import Container from "./components/ui/Container";
import SectionHeading from "./components/ui/SectionHeading";
import { client } from "@/sanity/lib/client";
import { getSiteSummary } from "@/lib/sanity/siteSettings";
import { cleanDescriptionLong, formatSafeDate, SITE_URL } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Read Urdu Novels Online Free",
  description:
    "Read original Urdu novels, episodic stories and complete PDF books by Huma Qureshi - free online, or download the PDF to read offline.",
  alternates: { canonical: SITE_URL },
};

async function getHomeContent() {
  const query = `{
    "featuredNovels": *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi" && featured == true] | order(novelreleasedate desc)[0...4] {
      _id, title, banner, slug, novelreleasedate, novelstatus, isShortStory, noveldescription,
      "episodeCount": count(*[_type == "novel" && references(^._id)]),
      "views": *[_type == "novel" && references(^._id)].views,
      genre->{genrename}, writer->{writername}
    },
    "popularNovels": *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi"] | order(novelreleasedate desc) {
      _id, title, banner, slug, novelreleasedate, novelstatus, isShortStory, noveldescription,
      "episodeCount": count(*[_type == "novel" && references(^._id)]),
      "views": *[_type == "novel" && references(^._id)].views,
      genre->{genrename}, writer->{writername}
    },
    "latestNovels": *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi"] | order(novelreleasedate desc)[0...8] {
      _id, title, banner, slug, novelreleasedate, novelstatus, isShortStory, noveldescription,
      "episodeCount": count(*[_type == "novel" && references(^._id)]),
      genre->{genrename}, writer->{writername}
    },
    "latestPdfs": *[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now() && writer->writername == "Huma Qureshi"] | order(pdfreleasedate desc)[0...4] {
      _id, title, banner, slug, pdfreleasedate, pdfdescription, downloadformat, downloadsize, pdfnumberofpages,
      genre->{genrename}, writer->{writername}
    },
    "latestEpisodes": *[_type == "novel" && defined(episodeslug.current) && defined(episodereleasedate) && episodereleasedate <= now() && novelparent->writer->writername == "Huma Qureshi"] | order(episodereleasedate desc) {
      _id, name, episodereleasedate, "episodeSlug": episodeslug.current, "novelSlug": novelparent->slug.current, "novelTitle": novelparent->title, "novelBanner": novelparent->banner, "novelGenre": novelparent->genre->genrename
    }
  }`;
  const data = await client.fetch<any>(query, {}, { next: { revalidate: 300 } });

  const sum = (v: any) =>
    Array.isArray(v) ? v.reduce((a: number, x: number) => a + (Number(x) || 0), 0) : Number(v) || 0;
  const enrich = (list: any[]) =>
    (list || []).map((n: any) => ({
      ...n,
      totalViews: sum(n.views),
      summary: cleanDescriptionLong(n.noveldescription || n.pdfdescription, ""),
    }));

  // Latest Episodes: one entry per novel (newest episode), so the list spans
  // several stories instead of showing eight chapters of the same novel.
  const seenNovels = new Set<string>();
  const distinctEpisodes = (data.latestEpisodes || []).filter((ep: any) => {
    const key = ep.novelSlug || ep.novelTitle;
    if (!key || seenNovels.has(key)) return false;
    seenNovels.add(key);
    return true;
  });

  return {
    featuredFromFlag: enrich(data.featuredNovels),
    popularNovels: enrich(data.popularNovels),
    latestNovels: enrich(data.latestNovels),
    latestPdfs: enrich(data.latestPdfs),
    latestEpisodes: distinctEpisodes.slice(0, 5),
  };
}

function date(value: string) {
  return formatSafeDate(value);
}

export default async function HomePage() {
  const data = await getHomeContent();
  const summary = await getSiteSummary();

  const latestNovels = (data.latestNovels || []).map((x: any) => ({ ...x, type: "novel" }));
  const latestPdfs = (data.latestPdfs || []).map((x: any) => ({ ...x, type: "pdf" }));

  // Featured: prefer curated "featured" flag; otherwise fall back to the most
  // viewed published novels. Never label every book as featured.
  const featuredRanked =
    data.featuredFromFlag.length > 0
      ? data.featuredFromFlag
      : [...data.popularNovels]
          .sort((a: any, b: any) => (b.totalViews || 0) - (a.totalViews || 0))
          .slice(0, 9);

  // Hero slider: showcase up to 4 real published books (title + cover + synopsis).
  // These ids are then excluded from the sections below so no cover repeats
  // (constitution §12.7 / §3). No fabricated featured/popularity claims are made.
  const heroSlides = featuredRanked.slice(0, 4).map((n: any) => ({
    id: n._id,
    title: n.title || "",
    slug: n.slug?.current || "",
    banner: n.banner || "",
    genre: n.genre?.genrename || "",
    summary: n.summary || "",
  }));
  const heroIds = new Set(heroSlides.map((s: any) => s.id));

  const featuredNovels = featuredRanked
    .filter((x: any) => !heroIds.has(x._id))
    .slice(0, 4);
  const featuredIds = new Set(
    heroSlides.map((s: any) => s.id).concat(featuredNovels.map((x: any) => x._id))
  );

  // Latest uploads: genuinely recent published items, excluding those already
  // shown as featured (only overlap if there is not enough distinct content).
  const latestAll = [...latestNovels, ...latestPdfs].sort(
    (a: any, b: any) =>
      new Date(b.novelreleasedate || b.pdfreleasedate || 0).getTime() -
      new Date(a.novelreleasedate || a.pdfreleasedate || 0).getTime()
  );
  const distinctLatest = latestAll.filter((item: any) => !featuredIds.has(item._id));
  const latest = (distinctLatest.length >= 4 ? distinctLatest : latestAll).slice(0, 6);

  const stats = await client.fetch<{ novels: number; pdfs: number; genres: number }>(
    `{
      "novels": count(*[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi"]),
      "pdfs": count(*[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now() && writer->writername == "Huma Qureshi"]),
      "genres": count(*[_type == "genre"])
    }`
  );

  return (
    <main className="flex flex-col">
      {/* HERO — premium author slider (Zeela-style composition, own branding) */}
      <AuthorHero slides={heroSlides} stats={stats} />

      {/* WEBSITE SUMMARY — author/website intro with portrait imagery */}
      {(summary.title || summary.text || summary.images.length > 0) && (
        <section id="summary" className="border-y border-line bg-cream py-14">
          <Container size="wide">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
              <div className="flex flex-col gap-5">
                {summary.eyebrow && (
                  <span className="ui-eyebrow">{summary.eyebrow}</span>
                )}
                {summary.title && (
                  <h2 className="heading-stylish text-balance text-3xl font-extrabold leading-tight text-brand sm:text-4xl">
                    {summary.title}
                  </h2>
                )}
                {summary.text && (
                  <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-muted">
                    {summary.text
                      .split(/\n{2,}|\r?\n/)
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                  </div>
                )}
                {summary.titleUrdu && (
                  <h3
                    className="font-urdu text-2xl leading-[2] text-brand"
                    dir="rtl"
                    lang="ur"
                  >
                    {summary.titleUrdu}
                  </h3>
                )}
                {summary.textUrdu && (
                  <p
                    className="font-urdu text-lg leading-[2.2] text-muted"
                    dir="rtl"
                    lang="ur"
                  >
                    {summary.textUrdu}
                  </p>
                )}
                <div className="pt-1">
                  <Button href="/novel" variant="primary">
                    Explore My Novels &rarr;
                  </Button>
                </div>
              </div>

              {summary.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-5">
                  {summary.images.map((img, i) => (
                    <figure
                      key={i}
                      className={`group relative aspect-[5/6] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_18px_40px_-24px_rgba(41,40,36,0.55)] ${
                        i === 0 && summary.images.length === 3
                          ? "col-span-2 row-span-2 sm:col-span-2"
                          : ""
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || summary.title || "Huma Qureshi Urdu fiction"}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/0 transition-all duration-500 group-hover:ring-gold/40"
                      />
                    </figure>
                  ))}
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* FEATURED NOVELS */}
      {featuredNovels.length > 0 && (
        <section id="featured" className="py-12">
          <Container size="wide">
            <SectionHeading eyebrow="Featured" title="Featured Novels" />
            <div className="mt-8 flex flex-wrap gap-5 justify-center lg:justify-start">
              {featuredNovels.map((item: any) => (
                <Novel
                  key={item._id}
                  date={date(item.novelreleasedate)}
                  href={item.slug?.current || ""}
                  cardBanner={item.banner || ""}
                  novelName={item.title}
                  writer={item.writer?.writername || ""}
                  genre={item.genre?.genrename || ""}
                  summary={item.summary}
                  status={item.novelstatus || ""}
                  episodes={item.episodeCount}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-center lg:justify-start">
              <Button href="/novel" variant="primary">View All Novels &rarr;</Button>
            </div>
          </Container>
        </section>
      )}

      {/* LATEST UPLOADS */}
      {latest.length > 0 && (
        <section id="latest" className="py-12">
          <Container size="wide">
            <SectionHeading eyebrow="Just Added" title="Latest Uploads" />
            <div className="mt-8 flex flex-wrap gap-5 justify-center lg:justify-start">
              {latest.map((item: any) =>
                item.type === "pdf" ? (
                  <PDF
                    key={item._id}
                    date={date(item.pdfreleasedate)}
                    href={item.slug?.current || ""}
                    cardBanner={item.banner || ""}
                    novelName={item.title}
                    writer={item.writer?.writername || ""}
                    genre={item.genre?.genrename || ""}
                    summary={item.summary}
                    format={item.downloadformat || ""}
                    size={item.downloadsize || ""}
                    pages={item.pdfnumberofpages}
                  />
                ) : (
                  <Novel
                    key={item._id}
                    date={date(item.novelreleasedate)}
                    href={item.slug?.current || ""}
                    cardBanner={item.banner || ""}
                    novelName={item.title}
                    writer={item.writer?.writername || ""}
                    genre={item.genre?.genrename || ""}
                    summary={item.summary}
                    status={item.novelstatus || ""}
                    episodes={item.episodeCount}
                  />
                )
              )}
            </div>
          </Container>
        </section>
      )}

      {/* LATEST EPISODES */}
      {data.latestEpisodes.length > 0 && (
        <section id="episodes" className="py-12">
          <Container size="wide">
            <SectionHeading eyebrow="Just Added" title="Latest Episodes" />
            <div className="mt-8 flex flex-wrap gap-5 justify-center lg:justify-start">
              {data.latestEpisodes.map((ep: any) => (
                <article
                  key={ep._id}
                  className="group relative flex w-full max-w-[260px] flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_2px_12px_rgba(41,40,36,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[0_22px_44px_-22px_rgba(164,135,80,0.6)] active:scale-[0.99]"
                >
                  <Link
                    href={`/novel/${ep.novelSlug}/${ep.episodeSlug}`}
                    aria-label={`Read ${ep.name || ep.novelTitle} episode`}
                    className="absolute inset-0 z-10 rounded-3xl"
                  />

                  {ep.novelBanner ? (
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src={ep.novelBanner}
                        alt={`${ep.novelTitle} cover`}
                        fill
                        sizes="(max-width: 640px) 90vw, 240px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-brand-deep/85 via-brand-deep/5 to-transparent"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
                      />
                      <span className="absolute left-3 top-3 rounded-full border border-gold/30 bg-brand-deep/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-gold backdrop-blur-sm">
                        Episode
                      </span>
                      {ep.episodereleasedate && (
                        <span className="absolute right-3 top-3 rounded-full border border-gold/30 bg-brand-deep/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-gold backdrop-blur-sm">
                          {date(ep.episodereleasedate)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      aria-hidden="true"
                      className="hero-pattern relative flex aspect-video w-full items-center justify-center overflow-hidden bg-brand-deep"
                    >
                      <span className="font-display text-3xl font-extrabold text-gold/70">
                        {(ep.name || ep.novelTitle).trim().charAt(0).toUpperCase() || "E"}
                      </span>
                      <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3.5">
                    {!ep.novelBanner && ep.episodereleasedate && (
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                        {date(ep.episodereleasedate)}
                      </span>
                    )}

                    <h3 className="line-clamp-2 font-display text-lg font-extrabold leading-snug text-balance text-brand transition-colors duration-300 group-hover:text-gold-dark">
                      {ep.name || ep.novelTitle}
                    </h3>

                    {ep.novelTitle && (
                      <p className="line-clamp-1 text-xs font-semibold text-muted">
                        From {ep.novelTitle}
                      </p>
                    )}

                    <dl className="mt-auto flex flex-col gap-1.5 border-t border-line pt-2.5">
                      <div className="flex items-baseline gap-2">
                        <dt className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-dark">
                          Novel
                        </dt>
                        <span aria-hidden="true" className="h-px min-w-3 flex-1 bg-line" />
                        <dd className="max-w-[62%] truncate text-right text-xs font-semibold text-brand">
                          {ep.novelTitle}
                        </dd>
                      </div>
                      {ep.novelGenre && (
                        <div className="flex items-baseline gap-2">
                          <dt className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-dark">
                            Genre
                          </dt>
                          <span aria-hidden="true" className="h-px min-w-3 flex-1 bg-line" />
                          <dd className="max-w-[62%] truncate text-right text-xs font-semibold text-brand">
                            {ep.novelGenre}
                          </dd>
                        </div>
                      )}
                    </dl>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <span className="rounded-full bg-brand px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 group-hover:bg-brand-dark">
                        Read Episode
                      </span>
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-brand-deep"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* EXPLORE BY GENRE */}
      {stats?.genres ? (
        <GenreSection />
      ) : null}
    </main>
  );
}

async function GenreSection() {
  const genreCards = await client.fetch<any[]>(
    `*[_type == "genre"] | order(genrename asc) { genrename, genreslug, genrecardimageurl, "count": count(*[_type in ["novelparent","pdf"] && references(^._id)]) }`
  );
  if (!genreCards || genreCards.length === 0) return null;

  return (
    <section id="genres" className="py-12">
      <Container size="wide">
        <SectionHeading eyebrow="Explore" title="Explore by Genre" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {genreCards.map((g: any, i: number) => (
            <Link
              key={i}
              href={`/novel?genre=${encodeURIComponent(g.genrename || "")}`}
              className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
            >
              {g.genrecardimageurl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={g.genrecardimageurl}
                  alt={`${g.genrename} Urdu novels`}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-2xl font-extrabold text-brand">
                  {g.genrename?.charAt(0) || "?"}
                </span>
              )}
              <span className="flex min-w-0 flex-col">
                <span className="font-extrabold text-brand group-hover:underline">
                  {g.genrename}
                </span>
                {typeof g.count === "number" && g.count > 0 && (
                  <span className="text-xs font-medium text-muted">
                    {g.count} {g.count === 1 ? "title" : "titles"}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

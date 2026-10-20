import type { Metadata } from "next";
import Link from "next/link";
import Novel from "./components/Cards/Novel";
import PDF from "./components/Cards/PDF";
import AuthorHero from "./components/AuthorHero";
import Button from "./components/ui/Button";
import Container from "./components/ui/Container";
import SectionHeading from "./components/ui/SectionHeading";
import { client } from "@/sanity/lib/client";
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
      _id, name, episodereleasedate, "episodeSlug": episodeslug.current, "novelSlug": novelparent->slug.current, "novelTitle": novelparent->title
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
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.latestEpisodes.map((ep: any) => (
                <li key={ep._id}>
                  <Link
                    href={`/novel/${ep.novelSlug}/${ep.episodeSlug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 transition-all duration-300 hover:border-brand hover:shadow-md"
                  >
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-gold-dark">
                        {date(ep.episodereleasedate)}
                      </span>
                      <span className="line-clamp-2 font-extrabold leading-snug text-brand">
                        {ep.name || ep.novelTitle}
                      </span>
                      {ep.novelTitle && (
                        <span className="truncate text-xs font-medium text-muted">
                          From {ep.novelTitle}
                        </span>
                      )}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
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

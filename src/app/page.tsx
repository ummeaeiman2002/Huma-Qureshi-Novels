import type { Metadata } from "next";
import Link from "next/link";
import Novel from "./components/Cards/Novel";
import PDF from "./components/Cards/PDF";
import HomeFilter from "./components/HomeFilter";
import Container from "./components/ui/Container";
import SectionHeading from "./components/ui/SectionHeading";
import Button from "./components/ui/Button";
import { client } from "@/sanity/lib/client";
import { cleanDescriptionLong, formatSafeDate, SITE_URL } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Read Urdu Novels Online Free",
  description:
    "Read original Urdu novels, episodic stories and complete PDF books by Huma Qureshi - free online, or download the PDF to read offline.",
  alternates: { canonical: SITE_URL },
};

type SearchParams = { genre?: string; type?: string };

async function getHomeContent() {
  const query = `{
    "latestNovels": *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi"] | order(novelreleasedate desc)[0...8] { _id, title, banner, slug, novelreleasedate, noveldescription, youtubeurl, genre->{genrename}, writer->{writername}, "views": *[_type == "novel" && references(^._id)].views, "monthlyViews": *[_type == "novel" && references(^._id)].monthlyViews },
    "latestPdfs": *[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now() && writer->writername == "Huma Qureshi"] | order(pdfreleasedate desc)[0...4] { _id, title, banner, slug, pdfreleasedate, pdfdescription, youtubeurl, views, monthlyViews, genre->{genrename}, writer->{writername} },
    "popularNovels": *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi"] { _id, title, banner, slug, novelreleasedate, noveldescription, youtubeurl, genre->{genrename}, writer->{writername}, "views": *[_type == "novel" && references(^._id)].views, "monthlyViews": *[_type == "novel" && references(^._id)].monthlyViews },    "latestEpisodes": *[_type == "novel" && defined(episodeslug.current) && defined(episodereleasedate) && episodereleasedate <= now() && novelparent->writer->writername == "Huma Qureshi"] | order(episodereleasedate desc)[0...6] { _id, name, episodereleasedate, "episodeSlug": episodeslug.current, "novelSlug": novelparent->slug.current, "novelTitle": novelparent->title }
  }`;
  const data = await client.fetch<any>(query, {}, { next: { revalidate: 300 } });
  const sum = (v: any) =>
    Array.isArray(v) ? v.reduce((a: number, x: number) => a + (Number(x) || 0), 0) : Number(v) || 0;
  const enrich = (list: any[]) =>
    (list || []).map((n: any) => ({
      ...n,
      totalViews: sum(n.views),
      totalMonthlyViews: sum(n.monthlyViews),
    }));
  return {
    latestNovels: enrich(data.latestNovels),
    latestPdfs: enrich(data.latestPdfs),
    popularNovels: enrich(data.popularNovels),
    latestEpisodes: data.latestEpisodes || [],
  };
}

function date(value: string) {
  return formatSafeDate(value);
}

function applyFilters(items: any[], genres: string[], type: string) {
  const result = items.filter((item) => {
    const matchesGenre =
      genres.length === 0 || genres.some((g) => g === item.genre?.genrename);

    let matchesType = true;
    if (type === "Episodic") matchesType = item.type === "novel";
    else if (type === "PDF") matchesType = item.type === "pdf";
    else if (type === "Audio Books")
      matchesType = !!(item.youtubeurl && item.youtubeurl.trim() !== "");

    return matchesGenre && matchesType;
  });

  return result;
}

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const data = await getHomeContent();
  const params = await searchParams;
  const genres =
    typeof params?.genre === "string" && params.genre ? params.genre.split(",").filter(Boolean) : [];
  const type = params?.type || "";

  const popularNovels = (data.popularNovels || []).map((x: any) => ({ ...x, type: "novel" }));
  const latestNovels = (data.latestNovels || []).map((x: any) => ({ ...x, type: "novel" }));
  const latestPdfs = (data.latestPdfs || []).map((x: any) => ({ ...x, type: "pdf" }));

  const featuredNovels = popularNovels
    .sort((a: any, b: any) => (b.totalViews || 0) - (a.totalViews || 0))
    .slice(0, 6);
  const featuredIds = new Set(featuredNovels.map((x: any) => x._id));

  const latest = [
    ...applyFilters(latestNovels, genres, type),
    ...applyFilters(latestPdfs, genres, type),
  ]
    .filter((item: any) => !featuredIds.has(item._id))
    .slice(0, 8);

  const hasFilters = genres.length > 0 || type !== "";
  const allGenres = await client.fetch<string[]>(`*[_type == "genre"] { genrename }.genrename`);
  const genreCards = await client.fetch<any[]>(
    `*[_type == "genre"] | order(genrename asc) { genrename, genreslug, genrecardimageurl, "count": count(*[_type in ["novelparent","pdf"] && references(^._id)]) }`
  );
  const stats = await client.fetch<{ novels: number; pdfs: number; genres: number }>(
    `{
      "novels": count(*[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi"]),
      "pdfs": count(*[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now() && writer->writername == "Huma Qureshi"]),
      "genres": count(*[_type == "genre"])
    }`
  );

  const episodeDate = (v: string) => formatSafeDate(v);

  return (
    <main className="flex flex-col">
      {/* ABOUT THE LIBRARY — original site copy */}
      <section aria-labelledby="welcome-heading" className="pt-6 lg:pt-8 pb-6">
        <Container size="wide">
          <div className="grid gap-7 rounded-3xl border border-line bg-surface p-6 shadow-sm lg:grid-cols-[1.7fr_1fr] lg:items-center lg:p-9">
            <div className="flex flex-col gap-4">
              <span className="ui-eyebrow">About the Library</span>
              <h1
                id="welcome-heading"
                className="font-display text-2xl font-extrabold leading-tight text-brand sm:text-3xl"
              >
                Read Urdu Novels Online, Free — Chapter by Chapter
              </h1>
              <p className="text-sm leading-7 text-ink/80 sm:text-[15px] sm:leading-8">
                Huma Qureshi Novels is a free online library of original Urdu novels, episodic
                stories and short afsanas written by Huma Qureshi. Every chapter is published here
                as soon as it is released — no sign-up, no subscription and no payment required.
              </p>
              <p className="text-sm leading-7 text-ink/80 sm:text-[15px] sm:leading-8">
                Prefer reading offline? Complete novels are also available as downloadable PDF
                books. Browse the library by genre, follow the latest episodes, or start with the
                featured reads below.
              </p>
            </div>

            <dl className="grid grid-cols-3 gap-3">
              {[
                { label: "Novels", value: stats?.novels ?? 0 },
                { label: "PDF Books", value: stats?.pdfs ?? 0 },
                { label: "Genres", value: stats?.genres ?? 0 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-1 rounded-2xl border border-gold/25 bg-brand-deep px-3 py-5 text-center"
                >
                  <dd className="font-display text-2xl font-extrabold tabular-nums text-gold sm:text-3xl">
                    {item.value.toLocaleString("en-GB")}
                  </dd>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-cream/70">
                    {item.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* FEATURED NOVELS + LATEST EPISODES */}
      {(featuredNovels.length > 0 || data.latestEpisodes.length > 0) && (
        <section id="featured" className="py-14">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              <div className="lg:col-span-3">
                <SectionHeading
                  eyebrow="Featured"
                  title="Featured Novels"
                />
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 justify-items-center lg:justify-items-start">
                  {featuredNovels.map((item: any) => (
                    <Novel
                      key={item._id}
                      date={date(item.novelreleasedate)}
                      href={item.slug.current}
                      cardBanner={item.banner}
                      novelName={item.title}
                      writer={item.writer?.writername || ""}
                      genre={item.genre?.genrename || ""}
                      summary={cleanDescriptionLong(item.noveldescription, "")}
                    />
                  ))}
                </div>
                <div className="mt-8 flex justify-center lg:justify-start">
                  <Button href="/novel" variant="primary">View All Novels &rarr;</Button>
                </div>
              </div>

              {data.latestEpisodes.length > 0 && (
                <aside className="lg:col-span-1" aria-labelledby="episodes-heading">
                  <h2 id="episodes-heading" className="font-display text-2xl font-bold text-brand-deep">
                    Latest Episodes
                  </h2>
                  <ul className="mt-5 flex flex-col gap-3">
                    {data.latestEpisodes.map((ep: any) => (
                      <li key={ep._id}>
                        <Link
                          href={`/novel/${ep.novelSlug}/${ep.episodeSlug}`}
                          className="group flex items-center justify-between gap-3 rounded-2xl bg-surface border border-line p-4 hover:border-brand hover:shadow-md transition-all duration-300"
                        >
                          <span className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[11px] font-bold uppercase tracking-wide text-gold-dark">
                              {episodeDate(ep.episodereleasedate)}
                            </span>
                            <span className="font-extrabold text-brand leading-snug line-clamp-2">
                              {ep.name || ep.novelTitle}
                            </span>
                            {ep.novelTitle && (
                              <span className="text-xs text-muted font-medium truncate">
                                From {ep.novelTitle}
                              </span>
                            )}
                          </span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* EXPLORE BY GENRE */}
      {genreCards.length > 0 && (
        <section id="genres" className="py-14">
          <Container size="wide">
            <SectionHeading
              eyebrow="Explore"
              title="Explore by Genre"
            />
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {genreCards.map((g: any, i: number) => (
                <Link
                  key={i}
                  href={`/novel?genre=${encodeURIComponent(g.genrename || "")}`}
                  className="group flex items-center gap-3 rounded-2xl bg-surface border border-line p-4 hover:border-brand hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  {g.genrecardimageurl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={g.genrecardimageurl}
                      alt={`${g.genrename} Urdu novels`}
                      className="w-14 h-14 object-cover rounded-xl shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <span className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gold/15 text-2xl font-extrabold text-brand">
                      {g.genrename?.charAt(0) || "?"}
                    </span>
                  )}
                  <span className="flex flex-col min-w-0">
                    <span className="font-extrabold text-brand group-hover:underline">{g.genrename}</span>
                    {typeof g.count === "number" && g.count > 0 && (
                      <span className="text-xs text-muted font-medium">
                        {g.count} {g.count === 1 ? "title" : "titles"}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* BROWSE + FILTER + LATEST */}
      <section id="browse" aria-labelledby="browse-heading" className="py-14">
        <Container>
          <SectionHeading
            eyebrow="Browse"
            title="Browse Novels & PDFs"
          />
          <div className="mt-6">
            <HomeFilter genres={allGenres || []} />
            {hasFilters && (
              <p className="mt-4 text-center text-sm font-bold text-brand">
                Showing {latest.length} results
                {type ? ` · ${type}` : ""}
                {genres.length > 0 ? ` in ${genres.join(", ")}` : ""}
              </p>
            )}
          </div>

          <h3 id="browse-heading" className="sr-only">Latest novels</h3>

          {latest.length > 0 && (
            <>
              <div className="mt-10">
                <SectionHeading title="Latest Uploads" />
              </div>
              <div className="mt-6 flex flex-wrap gap-5 justify-center lg:justify-start">
                {latest.map((item: any) =>
                  item.type === "novel" ? (
                    <Novel key={item._id} date={date(item.novelreleasedate)} href={item.slug.current} cardBanner={item.banner} novelName={item.title} writer={item.writer?.writername || ""} genre={item.genre?.genrename || ""} summary={cleanDescriptionLong(item.noveldescription, "")} />
                  ) : (
                    <PDF key={item._id} date={date(item.pdfreleasedate)} href={item.slug.current} cardBanner={item.banner} novelName={item.title} writer={item.writer?.writername || ""} genre={item.genre?.genrename || ""} summary={cleanDescriptionLong(item.pdfdescription, "")} />
                  )
                )}
              </div>
            </>
          )}

          {latest.length === 0 && (
            <p className="text-center py-6 font-bold text-brand">No content matches your filters.</p>
          )}
        </Container>
      </section>

    </main>
  );
}

import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import Novel from "./components/Cards/Novel";
import PDF from "./components/Cards/PDF";
import HomeFilter from "./components/HomeFilter";
import Container from "./components/ui/Container";
import SectionHeading from "./components/ui/SectionHeading";
import Button from "./components/ui/Button";
import ReviewMarquee from "./components/ReviewMarquee";
import { client } from "@/sanity/lib/client";
import { getSiteSettings } from "@/lib/sanity/siteSettings";
import { getTestimonials } from "@/lib/sanity/queries";
import { cleanDescriptionLong, formatSafeDate, SITE_URL, SITE_NAME } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Read Urdu Novels Online Free",
  description:
    "Read original Urdu novels, episodic stories and short stories by Huma Qureshi — free online or download the complete PDF books to read offline.",
  alternates: { canonical: SITE_URL },
};

type SearchParams = { writer?: string; genre?: string; sort?: string; yt?: string };

async function getHomeContent() {
  const query = `{
    "latestNovels": *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi"] | order(novelreleasedate desc)[0...8] { _id, title, banner, slug, novelreleasedate, noveldescription, youtubeurl, genre->{genrename}, writer->{writername}, "views": *[_type == "novel" && references(^._id)].views, "monthlyViews": *[_type == "novel" && references(^._id)].monthlyViews },
    "latestPdfs": *[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now() && writer->writername == "Huma Qureshi"] | order(pdfreleasedate desc)[0...4] { _id, title, banner, slug, pdfreleasedate, pdfdescription, youtubeurl, views, monthlyViews, genre->{genrename}, writer->{writername} },
    "popularNovels": *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi"] { _id, title, banner, slug, novelreleasedate, noveldescription, youtubeurl, genre->{genrename}, writer->{writername}, "views": *[_type == "novel" && references(^._id)].views, "monthlyViews": *[_type == "novel" && references(^._id)].monthlyViews },
    "popularPdfs": *[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now() && writer->writername == "Huma Qureshi"] | order(coalesce(views,0) desc)[0...4] { _id, title, banner, slug, pdfreleasedate, pdfdescription, youtubeurl, views, monthlyViews, genre->{genrename}, writer->{writername} },
    "latestEpisodes": *[_type == "novel" && defined(episodeslug.current) && defined(episodereleasedate) && episodereleasedate <= now() && novelparent->writer->writername == "Huma Qureshi"] | order(episodereleasedate desc)[0...6] { _id, name, episodereleasedate, "episodeSlug": episodeslug.current, "novelSlug": novelparent->slug.current, "novelTitle": novelparent->title },
    "shortStoryCount": count(*[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && coalesce(isShortStory, false) == true && writer->writername == "Huma Qureshi"]),
    "author": *[_type == "writer" && writername == "Huma Qureshi"][0]{ "slug": writerslug.current, writername }
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
    popularPdfs: enrich(data.popularPdfs),
    latestEpisodes: data.latestEpisodes || [],
    shortStoryCount: data.shortStoryCount || 0,
    authorSlug: data.author?.slug || "",
  };
}

function date(value: string) {
  return formatSafeDate(value);
}

function applyFilters(items: any[], writer: string, genres: string[], youtubeOnly: boolean, sort: string) {
  let result = items.filter((item) => {
    const matchesWriter = !writer || item.writer?.writername === writer;
    const matchesGenre = genres.length === 0 || genres.some((g) => g === item.genre?.genrename);
    const matchesYt = !youtubeOnly || (item.youtubeurl && item.youtubeurl.trim() !== "");
    return matchesWriter && matchesGenre && matchesYt;
  });

  if (sort === "Latest") {
    result = [...result].sort(
      (a, b) =>
        new Date(a.novelreleasedate || a.pdfreleasedate).getTime() -
        new Date(b.novelreleasedate || b.pdfreleasedate).getTime()
    );
  } else if (sort === "Popular") {
    result = [...result].sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0));
  } else if (sort === "Trending") {
    result = [...result].sort((a, b) => (b.totalMonthlyViews || 0) - (a.totalMonthlyViews || 0));
  }

  return result;
}

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const data = await getHomeContent();
  const siteImages = await getSiteSettings();
  const testimonials = await getTestimonials(12);
  const params = await searchParams;
  const writer = params?.writer || "";
  const genres =
    typeof params?.genre === "string" && params.genre ? params.genre.split(",").filter(Boolean) : [];
  const sort = params?.sort || "";
  const youtubeOnly = params?.yt === "1";

  const popularNovels = (data.popularNovels || []).map((x: any) => ({ ...x, type: "novel" }));
  const popularPdfs = (data.popularPdfs || []).map((x: any) => ({ ...x, type: "pdf" }));
  const latestNovels = (data.latestNovels || []).map((x: any) => ({ ...x, type: "novel" }));
  const latestPdfs = (data.latestPdfs || []).map((x: any) => ({ ...x, type: "pdf" }));

  const featuredNovels = popularNovels
    .slice()
    .sort((a: any, b: any) => (b.totalViews || 0) - (a.totalViews || 0))
    .slice(0, 8);

  const latest = [
    ...applyFilters(latestNovels, writer, genres, youtubeOnly, sort),
    ...applyFilters(latestPdfs, writer, genres, youtubeOnly, sort),
  ].slice(0, 8);

  const popular = [
    ...applyFilters(popularNovels, writer, genres, youtubeOnly, sort || "Popular").slice(0, 6),
    ...applyFilters(popularPdfs, writer, genres, youtubeOnly, sort || "Popular").slice(0, 2),
  ];

  const hasFilters = writer !== "" || genres.length > 0 || sort !== "" || youtubeOnly;
  const writers = await client.fetch<string[]>(
    `*[_type == "writer" && writername == "Huma Qureshi"] { writername }.writername`
  );
  const allGenres = await client.fetch<string[]>(`*[_type == "genre"] { genrename }.genrename`);
  const genreCards = await client.fetch<any[]>(
    `*[_type == "genre"] | order(genrename asc) { genrename, genreslug, genrecardimageurl, "count": count(*[_type in ["novelparent","pdf"] && references(^._id)]) }`
  );
  const categories = await client.fetch<any[]>(
    `*[_type == "category"] | order(categoryname asc) { categoryname, "slug": categoryslug.current, "count": count(*[_type in ["novelparent","pdf"] && references(^._id)]) }`
  );

  const stats = [
    { value: popularNovels.length, label: "Full Novels" },
    { value: data.shortStoryCount, label: "Short Stories / Afsanas" },
    { value: popularPdfs.length, label: "PDF Books" },
    { value: genreCards.length, label: "Genres" },
  ];

  const quote = {
    text: "Every story I write carries a piece of my heart.",
    author: "Huma Qureshi",
  };

  const homepageFaq = [
    {
      q: "Is it free to read Urdu novels on this website?",
      a: "Yes. All Urdu novels, short stories, episodic stories and PDF books by Huma Qureshi are completely free to read and download. You never need to pay or sign up to enjoy the stories.",
    },
    {
      q: "Do I need to create an account to read?",
      a: "No. There is no account or login required. Open any novel, short story or PDF and start reading immediately — completely free, with no registration needed.",
    },
    {
      q: "Can I download novels as PDF and read offline?",
      a: "Yes. Completed novels are available as a single PDF download. Once downloaded, you can read the file on any phone, tablet or computer, even without internet.",
    },
    {
      q: "How often are new Urdu novels added?",
      a: "New episodes and complete novels are added regularly. Long novels are published in episodes, and new chapters appear as the author releases them, so check back often for fresh content.",
    },
    {
      q: "What genres are available?",
      a: "You will find romance, women-centric fiction, family and social drama, mystery and suspense, and short stories (afsanas). You can filter the whole library by writer and genre using the browse tools on this page.",
    },
  ];

  const episodeDate = (v: string) => formatSafeDate(v);

  return (
    <main className="flex flex-col">
      {/* HERO */}
      <section className="pt-10 lg:pt-16 pb-10" aria-labelledby="welcome-heading">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
              <span className="ui-eyebrow">Welcome to Huma Qureshi Novels</span>
              <h1 id="welcome-heading" className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-brand-deep">
                Real Stories. Deep Emotions.
              </h1>
              <p className="max-w-xl text-base lg:text-lg leading-8 text-muted font-medium">
                Discover a world of Urdu novels, short stories and heart-touching fiction written by
                Huma Qureshi.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-1">
                <Button href="/novel" variant="primary" size="lg">
                  Browse Novels &rarr;
                </Button>
                <Button href="/pdf" variant="outline" size="lg">
                  PDF Library
                </Button>
              </div>
              <ul className="flex flex-wrap gap-2 justify-center lg:justify-start pt-2">
                {["100% Free to Read", "No Sign-up Needed", "Read Online & Offline"].map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-line bg-cream-soft px-3.5 py-1.5 text-xs font-semibold text-muted"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div aria-hidden="true" className="absolute -top-6 -right-4 w-40 h-40 rounded-full bg-gold/20 blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden border border-line shadow-xl bg-surface">
                <Image
                  src={siteImages.heroImage}
                  alt="Reading desk with Urdu novels, a notebook and warm light"
                  width={1200}
                  height={800}
                  priority
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
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
                  subtitle="Popular original Urdu novels by Huma Qureshi — open any title and start reading from the first episode."
                />
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 justify-items-center lg:justify-items-start">
                  {featuredNovels.slice(0, 6).map((item: any) => (
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
                  <p className="mt-1 text-sm text-muted font-medium">
                    Freshly released chapters from ongoing novels.
                  </p>
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

      {/* EXPLORE BY GENRE + QUOTE */}
      {genreCards.length > 0 && (
        <section id="genres" className="py-14">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
              <div className="lg:col-span-3">
                <SectionHeading
                  eyebrow="Explore"
                  title="Explore by Genre"
                  subtitle="Find the kind of Urdu story you love — romance, thriller, social drama, short stories and more."
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
              </div>

              <blockquote className="lg:col-span-1 rounded-3xl bg-brand-deep text-cream p-8 shadow-lg h-full flex flex-col justify-center gap-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gold/70" aria-hidden="true">
                  <path d="M9.5 6C6.46 6 4 8.46 4 11.5V18h6.5v-6.5H7.5c0-1.66 1.34-3 3-3V6H9.5Zm10 0c-3.04 0-5.5 2.46-5.5 5.5V18H20.5v-6.5h-3c0-1.66 1.34-3 3-3V6h-1Z" />
                </svg>
                <p className="font-display italic text-xl lg:text-2xl leading-relaxed text-cream/90">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <cite className="not-italic text-gold font-bold text-sm">&mdash; {quote.author}</cite>
              </blockquote>
            </div>
          </Container>
        </section>
      )}

      {/* ABOUT THE AUTHOR */}
      <section id="about-author" className="py-14">
        <Container size="wide">
          <SectionHeading
            eyebrow="About the Author"
            title="About the Author"
            subtitle="Meet Huma Qureshi, the storyteller behind every novel."
          />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="rounded-3xl overflow-hidden border border-line shadow-lg bg-surface">
              <Image
                src={siteImages.authorImage}
                alt="A warm writing desk with Urdu novels, a notebook and a fountain pen"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-brand">Huma Qureshi</h2>
              <p className="leading-8 text-ink/90 font-medium">
                Huma Qureshi is a Pakistani Urdu writer known for her heartfelt stories, strong
                characters and captivating plots. She writes primarily under her pen name, inspired
                by her mother&apos;s name, and brings emotions, relationships and real-life
                experiences to life through her novels and short stories.
              </p>
              <p className="leading-8 text-ink/90 font-medium">
                Over the years she has written full-length Urdu novels, short novels, afsanas and
                short fiction, centred on romance, women-centric narratives, social drama and
                realistic, thought-provoking themes.
              </p>
              <div className="pt-1 flex flex-wrap gap-3">
                <Button href="/about" variant="primary">Learn More &rarr;</Button>
                {data.authorSlug && (
                  <Button href={`/writer/${data.authorSlug}` as Route} variant="secondary">
                    View Author Profile
                  </Button>
                )}
              </div>
            </div>
            <div className="rounded-3xl bg-brand-deep text-cream p-6 lg:p-8 shadow-lg">
              <p className="ui-eyebrow text-gold">Library at a Glance</p>
              <ul className="mt-5 flex flex-col gap-5">
                {stats.map((s, i) => (
                  <li key={i} className="flex items-baseline gap-3">
                    <span className="text-3xl lg:text-4xl font-extrabold text-gold leading-none">
                      {Number(s.value || 0).toLocaleString()}
                    </span>
                    <span className="text-xs lg:text-sm font-bold uppercase tracking-wide text-cream/80">
                      {s.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* BROWSE + FILTER + LATEST */}
      <section id="browse" aria-labelledby="browse-heading" className="py-14">
        <Container>
          <SectionHeading
            eyebrow="Browse"
            title="Browse Novels & PDFs"
            subtitle="Filter the whole library by writer and genre, then press Apply filter."
          />
          <div className="mt-6 rounded-3xl bg-cream-soft border border-line p-6 lg:p-8 flex flex-col items-center gap-4">
            <HomeFilter writers={writers || []} genres={allGenres || []} />
            {hasFilters && (
              <p className="text-center text-sm font-bold text-brand">
                Showing {latest.length + popular.length} results
                {writer ? ` for writer "${writer}"` : ""}
                {genres.length > 0 ? ` in ${genres.join(", ")}` : ""}
              </p>
            )}
          </div>

          <h3 id="browse-heading" className="sr-only">Latest and popular novels</h3>

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

          {popular.length > 0 && (
            <>
              <div className="mt-12">
                <SectionHeading title="Popular Reads" />
              </div>
              <div className="mt-6 flex flex-wrap gap-5 justify-center lg:justify-start">
                {popular.map((item: any) =>
                  item.type === "novel" ? (
                    <Novel key={item._id} date={date(item.novelreleasedate)} href={item.slug.current} cardBanner={item.banner} novelName={item.title} writer={item.writer?.writername || ""} genre={item.genre?.genrename || ""} summary={cleanDescriptionLong(item.noveldescription, "")} />
                  ) : (
                    <PDF key={item._id} date={date(item.pdfreleasedate)} href={item.slug.current} cardBanner={item.banner} novelName={item.title} writer={item.writer?.writername || ""} genre={item.genre?.genrename || ""} summary={cleanDescriptionLong(item.pdfdescription, "")} />
                  )
                )}
              </div>
            </>
          )}

          {latest.length === 0 && popular.length === 0 && (
            <p className="text-center py-6 font-bold text-brand">No content matches your filters.</p>
          )}
        </Container>
      </section>

      {/* ABOUT THE LIBRARY / FAQ */}
      <section aria-labelledby="library-heading" className="py-14">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-surface border border-line p-6 lg:p-8 flex flex-col gap-4">
              <h2 id="library-heading" className="text-2xl lg:text-3xl font-extrabold text-brand">
                The Home of Urdu Novel Reading Online
              </h2>
              <div className="leading-8 text-ink/90 font-medium flex flex-col gap-4">
                <p>
                  <strong className="text-brand">{SITE_NAME}</strong> is a free online library for
                  readers of Urdu fiction. Read original Urdu novels, follow episodic stories chapter
                  by chapter, discover short stories (afsanas), and download complete books as PDFs
                  to read offline — all without any cost or sign-up.
                </p>
                <p>
                  Every novel is published in regular episodes, letting you follow the story as new
                  chapters arrive. Finished stories are also available as a single PDF download, so
                  you can carry the whole book on your phone, tablet or e-reader and continue reading
                  anywhere, even without an internet connection.
                </p>
                <p>
                  Use the browse filters above to explore novels, short stories and PDFs by writer
                  and genre, or jump straight to the{" "}
                  <Link href="/novel" className="font-bold text-brand underline underline-offset-4 hover:text-gold-dark">
                    novel library
                  </Link>{" "}
                  and the{" "}
                  <Link href="/pdf" className="font-bold text-brand underline underline-offset-4 hover:text-gold-dark">
                    PDF collection
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-surface border border-line p-6 lg:p-8 flex flex-col gap-5" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl lg:text-3xl font-extrabold text-brand">
                Frequently Asked Questions
              </h2>
              {homepageFaq.map((f, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <h3 className="text-base lg:text-lg font-extrabold text-brand">{f.q}</h3>
                  <p className="leading-7 text-ink/90 font-medium">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* READER REVIEWS */}
      <section id="reviews" className="py-14">
        <Container>
          <ReviewMarquee reviews={testimonials} />
        </Container>
      </section>

      {/* STAY CONNECTED (real links only) */}
      <section id="connect" aria-labelledby="connect-heading" className="py-14">
        <Container>
          <div className="rounded-3xl bg-brand-deep text-cream px-6 py-10 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2 text-center lg:text-left">
              <span className="ui-eyebrow text-gold">Stay Connected</span>
              <h2 id="connect-heading" className="font-display text-2xl lg:text-3xl font-bold">
                Get the Latest Updates
              </h2>
              <p className="text-cream/80 font-medium max-w-xl">
                Follow along for new novels, fresh episodes and announcements — or send a message
                directly.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button href="/contact" variant="secondary">Contact Us</Button>
              <Button
                href="https://youtube.com/@writerhumaqureshinovells?si=UzQ_r6YKbTz-dI2z"
                external
                variant="ghost"
                className="border-cream/50 text-cream hover:bg-cream hover:text-brand-deep"
              >
                YouTube
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* CATEGORIES */}
      {categories && categories.length > 0 && (
        <section id="categories" aria-label="Categories" className="py-14">
          <Container>
            <SectionHeading title="Categories" />
            <nav aria-label="Novel categories" className="mt-6 flex flex-wrap gap-3 lg:gap-4">
              {categories
                .filter((c: any) => c.categoryname && c.slug)
                .map((c: any, i: number) => (
                  <Link
                    key={i}
                    href={`/novel?category=${encodeURIComponent(c.slug)}`}
                    className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-brand transition-colors hover:border-brand hover:bg-brand hover:text-white"
                  >
                    {c.categoryname}
                  </Link>
                ))}
            </nav>
          </Container>
        </section>
      )}
    </main>
  );
}

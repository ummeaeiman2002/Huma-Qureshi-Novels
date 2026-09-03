import Novel from "./components/Cards/Novel";
import PDF from "./components/Cards/PDF";
import Heading from "./components/Heading";
import HomeFilter from "./components/HomeFilter";
import ReaderPoll from "./components/homePageComponents/ReaderPoll";
import ReadingStreak from "./components/ReadingStreak";
import Achievements from "./components/Achievements";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { cleanDescriptionLong, formatSafeDate } from "@/lib/seo";

export const revalidate = 300;

type SearchParams = { writer?: string; genre?: string; sort?: string; yt?: string };

async function getHomeContent() {
  const query = `{
    "latestNovels": *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now()] | order(novelreleasedate desc)[0...8] { _id, title, banner, slug, novelreleasedate, noveldescription, youtubeurl, genre->{genrename}, writer->{writername}, "views": *[_type == "novel" && references(^._id)].views, "monthlyViews": *[_type == "novel" && references(^._id)].monthlyViews },
    "latestPdfs": *[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now()] | order(pdfreleasedate desc)[0...4] { _id, title, banner, slug, pdfreleasedate, pdfdescription, youtubeurl, views, monthlyViews, genre->{genrename}, writer->{writername} },
    "popularNovels": *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now()] { _id, title, banner, slug, novelreleasedate, noveldescription, youtubeurl, genre->{genrename}, writer->{writername}, "views": *[_type == "novel" && references(^._id)].views, "monthlyViews": *[_type == "novel" && references(^._id)].monthlyViews },
    "popularPdfs": *[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now()] | order(coalesce(views,0) desc)[0...4] { _id, title, banner, slug, pdfreleasedate, pdfdescription, youtubeurl, views, monthlyViews, genre->{genrename}, writer->{writername} }
  }`;
  const data = await client.fetch<any>(query, {}, { next: { revalidate: 300 } });
  const sum = (v: any) =>
    Array.isArray(v)
      ? v.reduce((a: number, x: number) => a + (Number(x) || 0), 0)
      : Number(v) || 0;
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
  };
}

function date(value: string) {
  return formatSafeDate(value);
}

function applyFilters(
  items: any[],
  writer: string,
  genres: string[],
  youtubeOnly: boolean,
  sort: string
) {
  let result = items.filter((item) => {
    const matchesWriter = !writer || item.writer?.writername === writer;
    const matchesGenre =
      genres.length === 0 || genres.some((g) => g === item.genre?.genrename);
    const matchesYt =
      !youtubeOnly || (item.youtubeurl && item.youtubeurl.trim() !== "");
    return matchesWriter && matchesGenre && matchesYt;
  });

  if (sort === "Latest") {
    result = [...result].sort(
      (a, b) =>
        new Date(a.novelreleasedate || a.pdfreleasedate).getTime() -
        new Date(b.novelreleasedate || b.pdfreleasedate).getTime()
    );
  } else if (sort === "Popular") {
    result = [...result].sort(
      (a, b) => (b.totalViews || 0) - (a.totalViews || 0)
    );
  } else if (sort === "Trending") {
    result = [...result].sort(
      (a, b) => (b.totalMonthlyViews || 0) - (a.totalMonthlyViews || 0)
    );
  }

  return result;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const data = await getHomeContent();
  const params = await searchParams;
  const writer = params?.writer || "";
  const genres =
    typeof params?.genre === "string" && params.genre
      ? params.genre.split(",").filter(Boolean)
      : [];
  const sort = params?.sort || "";
  const youtubeOnly = params?.yt === "1";

  const latestNovels = (data.latestNovels || []).map((x: any) => ({
    ...x,
    type: "novel",
  }));
  const latestPdfs = (data.latestPdfs || []).map((x: any) => ({
    ...x,
    type: "pdf",
  }));
  const popularNovels = (data.popularNovels || []).map((x: any) => ({
    ...x,
    type: "novel",
  }));
  const popularPdfs = (data.popularPdfs || []).map((x: any) => ({
    ...x,
    type: "pdf",
  }));

  const trendingNovels = applyFilters(
    popularNovels,
    writer,
    genres,
    youtubeOnly,
    "Trending"
  )
    .filter((n: any) => (n.totalViews || 0) > 1000)
    .slice(0, 10);

  const latest = [
    ...applyFilters(latestNovels, writer, genres, youtubeOnly, sort),
    ...applyFilters(latestPdfs, writer, genres, youtubeOnly, sort),
  ];
  const popular = [
    ...applyFilters(
      popularNovels,
      writer,
      genres,
      youtubeOnly,
      sort || "Popular"
    ).slice(0, 8),
    ...applyFilters(
      popularPdfs,
      writer,
      genres,
      youtubeOnly,
      sort || "Popular"
    ).slice(0, 4),
  ];
  const hasTrending = trendingNovels.length > 0;

  const hasFilters =
    writer !== "" || genres.length > 0 || sort !== "" || youtubeOnly;
  const writers = await client.fetch<string[]>(
    `*[_type == "writer"] { writername }.writername`
  );
  const allGenres = await client.fetch<string[]>(
    `*[_type == "genre"] { genrename }.genrename`
  );
  const genreCards = await client.fetch<any[]>(
    `*[_type == "genre"] { genrename, genreslug, genrecardimageurl }`
  );
  const testimonials = await client.fetch<any[]>(
    `*[_type == "testimonial"] | order(coalesce(timestamp, _createdAt) desc)[0...6] { name, quote, timestamp }`
  );
  const announcements = await client.fetch<any[]>(
    `*[_type == "announcement"] | order(coalesce(announcementdate, _createdAt) desc)[0...5] { title, body, announcementdate }`
  );

  // Stats for the professional stats bar
  const totalReads =
    popularNovels.reduce((a: number, n: any) => a + (n.totalViews || 0), 0) +
    popularPdfs.reduce((a: number, p: any) => a + (p.views || 0), 0);
  const stats = [
    { value: popularNovels.length + popularPdfs.length, label: "Novels & PDFs" },
    { value: writers.length, label: "Writers" },
    { value: genreCards.length, label: "Genres" },
    { value: totalReads, label: "Total Reads" },
  ];
  const youtubeNovels = applyFilters(
    popularNovels,
    "",
    [],
    true,
    "Popular"
  ).slice(0, 6);

  return (
    <main className="text-tertiary flex flex-col gap-6 lg:py-8">
      {/* HERO — Bold dark emerald banner */}
      <section aria-labelledby="welcome-heading" className="relative mx-4 lg:mx-0 rounded-3xl overflow-hidden bg-[#1E5D50] shadow-2xl">
        <div aria-hidden="true" className="absolute inset-0 -z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-[#2F7565]/40 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-[#C9A96E]/15 blur-3xl"></div>
        </div>
        <div className="relative text-center px-6 py-14 lg:py-20 flex flex-col items-center gap-5">
          <span className="inline-block px-5 py-2 rounded-full border-2 border-[#C9A96E]/60 text-[#C9A96E] text-sm font-bold tracking-wide uppercase">
            Huma Qureshi Novels
          </span>
          <h1
            id="welcome-heading"
            className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl"
          >
            Read Urdu Novels Online Free
          </h1>
          <p className="mx-auto max-w-2xl text-base lg:text-lg leading-8 text-white/80">
            Original Urdu novels, episodic stories and complete PDF books by Huma
            Qureshi — read online free or download to read offline, anywhere, anytime.
          </p>
          <p className="mx-auto max-w-2xl text-base lg:text-lg leading-8 text-[#C9A96E] font-semibold">
            New chapters added regularly, and every story is 100% free to read.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link
              href="/novel"
              className="bg-[#C9A96E] text-[#1E5D50] font-bold px-8 py-3 rounded-full hover:bg-[#d4b57a] active:scale-95 transition text-lg shadow-lg"
            >
              Browse Novels
            </Link>
            <Link
              href="/pdf"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-[#1E5D50] active:scale-95 transition text-lg shadow-lg"
            >
              PDF Library
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BAR — social proof */}
      <section aria-labelledby="stats-heading" className="mx-4 lg:mx-0">
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 px-6 py-8 lg:px-12 shadow-md">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <span className="text-3xl lg:text-5xl font-extrabold text-[#1E5D50] leading-none">{s.value.toLocaleString()}</span>
                <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-[#8B6914]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING */}
      {hasTrending && (
      <section id="trending" aria-labelledby="trending-heading" className="py-2">
        <Heading name="Trending Novels" />
        <p className="mx-auto max-w-4xl px-5 pb-4 text-center leading-7 font-medium">
          The most-read Urdu novels on Huma Qureshi Novels right now — stories with over 1,000 readers.
        </p>
        <div className="flex gap-5 flex-wrap justify-center lg:justify-start lg:px-10 lg:gap-6">
          {trendingNovels.map((item: any) => (
            <Novel key={item._id} date={date(item.novelreleasedate)} href={item.slug.current} cardBanner={item.banner} novelName={item.title} writer={item.writer?.writername || ""} genre={item.genre?.genrename || ""} summary={cleanDescriptionLong(item.noveldescription, "")} />
          ))}
        </div>
      </section>
      )}

      {/* WHAT YOU'LL FIND */}
      <section aria-labelledby="whats-here-heading" className="py-2">
        <Heading name="What You Will Find Here" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl mx-auto px-5 lg:px-10 py-5">
          {[
            {
              title: "Episodic Novels",
              desc: "Long Urdu novels published episode by episode. Read the latest chapter, then continue from where you left off.",
            },
            {
              title: "Complete PDF Novels",
              desc: "Finished stories available as a single PDF download for reading offline or on your phone.",
            },
            {
              title: "Short Stories & Afsanas",
              desc: "Quick emotional reads that can be finished in one sitting.",
            },
            {
              title: "Browse by Writer and Genre",
              desc: "Filter stories by your favourite writer or by genre such as Romance, Thriller, Cultural Fiction and more.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl border-2 border-[#1E5D50]/30 bg-[#FFFDF9] p-6 hover:border-[#1E5D50] hover:shadow-xl hover:-translate-y-0.5 transition duration-300"
            >
              <span className="w-11 h-11 rounded-full bg-[#8B6914] text-white font-extrabold flex items-center justify-center text-lg shadow-md">
                {i + 1}
              </span>
              <h3 className="text-lg font-extrabold text-[#1E5D50]">{f.title}</h3>
              <p className="leading-7 text-tertiary font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT THE AUTHOR */}
      <section aria-labelledby="author-heading" className="py-4">
        <Heading name="About the Author" />
        <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-5 flex flex-col">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-10 flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <h2 id="author-heading" className="text-2xl lg:text-3xl font-extrabold text-[#1E5D50]">
                Meet Huma Qureshi
              </h2>
              <p className="leading-8 text-tertiary font-medium">
                Huma Qureshi is a passionate Urdu novelist, story writer, and ghost writer
                from Pakistan. Writing, for her, is not just a talent — it is an emotion, a
                voice, and a lifelong craft through which she explores the many shades of
                human relationships, love, betrayal, sacrifice, and resilience.
              </p>
              <p className="leading-8 text-tertiary font-medium">
                She writes primarily under her pen name Huma Qureshi, inspired by her mother&apos;s
                name. In a career spanning five years, she has written full-length Urdu novels,
                short novels, afsanas, and short fiction. Much of her work spread across social
                platforms through readers who kept sharing and recommending her stories, and she
                has also published on Amazon Kindle.
              </p>
              <p className="leading-8 text-tertiary font-medium">
                Her stories often centre on romance and emotional fiction, women-centric narratives,
                social drama, and realistic, thought-provoking themes.
              </p>
              <div className="pt-1">
                <Link
                  href="/about"
                  className="inline-flex bg-[#1E5D50] text-white font-bold px-6 py-3 rounded-full hover:bg-[#2F7565] active:scale-95 transition text-sm shadow"
                >
                  Read More About the Author
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS & ANNOUNCEMENTS */}
      {announcements.length > 0 && (
        <section aria-labelledby="announcements-heading" className="py-4">
          <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
            <Heading name="News & Updates" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {announcements.map((a: any, i: number) => (
                <article
                  key={i}
                  className="bg-[#FFFDF9] rounded-2xl border-2 border-[#1E5D50]/30 p-6 flex flex-col gap-2"
                >
                  <time className="text-xs font-bold uppercase tracking-wide text-[#8B6914]">
                    {date(a.announcementdate)}
                  </time>
                  <h3 className="text-lg font-extrabold text-[#1E5D50]">
                    {a.title}
                  </h3>
                  <p className="leading-7 text-tertiary font-medium">{a.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT THE LIBRARY — SEO editorial content */}
      <section aria-labelledby="library-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-10 flex flex-col gap-5">
            <h2 id="library-heading" className="text-2xl lg:text-3xl font-extrabold text-[#1E5D50]">
              The Home of Urdu Novel Reading Online
            </h2>
            <div className="leading-8 text-tertiary font-medium flex flex-col gap-4">
              <p>
                <strong className="text-[#1E5D50]">Huma Qureshi Novels</strong> is a
                free online library for readers of Urdu fiction. Here you can read
                original Urdu novels, follow episodic stories chapter by chapter, and
                download complete books as PDFs to read offline — all without any cost
                or sign-up.
              </p>
              <p>
                Urdu novels have always held a special place in the hearts of readers
                across Pakistan, India, and the Urdu-speaking world. Our library brings
                together romance, family drama, women-centric fiction, thrillers, and
                thought-provoking social stories written in clear, engaging Urdu. Whether
                you enjoy long multi-episode novels or short afsanas you can finish in one
                sitting, you will find something worth reading here.
              </p>
              <p>
                Every novel is published in regular episodes, letting you follow the story
                as new chapters arrive. Finished stories are also available as a single PDF
                download, so you can carry the whole book on your phone, tablet, or e-reader
                and continue reading anywhere, even without an internet connection.
              </p>
              <p>
                New Urdu novels, chapters, and PDF books are added regularly. Bookmark this
                page and check back often to catch the latest releases from your favourite
                writers and discover fresh voices in Urdu literature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR GENRES — SEO content + internal links */}
      <section aria-labelledby="genres-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-10 flex flex-col gap-5">
            <h2 id="genres-heading" className="text-2xl lg:text-3xl font-extrabold text-[#1E5D50]">
              Genres You Will Find in Our Urdu Library
            </h2>
            <div className="leading-8 text-tertiary font-medium flex flex-col gap-4">
              <p>
                Our collection spans a wide range of Urdu fiction genres, so every kind of
                reader can find stories that move them:
              </p>
              <ul className="list-disc ps-6 flex flex-col gap-3">
                <li>
                  <strong className="text-[#1E5D50]">Romance &amp; Emotional Fiction</strong>{" "}
                  — heart-touching love stories and emotional journeys that explore the many layers
                  of relationships.
                </li>
                <li>
                  <strong className="text-[#1E5D50]">Women-Centric Narratives</strong> — powerful
                  stories told from a woman&apos;s perspective, celebrating strength, resilience, and hope.
                </li>
                <li>
                  <strong className="text-[#1E5D50]">Family &amp; Social Drama</strong> — realistic tales
                  of family life, sacrifice, and the quiet courage of ordinary people.
                </li>
                <li>
                  <strong className="text-[#1E5D50]">Mystery &amp; Suspense</strong> — gripping page-turners
                  full of twists that keep you guessing until the final chapter.
                </li>
                <li>
                  <strong className="text-[#1E5D50]">Short Stories &amp; Afsanas</strong> — complete
                  stories you can read in one go, perfect for a tea break.
                </li>
              </ul>
              <p>
                Use the browse filters on this page to sort Urdu novels and PDFs by writer and
                genre, or explore the full{" "}
                novel library and the complete PDF collection to discover even more stories.
              </p>
            </div>
          </div>

          {/* GENRE CARDS GRID */}
          {genreCards.length > 0 && (
            <div className="flex flex-col gap-5">
              <Heading name="Browse by Genre" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {genreCards.map((g: any, i: number) => (
                  <Link
                    key={i}
                    href={`/novel?genre=${encodeURIComponent(g.genrename || "")}`}
                    className="group flex flex-col items-start gap-3 rounded-2xl border-2 border-[#1E5D50]/30 bg-[#FFFDF9] p-4 hover:border-[#1E5D50] hover:shadow-xl hover:-translate-y-0.5 transition duration-300"
                  >
                    {g.genrecardimageurl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={g.genrecardimageurl}
                        alt={`${g.genrename} Urdu novels`}
                        className="w-full h-24 object-cover rounded-xl"
                        loading="lazy"
                      />
                    ) : (
                      <span className="w-full h-24 rounded-xl flex items-center justify-center bg-[#1E5D50]/10 text-3xl font-extrabold text-[#1E5D50]">
                        {g.genrename?.charAt(0) || "?"}
                      </span>
                    )}
                    <span className="text-lg font-extrabold text-[#1E5D50] group-hover:underline">
                      {g.genrename}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ — moved below (before Reader Poll) */}

      {/* TRENDING */}
      {/* moved above (after hero) */}

      {/* BROWSE + FILTER */}
      <section aria-labelledby="browse-heading" className="py-2 bg-[#FAF7F2] rounded-3xl mx-4 lg:mx-0 px-6 py-8">
        <Heading name="Browse Novels" />
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-4 pt-4">
          <p className="text-center leading-7 font-medium">
            Filter Urdu novels and PDFs by writer and genre. Choose your options
            and press Apply filter.
          </p>
          <HomeFilter writers={writers || []} genres={allGenres || []} />
          {hasFilters && (
            <p className="text-center text-sm font-bold text-[#1E5D50]">
              Showing {latest.length + popular.length} results
              {writer ? ` for writer "${writer}"` : ""}
              {genres.length > 0 ? ` in ${genres.join(", ")}` : ""}
            </p>
          )}
        </div>
      </section>

      {/* LATEST */}
      <section id="latest" aria-labelledby="latest-heading" className="py-2">
        <Heading name="Latest Novels & PDFs" />
        {latest.length > 0 ? (
        <p className="mx-auto max-w-4xl px-5 pb-4 text-center leading-7 font-medium">
          Read Urdu novels, new episodes and PDF books on Huma Qureshi Novels. Browse the latest stories by writer and genre.
        </p>
        ) : (
          <p className="text-center py-4 font-medium">No latest content matches your filters.</p>
        )}
        {latest.length > 0 && (
        <div className="flex gap-5 flex-wrap justify-center lg:justify-start lg:px-10 lg:gap-6">
          {latest.map((item: any) => item.type === "novel" ? (
            <Novel key={item._id} date={date(item.novelreleasedate)} href={item.slug.current} cardBanner={item.banner} novelName={item.title} writer={item.writer?.writername || ""} genre={item.genre?.genrename || ""} summary={cleanDescriptionLong(item.noveldescription, "")} />
          ) : (
            <PDF key={item._id} date={date(item.pdfreleasedate)} href={item.slug.current} cardBanner={item.banner} novelName={item.title} writer={item.writer?.writername || ""} genre={item.genre?.genrename || ""} summary={cleanDescriptionLong(item.pdfdescription, "")} />
          ))}
        </div>
        )}
      </section>

      {/* POPULAR */}
      <section id="popular" aria-labelledby="popular-heading" className="py-2">
        <Heading name="Popular Novels & PDFs" />
        {popular.length > 0 ? (
        <p className="mx-auto max-w-4xl px-5 pb-4 text-center leading-7 font-medium">
          The most popular Urdu novels and PDF books on Huma Qureshi Novels, ranked by reader views.
        </p>
        ) : (
          <p className="text-center py-4 font-medium">No popular content matches your filters.</p>
        )}
        {popular.length > 0 && (
        <div className="flex gap-5 flex-wrap justify-center lg:justify-start lg:px-10 lg:gap-6">
          {popular.map((item: any) => item.type === "novel" ? (
            <Novel key={item._id} date={date(item.novelreleasedate)} href={item.slug.current} cardBanner={item.banner} novelName={item.title} writer={item.writer?.writername || ""} genre={item.genre?.genrename || ""} summary={cleanDescriptionLong(item.noveldescription, "")} />
          ) : (
            <PDF key={item._id} date={date(item.pdfreleasedate)} href={item.slug.current} cardBanner={item.banner} novelName={item.title} writer={item.writer?.writername || ""} genre={item.genre?.genrename || ""} summary={cleanDescriptionLong(item.pdfdescription, "")} />
          ))}
        </div>
        )}
      </section>

      {/* WATCH ON YOUTUBE */}
      {youtubeNovels.length > 0 && (
        <section aria-labelledby="youtube-heading" className="py-4">
          <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
            <Heading name="Listen & Watch on YouTube" />
            <p className="max-w-4xl leading-7 font-medium">
              Prefer to listen? Many of our Urdu novels are also available as audio
              narration on YouTube. Pick a story below to start listening.
            </p>
            <div className="flex flex-col gap-5">
              {youtubeNovels.map((n: any, i: number) => (
                <Link
                  key={n._id || i}
                  href={n.youtubeurl.indexOf("http") === 0 ? n.youtubeurl : "#"}
                  target={n.youtubeurl.indexOf("http") === 0 ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border-2 border-[#1E5D50]/30 bg-[#FFFDF9] p-4 hover:border-[#1E5D50] hover:shadow-xl transition duration-300"
                >
                  <span className="w-12 h-12 shrink-0 rounded-full bg-[#1E5D50] text-white flex items-center justify-center text-xl shadow">
                    ▶
                  </span>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-extrabold text-[#1E5D50] group-hover:underline">
                      {n.title}
                    </span>
                    {n.writer?.writername && (
                      <span className="text-sm font-medium text-tertiary">
                        by {n.writer.writername}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section aria-labelledby="testimonials-heading" className="py-4">
          <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
            <Heading name="What Readers Say" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {testimonials.map((t: any, i: number) => (
                <figure
                  key={i}
                  className="bg-[#FFFDF9] rounded-2xl border-2 border-[#1E5D50]/30 p-6 flex flex-col gap-3"
                >
                  <blockquote className="leading-7 text-tertiary font-medium">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="font-extrabold text-[#1E5D50]">
                    — {t.name || "A Reader"}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW TO READ / GUIDE */}
      <section aria-labelledby="guide-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <Heading name="How to Use This Website" />
          <div className="rounded-3xl border-2 border-[#1E5D50]/30 bg-[#FFFDF9] p-6 lg:p-10 flex flex-col gap-5">
            <ol className="flex flex-col gap-4">
              {[
                {
                  title: "Browse or Search",
                  desc: "Use the search bar in the header, or click Browse Novels to explore the full library. You can filter by writer and genre.",
                },
                {
                  title: "Open a Novel",
                  desc: "Click any novel card to open its details page. There you can read the description, see the chapters, and choose where to start.",
                },
                {
                  title: "Read Episode by Episode",
                  desc: "Long novels are split into episodes. Read one chapter, then continue to the next. Your reading continues exactly where you left off.",
                },
                {
                  title: "Download the PDF",
                  desc: "For completed stories, use the Download PDF button to save the whole book on your phone or computer and read offline.",
                },
                {
                  title: "Watch on YouTube",
                  desc: "Stories with audio narration have a Watch on YouTube option, so you can listen instead of reading.",
                },
              ].map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="w-9 h-9 shrink-0 rounded-full bg-[#8B6914] text-white font-extrabold flex items-center justify-center shadow">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-extrabold text-[#1E5D50]">
                      {step.title}
                    </h3>
                    <p className="leading-7 text-tertiary font-medium">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ — SEO content */}
      <section aria-labelledby="faq-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <Heading name="Frequently Asked Questions" />
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-10 flex flex-col gap-6">
            {[
              {
                q: "Is it free to read Urdu novels on this website?",
                a: "Yes. All Urdu novels, episodic stories, and PDF books on Huma Qureshi Novels are completely free to read and download. You never need to pay or sign up to enjoy the stories.",
              },
              {
                q: "Do I need to create an account to read?",
                a: "No. There is no account, login, or sign-up required at all. You can open any novel or PDF and start reading immediately — completely free, with no registration needed.",
              },
              {
                q: "Can I download novels as PDF and read offline?",
                a: "Yes. Completed novels are available as a single PDF download. Once downloaded, you can open the file on any phone, tablet, or computer and read offline, even without internet.",
              },
              {
                q: "How often are new Urdu novels added?",
                a: "New episodes and complete novels are added regularly. Long novels are published in episodes, and new chapters appear as the author releases them, so check back often for fresh content.",
              },
              {
                q: "What genres are available?",
                a: "You will find romance, women-centric fiction, family and social drama, mystery and suspense, and short stories (afsanas). You can filter the whole library by writer and genre using the browse tools on this page.",
              },
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-1">
                <h3 className="text-lg font-extrabold text-[#1E5D50]">{f.q}</h3>
                <p className="leading-7 text-tertiary font-medium">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* READING STREAK */}
      <section aria-labelledby="streak-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <ReadingStreak />
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section aria-labelledby="achievements-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <Achievements />
        </div>
      </section>

      {/* READER POLL */}
      <section aria-labelledby="poll-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <Heading name="Reader Poll" />
          <ReaderPoll />
        </div>
      </section>
    </main>
  );
}

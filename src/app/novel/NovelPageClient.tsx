"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Filter from "../components/Filter";
import Novel from "../components/Cards/Novel";
import Heading from "../components/Heading";
import PageHero from "../components/PageHero";
import StatsBar from "../components/StatsBar";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import Pagination from "../components/ui/Pagination";
import ListingSidebar from "../components/ListingSidebar";
import { formatSafeDate } from "@/lib/seo";
import YouTubeSection from "../components/YouTubeSection";

interface NovelPageProps {
  initialNovels: any[];
  writers: string[];
  genres: string[];
  totalNovelCount: number;
  currentPage: number;
  totalPages: number;
}

export default function NovelPageClient({
  initialNovels,
  writers,
  genres,
  totalNovelCount,
  currentPage,
  totalPages,
}: NovelPageProps) {
  const [filters, setFilters] = useState({
    selectedWriter: "",
    selectedSort: "",
    selectedGenres: [] as string[],
    youtubeOnly: false,
  });
  const [novels, setNovels] = useState<any[]>(initialNovels || []);
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("genre") || "";
  const categoryParam = searchParams.get("category") || "";

  // Sync list whenever the server sends a new page of results
  useEffect(() => {
    setNovels(
      Array.isArray(initialNovels)
        ? initialNovels.filter((novel) => novel && novel._id)
        : []
    );
  }, [initialNovels]);

  // Pre-apply a genre filter when arriving from a genre link (?genre=...)
  useEffect(() => {
    if (genreParam && genres.includes(genreParam)) {
      setFilters((prev) =>
        prev.selectedGenres.includes(genreParam)
          ? prev
          : { ...prev, selectedGenres: [genreParam] }
      );
    }
  }, [genreParam, genres]);

  // Client-side filtering of the current page
  const filteredNovels = useMemo(() => {
    let result = [...novels].filter((novel) => novel && novel._id);

    if (filters.selectedWriter) {
      result = result.filter(
        (novel) => novel.writer?.writername === filters.selectedWriter
      );
    }

    if (filters.selectedGenres.length > 0) {
      result = result.filter((novel) =>
        filters.selectedGenres.includes(novel.genre?.genrename)
      );
    }

    if (filters.youtubeOnly) {
      result = result.filter(
        (novel) => novel.youtubeurl && novel.youtubeurl.trim() !== ""
      );
    }

    switch (filters.selectedSort) {
      case "Latest":
        result = result.sort(
          (a, b) =>
            new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
        );
        break;
      case "Popular":
        result = result.sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0));
        break;
      case "Trending":
        result = result.sort(
          (a, b) => (b.totalMonthlyViews || 0) - (a.totalMonthlyViews || 0)
        );
        break;
      default:
        result = result.sort(
          (a, b) =>
            new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
        );
    }

    return result;
  }, [novels, filters]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const hasFilters =
    Boolean(filters.selectedWriter) ||
    Boolean(filters.selectedSort) ||
    filters.selectedGenres.length > 0 ||
    filters.youtubeOnly;

  const paginationParams: Record<string, string> = genreParam
    ? { genre: genreParam }
    : {};

  return (
    <div className="flex flex-col gap-6 py-5">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Novels" }]}
      />

      {/* Hero Banner */}
      <PageHero
        badge={`${totalNovelCount} Novels`}
        title="Urdu Novels"
        description="Browse Urdu novels by genre, author and other available filters. Read episodic novels online, chapter by chapter, completely free."
        accent="Most stories are free to read online — pick a title and start reading from episode one."
        actions={[
          { label: "Download PDF Books", href: "/pdf" },
          { label: "Short Stories", href: "/short-stories" },
        ]}
      />

      {/* STATS BAR — social proof */}
      <StatsBar
        items={[
          { value: totalNovelCount, label: "Episodic Novels" },
          { value: writers.length, label: writers.length === 1 ? "Writer" : "Writers" },
          { value: genres.length, label: "Genres" },
          {
            value: (initialNovels || []).reduce(
              (a: number, n: any) => a + (n.totalViews || 0),
              0
            ),
            label: "Total Reads",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-w-0 flex-col gap-6">
      {/* Filter Section */}
      <section className="rounded-3xl bg-cream-soft border border-line p-6 lg:p-8">
        <Heading name="Filter Novels" />
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-4 pt-4">
          <p className="text-center leading-7 font-medium">
            Filter Urdu novels by writer and genre. Choose your options and press Apply filter.
          </p>
          <Filter
            dropdowns={[
              {
                label: writers.length > 1 ? "Writers" : "Writer",
                options: writers,
                value: filters.selectedWriter,
                onChange: (value: any) =>
                  handleFilterChange({
                    ...filters,
                    selectedWriter: value,
                  }),
              },
              {
                label: "Sort By",
                options: ["Latest", "Trending", "Popular"],
                value: filters.selectedSort,
                onChange: (value: any) =>
                  handleFilterChange({
                    ...filters,
                    selectedSort: value,
                  }),
              },
            ]}
            checkboxes={genres.map((genre) => ({
              label: genre,
              checked: filters.selectedGenres.includes(genre),
              onChange: (checked: any) => {
                const newGenres = checked
                  ? [...filters.selectedGenres, genre]
                  : filters.selectedGenres.filter((g) => g !== genre);

                handleFilterChange({
                  ...filters,
                  selectedGenres: newGenres,
                });
              },
            }))}
            toggle={{
              label: "YouTube Novels",
              value: filters.youtubeOnly,
              onChange: (value: boolean) =>
                handleFilterChange({ ...filters, youtubeOnly: value }),
            }}
            onclick={() => {}}
          />
          {hasFilters && (
            <button
              onClick={() =>
                handleFilterChange({
                  selectedWriter: "",
                  selectedSort: "",
                  selectedGenres: [],
                  youtubeOnly: false,
                })
              }
              className="border-2 border-line text-ink font-bold px-5 py-2 sm:px-6 text-sm rounded-full hover:border-brand hover:text-brand hover:shadow-[0_0_12px_rgba(30,93,80,0.15)] active:scale-95 transition-all duration-300"
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* Results header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
        <h2 className="heading-stylish text-2xl lg:text-3xl font-bold">
          All Novels ({totalNovelCount})
        </h2>
        {hasFilters && (
          <p className="text-sm font-bold text-brand">
            Showing {filteredNovels.length} on this page
          </p>
        )}
      </div>

      {/* Novel Grid */}
      <ul className="flex flex-wrap gap-5 justify-center lg:justify-start lg:px-2">
        {filteredNovels.map((novel, index) => (
          <Novel
            key={`${novel._id}-${index}`}
            date={
              novel.novelreleasedate
                ? formatSafeDate(novel.novelreleasedate)
                : ""
            }
            href={novel?.slug?.current ? novel.slug.current : "unknown"}
            cardBanner={novel.banner || ""}
            novelName={novel.title || ""}
            writer={novel.writer?.writername || ""}
            genre={novel.genre?.genrename || ""}
            summary={novel.summary || ""}
          />
        ))}
      </ul>

      {filteredNovels.length === 0 && (
        <p className="text-center py-6 font-bold text-brand">
          No novels match your filters.
        </p>
      )}

      {/* Numbered pagination */}
      {!hasFilters && !categoryParam && (
        <Pagination
          current={currentPage}
          total={totalPages}
          basePath="/novel"
          params={paginationParams}
        />
      )}
      </div>

      {/* Desktop sidebar — useful navigation */}
      <ListingSidebar
        tags={genres}
        tagsBasePath="/novel"
        authorCount={totalNovelCount}
        authorCountLabel="Novels"
      />
      </div>

      {/* ABOUT EPISODIC NOVELS — SEO content */}
      <section aria-labelledby="about-episodic-heading" className="py-4">
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
          <div className="bg-surface rounded-3xl border border-brand/30 p-6 lg:p-10 flex flex-col gap-5">
            <h2 id="about-episodic-heading" className="text-2xl lg:text-3xl font-extrabold text-brand">
              What Are Episodic Urdu Novels?
            </h2>
            <div className="leading-8 text-tertiary font-medium flex flex-col gap-4">
              <p>
                Episodic Urdu novels are long-form stories published chapter by chapter over time.
                Unlike a complete book that you read in one go, an episodic novel unfolds gradually
                — each episode brings new twists, deeper character development, and fresh moments
                that keep you coming back for more.
              </p>
              <p>
                This format has a long tradition in Urdu literature. Readers in Pakistan, India, and
                across the Urdu-speaking world have enjoyed following stories week after week,
                discussing theories, and sharing their favourite moments with fellow readers. Our
                library carries forward this tradition in a modern, easy-to-access format.
              </p>
              <p>
                Every novel on this page is free to read. Simply click on a story that catches your
                eye, start from the first episode, and keep reading as many chapters as you like.
                New episodes are added regularly, so there is always something fresh to explore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY READ ONLINE — SEO content */}
      <section aria-labelledby="why-read-heading" className="py-4">
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
          <div className="bg-surface rounded-3xl border border-brand/30 p-6 lg:p-10 flex flex-col gap-5">
            <h2 id="why-read-heading" className="text-2xl lg:text-3xl font-extrabold text-brand">
              Why Read Urdu Novels Online?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "100% Free",
                  desc: "Read any novel from start to finish without paying anything. No hidden charges, no subscriptions required.",
                },
                {
                  title: "New Episodes Weekly",
                  desc: "Long novels are published in episodes so you always have something new to look forward to. Check back regularly for fresh chapters.",
                },
                {
                  title: "Read Anywhere",
                  desc: "Open any story on your phone, tablet, or computer. The reading experience adapts to your screen so you can enjoy everywhere.",
                },
                {
                  title: "The Complete Collection",
                  desc: "Every novel on this site is written by Huma Qureshi. Explore her full library of complete and ongoing Urdu stories in one place.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-2xl border border-brand/30 bg-surface p-6 hover:border-brand hover:shadow-xl hover:-translate-y-0.5 transition duration-300"
                >
                  <h3 className="text-lg font-extrabold text-brand">{item.title}</h3>
                  <p className="leading-7 text-tertiary font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO READ — Guide */}
      <section aria-labelledby="guide-heading" className="py-4">
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
          <Heading name="How to Read Episodic Novels" />
          <div className="rounded-3xl border border-brand/30 bg-surface p-6 lg:p-10 flex flex-col gap-5">
            <ol className="flex flex-col gap-4">
              {[
                {
                  title: "Pick a Novel",
                  desc: "Browse the list above or use the filters to find a story by writer or genre. Click on any novel card to open its details page.",
                },
                {
                  title: "Start from Episode 1",
                  desc: "Every episodic novel begins with the first chapter. Start there to understand the story from the beginning.",
                },
                {
                  title: "Read Chapter by Chapter",
                  desc: "After finishing one episode, move to the next. The story builds slowly and each chapter ends with a hook that makes you want to keep reading.",
                },
                {
                  title: "Come Back for More",
                  desc: "Long novels are still being written. New episodes appear regularly, so bookmark the story and check back for the latest chapters.",
                },
              ].map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="w-9 h-9 shrink-0 rounded-full bg-gold-dark text-white font-extrabold flex items-center justify-center shadow">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-extrabold text-brand">
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

      {/* WATCH / LISTEN ON YOUTUBE — before FAQ */}
      <YouTubeSection
        items={(initialNovels || []).filter(
          (n) => n && n.youtubeurl && n.youtubeurl.trim() !== ""
        )}
      />

      {/* FAQs — SEO content */}
      <section aria-labelledby="faq-heading" className="py-4">
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
          <Heading name="Frequently Asked Questions" />
          <div className="bg-surface rounded-3xl border border-brand/30 p-6 lg:p-10 flex flex-col gap-6">
            {[
              {
                q: "What is an episodic Urdu novel?",
                a: "An episodic novel is a long story published in chapters over time. Each episode is a new part of the same story. You read from episode 1 and continue as new chapters are released.",
              },
              {
                q: "Are all novels on this page free to read?",
                a: "Yes. Every Urdu novel listed here is completely free to read online. You do not need to pay or subscribe to access any story.",
              },
              {
                q: "How do I know which episode to read next?",
                a: "Episodes are numbered in order. Always start with episode 1 and follow the sequence. The novel detail page shows all available episodes in the correct order.",
              },
              {
                q: "Can I filter novels by genre or writer?",
                a: "Yes. Use the filter section above the novel list to sort by writer, genre, or popularity. You can also toggle YouTube novels only.",
              },
              {
                q: "How often are new episodes added?",
                a: "New episodes are added as the author writes and releases them. Long-running novels may have new chapters weekly or bi-weekly, while completed novels have all episodes available at once.",
              },
              {
                q: "Can I listen to novels on YouTube instead of reading?",
                a: "Many novels on this site have YouTube audio narration. Toggle the YouTube filter in the browse section to see only novels available as audio on YouTube.",
              },
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-1">
                <h3 className="text-lg font-extrabold text-brand">{f.q}</h3>
                <p className="leading-7 text-tertiary font-medium">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

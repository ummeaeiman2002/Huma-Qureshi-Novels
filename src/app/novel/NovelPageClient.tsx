"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Filter from "../components/Filter";
import ActiveFilters, { type ActiveFilterItem } from "../components/ActiveFilters";
import Novel from "../components/Cards/Novel";
import PDF from "../components/Cards/PDF";
import Heading from "../components/Heading";
import PageHero from "../components/PageHero";
import StatsBar from "../components/StatsBar";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import ListingSidebar from "../components/ListingSidebar";
import { formatSafeDate } from "@/lib/seo";
import YouTubeSection from "../components/YouTubeSection";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";

interface NovelPageProps {
  initialNovels: any[];
  writers: string[];
  genres: string[];
  totalNovelCount: number;
}

export default function NovelPageClient({
  initialNovels,
  writers,
  genres,
  totalNovelCount,
}: NovelPageProps) {
  const { defaultBanner } = useSiteSettings();
  const [filters, setFilters] = useState({
    selectedType: "",
    selectedGenres: [] as string[],
  });
  const [novels, setNovels] = useState<any[]>(initialNovels || []);
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("genre") || "";

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

    if (filters.selectedGenres.length > 0) {
      result = result.filter((novel) =>
        filters.selectedGenres.includes(novel.genre?.genrename)
      );
    }

    if (filters.selectedType === "Episodic") {
      result = result.filter((novel) => novel._kind !== "pdf");
    } else if (filters.selectedType === "PDF") {
      result = result.filter((novel) => novel._kind === "pdf");
    } else if (filters.selectedType === "Audio Books") {
      result = result.filter(
        (novel) => novel.youtubeurl && novel.youtubeurl.trim() !== ""
      );
    }

    result = result.sort(
      (a, b) =>
        new Date(b.date || b._createdAt).getTime() -
        new Date(a.date || a._createdAt).getTime()
    );

    return result;
  }, [novels, filters]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const hasFilters =
    filters.selectedType !== "" || filters.selectedGenres.length > 0;

  const resetFilters = useCallback(
    () => handleFilterChange({ selectedType: "", selectedGenres: [] }),
    [handleFilterChange]
  );

  const activeItems: ActiveFilterItem[] = [
    ...(filters.selectedType
      ? [
          {
            key: "type",
            label: "Type",
            value: filters.selectedType,
            onRemove: () =>
              handleFilterChange({ ...filters, selectedType: "" }),
          },
        ]
      : []),
    ...filters.selectedGenres.map((g) => ({
      key: `genre-${g}`,
      label: "Genre",
      value: g,
      onRemove: () =>
        handleFilterChange({
          ...filters,
          selectedGenres: filters.selectedGenres.filter((x) => x !== g),
        }),
    })),
  ];

  return (
    <div className="flex flex-col gap-6 py-5">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "All Novels" }]}
      />

      {/* Hero Banner */}
      <PageHero
        badge={`${totalNovelCount} Novels`}
        title="All Urdu Novels"
        description="Browse every Urdu novel by genre, author and other available filters. Read episodic novels online, chapter by chapter, or open a complete PDF — all in one place."
        accent="Most stories are free to read online — pick a title and start reading from episode one."
        actions={[{ label: "About the Author", href: "/about" }]}
      />

      {/* STATS BAR — social proof */}
      <StatsBar
        items={[
          { value: totalNovelCount, label: "Novels" },
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
      <section aria-label="Filter novels" className="flex flex-col gap-4">
        <Heading name="Filter Novels" />
        <Filter
          title="Refine Your Search"
          description="Narrow the library by genre, or switch between episodic novels, complete PDFs and audio books."
          dropdowns={[
            {
              label: "Type",
              options: ["Episodic", "PDF", "Audio Books"],
              value: filters.selectedType,
              onChange: (value: any) =>
                handleFilterChange({ ...filters, selectedType: value }),
            },
          ]}
          checkboxes={genres.map((genre) => ({
            label: genre,
            checked: filters.selectedGenres.includes(genre),
            onChange: (checked: any) =>
              handleFilterChange({
                ...filters,
                selectedGenres: checked
                  ? [...filters.selectedGenres, genre]
                  : filters.selectedGenres.filter((g) => g !== genre),
              }),
          }))}
          onclick={() => {}}
        />
      </section>

      {/* Active filters summary */}
      {hasFilters && (
        <ActiveFilters items={activeItems} onClearAll={resetFilters} />
      )}

      {/* Results header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
        <h2 className="heading-stylish text-2xl lg:text-3xl font-bold">
          All Novels ({totalNovelCount})
        </h2>
        {hasFilters && (
          <p className="text-sm font-bold text-brand">
            Showing {filteredNovels.length}
          </p>
        )}
      </div>

      {/* Novel + PDF Grid */}
      <div className="flex flex-wrap gap-5 justify-center lg:justify-start lg:px-2">
        {filteredNovels.map((item, index) =>
          item._kind === "pdf" ? (
            <PDF
              key={`${item._id}-${index}`}
              date={item.date ? formatSafeDate(item.date) : ""}
              href={item?.slug?.current ? item.slug.current : "unknown"}
              cardBanner={item.banner || defaultBanner}
              novelName={item.title || ""}
              writer={item.writer?.writername || ""}
              genre={item.genre?.genrename || ""}
              summary={item.summary || ""}
              format={item.downloadformat || ""}
              size={item.downloadsize || ""}
            />
          ) : (
            <Novel
              key={`${item._id}-${index}`}
              date={item.date ? formatSafeDate(item.date) : ""}
              href={item?.slug?.current ? item.slug.current : "unknown"}
              cardBanner={item.banner || ""}
              novelName={item.title || ""}
              writer={item.writer?.writername || ""}
              genre={item.genre?.genrename || ""}
              summary={item.summary || ""}
            />
          )
        )}
      </div>

      {filteredNovels.length === 0 && (
        <p className="text-center py-6 font-bold text-brand">
          No novels match your filters.
        </p>
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

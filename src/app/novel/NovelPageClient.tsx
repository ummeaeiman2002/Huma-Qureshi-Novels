"use client";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Filter from "../components/Filter";
import Novel from "../components/Cards/Novel";
import Heading from "../components/Heading";
import { getPaginatedNovels } from "@/lib/sanity/queries";
import Loader2 from "../components/Loader2";
import { formatSafeDate } from "@/lib/seo";

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
  const [filters, setFilters] = useState({
    selectedWriter: "",
    selectedSort: "",
    selectedGenres: [] as string[],
    youtubeOnly: false,
  });
  const [allLoadedNovels, setAllLoadedNovels] = useState<any[]>(
    initialNovels || []
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const isLoadingRef = useRef(false);

  // Fetch more novels when needed
  const loadMoreNovels = useCallback(async () => {
    if (isLoadingRef.current || !hasMore || filters.selectedSort) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const nextPage = currentPage + 1;
      const moreNovels = await getPaginatedNovels(nextPage, 20);

      if (!moreNovels || moreNovels.length === 0) {
        setHasMore(false);
        setShowLoadMore(false);
      } else {
        const sanitizedNovels = moreNovels.filter(
          (novel: any) => novel && novel._id
        );
        setAllLoadedNovels((prev) => [...prev, ...sanitizedNovels]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more novels:", error);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [currentPage, hasMore, filters.selectedSort]);

  // Reset data when filters change
  useEffect(() => {
    const sanitizedInitialNovels = Array.isArray(initialNovels)
      ? initialNovels.filter((novel) => novel && novel._id)
      : [];

    if (filters.selectedSort) {
      // For special sorts, only show top 4 from initial data
      setAllLoadedNovels(sanitizedInitialNovels);
      setHasMore(false);
      setShowLoadMore(false);
    } else {
      // For default view, reset pagination
      setAllLoadedNovels(sanitizedInitialNovels);
      setCurrentPage(0);
      setHasMore(true);
      setShowLoadMore(true);
    }
  }, [filters.selectedSort, initialNovels]);

  // Client-side filtering with useMemo for performance
  const filteredNovels = useMemo(() => {
    let result = [...allLoadedNovels].filter((novel) => novel && novel._id); // Filter out null/undefined novels

    // Apply writer filter
    if (filters.selectedWriter) {
      result = result.filter(
        (novel) => novel && novel.writer?.writername === filters.selectedWriter
      );
    }

    // Apply genre filters
    if (filters.selectedGenres.length > 0) {
      result = result.filter(
        (novel) =>
          novel && filters.selectedGenres.includes(novel.genre?.genrename)
      );
    }

    // Apply YouTube-only filter
    if (filters.youtubeOnly) {
      result = result.filter(
        (novel) => novel && novel.youtubeurl && novel.youtubeurl.trim() !== ""
      );
    }

    // Apply sorting
    switch (filters.selectedSort) {
      case "Latest":
        result = result
          .sort(
            (a, b) =>
              new Date(b._createdAt).getTime() -
              new Date(a._createdAt).getTime()
          )
          .slice(0, 4);
        break;
      case "Popular":
        result = result
          .sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))
          .slice(0, 4);
        break;
      case "Trending":
        result = result
          .sort(
            (a, b) => (b.totalMonthlyViews || 0) - (a.totalMonthlyViews || 0)
          )
          .slice(0, 4);
        break;
      default:
        result = result.sort(
          (a, b) =>
            new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
        );
    }

    return result;
  }, [allLoadedNovels, filters]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  // Handle scroll for infinite loading
  useEffect(() => {
    if (filters.selectedSort || !showLoadMore) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Load more when user scrolls near bottom
      if (
        scrollTop + windowHeight >= documentHeight - 1000 &&
        !isLoading &&
        hasMore
      ) {
        loadMoreNovels();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreNovels, isLoading, hasMore, filters.selectedSort, showLoadMore]);

  const handleLoadMoreClick = () => {
    loadMoreNovels();
  };

  return (
    <div className="flex flex-col gap-6 py-5 justify-center">
      {/* Hero Banner */}
      <section className="relative mx-4 lg:mx-0 rounded-3xl overflow-hidden bg-[#1E5D50] shadow-2xl">
        <div aria-hidden="true" className="absolute inset-0 -z-0">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] rounded-full bg-[#2F7565]/40 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[200px] rounded-full bg-[#C9A96E]/15 blur-3xl"></div>
        </div>
        <div className="relative text-center px-6 py-12 lg:py-16 flex flex-col items-center gap-4">
          <span className="inline-block px-5 py-2 rounded-full border-2 border-[#C9A96E]/60 text-[#C9A96E] text-sm font-bold tracking-wide uppercase">
            {totalNovelCount} Novels
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            All Episodic Novels
          </h1>
          <p className="mx-auto max-w-2xl text-base lg:text-lg leading-8 text-white/80">
            Browse the complete collection of Urdu episodic novels. Filter by writer, genre, or sort by latest, trending and popular.
          </p>
          <p className="mx-auto max-w-2xl text-base lg:text-lg leading-8 text-[#C9A96E] font-semibold">
            Most stories are free to read online — pick a title and start reading from episode one.
          </p>
        </div>
      </section>

      {/* STATS BAR — social proof */}
      <section aria-labelledby="stats-heading" className="mx-4 lg:mx-0">
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 px-6 py-8 lg:px-12 shadow-md">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl lg:text-5xl font-extrabold text-[#1E5D50] leading-none">{totalNovelCount.toLocaleString()}</span>
              <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-[#8B6914]">Episodic Novels</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl lg:text-5xl font-extrabold text-[#1E5D50] leading-none">{writers.length.toLocaleString()}</span>
              <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-[#8B6914]">Writers</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl lg:text-5xl font-extrabold text-[#1E5D50] leading-none">{genres.length.toLocaleString()}</span>
              <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-[#8B6914]">Genres</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl lg:text-5xl font-extrabold text-[#1E5D50] leading-none">{(initialNovels || []).reduce((a: number, n: any) => a + (n.totalViews || 0), 0).toLocaleString()}</span>
              <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-[#8B6914]">Total Reads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section — matches homepage style */}
      <section className="py-2 bg-[#FAF7F2] rounded-3xl mx-4 lg:mx-0 px-6 py-8">
        <Heading name="Browse Novels" />
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-4 pt-4">
          <p className="text-center leading-7 font-medium">
            Filter Urdu novels by writer and genre. Choose your options and press Apply filter.
          </p>
          <Filter
            dropdowns={[
              {
                label: "Writers",
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
          {(filters.selectedWriter || filters.selectedSort || filters.selectedGenres.length > 0 || filters.youtubeOnly) && (
            <button
              onClick={() => handleFilterChange({ selectedWriter: "", selectedSort: "", selectedGenres: [], youtubeOnly: false })}
              className="border-2 border-[#DCCFC2] text-[#111111] font-bold px-6 py-2 text-sm rounded-full hover:border-[#1E5D50] hover:text-[#1E5D50] hover:shadow-[0_0_12px_rgba(30,93,80,0.15)] active:scale-95 transition-all duration-300"
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>

      {/* Novel Grid */}
      <ul className="flex flex-wrap gap-5 justify-center lg:justify-start lg:px-4">
        {filteredNovels
          .filter((pdf) => pdf && pdf._id)
          .map((pdf, index) => (
            <Novel
              key={`${pdf._id}-${index}`}
              date={
                pdf.novelreleasedate
                  ? formatSafeDate(pdf.novelreleasedate)
                  : ""
              }
              href={
                pdf?.slug?.current ? pdf.slug.current : "unknown"
              }
              cardBanner={pdf.banner || ""}
              novelName={pdf.title || ""}
              writer={pdf.writer?.writername || ""}
              genre={pdf.genre?.genrename || ""}
              summary={pdf.summary || ""}
            />
          ))}
      </ul>

      {/* Load More */}
      {filters.selectedSort === "" && showLoadMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMoreClick}
            disabled={isLoading}
            className="bg-[#1E5D50] text-white font-bold px-8 py-3 rounded-full hover:bg-[#16483E] active:scale-95 transition shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2"><Loader2 /> Loading...</span>
            ) : (
              "Load More Novels"
            )}
          </button>
        </div>
      )}

      {/* End of list */}
      {!hasMore && !isLoading && filters.selectedSort === "" && (
        <div className="text-center py-6 font-bold text-[#1E5D50]">
          You&apos;ve reached the end of the list
        </div>
      )}

      {/* ABOUT EPISODIC NOVELS — SEO content */}
      <section aria-labelledby="about-episodic-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-10 flex flex-col gap-5">
            <h2 id="about-episodic-heading" className="text-2xl lg:text-3xl font-extrabold text-[#1E5D50]">
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
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-10 flex flex-col gap-5">
            <h2 id="why-read-heading" className="text-2xl lg:text-3xl font-extrabold text-[#1E5D50]">
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
                  title: "Explore All Writers",
                  desc: "Huma Qureshi's library also brings stories from other writers. Discover fresh voices across multiple Urdu fiction genres.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-2xl border-2 border-[#1E5D50]/30 bg-[#FFFDF9] p-6 hover:border-[#1E5D50] hover:shadow-xl hover:-translate-y-0.5 transition duration-300"
                >
                  <h3 className="text-lg font-extrabold text-[#1E5D50]">{item.title}</h3>
                  <p className="leading-7 text-tertiary font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO READ — Guide */}
      <section aria-labelledby="guide-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <Heading name="How to Read Episodic Novels" />
          <div className="rounded-3xl border-2 border-[#1E5D50]/30 bg-[#FFFDF9] p-6 lg:p-10 flex flex-col gap-5">
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

      {/* FAQs — SEO content */}
      <section aria-labelledby="faq-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <Heading name="Frequently Asked Questions" />
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-10 flex flex-col gap-6">
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
                <h3 className="text-lg font-extrabold text-[#1E5D50]">{f.q}</h3>
                <p className="leading-7 text-tertiary font-medium">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

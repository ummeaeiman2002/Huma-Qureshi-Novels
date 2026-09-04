"use client";
import { useState, useMemo, useCallback } from "react";
import Filter from "../components/Filter";
import Novel from "../components/Cards/Novel";
import Heading from "../components/Heading";
import ReaderReviews from "../components/ReaderReviews";
import ReaderPoll from "../components/homePageComponents/ReaderPoll";
import ReadingStreak from "../components/ReadingStreak";
import Achievements from "../components/Achievements";
import { formatSafeDate } from "@/lib/seo";

interface ShortStoriesClientProps {
  initialStories: any[];
  writers: string[];
  genres: string[];
}

export default function ShortStoriesClient({
  initialStories,
  writers,
  genres,
}: ShortStoriesClientProps) {
  const stories = (initialStories || []).filter(
    (story: any) => story && story._id
  );

  const [filters, setFilters] = useState({
    selectedWriter: "",
    selectedSort: "",
    selectedGenres: [] as string[],
  });

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const totalViews = useMemo(
    () => stories.reduce((a: number, s: any) => a + (s.totalViews || 0), 0),
    [stories]
  );

  const filteredStories = useMemo(() => {
    let result = [...stories];

    if (filters.selectedWriter) {
      result = result.filter(
        (s) => s && s.writer?.writername === filters.selectedWriter
      );
    }

    if (filters.selectedGenres.length > 0) {
      result = result.filter(
        (s) => s && filters.selectedGenres.includes(s.genre?.genrename)
      );
    }

    switch (filters.selectedSort) {
      case "Latest":
        result = result.sort(
          (a, b) =>
            new Date(b._createdAt).getTime() -
            new Date(a._createdAt).getTime()
        );
        break;
      case "Popular":
        result = result.sort(
          (a, b) => (b.totalViews || 0) - (a.totalViews || 0)
        );
        break;
      case "Trending":
        result = result.sort(
          (a, b) =>
            (b.totalMonthlyViews || 0) - (a.totalMonthlyViews || 0)
        );
        break;
      default:
        result = result.sort(
          (a, b) =>
            new Date(b._createdAt).getTime() -
            new Date(a._createdAt).getTime()
        );
    }

    return result;
  }, [stories, filters]);

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
            {stories.length} Short Stories
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Short Stories
          </h1>
          <p className="mx-auto max-w-2xl text-base lg:text-lg leading-8 text-white/80">
            A collection of short Urdu stories, afsanas and quick reads by Huma Qureshi. Perfect when you want a complete story in one sitting.
          </p>
        </div>
      </section>

      {/* STATS BAR — social proof */}
      <section aria-labelledby="stats-heading" className="mx-4 lg:mx-0">
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 px-6 py-8 lg:px-12 shadow-md">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl lg:text-5xl font-extrabold text-[#1E5D50] leading-none">
                {stories.length.toLocaleString()}
              </span>
              <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-[#8B6914]">
                Short Stories
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl lg:text-5xl font-extrabold text-[#1E5D50] leading-none">
                {writers.length.toLocaleString()}
              </span>
              <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-[#8B6914]">
                Writers
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl lg:text-5xl font-extrabold text-[#1E5D50] leading-none">
                {genres.length.toLocaleString()}
              </span>
              <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-[#8B6914]">
                Genres
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl lg:text-5xl font-extrabold text-[#1E5D50] leading-none">
                {totalViews.toLocaleString()}
              </span>
              <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-[#8B6914]">
                Total Reads
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-2 bg-[#FAF7F2] rounded-3xl mx-4 lg:mx-0 px-6 py-8">
        <Heading name="Browse Short Stories" />
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-4 pt-4">
          <p className="text-center leading-7 font-medium">
            Filter Urdu short stories by writer and genre. Choose your options and press Apply filter.
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
            onclick={() => {}}
          />
          {(filters.selectedWriter ||
            filters.selectedSort ||
            filters.selectedGenres.length > 0) && (
            <button
              onClick={() =>
                handleFilterChange({
                  selectedWriter: "",
                  selectedSort: "",
                  selectedGenres: [],
                })
              }
              className="border-2 border-[#DCCFC2] text-[#111111] font-bold px-5 py-2 sm:px-6 text-sm rounded-full hover:border-[#1E5D50] hover:text-[#1E5D50] hover:shadow-[0_0_12px_rgba(30,93,80,0.15)] active:scale-95 transition-all duration-300"
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>

      {/* Story Grid */}
      {filteredStories.length > 0 ? (
        <ul className="flex flex-wrap gap-5 justify-center lg:justify-start lg:px-4">
          {filteredStories.map((story, index) => (
            <Novel
              key={`${story._id}-${index}`}
              date={
                story.novelreleasedate
                  ? formatSafeDate(story.novelreleasedate)
                  : ""
              }
              href={
                story?.slug?.current ? story.slug.current : "unknown"
              }
              cardBanner={story.banner || ""}
              novelName={story.title || ""}
              writer={story.writer?.writername || ""}
              genre={story.genre?.genrename || ""}
              summary={story.summary || ""}
            />
          ))}
        </ul>
      ) : (
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#DCCFC2] p-8 lg:p-12 flex flex-col items-center gap-4 text-center">
            <span className="text-5xl">📚</span>
            <h2 className="text-2xl font-extrabold text-[#1E5D50]">
              No Short Stories Found
            </h2>
            <p className="leading-8 text-tertiary font-medium max-w-xl">
              {filters.selectedWriter || filters.selectedSort || filters.selectedGenres.length > 0
                ? "No stories match your filters. Try adjusting your selection or clear filters."
                : "Short stories are coming soon! To publish a short story, open the novel in Sanity Studio and turn ON the \"Is this a Short Story?\" option."}
            </p>
          </div>
        </div>
      )}

      {/* ABOUT SHORT STORIES — SEO content */}
      <section aria-labelledby="about-short-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <Heading name="About Short Stories" />
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-10 flex flex-col gap-5">
            <div className="leading-8 text-tertiary font-medium flex flex-col gap-4">
              <p>
                Short stories are compact works of fiction that tell a complete story in a single
                reading session. Unlike episodic novels that unfold across many chapters, a short
                story delivers a full narrative arc — introduction, conflict, and resolution — all
                within one piece.
              </p>
              <p>
                This form has deep roots in Urdu literature, with masters of the afsana (short story)
                tradition crafting powerful tales of emotion, society, and the human experience. Our
                short story collection brings you these gems in an easy-to-read online format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* READER STREAK */}
      <ReadingStreak />

      {/* ACHIEVEMENTS */}
      <Achievements />

      {/* READER REVIEWS — short stories page */}
      <ReaderReviews storageKey="review_short_stories_page" heading="Reader Reviews" />

      {/* READER POLL */}
      <section aria-labelledby="poll-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <Heading name="Reader Poll" />
          <ReaderPoll />
        </div>
      </section>
    </div>
  );
}

"use client";
import { useState, useMemo, useCallback } from "react";
import Filter from "../components/Filter";
import Heading from "../components/Heading";
import PageHero from "../components/PageHero";
import StatsBar from "../components/StatsBar";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import Novel from "../components/Cards/Novel";
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
    <div className="flex flex-col gap-6 py-5">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Short Stories" }]}
      />

      {/* Hero Banner */}
      <PageHero
        badge={`${stories.length} Short Stories`}
        title="Urdu Short Stories"
        description="Explore short Urdu stories across different genres, themes and writing styles. Perfect when you want a complete story in one sitting."
        actions={[
          { label: "Browse Novels", href: "/novel" },
          { label: "PDF Library", href: "/pdf" },
        ]}
      />

      {/* STATS BAR — social proof */}
      <StatsBar
        items={[
          { value: stories.length, label: "Short Stories" },
          { value: writers.length, label: writers.length === 1 ? "Writer" : "Writers" },
          { value: genres.length, label: "Genres" },
          { value: totalViews, label: "Total Reads" },
        ]}
      />

      {/* Filter Section */}
      <section className="rounded-3xl bg-cream-soft border border-line p-6 lg:p-8">
        <Heading name="Browse Short Stories" />
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-4 pt-4">
          <p className="text-center leading-7 font-medium">
            Filter Urdu short stories by writer and genre. Choose your options and press Apply filter.
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
              className="border-2 border-line text-ink font-bold px-5 py-2 sm:px-6 text-sm rounded-full hover:border-brand hover:text-brand hover:shadow-[0_0_12px_rgba(30,93,80,0.15)] active:scale-95 transition-all duration-300"
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>

      {/* Story Grid — same card style as Novels / PDF pages */}
      {filteredStories.length > 0 ? (
        <ul className="flex flex-wrap gap-5 justify-center lg:justify-start lg:px-2">
          {filteredStories.map((story, index) => (
            <Novel
              key={`${story._id}-${index}`}
              hrefBase="/short-stories"
              cta="Read More"
              date={
                story.novelreleasedate ? formatSafeDate(story.novelreleasedate) : ""
              }
              href={story?.slug?.current ? story.slug.current : "unknown"}
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
          <div className="bg-surface rounded-3xl border border-line p-8 lg:p-12 flex flex-col items-center gap-4 text-center">
            <span className="text-5xl">📚</span>
            <h2 className="text-2xl font-extrabold text-brand">
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
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
          <Heading name="About Short Stories" />
          <div className="bg-surface rounded-3xl border border-brand/30 p-6 lg:p-10 flex flex-col gap-5">
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
    </div>
  );
}

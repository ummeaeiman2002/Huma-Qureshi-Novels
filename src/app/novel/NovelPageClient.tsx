"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Novel from "../components/Cards/Novel";
import PDF from "../components/Cards/PDF";
import PageHero from "../components/PageHero";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import ListingSidebar from "../components/ListingSidebar";
import NovelFilters, {
  type NovelFilterState,
  type NovelSort,
} from "../components/NovelFilters";
import { formatSafeDate } from "@/lib/seo";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";

interface NovelPageProps {
  initialNovels: any[];
  genres: string[];
}

type CardItem = {
  id: string;
  kind: "novel" | "pdf";
  title: string;
  slug: string;
  banner: string;
  date: string;
  timestamp: number;
  genre: string;
  writer: string;
  summary: string;
  status: string;
  language: string;
  episodes?: number;
  pages?: number;
  format: string;
  size: string;
  hasYoutube: boolean;
  searchText: string;
};

const DEFAULT_FILTERS: NovelFilterState = {
  q: "",
  type: "",
  genres: [],
  youtubeOnly: false,
  sort: "latest",
};

function buildCard(item: any): CardItem | null {
  if (!item || !item._id) return null;

  const isPdf = item._kind === "pdf";
  const slug = item?.slug?.current || "";
  if (!slug) return null;

  const rawDate = isPdf ? item.pdfreleasedate : item.novelreleasedate;
  const dateObj = new Date(rawDate || item._createdAt || Date.now());
  const timestamp = Number.isNaN(dateObj.getTime()) ? 0 : dateObj.getTime();

  return {
    id: item._id,
    kind: isPdf ? "pdf" : "novel",
    title: item.title || "",
    slug,
    banner: item.banner || "",
    date: rawDate ? formatSafeDate(rawDate) : "",
    timestamp,
    genre: item.genre?.genrename || "",
    writer: item.writer?.writername || "",
    summary: (item.summary || "").trim(),
    status: isPdf ? "" : item.novelstatus || "",
    language: item.language || "",
    episodes: isPdf ? undefined : item.episodeCount,
    pages: isPdf ? item.pdfnumberofpages : undefined,
    format: isPdf ? item.downloadformat || "" : "",
    size: isPdf ? item.downloadsize || "" : "",
    hasYoutube: Boolean(item.youtubeurl && String(item.youtubeurl).trim()),
    searchText: [item.title, item.englishtitle]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };
}

function matchesType(item: CardItem, type: string) {
  switch (type) {
    case "Episodic":
      return item.kind === "novel" && !item.hasYoutube;
    case "Complete":
      return item.kind === "pdf";
    case "Short Story":
      return item.kind === "novel" && item.title.toLowerCase().includes("short story");
    case "Audio Books":
      return item.hasYoutube;
    default:
      return true;
  }
}

export default function NovelPageClient({ initialNovels, genres }: NovelPageProps) {
  const { defaultBanner } = useSiteSettings();
  const searchParams = useSearchParams();

  const cards = useMemo(
    () =>
      (initialNovels || [])
        .map(buildCard)
        .filter((c): c is CardItem => c !== null),
    [initialNovels]
  );

  const [filters, setFilters] = useState<NovelFilterState>(() => ({
    q: searchParams.get("q") || "",
    type: searchParams.get("type") || "",
    genres: searchParams.get("genre")?.split(",").filter(Boolean) || [],
    youtubeOnly: searchParams.get("yt") === "1",
    sort: (searchParams.get("sort") as NovelSort) || "latest",
  }));

  // Keep the URL in sync with the filters, so listings stay shareable.
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.type) params.set("type", filters.type);
    if (filters.genres.length > 0) params.set("genre", filters.genres.join(","));
    if (filters.youtubeOnly) params.set("yt", "1");
    if (filters.sort !== "latest") params.set("sort", filters.sort);

    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/novel?${qs}` : "/novel");
  }, [filters]);

  // Normalise filters when arriving from a genre link (?genre=...) or deep link.
  useEffect(() => {
    if (filters.type && !["Episodic", "Complete", "Short Story", "Audio Books"].includes(filters.type)) {
      setFilters((prev) => ({ ...prev, type: "" }));
    }
  }, [filters.type]);

  const genreCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const genre of genres) map.set(genre, 0);
    for (const card of cards) {
      if (card.genre && map.has(card.genre)) {
        map.set(card.genre, (map.get(card.genre) || 0) + 1);
      }
    }
    return genres
      .map((name) => ({ name, count: map.get(name) || 0 }))
      .filter((g) => g.count > 0);
  }, [cards, genres]);

  const typeOptions = useMemo(() => {
    const defs = [
      { value: "Episodic", label: "Episodic novel", match: (c: CardItem) => matchesType(c, "Episodic") },
      { value: "Complete", label: "Complete PDF", match: (c: CardItem) => matchesType(c, "Complete") },
      { value: "Short Story", label: "Short story", match: (c: CardItem) => matchesType(c, "Short Story") },
      { value: "Audio Books", label: "Audio (YouTube)", match: (c: CardItem) => matchesType(c, "Audio Books") },
    ];
    return defs.map((d) => ({
      value: d.value,
      label: d.label,
      count: cards.filter(d.match).length,
    }));
  }, [cards]);

  const filtered = useMemo(() => {
    let result = cards.slice();

    const query = filters.q.trim().toLowerCase();
    if (query) {
      result = result.filter((c) => c.searchText.includes(query));
    }

    if (filters.genres.length > 0) {
      result = result.filter((c) => filters.genres.includes(c.genre));
    }

    if (filters.type) {
      result = result.filter((c) => matchesType(c, filters.type));
    }

    if (filters.youtubeOnly) {
      result = result.filter((c) => c.hasYoutube);
    }

    switch (filters.sort) {
      case "oldest":
        result.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case "title":
        result.sort((a, b) =>
          a.title.localeCompare(b.title, "en", { sensitivity: "base" })
        );
        break;
      default:
        result.sort((a, b) => b.timestamp - a.timestamp);
    }

    return result;
  }, [cards, filters]);

  const handleChange = useCallback(
    (patch: Partial<NovelFilterState>) => setFilters((prev) => ({ ...prev, ...patch })),
    []
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const hasFilters =
    filters.q !== "" ||
    filters.type !== "" ||
    filters.genres.length > 0 ||
    filters.youtubeOnly ||
    filters.sort !== "latest";

  const totalPdf = cards.filter((c) => c.kind === "pdf").length;
  const youtubeCount = cards.filter((c) => c.hasYoutube).length;

  return (
    <div className="flex flex-col gap-6 py-5">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "All Novels" }]}
      />

      <PageHero
        badge={`${cards.length} ${cards.length === 1 ? "title" : "titles"}`}
        title="All Urdu Novels by Huma Qureshi"
        description="Discover original Urdu fiction by Huma Qureshi. Explore novels across different genres, discover new stories, and continue reading your favourite characters and episodes."
        highlights={[
          { value: cards.length - totalPdf, label: "Novels & Stories" },
          { value: totalPdf, label: "PDF Books" },
          { value: genreCounts.length, label: "Genres" },
          { value: youtubeCount, label: "On YouTube" },
        ]}
        actions={[{ label: "About the Author", href: "/about" }]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-6">
          <NovelFilters
            value={filters}
            onChange={handleChange}
            onReset={resetFilters}
            genres={genreCounts}
            typeOptions={typeOptions}
            resultCount={filtered.length}
            totalCount={cards.length}
            hasFilters={hasFilters}
          />

          <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
            <h2 className="heading-stylish text-2xl font-bold lg:text-3xl">
              Novels &amp; PDFs{" "}
              <span className="text-brand/50">({filtered.length})</span>
            </h2>
          </div>

          {filtered.length > 0 ? (
            <ul className="flex flex-wrap justify-center gap-5 lg:justify-start lg:px-2">
              {filtered.map((item) =>
                item.kind === "pdf" ? (
                  <li key={item.id} className="flex">
                    <PDF
                      date={item.date}
                      href={item.slug}
                      cardBanner={item.banner || defaultBanner}
                      novelName={item.title}
                      writer={item.writer}
                      genre={item.genre}
                      summary={item.summary}
                      format={item.format}
                      size={item.size}
                      language={item.language}
                      pages={item.pages}
                    />
                  </li>
                ) : (
                  <li key={item.id} className="flex">
                    <Novel
                      date={item.date}
                      href={item.slug}
                      cardBanner={item.banner}
                      novelName={item.title}
                      writer={item.writer}
                      genre={item.genre}
                      summary={item.summary}
                      status={item.status}
                      language={item.language}
                      episodes={item.episodes}
                    />
                  </li>
                )
              )}
            </ul>
          ) : (
            <div className="rounded-3xl border border-dashed border-line bg-surface px-6 py-14 text-center">
              <p className="font-display text-xl font-extrabold text-brand">
                No novels match your search.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-muted">
                Try a different title or genre, or reset the filters to see the
                full collection.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-brand-deep shadow-md transition hover:bg-gold-dark hover:text-cream active:scale-95"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        <ListingSidebar
          tags={genreCounts.map((g) => g.name)}
          tagsBasePath="/novel"
          authorCount={cards.length - totalPdf}
          authorCountLabel="Novels & Stories"
        />
      </div>

      {/* Short closing introduction */}
      <section aria-labelledby="closing-heading" className="py-4">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 rounded-3xl border border-line bg-surface p-6 lg:p-10">
          <h2 id="closing-heading" className="text-2xl font-extrabold text-brand lg:text-3xl">
            Discover More of Huma Qureshi&rsquo;s Writing
          </h2>
          <p className="font-medium leading-8 text-tertiary">
            This library collects Huma Qureshi&rsquo;s original Urdu fiction in one
            place — ongoing episodic novels, complete PDF books and shorter
            stories, organised by genre so you can find your next read quickly.
            Browse a series from its first episode, follow the latest chapters as
            they appear, or download a complete book to read offline. If you are
            new here, start with a genre that appeals to you and open any title to
            begin reading.
          </p>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Filter from "./Filter";

export default function HomeFilter({
  writers,
  genres,
}: {
  writers: string[];
  genres: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedWriter, setSelectedWriter] = useState(
    searchParams.get("writer") || ""
  );
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get("sort") || ""
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    searchParams.get("genre")?.split(",").filter(Boolean) || []
  );
  const [youtubeOnly, setYoutubeOnly] = useState(
    searchParams.get("yt") === "1"
  );

  const hasFilters =
    selectedWriter !== "" ||
    selectedSort !== "" ||
    selectedGenres.length > 0 ||
    youtubeOnly;

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedWriter) params.set("writer", selectedWriter);
    if (selectedSort) params.set("sort", selectedSort);
    if (selectedGenres.length > 0)
      params.set("genre", selectedGenres.join(","));
    if (youtubeOnly) params.set("yt", "1");
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
    router.refresh();
  }, [router, selectedWriter, selectedSort, selectedGenres, youtubeOnly]);

  const clearFilters = useCallback(() => {
    setSelectedWriter("");
    setSelectedSort("");
    setSelectedGenres([]);
    setYoutubeOnly(false);
    router.push("/");
    router.refresh();
  }, [router]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Filter
        dropdowns={[
          {
            label: "Writers",
            options: writers,
            value: selectedWriter,
            onChange: (v: any) => setSelectedWriter(v),
          },
          {
            label: "Sort By",
            options: ["Latest", "Trending", "Popular"],
            value: selectedSort,
            onChange: (v: any) => setSelectedSort(v),
          },
        ]}
        checkboxes={genres.map((genre) => ({
          label: genre,
          checked: selectedGenres.includes(genre),
          onChange: (checked: any) =>
            setSelectedGenres((prev) =>
              checked ? [...prev, genre] : prev.filter((g) => g !== genre)
            ),
        }))}
        toggle={{
          label: "YouTube Novels",
          value: youtubeOnly,
          onChange: (value: boolean) => setYoutubeOnly(value),
        }}
        onclick={applyFilters}
      />
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="border-2 border-[#DCCFC2] text-[#111111] font-bold px-5 py-2 sm:px-6 text-sm rounded-full hover:border-[#1E5D50] hover:text-[#1E5D50] hover:shadow-[0_0_12px_rgba(30,93,80,0.15)] active:scale-95 transition-all duration-300"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

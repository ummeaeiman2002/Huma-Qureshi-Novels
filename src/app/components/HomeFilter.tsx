"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Filter from "./Filter";
import ActiveFilters, { type ActiveFilterItem } from "./ActiveFilters";

export default function HomeFilter({ genres }: { genres: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || ""
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    searchParams.get("genre")?.split(",").filter(Boolean) || []
  );

  const hasFilters = selectedType !== "" || selectedGenres.length > 0;

  // Update state and push the new query string (used by Apply and chip removal)
  const commit = useCallback(
    (overrides: { type?: string; genres?: string[] }) => {
      const t = overrides.type ?? selectedType;
      const g = overrides.genres ?? selectedGenres;

      setSelectedType(t);
      setSelectedGenres(g);

      const params = new URLSearchParams();
      if (t) params.set("type", t);
      if (g.length > 0) params.set("genre", g.join(","));

      const qs = params.toString();
      router.push(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [selectedType, selectedGenres, router]
  );

  const clearFilters = useCallback(() => {
    commit({ type: "", genres: [] });
  }, [commit]);

  const activeItems: ActiveFilterItem[] = [
    ...(selectedType
      ? [
          {
            key: "type",
            label: "Type",
            value: selectedType,
            onRemove: () => commit({ type: "" }),
          },
        ]
      : []),
    ...selectedGenres.map((g) => ({
      key: `genre-${g}`,
      label: "Genre",
      value: g,
      onRemove: () => commit({ genres: selectedGenres.filter((x) => x !== g) }),
    })),
  ];

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Filter
        title="Find Your Next Read"
        description="Filter Urdu novels by genre, or switch between episodic novels, complete PDFs and audio books."
        dropdowns={[
          {
            label: "Type",
            options: ["Episodic", "PDF", "Audio Books"],
            value: selectedType,
            onChange: (v: any) => setSelectedType(v),
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
        onclick={() => commit({})}
      />

      {hasFilters && (
        <ActiveFilters
          items={activeItems}
          onClearAll={clearFilters}
          className="w-full justify-center sm:justify-start"
        />
      )}
    </div>
  );
}

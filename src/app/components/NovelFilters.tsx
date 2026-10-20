"use client";

export type NovelSort = "latest" | "oldest" | "title";

export type NovelFilterState = {
  q: string;
  type: string;
  genres: string[];
  youtubeOnly: boolean;
  sort: NovelSort;
};

type Option = { value: string; label: string; count: number };

interface NovelFiltersProps {
  value: NovelFilterState;
  onChange: (patch: Partial<NovelFilterState>) => void;
  onReset: () => void;
  genres: { name: string; count: number }[];
  typeOptions: Option[];
  resultCount: number;
  totalCount: number;
  hasFilters: boolean;
}

const labelClass = "ui-eyebrow";

const selectClass =
  "w-full appearance-none rounded-xl border border-line bg-surface px-4 py-2.5 pr-10 text-sm font-semibold text-tertiary shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";

const SORTS: Option[] = [
  { value: "latest", label: "Newest first", count: 0 },
  { value: "oldest", label: "Oldest first", count: 0 },
  { value: "title", label: "Title (A–Z)", count: 0 },
];

export default function NovelFilters({
  value,
  onChange,
  onReset,
  genres,
  typeOptions,
  resultCount,
  totalCount,
  hasFilters,
}: NovelFiltersProps) {
  return (
    <section
      aria-label="Search and filter novels"
      className="w-full rounded-3xl border border-line bg-surface p-5 shadow-sm lg:p-7"
    >
      <div className="mb-6 flex flex-col gap-1.5">
        <h2 className="font-display text-xl font-extrabold text-brand lg:text-2xl">
          Find Your Next Read
        </h2>
        <p className="text-sm font-medium leading-6 text-muted">
          Search the collection by title, then narrow it by type, genre or
          availability.
        </p>
        <span
          aria-hidden="true"
          className="mt-1 h-1 w-16 rounded-full bg-gradient-to-r from-gold to-transparent"
        />
      </div>

      <div className="flex flex-col gap-6">
        {/* Search */}
        <div className="flex flex-col gap-2">
          <label htmlFor="novel-search" className={labelClass}>
            Search by title
          </label>
          <div className="relative">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="novel-search"
              type="search"
              value={value.q}
              onChange={(e) => onChange({ q: e.target.value })}
              placeholder="Search novels by title…"
              autoComplete="off"
              className="w-full rounded-xl border border-line bg-surface py-2.5 pl-11 pr-4 text-sm font-semibold text-brand shadow-sm outline-none transition placeholder:font-medium placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </div>
        </div>

        {/* Type + sort */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="novel-type" className={labelClass}>
              Content type
            </label>
            <div className="relative">
              <select
                id="novel-type"
                value={value.type}
                onChange={(e) => onChange({ type: e.target.value })}
                className={selectClass}
              >
                <option value="">All types</option>
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.count})
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted"
              >
                ▼
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="novel-sort" className={labelClass}>
              Sort by
            </label>
            <div className="relative">
              <select
                id="novel-sort"
                value={value.sort}
                onChange={(e) =>
                  onChange({ sort: e.target.value as NovelFilterState["sort"] })
                }
                className={selectClass}
              >
                {SORTS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted"
              >
                ▼
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className={labelClass}>Availability</span>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line bg-cream-soft px-4 py-2.5">
              <span className="text-sm font-semibold text-brand">
                On YouTube only
              </span>
              <span className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  checked={value.youtubeOnly}
                  onChange={(e) => onChange({ youtubeOnly: e.target.checked })}
                  className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full bg-line transition-colors peer-checked:bg-gold peer-focus-visible:ring-2 peer-focus-visible:ring-brand/25" />
                <span className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </span>
            </label>
          </div>
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <span className={labelClass}>Genres</span>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => {
                const checked = value.genres.includes(genre.name);
                return (
                  <button
                    key={genre.name}
                    type="button"
                    aria-pressed={checked}
                    onClick={() =>
                      onChange({
                        genres: checked
                          ? value.genres.filter((g) => g !== genre.name)
                          : [...value.genres, genre.name],
                      })
                    }
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-95 ${
                      checked
                        ? "border-gold bg-gold/15 text-brand"
                        : "border-line bg-surface text-muted hover:border-brand/40 hover:text-brand"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-bold transition-colors ${
                        checked
                          ? "border-gold bg-gold text-brand-deep"
                          : "border-line text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    {genre.name}
                    <span className="text-[11px] font-bold text-brand/50">
                      {genre.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Result count + reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <p aria-live="polite" className="text-sm font-bold text-brand">
            Showing {resultCount} of {totalCount}{" "}
            {totalCount === 1 ? "title" : "titles"}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-brand/25 px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-brand transition hover:border-brand hover:bg-brand hover:text-cream active:scale-95"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

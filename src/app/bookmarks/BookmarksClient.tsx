"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHero from "../components/PageHero";
import RelatedContent from "../components/RelatedContent";

interface Bookmark {
  slug: string;
  title: string;
  type: "pdf" | "novel" | "episode";
  savedAt: number;
}

const TYPE_LABEL: Record<string, string> = {
  pdf: "PDF Novel",
  novel: "Novel",
  episode: "Episode",
};

const TYPE_ICON: Record<string, string> = {
  pdf: "📄",
  novel: "📖",
  episode: "📘",
};

export default function BookmarksClient({
  suggestions,
}: {
  suggestions?: { novels?: any[]; pdfs?: any[] };
}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeType, setActiveType] = useState<"all" | "novel" | "pdf" | "episode">("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hq_bookmarks");
      const list = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list)) {
        setBookmarks(list.sort((a: any, b: any) => (b.savedAt || 0) - (a.savedAt || 0)));
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  const filteredBookmarks =
    activeType === "all"
      ? bookmarks
      : bookmarks.filter((b) => b.type === activeType);

  function remove(slug: string) {
    const next = bookmarks.filter((b) => b.slug !== slug);
    setBookmarks(next);
    try {
      localStorage.setItem("hq_bookmarks", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function hrefFor(b: Bookmark) {
    if (b.type === "pdf") return `/pdf/${b.slug}`;
    if (b.type === "novel") return `/novel/${b.slug}`;
    return `/novel/${b.slug}`;
  }

  const hasSuggestions =
    (suggestions?.novels?.length || 0) > 0 || (suggestions?.pdfs?.length || 0) > 0;

  return (
    <main className="flex flex-col py-5 gap-6 lg:gap-10 mx-auto w-full max-w-5xl">
      {/* HERO */}
      <PageHero
        title="Your Bookmarks"
        description="Everything you saved appears here, stored privately on your device. Tap any bookmark to jump straight back to it, or remove it when you're done."
      />

      {!loaded ? (
        <p className="text-center opacity-60">Loading your bookmarks…</p>
      ) : bookmarks.length === 0 ? (
        <section className="text-center py-12 bg-cream-soft rounded-3xl border border-line">
          <p className="text-5xl mb-4">🔖</p>
          <h2 className="text-xl font-extrabold text-brand">No bookmarks yet</h2>
          <p className="mt-2 text-sm opacity-70 max-w-md mx-auto">
            While reading a novel or PDF, tap the Bookmark button to save it here.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/novel" className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-brand text-white text-sm font-bold hover:bg-brand-dark transition text-center">
              Browse Novels
            </Link>
            <Link href="/pdf" className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border border-brand/40 text-brand text-sm font-bold hover:border-brand hover:bg-brand/5 transition text-center">
              PDF Library
            </Link>
          </div>
        </section>
      ) : (
        <section aria-labelledby="bookmarks-list" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {([["all", `All (${bookmarks.length})`], ["novel", `Novels (${bookmarks.filter((b) => b.type === "novel").length})`], ["pdf", `PDFs (${bookmarks.filter((b) => b.type === "pdf").length})`], ["episode", `Episodes (${bookmarks.filter((b) => b.type === "episode").length})`]] as const).map(([type, label]) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition active:scale-95 ${
                  activeType === type
                    ? "bg-brand text-white shadow"
                    : "border border-brand/30 text-brand hover:border-brand hover:bg-brand/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-10 bg-cream-soft rounded-3xl border border-line">
              <p className="text-4xl mb-3">🔖</p>
              <h2 className="text-lg font-extrabold text-brand">
                No {activeType === "all" ? "" : TYPE_LABEL[activeType] + " "}bookmarks here
              </h2>
              <p className="mt-2 text-sm opacity-70 max-w-md mx-auto">
                {activeType === "all"
                  ? "Everything you save will appear here."
                  : `You have no saved ${TYPE_LABEL[activeType]}s yet. Try a different filter.`}
              </p>
            </div>
          ) : (
            filteredBookmarks.map((b) => (
            <div
              key={b.slug}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-brand/20 bg-surface p-4 sm:p-5 hover:border-brand/60 hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto overflow-hidden">
                <span className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-brand/10 flex items-center justify-center text-xl sm:text-2xl">
                  {TYPE_ICON[b.type] || "🔖"}
                </span>
                <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gold-dark">
                    {TYPE_LABEL[b.type] || "Saved"}
                  </span>
                  <Link href={hrefFor(b) as any} className="text-base sm:text-lg font-extrabold text-brand hover:underline truncate block">
                    {b.title}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <Link
                  href={hrefFor(b) as any}
                  className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-brand text-white text-xs sm:text-sm font-bold hover:bg-brand-dark active:scale-95 transition"
                >
                  Open
                </Link>
                <button
                  onClick={() => remove(b.slug)}
                  className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border-2 border-[#e65564]/40 text-[#e65564] text-xs sm:text-sm font-bold hover:bg-[#e65564] hover:text-white active:scale-95 transition"
                >
                  Remove
                </button>
              </div>
            </div>
            ))
          )}
        </section>
      )}

      {/* SUGGESTIONS — shown when there is nothing saved yet */}
      {bookmarks.length === 0 && hasSuggestions && (
        <RelatedContent
          relatedNovels={suggestions?.novels}
          relatedPDFs={suggestions?.pdfs}
          heading="Popular Novels to Read"
        />
      )}
    </main>
  );
}

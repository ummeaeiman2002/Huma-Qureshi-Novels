"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loaded, setLoaded] = useState(false);

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

  return (
    <main className="flex flex-col py-5 gap-6 lg:gap-10 max-w-5xl mx-auto px-5 lg:px-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-secondary/25 bg-secondary/5 p-6 lg:p-10 shadow-2xl">
        <div aria-hidden="true" className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary/15 blur-3xl"></div>
        <div aria-hidden="true" className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-[#C9A96E]/10 blur-3xl"></div>
        <div className="relative flex flex-col gap-4 text-center lg:text-start">
          <h1 className="text-3xl lg:text-4xl font-extrabold title-bright">Your Bookmarks</h1>
          <p className="max-w-2xl leading-7 text-tertiary font-medium">
            Everything you saved appears here, stored privately on your device. Tap any bookmark
            to jump straight back to it, or remove it when you&apos;re done.
          </p>
        </div>
      </section>

      {!loaded ? (
        <p className="text-center opacity-60">Loading your bookmarks…</p>
      ) : bookmarks.length === 0 ? (
        <section className="text-center py-12 bg-[#FAF7F2] rounded-3xl border-2 border-[#DCCFC2]">
          <p className="text-5xl mb-4">🔖</p>
          <h2 className="text-xl font-extrabold text-[#1E5D50]">No bookmarks yet</h2>
          <p className="mt-2 text-sm opacity-70 max-w-md mx-auto">
            While reading a novel or PDF, tap the Bookmark button to save it here.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/novel" className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#1E5D50] text-white text-sm font-bold hover:bg-[#16483E] transition text-center">
              Browse Novels
            </Link>
            <Link href="/pdf" className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border-2 border-[#1E5D50]/40 text-[#1E5D50] text-sm font-bold hover:border-[#1E5D50] hover:bg-[#1E5D50]/5 transition text-center">
              PDF Library
            </Link>
          </div>
        </section>
      ) : (
        <section aria-labelledby="bookmarks-list" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "novel", "pdf", "episode"] as const).map((t) => null)}
          </div>
          {bookmarks.map((b) => (
            <div
              key={b.slug}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl border-2 border-[#1E5D50]/20 bg-[#FFFDF9] p-4 sm:p-5 hover:border-[#1E5D50]/60 hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto overflow-hidden">
                <span className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-[#1E5D50]/10 flex items-center justify-center text-xl sm:text-2xl">
                  {TYPE_ICON[b.type] || "🔖"}
                </span>
                <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-[#8B6914]">
                    {TYPE_LABEL[b.type] || "Saved"}
                  </span>
                  <Link href={hrefFor(b) as any} className="text-base sm:text-lg font-extrabold text-[#1E5D50] hover:underline truncate block">
                    {b.title}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <Link
                  href={hrefFor(b) as any}
                  className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#1E5D50] text-white text-xs sm:text-sm font-bold hover:bg-[#16483E] active:scale-95 transition"
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
          ))}
        </section>
      )}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";

interface BookmarkButtonProps {
  slug: string;
  title: string;
  type: "pdf" | "novel" | "episode";
}

const STORAGE_KEY = "hq_bookmarks";

export default function BookmarkButton({ slug, title, type }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setSaved(Array.isArray(list) && list.some((b: any) => b.slug === slug));
    } catch {
      /* ignore */
    }
  }, [slug]);

  function toggle() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: any[] = raw ? JSON.parse(raw) : [];
      const exists = list.some((b: any) => b.slug === slug);
      let next: any[];
      if (exists) {
        next = list.filter((b: any) => b.slug !== slug);
      } else {
        next = [...list, { slug, title, type, savedAt: Date.now() }];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaved(!exists);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition active:scale-95 ${
        saved
          ? "bg-[#1E5D50] text-white"
          : "border-2 border-[#1E5D50]/30 text-[#1E5D50] hover:border-[#1E5D50] hover:bg-[#1E5D50]/5"
      }`}
      aria-pressed={saved}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M5 3h14v18l-7-5-7 5V3z" strokeLinejoin="round" />
      </svg>
      {saved ? "Bookmarked" : "Bookmark"}
    </button>
  );
}

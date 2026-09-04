"use client";

import { useEffect, useState } from "react";

interface ReactionsProps {
  slug: string;
}

const REACTIONS = [
  { key: "like", label: "Like", emoji: "👍", color: "#1E5D50" },
  { key: "heart", label: "Love", emoji: "❤️", color: "#e65564" },
  { key: "wow", label: "Wow", emoji: "😮", color: "#C9A96E" },
  { key: "sad", label: "Sad", emoji: "😢", color: "#5B7C99" },
  { key: "fire", label: "Fire", emoji: "🔥", color: "#e65564" },
];

const STORAGE_PREFIX = "hq_reactions_";

function loadCounts(slug: string) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + slug);
    const data = raw ? JSON.parse(raw) : {};
    if (data && typeof data === "object") {
      return { counts: data, userReacted: null as string | null };
    }
  } catch {
    /* ignore */
  }
  return { counts: {}, userReacted: null as string | null };
}

export default function Reactions({ slug }: ReactionsProps) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [userReacted, setUserReacted] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const { counts: c, userReacted: u } = loadCounts(slug);
    setCounts(c);
    setUserReacted(u);
    setLoaded(true);
  }, [slug]);

  function react(key: string) {
    const nextCounts = { ...counts };

    if (userReacted === key) {
      // Remove existing reaction
      nextCounts[key] = Math.max(0, (nextCounts[key] || 1) - 1);
      setUserReacted(null);
    } else {
      // Remove previous reaction if any
      if (userReacted) {
        nextCounts[userReacted] = Math.max(0, (nextCounts[userReacted] || 1) - 1);
      }
      // Add new reaction
      nextCounts[key] = (nextCounts[key] || 0) + 1;
      setUserReacted(key);
    }

    setCounts(nextCounts);
    try {
      localStorage.setItem(STORAGE_PREFIX + slug, JSON.stringify(nextCounts));
      localStorage.setItem(STORAGE_PREFIX + slug + "_user", JSON.stringify(userReacted === key ? null : key));
    } catch {
      /* ignore */
    }
  }

  if (!loaded) {
    return (
      <div className="flex justify-center py-6">
        <span className="opacity-50 text-sm">Loading reactions…</span>
      </div>
    );
  }

  return (
    <section aria-label="React to this episode" className="flex flex-col items-center gap-3 py-4">
      <span className="text-sm font-extrabold uppercase tracking-widest text-[#8B6914]">
        How did this episode make you feel?
      </span>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {REACTIONS.map((r) => {
          const active = userReacted === r.key;
          const count = counts[r.key] || 0;
          return (
            <button
              key={r.key}
              onClick={() => react(r.key)}
              aria-pressed={active}
              aria-label={`${r.label}${count ? `, ${count}` : ""}`}
              className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border-2 transition active:scale-90 ${
                active
                  ? "border-[#1E5D50] bg-[#1E5D50]/10 shadow"
                  : "border-[#DCCFC2] bg-[#FFFDF9] hover:border-[#1E5D50]/50 hover:shadow-sm"
              }`}
            >
              <span className="text-lg sm:text-xl leading-none">{r.emoji}</span>
              <span className={`text-xs sm:text-sm font-bold ${active ? "text-[#1E5D50]" : "text-tertiary"}`}>
                {count > 0 ? count : ""}
              </span>
            </button>
          );
        })}
      </div>
      <span className="text-[11px] text-[#111111]/50 text-center">
        {userReacted
          ? `You reacted with ${REACTIONS.find((r) => r.key === userReacted)?.label}. Tap again to remove.`
          : "Tap a reaction to share how you felt."}
      </span>
    </section>
  );
}

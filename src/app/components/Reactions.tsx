"use client";

import { useCallback, useEffect, useState } from "react";

interface ReactionsProps {
  slug: string;
}

const REACTIONS = [
  { key: "like", label: "Like", emoji: "👍", color: "#746044" },
  { key: "heart", label: "Love", emoji: "❤️", color: "#A48750" },
  { key: "wow", label: "Wow", emoji: "😮", color: "#A48750" },
  { key: "sad", label: "Sad", emoji: "😢", color: "#625D54" },
  { key: "fire", label: "Fire", emoji: "🔥", color: "#746044" },
];

const STORAGE_PREFIX = "hq_reactions_";

function readLocalCounts(slug: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + slug);
    const data = raw ? JSON.parse(raw) : null;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const counts: Record<string, number> = {};
      for (const key of Object.keys(data)) {
        const n = Number(data[key]);
        if (Number.isFinite(n) && n > 0) counts[key] = Math.floor(n);
      }
      return counts;
    }
  } catch {
    /* ignore */
  }
  return {};
}

function readLocalChoice(slug: string): string | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${slug}_user`);
    const value = raw ? JSON.parse(raw) : null;
    if (typeof value === "string" && REACTIONS.some((r) => r.key === value)) {
      return value;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function saveLocal(slug: string, counts: Record<string, number>, choice: string | null) {
  try {
    localStorage.setItem(STORAGE_PREFIX + slug, JSON.stringify(counts));
    localStorage.setItem(`${STORAGE_PREFIX}${slug}_user`, JSON.stringify(choice));
  } catch {
    /* ignore */
  }
}

export default function Reactions({ slug }: ReactionsProps) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [userReacted, setUserReacted] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Restore this device's state instantly, then replace it with the global counts
  useEffect(() => {
    let cancelled = false;

    setCounts(readLocalCounts(slug));
    setUserReacted(readLocalChoice(slug));
    setLoaded(true);

    fetch(`/api/reactions?slug=${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: any) => {
        if (!cancelled && data?.success && data.counts) setCounts(data.counts);
      })
      .catch(() => {
        /* offline — keep local counts */
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const sync = useCallback(
    (key: string, delta: 1 | -1) => {
      fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, key, delta }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: any) => {
          // Server is the source of truth — adopt its totals
          if (data?.success && data.counts) setCounts(data.counts);
        })
        .catch(() => {
          /* keep the optimistic count if the network dropped */
        });
    },
    [slug]
  );

  function react(key: string) {
    const removing = userReacted === key;
    const nextCounts = { ...counts };
    const previous = userReacted;

    if (removing) {
      nextCounts[key] = Math.max(0, (nextCounts[key] || 0) - 1);
    } else {
      if (previous) nextCounts[previous] = Math.max(0, (nextCounts[previous] || 0) - 1);
      nextCounts[key] = (nextCounts[key] || 0) + 1;
    }

    const nextChoice = removing ? null : key;
    setCounts(nextCounts);
    setUserReacted(nextChoice);
    saveLocal(slug, nextCounts, nextChoice);
    sync(key, removing ? -1 : 1);
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
      <span className="text-sm font-extrabold uppercase tracking-widest text-gold-dark">
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
                  ? "border-brand bg-brand/10 shadow"
                  : "border-line bg-surface hover:border-brand/50 hover:shadow-sm"
              }`}
            >
              <span className="text-lg sm:text-xl leading-none">{r.emoji}</span>
              <span className={`text-xs sm:text-sm font-bold ${active ? "text-brand" : "text-tertiary"}`}>
                {count > 0 ? count : ""}
              </span>
            </button>
          );
        })}
      </div>
      <span className="text-[11px] text-ink/50 text-center">
        {userReacted
          ? `You reacted with ${REACTIONS.find((r) => r.key === userReacted)?.label}. Tap again to remove.`
          : "Tap a reaction to share how you felt."}
      </span>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";

const OPTIONS = [
  { label: "Romance & Emotional Fiction", emoji: "💘" },
  { label: "Thriller & Suspense", emoji: "🕵️" },
  { label: "Family & Social Drama", emoji: "🏡" },
  { label: "Short Stories & Afsanas", emoji: "📖" },
];

const STORAGE_KEY = "hq_reader_poll";

export default function ReaderPoll() {
  const [votes, setVotes] = useState<number[]>(OPTIONS.map(() => 0));
  const [selected, setSelected] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setVotes(parsed.votes || OPTIONS.map(() => 0));
        setSelected(parsed.selected ?? null);
      } catch {
        /* ignore */
      }
    }
    setLoaded(true);
  }, []);

  function vote(index: number) {
    if (selected !== null) return;
    const next = [...votes];
    next[index] += 1;
    const selectedIndex = index;
    setVotes(next);
    setSelected(selectedIndex);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ votes: next, selected: selectedIndex })
      );
    } catch {
      /* ignore */
    }
  }

  const total = votes.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-8 flex flex-col gap-4">
      <p className="text-lg font-extrabold text-[#1E5D50]">
        Which type of Urdu stories do you love most?
      </p>
      <p className="text-sm font-medium text-tertiary">
        Vote below — it helps us decide which new novels to publish next.
      </p>
      {loaded && (
        <div className="flex flex-col gap-3">
          {OPTIONS.map((opt, i) => {
            const pct = total > 0 ? Math.round((votes[i] / total) * 100) : 0;
            const isSel = selected === i;
            return (
              <button
                key={i}
                onClick={() => vote(i)}
                disabled={selected !== null}
                className={`relative text-left flex items-center gap-3 rounded-2xl border-2 px-4 py-3 transition ${
                  isSel
                    ? "border-[#1E5D50] bg-[#1E5D50]/10"
                    : "border-[#1E5D50]/20 hover:border-[#1E5D50]"
                } ${selected !== null ? "cursor-default" : "cursor-pointer"}`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="flex-1 font-bold text-tertiary">
                  {opt.label}
                </span>
                {selected !== null && (
                  <span className="font-extrabold text-[#1E5D50]">{pct}%</span>
                )}
                {selected !== null && (
                  <span className="absolute inset-y-0 left-0 rounded-2xl bg-[#C9A96E]/25" style={{ width: `${pct}%` }} aria-hidden="true" />
                )}
              </button>
            );
          })}
          {selected !== null && (
            <p className="text-sm font-medium text-[#1E5D50]">
              Thanks for voting! Total votes: {total}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

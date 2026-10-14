"use client";

import { useEffect, useState } from "react";
import Heading from "./Heading";

const STREAK_KEY = "hq_reading_streak";

interface StreakData {
  count: number;
  lastReadDate: string; // YYYY-MM-DD local
  bestStreak: number;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function load(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lastReadDate: "", bestStreak: 0 };
}

function save(data: StreakData) {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch {}
}

export default function ReadingStreak() {
  const [data, setData] = useState<StreakData>({ count: 0, lastReadDate: "", bestStreak: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const today = todayKey();
    const current = load();
    let next: StreakData;

    if (current.lastReadDate === today) {
      // already read today, just ensure best is up to date
      next = { ...current, bestStreak: Math.max(current.bestStreak, current.count) };
    } else if (current.lastReadDate === addDays(today, -1)) {
      // read yesterday -> streak continues
      next = { count: current.count + 1, lastReadDate: today, bestStreak: Math.max(current.bestStreak, current.count + 1) };
    } else {
      // no read yesterday -> new streak
      next = { count: 1, lastReadDate: today, bestStreak: Math.max(current.bestStreak, current.count) };
    }

    save(next);
    setData(next);
    setLoaded(true);
  }, []);

  const days = data.count;
  const best = data.bestStreak;

  const badge =
    days >= 30
      ? { label: "🔥 Legendary Reader", emoji: "👑" }
      : days >= 14
      ? { label: "🔥 Dedicated Reader", emoji: "⚡" }
      : days >= 7
      ? { label: "🔥 Weekly Streak", emoji: "🌤️" }
      : days >= 3
      ? { label: "🔥 On Fire!", emoji: "🔥" }
      : days >= 1
      ? { label: "🔥 Streak Started", emoji: "📖" }
      : { label: "Start Reading Today", emoji: "📖" };

  return (
    <section aria-labelledby="streak-heading" className="py-4">
      <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
        <Heading name="Reading Streak" />
        <div className="rounded-3xl border-2 border-[#C9A96E]/40 bg-gradient-to-br from-[#FFFDF9] to-[#FFF8EC] p-6 lg:p-10 shadow-xl">
          {loaded ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-5xl lg:text-6xl font-extrabold text-[#1E5D50]">{days}</span>
                  <span className="text-sm font-bold uppercase tracking-wide text-[#8B6914]">Day Streak</span>
                </div>
                <div className="w-px h-16 bg-[#C9A96E]/30 hidden sm:block" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-5xl lg:text-6xl font-extrabold text-[#1E5D50]">{best}</span>
                  <span className="text-sm font-bold uppercase tracking-wide text-[#8B6914]">Best Streak</span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#C9A96E]/30 bg-[#FFFDF9] px-6 py-4 flex items-center justify-center gap-3">
                <span className="text-3xl">{badge.emoji}</span>
                <span className="text-lg font-extrabold text-[#1E5D50]">{badge.label}</span>
              </div>

              <p className="text-sm text-tertiary font-medium text-center leading-6">
                Read at least one story every day to keep your streak alive. Miss a day and the
                streak resets — but your best streak is saved forever. Keep reading!
              </p>
            </div>
          ) : (
            <div className="text-center text-tertiary font-medium">Loading your streak…</div>
          )}
        </div>
      </div>
    </section>
  );
}

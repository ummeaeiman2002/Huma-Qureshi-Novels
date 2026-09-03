"use client";

import { useEffect, useState } from "react";
import Heading from "./Heading";

const STREAK_KEY = "hq_reading_streak";
const EPISODES_KEY = "hq_read_episodes";
const NOVELS_KEY = "hq_read_novels";
const GIFT_NOTIFIED_KEY = "hq_gift_notified";

interface Achievement {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  unlocked: boolean;
  progress: number; // 0-100
  metric: string;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getStreakData(): { count: number; bestStreak: number; lastReadDate: string } {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, bestStreak: 0, lastReadDate: "" };
}

function getArr(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const episodes = getArr(EPISODES_KEY);
    const novelsRaw = getArr(NOVELS_KEY);
    const novelIds = new Set(novelsRaw.map((v) => v.split("__")[0]));
    const streak = getStreakData();

    const episodesCount = episodes.length;
    const novelsCount = novelIds.size;
    const streakDays = streak.count;
    // 3 months = ~90 days of consistent reading
    const threeMonthEligible = streakDays >= 90 || streak.bestStreak >= 90;

    const cap100 = (v: number) => Math.min(v, 100);

    const list: Achievement[] = [
      {
        id: "first_novel",
        title: "First Novel",
        desc: "Read your first novel",
        emoji: "🏅",
        unlocked: novelsCount >= 1,
        progress: cap100((novelsCount / 1) * 100),
        metric: `${novelsCount}/1 novel`,
      },
      {
        id: "five_novels",
        title: "Bookworm",
        desc: "Read 5 different novels",
        emoji: "🥉",
        unlocked: novelsCount >= 5,
        progress: cap100((novelsCount / 5) * 100),
        metric: `${novelsCount}/5 novels`,
      },
      {
        id: "seven_day",
        title: "7-Day Streak",
        desc: "Read consistently for 7 days",
        emoji: "📚",
        unlocked: streakDays >= 7,
        progress: cap100((streakDays / 7) * 100),
        metric: `${streakDays}/7 days`,
      },
      {
        id: "hundred_episodes",
        title: "Century Reader",
        desc: "Read 100 episodes",
        emoji: "📖",
        unlocked: episodesCount >= 100,
        progress: cap100((episodesCount / 100) * 100),
        metric: `${episodesCount}/100 episodes`,
      },
      {
        id: "gift",
        title: "Premium Gift",
        desc: "Read consistently for 3 months and win a FREE ebook",
        emoji: "🎁",
        unlocked: threeMonthEligible,
        progress: cap100((Math.max(streakDays, streak.bestStreak) / 90) * 100),
        metric: `${Math.max(streakDays, streak.bestStreak)}/90 days`,
      },
    ];

    setAchievements(list);
    setLoaded(true);

    // Notify about gift unlock once
    if (threeMonthEligible && !localStorage.getItem(GIFT_NOTIFIED_KEY)) {
      localStorage.setItem(GIFT_NOTIFIED_KEY, "1");
      // A gentle toast/inline note shown in the gift card instead of blocking alert
    }
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <section aria-labelledby="achievements-heading" className="py-4">
      <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Heading name="Achievements" />
          <span className="text-sm font-bold text-[#1E5D50] bg-[#1E5D50]/10 border border-[#1E5D50]/30 px-4 py-1.5 rounded-full">
            {unlockedCount}/{achievements.length} unlocked
          </span>
        </div>

        <div className="rounded-3xl border-2 border-[#1E5D50]/30 bg-[#FFFDF9] p-6 lg:p-8 shadow-xl">
          {loaded ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`flex flex-col gap-3 rounded-2xl border-2 p-5 transition ${
                    a.unlocked
                      ? "border-[#C9A96E]/70 bg-gradient-to-br from-[#FFF8EC] to-[#FFFDF9]"
                      : "border-[#DCCFC2] bg-[#FFFDF9]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{a.emoji}</span>
                    {a.unlocked && (
                      <span className="text-xs font-extrabold uppercase tracking-wide text-[#1E5D50] bg-[#1E5D50]/10 px-3 py-1 rounded-full">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-extrabold text-[#1E5D50]">{a.title}</h3>
                    <p className="text-sm text-tertiary font-medium leading-6">{a.desc}</p>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-[#8B6914]">{a.metric}</span>
                      <span>{Math.round(a.progress)}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#1E5D50]/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#C9A96E] to-[#1E5D50] transition-all duration-700"
                        style={{ width: `${Math.max(a.progress, a.unlocked ? 100 : 0)}%` }}
                      />
                    </div>
                  </div>
                  {a.id === "gift" && a.unlocked && (
                    <div className="mt-1 rounded-xl border border-[#C9A96E]/50 bg-[#FFF8EC] p-3 flex flex-col gap-1">
                      <p className="text-sm font-extrabold text-[#8B6914]">
                        🎉 You won a FREE ebook!
                      </p>
                      <p className="text-xs text-tertiary font-medium leading-5">
                        Congratulations! Contact us through the Contact page or email at{" "}
                        <span className="font-bold text-[#1E5D50]">humaqureshiofficial73@gmail.com</span>{" "}
                        to claim your gift.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-tertiary font-medium">Loading achievements…</div>
          )}
        </div>
      </div>
    </section>
  );
}

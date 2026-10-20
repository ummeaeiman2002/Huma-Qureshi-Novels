"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type UpcomingProject = {
  id: string;
  title: string;
  cover: string;
  coverAlt: string;
  genre: string;
  teaser: string;
  teaserUrdu: string;
  releaseNote: string;
};

const DOTS_LIMIT = 5;

/**
 * Upcoming Projects slider — portrait covers (2500x3000 / 5:6) with title,
 * genre, teaser and a "Coming Soon" badge. Reuses the site's existing slider
 * behaviour (arrows, dots, autoplay, reduced-motion) and design tokens only.
 */
export default function UpcomingProjects({
  projects,
}: {
  projects: UpcomingProject[];
}) {
  const [index, setIndex] = useState(0);
  const count = projects.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startX = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    if (count <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), 8000);
  }, [count, stop]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  if (count === 0) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? startX.current) - startX.current;
    startX.current = null;
    if (Math.abs(delta) < 40) return;
    goTo(delta < 0 ? index + 1 : index - 1);
  };

  const current = projects[index];

  return (
    <div
      aria-roledescription="carousel"
      aria-label="Upcoming projects by Huma Qureshi"
      className="relative overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_2px_12px_rgba(41,40,36,0.06)]"
      onMouseEnter={stop}
      onMouseLeave={start}
      onFocus={stop}
      onBlur={start}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-center lg:gap-12 lg:p-10">
        {/* Portrait cover (2500x3000 -> 5:6) */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative w-full max-w-[320px] overflow-hidden rounded-2xl border border-gold/30 bg-brand-deep shadow-2xl">
            <div className="relative aspect-[5/6] w-full">
              {current.cover ? (
                <Image
                  key={`cover-${current.id}`}
                  src={current.cover}
                  alt={current.coverAlt || `${current.title} coming soon cover`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 80vw, 320px"
                  className="object-cover"
                />
              ) : (
                <div className="hero-pattern flex h-full w-full items-center justify-center bg-brand-deep">
                  <span className="font-display text-6xl font-extrabold text-gold/70">
                    {current.title.trim().charAt(0).toUpperCase() || "H"}
                  </span>
                </div>
              )}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
              />
              <span className="absolute left-3 top-3 rounded-full border border-gold/30 bg-brand-deep/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-gold backdrop-blur-sm">
                Coming Soon
              </span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-start gap-4">
          <span className="ui-eyebrow text-gold-dark">Upcoming Project</span>

          <h3 className="font-display text-3xl font-extrabold leading-[1.15] text-balance text-brand sm:text-4xl">
            {current.title}
          </h3>

          {current.genre && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/35 bg-gold/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-dark">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
              {current.genre}
            </span>
          )}

          {current.teaser && (
            <p className="line-clamp-5 max-w-xl text-sm leading-7 font-medium text-ink/80 sm:text-base sm:leading-8">
              {current.teaser}
            </p>
          )}

          {current.teaserUrdu && (
            <p
              className="line-clamp-4 max-w-xl font-urdu text-lg leading-[2.1] text-muted"
              dir="rtl"
              lang="ur"
            >
              {current.teaserUrdu}
            </p>
          )}

          {current.releaseNote && (
            <span className="rounded-full bg-brand px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
              {current.releaseNote}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      {count > 1 && (
        <div className="flex items-center justify-between gap-4 border-t border-line px-6 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose project">
            {projects.slice(0, DOTS_LIMIT).map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to project ${i + 1}: ${p.title}`}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-gold" : "w-2.5 bg-brand/20 hover:bg-brand/40"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => goTo(index - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-brand transition hover:border-gold hover:bg-gold hover:text-brand-deep"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next project"
              onClick={() => goTo(index + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-brand transition hover:border-gold hover:bg-gold hover:text-brand-deep"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

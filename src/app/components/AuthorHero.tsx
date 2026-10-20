"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type HeroSlide = {
  id: string;
  title: string;
  slug: string;
  banner: string;
  genre: string;
  summary: string;
};

const DOTS_LIMIT = 4;

/**
 * Premium author hero — a full-width fading slider of real published novels.
 *
 * Layout/composition is inspired by a premium Urdu author website
 * (cover on one side, title/author/synopsis/button on the other, full-bleed
 * dimmed backdrop). All text, colours, book covers and links are Huma
 * Qureshi's own, taken from the site's Sanity content and design tokens.
 */
export default function AuthorHero({
  slides,
  stats,
}: {
  slides: HeroSlide[];
  stats: { novels: number; pdfs: number; genres: number };
}) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

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
    if (reduce) return; // respect reduced motion — no autoplay
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), 8000);
  }, [count, stop]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  if (count === 0) {
    // Graceful typography-led hero when no book content is available.
    return (
      <section aria-labelledby="hero-heading" className="pt-6 lg:pt-8 pb-6">
        <div className="relative overflow-hidden rounded-3xl bg-brand-deep px-6 py-16 text-center shadow-2xl ring-1 ring-gold/20 sm:px-12">
          <div aria-hidden="true" className="hero-pattern pointer-events-none absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              Pakistani Urdu Fiction Writer
            </span>
            <h1 id="hero-heading" className="font-display text-4xl font-extrabold text-cream sm:text-5xl">
              Huma Qureshi
            </h1>
            <p className="text-base leading-8 font-medium text-cream/85">
              Original Urdu novels, episodic fiction and complete PDF books.
            </p>
            <Link
              href="/novel"
              className="mt-1 inline-flex rounded-full bg-gold px-7 py-3 text-sm font-bold text-brand-deep shadow-md transition hover:bg-gold-dark hover:text-cream active:scale-95"
            >
              Explore My Novels
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const current = slides[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured novels by Huma Qureshi"
      className="pt-6 lg:pt-8 pb-6"
      onMouseEnter={stop}
      onMouseLeave={start}
      onFocus={stop}
      onBlur={start}
    >
      <div className="relative overflow-hidden rounded-3xl bg-brand-deep shadow-2xl ring-1 ring-gold/20">
        {/* Full-bleed backdrop = current book cover, kept clearly visible */}
        {current.banner && (
          <Image
            key={`bg-${current.id}`}
            src={current.banner}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="scale-105 object-cover opacity-90"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-brand-deep/95 via-brand-deep/80 to-brand-deep/40"
        />
        <div aria-hidden="true" className="hero-pattern absolute inset-0 opacity-[0.06]" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        {/* Slides */}
        <div className="relative">
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <article
                key={slide.id}
                aria-hidden={!active}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                className={`${
                  active ? "relative" : "pointer-events-none absolute inset-0 opacity-0"
                } grid gap-8 px-6 py-10 transition-opacity duration-700 sm:px-10 sm:py-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14 lg:px-14 lg:py-16`}
              >
                {/* Cover (landscape) */}
                <div className="order-1 flex justify-center lg:order-none lg:justify-start">
                  <Link
                    href={`/novel/${slide.slug}`}
                    aria-label={`Read ${slide.title}`}
                    className="group relative block w-full max-w-md overflow-hidden rounded-2xl border border-gold/30 bg-surface shadow-2xl transition-transform duration-300 hover:-translate-y-1.5"
                  >
                    <div className="relative aspect-video w-full">
                      {slide.banner ? (
                        <Image
                          src={slide.banner}
                          alt={`${slide.title} cover`}
                          fill
                          priority={i === 0}
                          sizes="(max-width: 1024px) 90vw, 520px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="hero-pattern flex h-full w-full items-center justify-center bg-brand-deep">
                          <span className="font-display text-5xl font-extrabold text-gold/70">
                            {slide.title.trim().charAt(0).toUpperCase() || "H"}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                {/* Text */}
                <div className="order-2 flex flex-col items-start gap-4 lg:order-none">
                  {i === 0 ? (
                    <h1 className="ui-eyebrow text-gold">Pakistani Urdu Fiction Writer</h1>
                  ) : (
                    <span className="ui-eyebrow text-gold">Pakistani Urdu Fiction Writer</span>
                  )}

                  {i === 0 ? (
                    <h2 className="font-display text-4xl font-extrabold leading-[1.1] text-cream sm:text-5xl">
                      {slide.title}
                    </h2>
                  ) : (
                    <p className="font-display text-4xl font-extrabold leading-[1.1] text-cream sm:text-5xl">
                      {slide.title}
                    </p>
                  )}

                  <p className="font-display text-xl font-semibold text-gold">
                    Huma Qureshi
                  </p>

                  {slide.summary && (
                    <p className="line-clamp-5 max-w-xl text-sm leading-7 font-medium text-cream/85 sm:text-base sm:leading-8">
                      {slide.summary}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link
                      href={`/novel/${slide.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-gold px-7 py-3 text-sm font-bold text-gold transition-all duration-200 hover:bg-gold hover:text-brand-deep active:scale-95 sm:text-base"
                    >
                      View More
                    </Link>
                    {i === 0 && (
                      <Link
                        href="/novel"
                        className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-bold text-brand-deep shadow-md transition-all duration-200 hover:bg-gold-dark hover:text-cream active:scale-95 sm:text-base"
                      >
                        Explore My Novels
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Controls */}
        <div className="relative flex items-center justify-between gap-4 border-t border-cream/10 px-6 py-4 sm:px-10 lg:px-14">
          <dl className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "Novels", value: stats.novels },
              { label: "PDF Books", value: stats.pdfs },
              { label: "Genres", value: stats.genres },
            ].map((item) => (
              <div key={item.label} className="flex items-baseline gap-2">
                <dd className="font-display text-lg font-extrabold tabular-nums text-gold sm:text-xl">
                  {item.value.toLocaleString("en-GB")}
                </dd>
                <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-cream/60">
                  {item.label}
                </dt>
              </div>
            ))}
          </dl>

          {count > 1 && (
            <div className="flex items-center gap-3">
              {/* Dots */}
              <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
                {slides.slice(0, DOTS_LIMIT).map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Go to slide ${i + 1}: ${s.title}`}
                    onClick={() => goTo(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === index ? "w-6 bg-gold" : "w-2.5 bg-cream/30 hover:bg-cream/50"
                    }`}
                  />
                ))}
              </div>
              {/* Arrows */}
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => goTo(index - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/25 text-cream transition hover:border-gold hover:text-gold"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => goTo(index + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/25 text-cream transition hover:border-gold hover:text-gold"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

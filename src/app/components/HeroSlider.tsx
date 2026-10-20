"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroSlide = {
  id: string;
  title: string;
  writer: string;
  genre: string;
  summary: string;
  href: string;
  banner: string;
};

const AUTOPLAY_MS = 6000;

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return;
      setIndex(((i % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || count <= 1) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count]);

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured novels"
      className="relative overflow-hidden rounded-3xl bg-brand-deep shadow-2xl ring-1 ring-gold/20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative h-[520px] sm:h-[560px] lg:h-[620px]">
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={slide.id}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
              }`}
            >
              {slide.banner && (
                <Image
                  src={slide.banner}
                  alt=""
                  fill
                  priority={index === 0 && i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              )}
              <div aria-hidden="true" className="absolute inset-0 bg-brand-deep/60" />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-brand-deep via-brand-deep/75 to-brand-deep/15"
              />

              <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6 sm:px-10 lg:px-14">
                <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-14">
                  <div
                    className={`hidden justify-center transition-all duration-700 lg:flex ${
                      index === 0 ? "translate-y-0 opacity-100" : ""
                    }`}
                    aria-hidden="true"
                  >
                    {slide.banner && (
                      <div className="relative aspect-video w-full max-w-[380px] overflow-hidden rounded-2xl border border-gold/30 bg-black/20 shadow-2xl ring-1 ring-black/20">
                        <Image
                          src={slide.banner}
                          alt={`${slide.title} cover`}
                          fill
                          sizes="(max-width: 1024px) 90vw, 380px"
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-4 text-left">
                    {slide.genre && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                        {slide.genre}
                      </span>
                    )}

                    <h2 className="font-display text-3xl font-extrabold leading-[1.1] text-cream sm:text-4xl lg:text-5xl">
                      {slide.title}
                    </h2>

                    {slide.writer && (
                      <p className="text-sm font-bold uppercase tracking-[0.14em] text-gold/90">
                        By {slide.writer}
                      </p>
                    )}

                    {slide.summary && (
                      <p className="max-w-xl text-sm leading-7 text-cream/85 line-clamp-4 sm:text-base">
                        {slide.summary}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 pt-1">
                      <Link
                        href={`/novel/${slide.href}` as Route}
                        className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-brand-deep shadow-md transition-all duration-200 hover:bg-gold-dark hover:text-cream active:scale-95 sm:text-base"
                      >
                        Read Novel &rarr;
                      </Link>
                      <Link
                        href="/novel"
                        className="inline-flex items-center gap-2 rounded-full border-2 border-cream/25 px-6 py-3 text-sm font-bold text-cream transition-all duration-200 hover:border-gold hover:text-gold active:scale-95 sm:text-base"
                      >
                        All Novels
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cream/25 bg-brand-deep/60 text-lg text-cream backdrop-blur transition-colors hover:border-gold hover:text-gold"
            >
              &lsaquo;
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cream/25 bg-brand-deep/60 text-lg text-cream backdrop-blur transition-colors hover:border-gold hover:text-gold"
            >
              &rsaquo;
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index ? "w-7 bg-gold" : "w-2.5 bg-cream/50 hover:bg-cream/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Heading from "@/app/components/Heading";

type SneakPeek = {
  _key?: string;
  imageUrl?: string;
  scene?: string;
  sceneIsUrdu?: boolean;
  caption?: string;
  chapterReference?: string;
  order?: number;
};

export default function SneakPeeks({ peeks }: { peeks?: SneakPeek[] }) {
  const valid = (peeks || [])
    .filter((p) => p && (p.imageUrl || (p.scene && p.scene.trim() !== "")))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const count = valid.length;

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % count)),
    [count]
  );
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + count) % count)),
    [count]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, next, prev]);

  if (count === 0) return null;

  const active = openIndex !== null ? valid[openIndex] : null;

  return (
    <section aria-labelledby="sneak-peeks-heading" className="py-2">
      <Heading name="Sneak Peeks" />
      <div className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-20">
        {valid.map((peek, index) => (
          <button
            key={peek._key || index}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-cream-soft text-start shadow-md transition-all duration-300 hover:border-brand hover:shadow-xl active:scale-[0.98]"
            aria-label={`Open preview ${index + 1}${peek.caption ? `: ${peek.caption}` : ""}`}
          >
            {peek.imageUrl ? (
              <Image
                src={peek.imageUrl as string}
                alt={peek.caption || `Sneak peek ${index + 1}`}
                width={600}
                height={800}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-24 w-full items-center justify-center bg-gradient-to-br from-brand-deep to-brand text-3xl text-gold/80"
              >
                ❝
              </span>
            )}

            {peek.scene && (
              <span
                dir={peek.sceneIsUrdu ? "rtl" : undefined}
                className={`line-clamp-4 px-4 pt-3 text-start text-sm leading-6 text-tertiary ${
                  peek.sceneIsUrdu ? "font-urdu" : ""
                }`}
              >
                {peek.scene}
              </span>
            )}

            {(peek.caption || peek.chapterReference) && (
              <span className="mt-auto block w-full bg-brand-deep/95 p-3 text-start text-xs font-semibold text-cream">
                {peek.caption}
                {peek.chapterReference ? ` — ${peek.chapterReference}` : ""}
              </span>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sneak peek preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close preview"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
          >
            &times;
          </button>
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous preview"
              className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            >
              &#8249;
            </button>
          )}
          <figure
            className="flex max-h-[90vh] max-w-3xl flex-col items-center gap-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {active.imageUrl && (
              <Image
                src={active.imageUrl as string}
                alt={active.caption || "Sneak peek"}
                width={1200}
                height={1600}
                className="mx-auto max-h-[70vh] w-auto rounded-xl object-contain"
              />
            )}
            {active.scene && (
              <p
                dir={active.sceneIsUrdu ? "rtl" : undefined}
                className={`max-w-2xl text-base leading-8 text-white/90 ${
                  active.sceneIsUrdu ? "font-urdu text-right" : "text-center"
                }`}
              >
                {active.scene}
              </p>
            )}
            {(active.caption || active.chapterReference) && (
              <figcaption className="text-center text-sm text-white/70">
                {active.caption}
                {active.chapterReference ? ` — ${active.chapterReference}` : ""}
              </figcaption>
            )}
          </figure>
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next preview"
              className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </section>
  );
}

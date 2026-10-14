"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function PDF({
  href,
  novelName,
  writer,
  genre,
  cardBanner,
  date,
  summary,
  format,
  size,
}: {
  href: string;
  novelName: string;
  writer: string;
  genre: string;
  cardBanner: string;
  date: string;
  summary?: string;
  format?: string;
  size?: string;
}) {
  const blockCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  return (
    <article
      onCopy={blockCopy}
      onCut={blockCopy}
      className="group relative flex w-full max-w-[260px] flex-col items-center gap-3 rounded-2xl border-2 border-line bg-surface px-4 py-5 text-tertiary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-[0_0_24px_rgba(30,93,80,0.35)] active:scale-[1.03]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-brand/0 transition-all duration-300 group-hover:bg-brand/5" />
      {/* Full-card click target (kept separate so genre can stay clickable) */}
      <Link
        href={`/pdf/${href}`}
        aria-label={`View details for ${novelName}`}
        className="absolute inset-0 z-10 rounded-2xl"
      />

      {cardBanner ? (
        <div className="relative h-[112px] w-[200px] self-center overflow-hidden rounded-lg">
          <Image
            alt={`${novelName} cover`}
            width={320}
            height={180}
            src={cardBanner}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <span className="absolute left-1.5 top-1.5 z-20 rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-deep shadow">
            PDF
          </span>
        </div>
      ) : null}

      <div className="flex w-full flex-col items-center gap-2.5">
        {date && (
          <p className="w-full px-4 text-right text-[11px] opacity-60">{date}</p>
        )}
        <h3 className="title-bright text-balance px-3 text-center text-lg font-extrabold leading-snug">
          {novelName}
        </h3>
        {summary && (
          <div className="flex w-full flex-col gap-1 px-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gold-dark">
              Summary
            </p>
            <p className="line-clamp-4 overflow-hidden text-start text-xs leading-5 text-tertiary">
              {summary}
            </p>
          </div>
        )}
        <div className="flex w-full flex-col gap-1 px-5 text-sm">
          {writer && (
            <p>
              <span className="font-bold text-gold-dark">Writer : </span>
              <span className="text-tertiary">{writer}</span>
            </p>
          )}
          {genre && (
            <p className="flex items-center gap-1">
              <span className="font-bold text-gold-dark">Genre : </span>
              <Link
                href={`/pdf?genre=${encodeURIComponent(genre)}`}
                className="relative z-20 rounded-full text-tertiary transition-colors hover:text-brand hover:underline"
              >
                {genre}
              </Link>
            </p>
          )}
        </div>
        <span className="mt-1 rounded-full bg-brand px-5 py-2 text-sm font-bold text-white transition-all duration-300 group-hover:bg-brand-dark group-hover:shadow-[0_0_14px_rgba(30,93,80,0.5)]">
          View Details
        </span>
        {(format || size) && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wide text-gold-dark">
            {format && (
              <span className="rounded-full border border-line bg-cream-soft px-2.5 py-0.5">
                {format}
              </span>
            )}
            {size && (
              <span className="rounded-full border border-line bg-cream-soft px-2.5 py-0.5">
                {size}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

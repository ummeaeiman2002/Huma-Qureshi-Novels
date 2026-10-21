"use client";

import Image from "next/image";
import Link from "next/link";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline gap-2">
      <dt className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-dark">
        {label}
      </dt>
      <span aria-hidden="true" className="h-px min-w-3 flex-1 bg-line" />
      <dd className="max-w-[62%] truncate text-right text-xs font-semibold text-brand">{value}</dd>
    </div>
  );
}

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
  language,
  pages,
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
  language?: string;
  pages?: number;
}) {
  const summaryText = (summary || "").trim();

  return (
    <article className="group relative flex w-full max-w-[260px] flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_2px_12px_rgba(41,40,36,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[0_22px_44px_-22px_rgba(164,135,80,0.6)] active:scale-[0.99]">
      {/* Full-card click target (kept separate so the genre value can stay clickable) */}
      <Link
        href={`/pdf/${href}`}
        aria-label={`View details for ${novelName}`}
        className="absolute inset-0 z-10 rounded-3xl"
      />

      {cardBanner ? (
        <div className="relative aspect-[5/6] w-full overflow-hidden">
          <Image
            alt={`${novelName} cover`}
            fill
            sizes="(max-width: 640px) 90vw, 260px"
            src={cardBanner}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-brand-deep/85 via-brand-deep/5 to-transparent"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
          />
          <span className="absolute left-3 top-3 z-20 rounded-full border border-gold/40 bg-brand-deep/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold backdrop-blur-sm">
            PDF
          </span>
          {date && (
            <span className="absolute right-3 top-3 rounded-full border border-cream/25 bg-brand-deep/75 px-2.5 py-1 text-[10px] font-bold tracking-[0.06em] text-cream backdrop-blur-sm">
              {date}
            </span>
          )}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3.5">
        {!cardBanner && date && (
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
            {date}
          </span>
        )}

        <h3 className="font-display text-lg font-extrabold leading-snug text-balance text-brand transition-colors duration-300 group-hover:text-gold-dark">
          {novelName}
        </h3>

        {/* Summary — real synopsis only, nothing fabricated */}
        {summaryText && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-dark">
              Summary
            </p>
            <p className="line-clamp-4 text-xs leading-5 text-ink/80">{summaryText}</p>
          </div>
        )}

        {/* Details */}
        <dl className="flex flex-col gap-1.5 border-t border-line pt-2.5">
          <DetailRow label="Writer" value={writer} />
          {typeof pages === "number" && pages > 0 && (
            <DetailRow
              label="Pages"
              value={`${pages} ${pages === 1 ? "page" : "pages"}`}
            />
          )}
          {language && <DetailRow label="Language" value={language} />}
          <DetailRow
            label="Genre"
            value={
              genre ? (
                <Link
                  href={`/novel?genre=${encodeURIComponent(genre)}`}
                  className="relative z-20 rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[11px] font-bold text-gold-dark transition-colors hover:border-gold/60 hover:bg-gold/20"
                >
                  {genre}
                </Link>
              ) : (
                ""
              )
            }
          />
          <DetailRow label="Format" value={format} />
          <DetailRow label="Size" value={size} />
        </dl>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="rounded-full bg-brand px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 group-hover:bg-brand-dark">
            View Details
          </span>
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-brand-deep"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}

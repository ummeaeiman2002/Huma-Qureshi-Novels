import React from "react";
import Link from "next/link";
import type { Route } from "next";

function pageWindow(current: number, total: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  const add = (p: number | "ellipsis") => pages.push(p);

  if (total <= 7) {
    for (let i = 1; i <= total; i += 1) add(i);
    return pages;
  }

  add(1);
  if (current > 3) add("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i += 1) add(i);

  if (current < total - 2) add("ellipsis");
  add(total);

  return pages;
}

export default function Pagination({
  current,
  total,
  basePath,
  params = {},
  className = "",
}: {
  current: number;
  total: number;
  basePath: string;
  params?: Record<string, string>;
  className?: string;
}) {
  if (total <= 1) return null;

  const hrefFor = (page: number): Route => {
    const sp = new URLSearchParams(params);
    if (page > 1) sp.set("page", String(page));
    const qs = sp.toString();
    return (qs ? `${basePath}?${qs}` : basePath) as Route;
  };

  const pages = pageWindow(current, total);
  const linkBase =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-line bg-surface px-3 text-sm font-bold text-brand transition-all hover:border-brand hover:bg-brand hover:text-cream";
  const disabled = "pointer-events-none opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-2 pt-2 ${className}`}
    >
      <Link
        href={hrefFor(Math.max(1, current - 1))}
        aria-label="Previous page"
        aria-disabled={current === 1}
        className={`${linkBase} ${current === 1 ? disabled : ""}`}
      >
        ← Prev
      </Link>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span
            key={`e-${i}`}
            aria-hidden="true"
            className="px-1 text-sm font-bold text-muted"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-label={`Page ${p}`}
            aria-current={p === current ? "page" : undefined}
            className={`${linkBase} ${
              p === current
                ? "border-brand bg-brand text-cream shadow-md"
                : ""
            }`}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={hrefFor(Math.min(total, current + 1))}
        aria-label="Next page"
        aria-disabled={current === total}
        className={`${linkBase} ${current === total ? disabled : ""}`}
      >
        Next →
      </Link>
    </nav>
  );
}

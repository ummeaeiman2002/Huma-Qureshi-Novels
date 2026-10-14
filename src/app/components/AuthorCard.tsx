import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

export default function AuthorCard({
  name,
  bio,
  count,
  countLabel = "Novels",
  image,
  href = "/about" as Route,
  ctaLabel = "View Author",
}: {
  name: string;
  bio?: string;
  count?: number;
  countLabel?: string;
  image?: string;
  href?: Route;
  ctaLabel?: string;
}) {
  return (
    <div className="ui-card flex flex-col gap-4 p-5">
      <p className="ui-eyebrow">Featured Author</p>
      <div className="flex items-center gap-3">
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-line bg-cream-soft">
          {image ? (
            <Image src={image} alt={name} fill sizes="56px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xl font-extrabold text-brand">
              {name.charAt(0)}
            </span>
          )}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-extrabold text-brand">{name}</span>
          {typeof count === "number" && (
            <span className="text-xs font-semibold text-muted">
              {count.toLocaleString()} {countLabel}
            </span>
          )}
        </div>
      </div>
      {bio && (
        <p className="line-clamp-3 text-sm leading-6 text-muted">{bio}</p>
      )}
      <Link
        href={href}
        className="inline-flex w-fit items-center gap-1 text-sm font-bold text-gold-dark hover:text-brand hover:underline"
      >
        {ctaLabel} →
      </Link>
    </div>
  );
}

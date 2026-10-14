import React from "react";
import Link from "next/link";
import type { Route } from "next";

export default function PopularTags({
  tags,
  basePath = "/novel",
  paramKey = "genre",
  title = "Popular Tags",
}: {
  tags?: string[];
  basePath?: string;
  paramKey?: string;
  title?: string;
}) {
  const list = (tags || []).filter(Boolean);
  if (list.length === 0) return null;

  return (
    <div className="ui-card flex flex-col gap-3 p-5">
      <p className="ui-eyebrow">{title}</p>
      <ul className="flex flex-wrap gap-2">
        {list.map((tag) => (
          <li key={tag}>
            <Link
              href={
                `${basePath}?${paramKey}=${encodeURIComponent(tag)}` as Route
              }
              className="inline-flex items-center rounded-full border border-line bg-cream-soft px-3 py-1.5 text-xs font-semibold text-brand transition-all hover:border-brand hover:bg-brand hover:text-cream"
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

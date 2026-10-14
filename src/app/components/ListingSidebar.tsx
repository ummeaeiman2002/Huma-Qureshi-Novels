"use client";

import React from "react";
import PopularTags from "./PopularTags";
import AuthorCard from "./AuthorCard";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";

export const SITE_AUTHOR = {
  name: "Huma Qureshi",
  bio: "A Pakistani Urdu writer known for heartfelt novels, strong characters and stories centred on romance, women-centric narratives and social drama.",
};

/**
 * Reusable desktop sidebar: useful navigation (tags + featured author).
 * Hidden on mobile where the primary content already fills the column.
 */
export default function ListingSidebar({
  tags,
  tagsBasePath = "/novel",
  authorCount,
  authorCountLabel = "Novels",
}: {
  tags?: string[];
  tagsBasePath?: string;
  authorCount?: number;
  authorCountLabel?: string;
}) {
  const { authorImage } = useSiteSettings();
  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-6 lg:sticky lg:top-24 lg:self-start">
      <PopularTags tags={tags} basePath={tagsBasePath} />
      <AuthorCard
        name={SITE_AUTHOR.name}
        bio={SITE_AUTHOR.bio}
        image={authorImage}
        count={authorCount}
        countLabel={authorCountLabel}
        href="/about"
        ctaLabel="View Author"
      />
    </aside>
  );
}

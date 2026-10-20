import NovelPageClient from "./NovelPageClient";
import { getAllNovels, getAllPDFs, getAllMetadata } from "@/lib/sanity/queries";
import type { Metadata } from "next";
import { Suspense } from "react";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { DEFAULT_SITE_IMAGES } from "@/lib/siteDefaults";

const TITLE = "All Urdu Novels by Huma Qureshi";
const DESCRIPTION =
  "Discover original Urdu fiction by Huma Qureshi. Explore novels across different genres, discover new stories, and continue reading your favourite characters and episodes.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/novel') },
  openGraph: {
    type: "website",
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: absoluteUrl('/novel'),
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_SITE_IMAGES.defaultBanner, alt: `${TITLE} — ${SITE_NAME}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    images: [DEFAULT_SITE_IMAGES.defaultBanner],
  },
};

export default async function Page() {
  const [novels, pdfs, meta] = await Promise.all([
    getAllNovels(),
    getAllPDFs(),
    getAllMetadata(),
  ]);

  const all = [...novels, ...pdfs].sort(
    (a, b) =>
      new Date(b.date || b._createdAt).getTime() -
      new Date(a.date || a._createdAt).getTime()
  );

  return (
    <div>
      <Suspense fallback={null}>
        <NovelPageClient initialNovels={all} genres={meta.genres} />
      </Suspense>
    </div>
  );
}

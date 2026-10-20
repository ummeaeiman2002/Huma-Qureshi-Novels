import NovelPageClient from './NovelPageClient';
import { getAllNovels, getAllPDFs, getAllMetadata } from '@/lib/sanity/queries';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';
import { DEFAULT_SITE_IMAGES } from '@/lib/siteDefaults';

const TITLE = "All Urdu Novels";
const DESCRIPTION =
  "Browse all Urdu novels by Huma Qureshi in one place — read episodic novels online free and download complete PDF books.";

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
    (a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
  );

  return (
    <div>
      <Suspense fallback={null}>
        <NovelPageClient
          initialNovels={all}
          writers={meta.writers}
          genres={meta.genres}
          totalNovelCount={all.length}
        />
      </Suspense>
    </div>
  );
}

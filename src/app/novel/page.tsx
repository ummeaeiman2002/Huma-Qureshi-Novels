import NovelPageClient from './NovelPageClient';
import { getPaginatedNovels, getAllMetadata, getTotalNovelCount, prefetchPages } from '@/lib/sanity/queries';
import type { Metadata } from 'next';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: `All Episodic Novels`,
  description: `Browse and read all episodic Urdu novels by Huma Qureshi and other writers on ${SITE_NAME}.`,
  alternates: { canonical: absoluteUrl('/novel') },
};

// Static generation with revalidation for cost optimization
export const revalidate = 300; // 5 minutes

export default async function Page() {
  // Fetch initial data for first page
  const initialNovels = await getPaginatedNovels(0, 20);
  const { writers, genres } = await getAllMetadata();
  const totalNovelCount = await getTotalNovelCount();

  // Prefetch next few pages in the background
  void prefetchPages(1, 2).catch(() => {}); // Prefetch pages 1 and 2

  return (
    <div>
    <NovelPageClient
      initialNovels={initialNovels}
      writers={writers}
      genres={genres}
      totalNovelCount={totalNovelCount}
      />
      </div>
  );
}

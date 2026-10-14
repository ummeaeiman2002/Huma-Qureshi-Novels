import NovelPageClient from './NovelPageClient';
import { getPaginatedNovels, getAllMetadata, getTotalNovelCount, prefetchPages, getNovelsByCategory } from '@/lib/sanity/queries';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Urdu Novels`,
  description: `Browse and read all episodic Urdu novels by Huma Qureshi. Filter by genre and author, read online, or download complete PDFs.`,
  alternates: { canonical: absoluteUrl('/novel') },
};

const PAGE_SIZE = 20;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const categorySlug = typeof sp?.category === 'string' ? sp.category : '';
  const parsed = Number.parseInt(sp?.page || '1', 10);
  const currentPage = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  const pageIndex = currentPage - 1;

  // When arriving from a category link (?category=...), show that category's novels.
  const { initialNovels, totalNovelCount, totalPages } = categorySlug
    ? await (async () => {
        const novels = await getNovelsByCategory(categorySlug);
        return { initialNovels: novels, totalNovelCount: novels.length, totalPages: 1 };
      })()
    : await (async () => {
        const novels = await getPaginatedNovels(pageIndex, PAGE_SIZE);
        const count = await getTotalNovelCount();
        const pages = Math.max(1, Math.ceil((count || 0) / PAGE_SIZE));
        if (pageIndex + 1 < pages) {
          void prefetchPages(pageIndex + 1, 1).catch(() => {});
        }
        return { initialNovels: novels, totalNovelCount: count, totalPages: pages };
      })();

  const { writers, genres } = await getAllMetadata();

  return (
    <div>
      <Suspense fallback={null}>
        <NovelPageClient
          initialNovels={initialNovels}
          writers={writers}
          genres={genres}
          totalNovelCount={totalNovelCount}
          currentPage={Math.min(currentPage, totalPages)}
          totalPages={totalPages}
        />
      </Suspense>
    </div>
  );
}

import PDFPageClient from './PDFPageClient';
import { getPaginatedPDFs, getAllMetadata, getTotalPDFCount, prefetchPDFPages } from '@/lib/sanity/queries';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Urdu Novels PDF`,
  description: `Download and read complete Urdu novel PDFs by Huma Qureshi — read offline on any phone, tablet or computer, completely free.`,
  alternates: { canonical: absoluteUrl('/pdf') },
};

const PAGE_SIZE = 20;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const parsed = Number.parseInt(sp?.page || '1', 10);
  const currentPage = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  const pageIndex = currentPage - 1;

  const initialPDFs = await getPaginatedPDFs(pageIndex, PAGE_SIZE);
  const { writers, genres } = await getAllMetadata();
  const totalPDFCount = await getTotalPDFCount();
  const totalPages = Math.max(1, Math.ceil((totalPDFCount || 0) / PAGE_SIZE));

  if (pageIndex + 1 < totalPages) {
    void prefetchPDFPages(pageIndex + 1, 1).catch(() => {});
  }

  return (
    <div>
      <Suspense fallback={null}>
        <PDFPageClient
          initialPDFs={initialPDFs}
          writers={writers}
          genres={genres}
          totalPDFCount={totalPDFCount}
          currentPage={Math.min(currentPage, totalPages)}
          totalPages={totalPages}
        />
      </Suspense>
    </div>
  );
}

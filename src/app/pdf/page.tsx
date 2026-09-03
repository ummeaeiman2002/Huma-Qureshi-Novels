import PDFPageClient from './PDFPageClient';
import { getPaginatedPDFs, getAllMetadata, getTotalPDFCount, prefetchPDFPages } from '@/lib/sanity/queries';
import type { Metadata } from 'next';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: `PDF Library`,
  description: `Download and read complete Urdu novel PDFs by Huma Qureshi and other writers from the ${SITE_NAME} PDF library.`,
  alternates: { canonical: absoluteUrl('/pdf') },
};

// Static generation with revalidation for cost optimization
export const revalidate = 300; // 5 minutes

export default async function Page() {
  // Fetch initial data for first page
  const initialPDFs = await getPaginatedPDFs(0, 20);
  const { writers, genres } = await getAllMetadata();
  const totalPDFCount = await getTotalPDFCount();

  // Prefetch next few pages in the background
  void prefetchPDFPages(1, 2).catch(() => {}); // Prefetch pages 1 and 2

  return (
    <div>
    <PDFPageClient
      initialPDFs={initialPDFs}
      writers={writers}
      genres={genres}
      totalPDFCount={totalPDFCount}
      />
      </div>
  );
}

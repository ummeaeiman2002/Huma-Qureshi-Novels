import ShortStoriesClient from './ShortStoriesClient';
import { getShortStories, getAllMetadata } from '@/lib/sanity/queries';
import type { Metadata } from 'next';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Short Stories`,
  description: `Browse and read all short stories by Huma Qureshi on ${SITE_NAME}. Short Urdu stories, afsanas and quick reads.`,
  alternates: { canonical: absoluteUrl('/short-stories') },
};

export const revalidate = 300;

export default async function Page() {
  const shortStories = await getShortStories();
  const { writers, genres } = await getAllMetadata();

  return (
    <div>
      <ShortStoriesClient
        initialStories={shortStories || []}
        writers={writers}
        genres={genres}
      />
    </div>
  );
}

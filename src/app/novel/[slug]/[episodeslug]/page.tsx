import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import EpisodePageClient from "./EpisodePageClient";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string; episodeslug: string }> };

async function getEpisode(slug: string, episodeslug: string) {
  const data = await client.fetch<any>(`*[_type == "novel" && episodeslug.current == $episodeSlug && novelparent->slug.current == $slug && (!defined(episodereleasedate) || episodereleasedate <= now())][0]{name,episodeslug,_id,body,views,novelparent->{title,slug,banner,"totalEpisodes": count(*[_type == "novel" && novelparent._ref == ^._id])},genre->{genrename,_id},writer->{writername,_id},episodereleasedate,tags,comment[]->{name,_id,comment,_createdAt}}`, { slug, episodeSlug: episodeslug }, { next: { revalidate: 300 } });
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, episodeslug } = await params;
  const episode = await getEpisode(slug, episodeslug);
  if (!episode) return { title: `Episode not found | ${SITE_NAME}` };
  const title = `${episode.novelparent?.title} — ${episode.name}`;
  const description = `Read ${episode.name} of ${episode.novelparent?.title} by ${episode.writer?.writername || "the author"} on ${SITE_NAME}.`;
  return { title, description, alternates: { canonical: absoluteUrl(`/novel/${slug}/${episodeslug}`) }, openGraph: { title, description, url: absoluteUrl(`/novel/${slug}/${episodeslug}`), type: "article", images: episode.novelparent?.banner ? [{ url: episode.novelparent.banner, alt: `${episode.novelparent.title} banner` }] : [] }, robots: { index: true, follow: true } };
}

export default async function Page({ params }: Props) {
  const { slug, episodeslug } = await params;
  const episode = await getEpisode(slug, episodeslug);
  if (!episode) notFound();
  const schema = { "@context": "https://schema.org", "@type": "Chapter", headline: episode.name, isPartOf: { "@type": "Book", name: episode.novelparent?.title }, author: episode.writer?.writername ? { "@type": "Person", name: episode.writer.writername } : undefined, datePublished: episode.episodereleasedate, image: episode.novelparent?.banner, url: absoluteUrl(`/novel/${slug}/${episodeslug}`) };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><EpisodePageClient episode={episode} initialComments={episode.comment || []} /></>;
}

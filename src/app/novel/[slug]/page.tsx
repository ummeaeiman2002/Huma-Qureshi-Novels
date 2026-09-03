import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { absoluteUrl, cleanDescription, cleanDescriptionLong, SITE_NAME } from "@/lib/seo";
import NovelPageClient from "./NovelPageClient";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

async function getNovel(slug: string) {
  const query = `*[_type == "novelparent" && slug.current == $slug][0]{_id,title,slug,noveldescription,novelreleasedate,descriptionlanguage,writer->{writername,_id},genre->{genrename,_id},authornote,authornotelang,banner,tags,pdfurl,youtubeurl,comment[]->{name,_id,comment,_createdAt}}`;
  return client.fetch<any>(query, { slug }, { next: { revalidate: 300 } });
}

async function getEpisodes(id: string) {
  return client.fetch<any[]>(`*[_type == "novel" && references($id) && defined(episodereleasedate) && episodereleasedate <= now()] | order(_createdAt asc)[0...4] {name,episodeslug,_id,episodeteaser,episodereleasedate}`, { id }, { next: { revalidate: 300 } });
}

async function getNovelViews(id: string) {
  const views = await client.fetch<number[]>(`*[_type == "novel" && references($id)].views`, { id }, { next: { revalidate: 300 } });
  return (views || []).reduce((a: number, v: number) => a + (Number(v) || 0), 0);
}

async function getRelatedNovels(novel: any, id: string) {
  const currentGenre = novel.genre?._id || "";
  const currentWriter = novel.writer?._id || "";
  return client.fetch<any[]>(
    `*[_type == "novelparent" && _id != $id && defined(novelreleasedate) && novelreleasedate <= now() && (genre->_id == $genre || writer->_id == $writer)][0...4] { _id, title, banner, slug, novelreleasedate, noveldescription, genre->{genrename}, writer->{writername} }`,
    { id, genre: currentGenre, writer: currentWriter },
    { next: { revalidate: 300 } }
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const novel = await getNovel(slug);
  if (!novel) return { title: "Novel not found | Huma Qureshi Novels" };
  const description = cleanDescription(novel.noveldescription, `Read ${novel.title} by ${novel.writer?.writername || "the author"} on ${SITE_NAME}.`);
  const url = absoluteUrl(`/novel/${novel.slug?.current || slug}`);
  return { title: `${novel.title} by ${novel.writer?.writername || "Author"}`, description, alternates: { canonical: url }, openGraph: { title: novel.title, description, url, type: "article", images: novel.banner ? [{ url: novel.banner, alt: `${novel.title} cover` }] : [] }, robots: { index: true, follow: true } };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const novel = await getNovel(slug);
  if (!novel) notFound();
  const episodes = await getEpisodes(novel._id);
  const views = await getNovelViews(novel._id);
  const related = await getRelatedNovels(novel, novel._id);
  const schema = { "@context": "https://schema.org", "@type": "Book", name: novel.title, author: novel.writer?.writername ? { "@type": "Person", name: novel.writer.writername } : undefined, genre: novel.genre?.genrename, image: novel.banner, description: cleanDescription(novel.noveldescription, `Read ${novel.title} on ${SITE_NAME}.`), url: absoluteUrl(`/novel/${novel.slug?.current || slug}`) };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><NovelPageClient novel={novel} episodes={episodes} hasMore={episodes.length === 4} slug={slug} views={views} related={related} /></>;
}

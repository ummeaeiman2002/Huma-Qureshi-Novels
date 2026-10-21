import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { getNovelsByWriter, getTestimonials } from "@/lib/sanity/queries";
import { absoluteUrl, cleanDescription, SITE_NAME } from "@/lib/seo";
import NovelPageClient from "./NovelPageClient";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ReviewMarquee from "@/app/components/ReviewMarquee";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

async function getNovel(slug: string) {
  const query = `*[_type == "novelparent" && slug.current == $slug && writer->writername == "Huma Qureshi"][0]{
    _id,title,englishtitle,tagline,slug,novelreleasedate,lastupdated,
    noveldescription,shortdescription,aboutnovel,storyintro,descriptionlanguage,
    characterintro,"characters": characters[]{_key, name, role, description, "imageUrl": image.asset->url},
    readerhighlightintro,"readerhighlights": readerhighlights[]{_key, title, description},
    authornote,authornotelang,contentwarning,importantnote,
    "banner": coalesce(bannerImage.asset->url, banner),tags,themes,pdfurl,youtubeurl,
    language,novelstatus,
    numberofpages,numberofchapters,fileformat,filesize,readingavailability,
    featured,trending,
    enableonlinereading,onlinereadingintro,
    downloadfile{asset->{url,size,originalFilename,extension}},
    downloadtitle,downloaddescription,downloadformat,downloadsize,externaldownloadurl,downloadbuttonlabel,
    "sneakPeeks": sneakPeeks[]{_key, "imageUrl": image.asset->url, scene, sceneIsUrdu, caption, chapterReference, order},
    genre->{genrename,_id},
    additionalgenres[]->{genrename,_id},
    writer->{writername,_id,writerslug,writerbio,writerbiofull,writercardimageurl,"writerimage":writerimage.asset->url,sociallinks[]{_key,label,url}},
    relatednovels[]->{_id,title,"banner": coalesce(bannerImage.asset->url, banner),slug,novelreleasedate,noveldescription,shortdescription,genre->{genrename},writer->{writername}},
    relatedstories[]->{_id,title,"banner": coalesce(bannerImage.asset->url, banner),slug,novelreleasedate,noveldescription,shortdescription,genre->{genrename},writer->{writername}},
    "comment": *[_type == "comment" && references(^._id) && approved != false] | order(_createdAt asc){name,_id,comment,_createdAt}
  }`;
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
    `*[_type == "novelparent" && _id != $id && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi" && (genre->_id == $genre || writer->_id == $writer)][0...4] { _id, title, "banner": coalesce(bannerImage.asset->url, banner), slug, novelreleasedate, noveldescription, shortdescription, genre->{genrename}, writer->{writername} }`,
    { id, genre: currentGenre, writer: currentWriter },
    { next: { revalidate: 300 } }
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const novel = await getNovel(slug);
  if (!novel) return { title: "Novel not found | Huma Qureshi Novels", robots: { index: false, follow: true } };
  const description =
    novel.seodescription ||
    cleanDescription(novel.noveldescription, `Read ${novel.title} by ${novel.writer?.writername || "the author"} on ${SITE_NAME}.`);
  const url = absoluteUrl(`/novel/${novel.slug?.current || slug}`);
  const episodeCount = await client.fetch<number>(
    `count(*[_type == "novel" && references($id) && (!defined(episodereleasedate) || episodereleasedate <= now())])`,
    { id: novel._id }
  );
  const hasBody = Boolean(
    novel.noveldescription || novel.aboutnovel || novel.storyintro || novel.tagline
  );
  const isThin = !hasBody && !episodeCount;
  return {
    title: novel.seotitle || `${novel.title} by ${novel.writer?.writername || "Author"}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: novel.title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      images: novel.banner
        ? [{ url: novel.banner, width: 1200, height: 630, alt: `${novel.title} cover` }]
        : [{ url: "/icon", width: 512, height: 512, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: novel.title,
      description,
      images: novel.banner ? [novel.banner] : ["/icon"],
    },
    robots: isThin ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const novel = await getNovel(slug);
  if (!novel) notFound();
  const episodes = await getEpisodes(novel._id);
  const views = await getNovelViews(novel._id);

  const manualRelated = (novel.relatednovels || []).concat(novel.relatedstories || []);
  const related = manualRelated.length > 0 ? manualRelated : await getRelatedNovels(novel, novel._id);

  const writerId = novel.writer?._id;
  const writerNovels = writerId ? await getNovelsByWriter(writerId, 12) : [];
  const moreFromAuthor = (writerNovels || [])
    .filter((n: any) => n && n._id !== novel._id && !n.isShortStory)
    .slice(0, 4);

  const testimonials = await getTestimonials(12);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: novel.title,
    alternateName: novel.englishtitle,
    author: novel.writer?.writername ? { "@type": "Person", name: novel.writer.writername } : undefined,
    genre: novel.genre?.genrename,
    image: novel.banner,
    description: cleanDescription(novel.noveldescription, `Read ${novel.title} on ${SITE_NAME}.`),
    url: absoluteUrl(`/novel/${novel.slug?.current || slug}`),
  };
  return (
    <main className="flex flex-col gap-6 py-5">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Novels", href: "/novel" }, { label: novel.title || "Novel" }]} />
      <NovelPageClient novel={novel} episodes={episodes} hasMore={episodes.length === 4} slug={slug} views={views} related={related} moreFromAuthor={moreFromAuthor} reviewsSlot={<ReviewMarquee reviews={testimonials} />} />
    </main>
  );
}

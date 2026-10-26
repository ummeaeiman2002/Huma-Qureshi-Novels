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
    _id,title,titleLocalized,englishtitle,tagline,slug,novelreleasedate,lastupdated,coverImageAlt,
    summary,storyIntroduction,contentFormat,fullStoryContent,storycontent,
    "episodes": episodes[]->{_id,name,episodeslug,episodeteaser,episodereleasedate},
    readingOrder,
    noveldescription,shortdescription,aboutnovel,storyintro,descriptionlanguage,
    characterintro,"characters": characters[]{_key, name, role, description, "imageUrl": image.asset->url},
    "mainCharacters": mainCharacters[]{_key, nameUr, nameEn, role, introductionUr, introductionEn, "imageUrl": image.asset->url, characterImageAlt},
    "sideCharacters": sideCharacters[]{_key, nameUr, nameEn, role, introductionUr, introductionEn, "imageUrl": image.asset->url, characterImageAlt},
    "tropesAndThemes": tropesAndThemes[]->{_id, labelUr, labelEn, order},
    readerHighlightsLocalized,
    readerhighlightintro,"readerhighlights": readerhighlights[]{_key, title, description},
    authorNote,authornote,authornotelang,contentwarning,importantNote,importantnote,
    sneakPeek,
    "banner": coalesce(bannerImage.asset->url, banner),tags,themes,pdfurl,youtubeurl,
    language,novelstatus,
    numberofpages,numberofchapters,fileformat,filesize,readingavailability,
    featured,trending,
    enableonlinereading,onlinereadingintro,
    pdfAvailability,edition,downloadInstructions,
    downloadfile{asset->{url,size,originalFilename,extension}},
    downloadtitle,downloaddescription,downloadformat,downloadsize,externaldownloadurl,downloadbuttonlabel,
    "sneakPeeks": sneakPeeks[]{_key, "imageUrl": image.asset->url, scene, sceneIsUrdu, caption, chapterReference, order},
    genre->{genrename,_id},
    additionalgenres[]->{genrename,_id},
    writer->{writername,_id,writerslug,writerbio,writerbiofull,writercardimageurl,"writerimage":writerimage.asset->url,sociallinks[]{_key,label,url}},
    "seoImage": seoImage.asset->url,noIndex,
    relatednovels[]->{_id,title,"banner": coalesce(bannerImage.asset->url, banner),slug,novelreleasedate,noveldescription,shortdescription,summary,seodescription,tagline,genre->{genrename},writer->{writername}},
    relatedstories[]->{_id,title,"banner": coalesce(bannerImage.asset->url, banner),slug,novelreleasedate,noveldescription,shortdescription,summary,seodescription,tagline,genre->{genrename},writer->{writername}},
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
    `*[_type == "novelparent" && _id != $id && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi" && (genre->_id == $genre || writer->_id == $writer)][0...4] { _id, title, "banner": coalesce(bannerImage.asset->url, banner), slug, novelreleasedate, noveldescription, shortdescription, summary, seodescription, tagline, genre->{genrename}, writer->{writername} }`,
    { id, genre: currentGenre, writer: currentWriter },
    { next: { revalidate: 300 } }
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const novel = await getNovel(slug);
  if (!novel) return { title: "Novel not found | Huma Qureshi Novels", robots: { index: false, follow: true } };
  const localizedTitle = novel.titleLocalized?.en || novel.titleLocalized?.ur || "";
  const localizedSummary = novel.summary?.en || novel.summary?.ur || "";
  const description =
    novel.seodescription ||
    cleanDescription(
      localizedSummary || novel.shortdescription || novel.noveldescription,
      `Read ${novel.title} by ${novel.writer?.writername || "the author"} on ${SITE_NAME}.`,
    );
  const url = absoluteUrl(`/novel/${novel.slug?.current || slug}`);
  const episodeCount = await client.fetch<number>(
    `count(*[_type == "novel" && references($id) && (!defined(episodereleasedate) || episodereleasedate <= now())])`,
    { id: novel._id }
  );
  const hasBody = Boolean(
    localizedSummary ||
      novel.storyIntroduction?.ur ||
      novel.storyIntroduction?.en ||
      (Array.isArray(novel.fullStoryContent) && novel.fullStoryContent.length > 0) ||
      (Array.isArray(novel.storycontent) && novel.storycontent.length > 0) ||
      novel.noveldescription ||
      novel.shortdescription ||
      novel.aboutnovel ||
      novel.storyintro ||
      novel.tagline ||
      novel.authorNote?.ur?.length ||
      novel.authorNote?.en?.length ||
      novel.sneakPeek?.ur?.length ||
      novel.sneakPeek?.en?.length ||
      (novel.mainCharacters && novel.mainCharacters.length > 0) ||
      (novel.sideCharacters && novel.sideCharacters.length > 0)
  );
  const isThin = !hasBody && !episodeCount;
  const socialImage = novel.seoImage || novel.banner;
  const ogTitle = localizedTitle || novel.title;
  return {
    title: novel.seotitle || `${novel.title} by ${novel.writer?.writername || "Author"}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      images: socialImage
        ? [{ url: socialImage, width: 1200, height: 630, alt: novel.coverImageAlt || `${novel.title} cover` }]
        : [{ url: "/icon", width: 512, height: 512, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: socialImage ? [socialImage] : ["/icon"],
    },
    robots: isThin || novel.noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const novel = await getNovel(slug);
  if (!novel) notFound();
  const now = Date.now();
  const selectedEpisodes = Array.isArray(novel.episodes)
    ? novel.episodes.filter(
        (episode: any) =>
          episode &&
          (!episode.episodereleasedate ||
            new Date(episode.episodereleasedate).getTime() <= now),
      )
    : [];
  const episodes =
    selectedEpisodes.length > 0 ? selectedEpisodes : await getEpisodes(novel._id);
  const hasMoreEpisodes = selectedEpisodes.length === 0 && episodes.length === 4;
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
    description: cleanDescription(
      novel.summary?.en || novel.summary?.ur || novel.shortdescription || novel.noveldescription,
      `Read ${novel.title} on ${SITE_NAME}.`,
    ),
    url: absoluteUrl(`/novel/${novel.slug?.current || slug}`),
  };
  return (
    <main className="flex flex-col gap-6 py-5">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Novels", href: "/novel" }, { label: novel.title || "Novel" }]} />
      <NovelPageClient novel={novel} episodes={episodes} hasMore={hasMoreEpisodes} slug={slug} views={views} related={related} moreFromAuthor={moreFromAuthor} reviewsSlot={<ReviewMarquee reviews={testimonials} />} />
    </main>
  );
}

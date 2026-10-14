import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { absoluteUrl, cleanDescription, SITE_NAME } from "@/lib/seo";
import { getTestimonials } from "@/lib/sanity/queries";
import NovelPageClient from "@/app/novel/[slug]/NovelPageClient";
import Heading from "@/app/components/Heading";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ReviewMarquee from "@/app/components/ReviewMarquee";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

async function getStory(slug: string) {
  const query = `*[_type == "novelparent" && slug.current == $slug && coalesce(isShortStory, false) == true && writer->writername == "Huma Qureshi"][0]{
    _id,title,englishtitle,tagline,slug,novelreleasedate,lastupdated,
    noveldescription,shortdescription,aboutnovel,storyintro,readingtime,storycontent,descriptionlanguage,
    characterintro,"characters": characters[]{_key, name, role, description, "imageUrl": image.asset->url},
    readerhighlightintro,"readerhighlights": readerhighlights[]{_key, title, description},
    authornote,authornotelang,contentwarning,importantnote,
    banner,tags,themes,pdfurl,youtubeurl,
    language,novelstatus,
    numberofpages,numberofchapters,fileformat,filesize,readingavailability,
    enableonlinereading,onlinereadingintro,
    downloadfile{asset->{url,size,originalFilename,extension}},
    downloadtitle,downloaddescription,downloadformat,downloadsize,externaldownloadurl,downloadbuttonlabel,
    "sneakPeeks": sneakPeeks[]{_key, "imageUrl": image.asset->url, scene, sceneIsUrdu, caption, chapterReference, order},
    genre->{genrename,_id},
    additionalgenres[]->{genrename,_id},
    writer->{writername,_id,writerslug,writerbio,writerbiofull,writercardimageurl,"writerimage":writerimage.asset->url,sociallinks[]{_key,label,url}},
    relatedstories[]->{_id,title,banner,slug,novelreleasedate,noveldescription,shortdescription,genre->{genrename},writer->{writername}},
    comment[]->{name,_id,comment,_createdAt}
  }`;
  return client.fetch<any>(query, { slug }, { next: { revalidate: 300 } });
}

async function getEpisodes(id: string) {
  return client.fetch<any[]>(
    `*[_type == "novel" && references($id) && defined(episodereleasedate) && episodereleasedate <= now()] | order(_createdAt asc)[0...4] {name,episodeslug,_id,episodeteaser,episodereleasedate}`,
    { id },
    { next: { revalidate: 300 } }
  );
}

async function getStoryViews(id: string) {
  const views = await client.fetch<number[]>(
    `*[_type == "novel" && references($id)].views`,
    { id },
    { next: { revalidate: 300 } }
  );
  return (views || []).reduce((a: number, v: number) => a + (Number(v) || 0), 0);
}

async function getRelatedStories(story: any, id: string) {
  const currentGenre = story.genre?._id || "";
  return client.fetch<any[]>(
    `*[_type == "novelparent" && _id != $id && coalesce(isShortStory, false) == true && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi" && (genre->_id == $genre || _type == "novelparent")][0...4] { _id, title, banner, slug, novelreleasedate, noveldescription, shortdescription, genre->{genrename}, writer->{writername} }`,
    { id, genre: currentGenre },
    { next: { revalidate: 300 } }
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return { title: "Short story not found | Huma Qureshi Novels" };
  const description = cleanDescription(
    story.noveldescription,
    `Read ${story.title}, a short Urdu story by ${story.writer?.writername || "the author"} on ${SITE_NAME}.`
  );
  // Canonical points to the primary novel URL to avoid duplicate-content issues.
  const url = absoluteUrl(`/novel/${story.slug?.current || slug}`);
  return {
    title: `${story.title} — Urdu Short Story`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: story.title,
      description,
      url,
      type: "article",
      images: story.banner ? [{ url: story.banner, alt: `${story.title} cover` }] : [],
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();
  const episodes = await getEpisodes(story._id);
  const views = await getStoryViews(story._id);
  const manualRelated = story.relatedstories || [];
  const related = manualRelated.length > 0 ? manualRelated : await getRelatedStories(story, story._id);
  const testimonials = await getTestimonials(12);

  return (
    <main className="flex flex-col gap-6 py-5">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Short Stories", href: "/short-stories" },
          { label: story.title || "Story" },
        ]}
      />
      <NovelPageClient
        novel={story}
        episodes={episodes}
        hasMore={episodes.length === 4}
        slug={slug}
        views={views}
        related={related}
        reviewsSlot={<ReviewMarquee reviews={testimonials} />}
        fullStory={
          story.storycontent ? (
            <section aria-labelledby="full-story-heading" className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Heading name="Read the Full Story" />
                {story.readingtime && (
                  <span className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-brand">
                    {story.readingtime}
                  </span>
                )}
              </div>
              <div
                dir={story.descriptionlanguage ? "rtl" : "ltr"}
                className={`mx-auto w-full max-w-3xl rounded-3xl border border-brand/30 bg-surface p-6 leading-8 text-tertiary lg:p-10 ${
                  story.descriptionlanguage ? "font-urdu" : "font-medium"
                }`}
              >
                <PortableText
                  value={story.storycontent}
                  components={{
                    block: {
                      h2: ({ children }: any) => (
                        <h2 className="mb-3 mt-6 text-2xl font-extrabold text-brand">{children}</h2>
                      ),
                      h3: ({ children }: any) => (
                        <h3 className="mb-2 mt-4 text-xl font-extrabold text-brand">{children}</h3>
                      ),
                      blockquote: ({ children }: any) => (
                        <blockquote className="my-4 border-l-4 border-gold pl-4 italic opacity-80">
                          {children}
                        </blockquote>
                      ),
                      normal: ({ children }: any) => <p className="mb-4 leading-8">{children}</p>,
                    },
                    list: {
                      bullet: ({ children }: any) => (
                        <ul className="mb-4 list-disc pl-6">{children}</ul>
                      ),
                      number: ({ children }: any) => (
                        <ol className="mb-4 list-decimal pl-6">{children}</ol>
                      ),
                    },
                  }}
                />
              </div>
            </section>
          ) : null
        }
      />

    </main>
  );
}

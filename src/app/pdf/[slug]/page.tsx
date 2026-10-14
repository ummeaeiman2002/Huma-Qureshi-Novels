import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { absoluteUrl, cleanDescription, SITE_NAME } from "@/lib/seo";
import Image from "next/image";
import Heading from "@/app/components/Heading";
import NovelDescription from "@/app/components/novelPage/NovelDescription";
import AuthorNote from "@/app/components/novelPage/AuthoNote";
import Tags from "@/app/components/novelPage/Tags";
import PDFComments from "./PDFComments";
import ViewsBadge from "@/app/components/ViewsBadge";
import RelatedContent from "@/app/components/RelatedContent";
import YouTubeSection from "@/app/components/YouTubeSection";
import BookmarkButton from "@/app/components/BookmarkButton";
import DownloadSection from "@/app/components/novelPage/DownloadSection";
import Characters from "@/app/components/novelPage/Characters";
import ReaderHighlights from "@/app/components/novelPage/ReaderHighlights";
import Themes from "@/app/components/novelPage/Themes";
import SneakPeeks from "@/app/components/novelPage/SneakPeeks";
import NovelDetails from "@/app/components/novelPage/NovelDetails";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ReviewMarquee from "@/app/components/ReviewMarquee";
import { getTestimonials } from "@/lib/sanity/queries";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

async function getPdf(slug: string) {
  const query = `*[_type == "pdf" && slug.current == $slug && writer->writername == "Huma Qureshi"][0]{title, englishtitle, slug, pdfdescription, pdfshortdescription, pdfreleasedate, descriptionlanguage, authornote, authornotelang, language, views, writer->{writername,_id}, genre->{genrename,_id}, banner, _id, tags, themes, characterintro, "characters": characters[]{_key, name, role, description, "imageUrl": image.asset->url}, readerhighlightintro, "readerhighlights": readerhighlights[]{_key, title, description}, "sneakPeeks": sneakPeeks[]{_key, "imageUrl": image.asset->url, scene, sceneIsUrdu, caption, chapterReference, order}, pdfurl, youtubeurl, downloadfile{asset->{url,size}}, downloadtitle, downloaddescription, downloadformat, downloadsize, pdfnumberofpages, externaldownloadurl, downloadbuttonlabel, seotitle, seodescription, comment[]->{name,_id,comment,_createdAt}}`;
  return client.fetch<any>(query, { slug }, { next: { revalidate: 300 } });
}

async function getRelatedPdfData(pdf: any) {
  const genreName = pdf?.genre?.genrename || "";
  const writerRef = pdf?.writer?._id || "";
  const relatedQuery = `{
    "relatedPDFs": *[_type == "pdf" && defined(slug.current) && _id != $currentId && genre->genrename == $genre && writer->writername == "Huma Qureshi"] | order(coalesce(views,0) desc)[0...6] { title, banner, slug, pdfreleasedate, views, genre->{genrename}, writer->{writername} },
    "recommendedNovels": *[_type == "novelparent" && defined(slug.current) && genre->genrename == $genre && writer->writername == "Huma Qureshi"] | order(_createdAt desc)[0...6] {
      _id, title, banner, slug, novelreleasedate, noveldescription, genre->{genrename}, writer->{writername},
      "views": *[_type == "novel" && references(^._id)].views
    },
    "popularNovels": *[_type == "novelparent" && defined(slug.current) && writer->writername == "Huma Qureshi"] | order(_createdAt desc)[0...6] {
      _id, title, banner, slug, novelreleasedate, noveldescription, genre->{genrename}, writer->{writername},
      "views": *[_type == "novel" && references(^._id)].views
    },
    "writers": *[_type == "writer" && writername == "Huma Qureshi"]{writername},
    "youtubeNovels": *[_type == "novelparent" && defined(slug.current) && defined(youtubeurl) && youtubeurl != "" && writer->writername == "Huma Qureshi"][0...6] { _id, title, youtubeurl, writer->{writername} }
  }`;
  const data = await client.fetch<any>(
    relatedQuery,
    { currentId: pdf?._id || "", genre: genreName },
    { next: { revalidate: 300 } }
  );

  const sumViews = (v: any) =>
    Array.isArray(v) ? v.reduce((a: number, x: number) => a + (Number(x) || 0), 0) : Number(v) || 0;
  const enrich = (list: any[]) =>
    (list || []).filter((n: any) => n && n.slug?.current).map((n: any) => ({
      ...n,
      summary: n.noveldescription
        ? String(n.noveldescription).replace(/\s+/g, " ").trim().slice(0, 160)
        : "",
      totalViews: sumViews(n.views),
    }));

  const recommendedNovels = enrich(data?.recommendedNovels || []);
  const popularNovels = enrich(data?.popularNovels || []);
  const combined = [...recommendedNovels];
  const seen = new Set(combined.map((n) => n._id));
  for (const n of popularNovels) {
    if (!seen.has(n._id)) {
      combined.push(n);
      seen.add(n._id);
    }
  }

  return {
    relatedPDFs: data?.relatedPDFs || [],
    relatedNovels: combined.slice(0, 6),
    otherWriters: (data?.writers || []).map((w: any) => w.writername).filter(Boolean),
    youtubeNovels: data?.youtubeNovels || [],
  };
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pdf = await getPdf(slug);
  if (!pdf) return { title: `PDF not found | ${SITE_NAME}` };
  const description = pdf.seodescription || cleanDescription(pdf.pdfshortdescription || pdf.pdfdescription, `Read ${pdf.title} by ${pdf.writer?.writername || "the author"} on ${SITE_NAME}.`);
  const url = absoluteUrl(`/pdf/${pdf.slug?.current || slug}`);
  return {
    title: pdf.seotitle || `${pdf.title} by ${pdf.writer?.writername || "Author"}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: pdf.title,
      description,
      url,
      type: "article",
      images: pdf.banner ? [{ url: pdf.banner, alt: `${pdf.title} cover` }] : [],
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const pdf = await getPdf(slug);
  if (!pdf) notFound();
  const related = await getRelatedPdfData(pdf);
  const testimonials = await getTestimonials(12);
  const siteImages = await getSiteSettings();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: pdf.title,
    author: pdf.writer?.writername ? { "@type": "Person", name: pdf.writer.writername } : undefined,
    genre: pdf.genre?.genrename,
    image: pdf.banner,
    description: cleanDescription(pdf.pdfdescription, `Read ${pdf.title} on ${SITE_NAME}.`),
    url: absoluteUrl(`/pdf/${pdf.slug?.current || slug}`),
  };

  const releaseDate = formatDate(pdf.pdfreleasedate);

  return (
    <main className="flex flex-col py-5 gap-6 lg:gap-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "PDF", href: "/pdf" }, { label: pdf.title || "PDF" }]} />

      {/* HERO — book detail */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-cream-soft shadow-xl">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-brand/5 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-gold/10 blur-3xl"></div>
        </div>
        <div className="relative grid items-center gap-8 lg:gap-10 lg:grid-cols-2 p-6 lg:p-10">
          <div className="order-2 lg:order-1 flex flex-col gap-4 text-center lg:text-start">
            <span className="ui-eyebrow">PDF Novel</span>
            <h1 className="font-display text-3xl lg:text-4xl font-extrabold title-bright leading-tight">
              {pdf.title}
            </h1>
            <p className="text-tertiary font-medium">
              by {pdf.writer?.writername || "Unknown writer"}
            </p>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="px-4 py-1.5 rounded-full border border-line bg-surface text-brand text-sm font-semibold">
                {pdf.genre?.genrename || "Novel"}
              </span>
              {releaseDate && (
                <span className="px-4 py-1.5 rounded-full border border-line bg-surface text-brand text-sm font-semibold">
                  {releaseDate}
                </span>
              )}
              <ViewsBadge views={pdf.views} />
              {pdf.downloadformat && (
                <span className="px-4 py-1.5 rounded-full border border-line bg-surface text-brand text-sm font-semibold">
                  {pdf.downloadformat}
                </span>
              )}
              {pdf.downloadsize && (
                <span className="px-4 py-1.5 rounded-full border border-line bg-surface text-brand text-sm font-semibold">
                  {pdf.downloadsize}
                </span>
              )}
              {pdf.pdfnumberofpages ? (
                <span className="px-4 py-1.5 rounded-full border border-line bg-surface text-brand text-sm font-semibold">
                  {pdf.pdfnumberofpages} pages
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
              <BookmarkButton slug={pdf.slug?.current || ""} title={pdf.title || ""} type="pdf" />
            </div>
            <Link
              href="/pdf"
              className="inline-flex w-fit mx-auto lg:mx-0 items-center gap-1 text-sm font-bold text-brand hover:underline"
            >
              ← Back to PDF Library
            </Link>
          </div>
          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-2xl border-4 border-surface shadow-2xl ring-1 ring-gold/30">
              <Image
                src={pdf.banner || siteImages.defaultBanner}
                alt={`${pdf.title} cover`}
                width={1920}
                height={1080}
                priority
                quality={85}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {pdf.pdfdescription && (
        <NovelDescription
          descText={pdf.pdfdescription}
          font={pdf.descriptionlanguage ? "font-urdu" : ""}
          dir={pdf.descriptionlanguage ? "rtl" : "ltr"}
        />
      )}

      <DownloadSection data={pdf} slug={pdf.slug?.current || slug} type="pdf" />

      {pdf.authornote && (
        <AuthorNote
          note={pdf.authornote}
          font={pdf.authornotelang ? "font-urdu" : ""}
          dir={pdf.authornotelang ? "rtl" : "ltr"}
        />
      )}

      <ReaderHighlights intro={pdf.readerhighlightintro} highlights={pdf.readerhighlights} />

      <Characters intro={pdf.characterintro} characters={pdf.characters} />

      <SneakPeeks peeks={pdf.sneakPeeks} />

      <NovelDetails novel={pdf} title="PDF Details" />

      <Tags tags={pdf.tags || []} />

      <Themes themes={pdf.themes} />

      {/* WHY DOWNLOAD — rich SEO content */}
      <section aria-labelledby="why-download-heading" className="py-4">
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
          <Heading name="Why Download This PDF" />
          <div className="bg-surface rounded-3xl border border-line p-6 lg:p-10 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Read Offline, Anywhere",
                  desc: "Download the complete novel to your phone or computer and keep reading even without internet — perfect for travel, commutes, or bedtime reading.",
                },
                {
                  title: "Complete Story in One File",
                  desc: "Unlike episodic novels that are published chapter by chapter, this PDF gives you the full story in a single downloadable file.",
                },
                {
                  title: "100% Free Download",
                  desc: "Every PDF in our library is completely free. No payment, no subscription, no sign-up required to download and read.",
                },
                {
                  title: "Preserve Urdu Text Clearly",
                  desc: "The Urdu text is rendered clearly in the PDF, keeping the original script, tone, and reading flow intact for the best experience.",
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-3 rounded-2xl border border-line bg-cream-soft p-6 hover:border-brand hover:shadow-xl hover:-translate-y-0.5 transition duration-300">
                  <h3 className="text-lg font-extrabold text-brand">{item.title}</h3>
                  <p className="leading-7 text-tertiary font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RELATED CONTENT — suggestions */}
      <section aria-labelledby="related-heading" className="py-4">
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
          <RelatedContent
            relatedNovels={related.relatedNovels}
            relatedPDFs={related.relatedPDFs}
            otherWriters={related.otherWriters}
          />

          <YouTubeSection items={related.youtubeNovels} id="youtube-pdf-heading" />
        </div>
      </section>

      <ReviewMarquee reviews={testimonials} />

      <section className="flex flex-col gap-10" aria-labelledby="comments-heading">
        <Heading name="Comments" />
        <div className="flex flex-col gap-10 lg:mx-10">
          <PDFComments pdfId={pdf._id} initialComments={pdf.comment || []} />
        </div>
      </section>
    </main>
  );
}

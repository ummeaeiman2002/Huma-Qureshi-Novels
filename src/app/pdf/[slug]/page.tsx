import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { absoluteUrl, cleanDescription, isValidUrl, SITE_NAME } from "@/lib/seo";
import Image from "next/image";
import Heading from "@/app/components/Heading";
import NovelDescription from "@/app/components/novelPage/NovelDescription";
import AuthorNote from "@/app/components/novelPage/AuthoNote";
import DownloadPDFButton from "@/app/components/novelPage/DownloadPDFButton";
import WatchOnYT from "@/app/components/novelPage/WatchOnYT";
import Tags from "@/app/components/novelPage/Tags";
import PDFComments from "./PDFComments";
import ViewsBadge from "@/app/components/ViewsBadge";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

async function getPdf(slug: string) {
  const query = `*[_type == "pdf" && slug.current == $slug][0]{title, slug, pdfdescription, pdfreleasedate, descriptionlanguage, authornote, authornotelang, views, writer->{writername,_id}, genre->{genrename,_id}, banner, _id, tags, pdfurl, youtubeurl, comment[]->{name,_id,comment,_createdAt}}`;
  return client.fetch<any>(query, { slug }, { next: { revalidate: 300 } });
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
  const description = cleanDescription(pdf.pdfdescription, `Read ${pdf.title} by ${pdf.writer?.writername || "the author"} on ${SITE_NAME}.`);
  const url = absoluteUrl(`/pdf/${pdf.slug?.current || slug}`);
  return {
    title: `${pdf.title} by ${pdf.writer?.writername || "Author"}`,
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

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-secondary/25 bg-secondary/5 p-6 lg:p-10 shadow-2xl">
        <div aria-hidden="true" className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary/15 blur-3xl"></div>
        <div aria-hidden="true" className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-[#C9A96E]/10 blur-3xl"></div>
        <div className="relative flex flex-col gap-6">
          <h1 className="text-2xl lg:text-4xl font-bold text-center lg:text-start title-bright">
            {pdf.title} by {pdf.writer?.writername || "Unknown writer"}
          </h1>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Written by: {pdf.writer?.writername || ""}</p>
            <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Genre: {pdf.genre?.genrename || ""}</p>
            {releaseDate && <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Published: {releaseDate}</p>}
            <ViewsBadge views={pdf.views} />
          </div>

          <div className="rounded-2xl overflow-hidden border border-secondary/30 shadow-2xl">
            <Image
              src={pdf.banner || "https://res.cloudinary.com/dx1gryhqc/image/upload/v1759093412/humaqureshi_writerbanner_ajh5nx.png"}
              alt={`${pdf.title} banner`}
              width={1920}
              height={1080}
              priority
              quality={85}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="mx-auto max-w-4xl text-center text-sm leading-7 opacity-80 text-tertiary">
            <p>&copy; {new Date().getFullYear()} humaqureshinovels.com</p>
            <p>This PDF novel is an original work by the author. All rights reserved.</p>
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

      {pdf.authornote && (
        <AuthorNote
          note={pdf.authornote}
          font={pdf.authornotelang ? "font-urdu" : ""}
          dir={pdf.authornotelang ? "rtl" : "ltr"}
        />
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        {isValidUrl(pdf.pdfurl) && <DownloadPDFButton pdf={pdf.pdfurl} />}
        {isValidUrl(pdf.youtubeurl) && <WatchOnYT YTurl={pdf.youtubeurl} />}
      </div>

      <Tags tags={pdf.tags || []} />

      <section className="flex flex-col gap-10" aria-labelledby="comments-heading">
        <Heading name="Comments" />
        <div className="flex flex-col gap-10 lg:mx-10">
          <PDFComments pdfId={pdf._id} initialComments={pdf.comment || []} />
        </div>
      </section>
    </main>
  );
}

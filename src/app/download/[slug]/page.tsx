import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Heading from "@/app/components/Heading";
import { PortableText } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { absoluteUrl, resolveSummary } from "@/lib/seo";
import RelatedContent from "@/app/components/RelatedContent";
import NovelSpotlight from "@/app/components/NovelSpotlight";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "Download Your Novel PDF",
    description:
      "Step-by-step guide to download and read your Urdu novel PDF on any device — phone, tablet, or computer. Free no-sign-up needed.",
    alternates: { canonical: absoluteUrl(`/download/${slug}`) },
    robots: { index: true, follow: true },
  };
}

const STEPS = [
  {
    title: "Tap the Download Now Button",
    desc: "Click the Download Now button below. Your PDF will open in a new tab on this screen.",
  },
  {
    title: "Check Your Browser Downloads",
    desc: "The file downloads automatically. On Android or desktop look at the download bar at the top or bottom of your screen.",
  },
  {
    title: "iPhone / iPad",
    desc: "Tap the download icon in the top-right (a small arrow in a circle), then choose Save to Files to keep it in your device storage.",
  },
  {
    title: "Open the PDF",
    desc: "Tap the downloaded file to open it in your default PDF viewer and start reading. On mobile, the PDF may open in the browser first.",
  },
  {
    title: "Read Offline Anytime",
    desc: "Once saved, the PDF works without internet. Keep it in your library and enjoy reading at your own pace, anywhere.",
  },
];

async function getDownloadSuggestions() {
  const query = `{
    "novels": *[_type == "novelparent" && defined(slug.current) && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi" && coalesce(isShortStory, false) != true] | order(novelreleasedate desc)[0...6] {
      _id, title, "banner": coalesce(bannerImage.asset->url, banner), slug, novelreleasedate, noveldescription, shortdescription, summary, seodescription, tagline, genre->{genrename}, writer->{writername}
    },
    "pdfs": *[_type == "pdf" && defined(slug.current) && defined(pdfreleasedate) && pdfreleasedate <= now() && writer->writername == "Huma Qureshi"] | order(pdfreleasedate desc)[0...3] {
      _id, title, "banner": coalesce(bannerImage.asset->url, banner), slug, pdfreleasedate, pdfdescription, pdfshortdescription, seodescription, genre->{genrename}, writer->{writername}
    },
    "spotlight": *[_type == "novelparent" && defined(slug.current) && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi"] | order(novelreleasedate desc)[0] {
      _id, title, "banner": coalesce(bannerImage.asset->url, banner), slug, shortdescription, summary, noveldescription, seodescription, tagline, genre->{genrename}, writer->{writername},
      "sneakPeeks": sneakPeeks[]{_key, "imageUrl": image.asset->url, scene, sceneIsUrdu, caption, chapterReference, order}
    }
  }`;
  return client.fetch<any>(query, {}, { next: { revalidate: 300 } });
}

async function resolvePdfUrl(slug: string) {
  const doc = await client.fetch<any>(
    `*[slug.current == $slug && _type in ["novelparent", "pdf"]][0]{
      "fileUrl": downloadfile.asset->url,
      externaldownloadurl,
      pdfurl,
      pdfAvailability
    }`,
    { slug },
    { next: { revalidate: 300 } }
  );
  if (!doc || doc.pdfAvailability === "unavailable") return "";
  const legacy = doc.pdfurl || "";
  return (
    doc.fileUrl ||
    doc.externaldownloadurl ||
    (legacy.indexOf("http") === 0 ? legacy : "")
  );
}

export default async function DownloadPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pdf?: string; type?: string }>;
}) {
  const { slug } = await params;
  const { pdf, type } = await searchParams;
  const resolvedUrl = await resolvePdfUrl(slug);
  const pdfUrl = resolvedUrl || pdf || "";
  const validPdf = pdfUrl.indexOf("http") === 0;

  const downloadSection =
    await client.fetch<{
      title: string;
      body: any;
      isUrdu?: boolean;
    } | null>(
      `*[_type == "downloadSection" && enabled == true] | order(_createdAt desc)[0]`
    );

  const suggestions = await getDownloadSuggestions();
  const suggestedNovels = (suggestions?.novels || []).map((n: any) => ({
    ...n,
    summary: resolveSummary(n),
  }));
  const suggestedPdfs = (suggestions?.pdfs || []).map((p: any) => ({
    ...p,
    summary: resolveSummary(p),
  }));
  const spotlight = suggestions?.spotlight
    ? {
        ...suggestions.spotlight,
        shortdescription: resolveSummary(suggestions.spotlight),
      }
    : undefined;

  const novelTitle = (suggestions?.spotlight?.title as string) || (suggestions?.novels?.[0]?.title as string) || slug.replace(/-/g, " ");
  const novelBanner = (suggestions?.spotlight?.banner as any) || (suggestions?.novels?.[0]?.banner as any);

  return (
    <main className="flex flex-col gap-6 lg:gap-8 mx-auto w-full max-w-5xl py-5 px-4 sm:px-0">
      {!validPdf ? (
        <section className="text-center py-10 bg-cream-soft rounded-2xl border border-line">
          <h1 className="text-xl font-extrabold text-brand">Download link unavailable</h1>
          <p className="mt-2 text-sm opacity-70 max-w-md mx-auto">
            This novel&apos;s PDF could not be prepared. Please browse another title.
          </p>
          <Link href="/novel" className="inline-block mt-4 px-6 py-2 rounded-full bg-brand text-white font-bold text-sm hover:bg-brand-dark transition">
            Browse Novels
          </Link>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-line bg-surface overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-5">
              <div className="relative aspect-[5/6] w-32 sm:w-36 rounded-xl overflow-hidden shrink-0 border border-line">
                {typeof novelBanner === "string" && novelBanner ? (
                  <img
                    src={novelBanner}
                    alt={novelTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand/10 to-gold/10" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs uppercase tracking-wider text-gold-dark font-bold">Free PDF Download</p>
                <h1 className="text-lg sm:text-xl font-extrabold text-brand mt-1">{novelTitle}</h1>
                <p className="text-sm text-tertiary mt-1">Complete Urdu novel in PDF format</p>
              </div>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand text-white font-bold text-sm px-6 py-2.5 rounded-full shadow hover:bg-brand-dark active:scale-95 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download PDF
              </a>
            </div>
          </section>
        </>
      )}

      <section aria-labelledby="steps-heading" className="flex flex-col gap-4">
        <Heading name="How to Download" />
        <div className="rounded-2xl border border-gold/30 bg-surface p-5 lg:p-6">
          <ol className="flex flex-col gap-3">
            {STEPS.slice(0, 4).map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-7 h-7 shrink-0 rounded-full bg-gold-dark text-white font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-bold text-brand">{step.title}</h3>
                  <p className="text-sm leading-6 text-tertiary">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {spotlight && (
        <NovelSpotlight novel={spotlight} heading="Sneak Peek" />
      )}

      <RelatedContent
        relatedNovels={suggestedNovels}
        relatedPDFs={suggestedPdfs}
        heading="More Novels & PDFs"
      />

      <section aria-labelledby="dl-faq-heading" className="flex flex-col gap-4">
        <Heading name="FAQs" />
        <div className="bg-surface rounded-2xl border border-brand/30 p-5 lg:p-6 flex flex-col gap-4">
          {[
            {
              q: "Is the PDF download free?",
              a: "Yes, completely free with no sign-up or payment.",
            },
            {
              q: "Where is the PDF saved?",
              a: "On Android it goes to Downloads; on iPhone/iPad use Save to Files.",
            },
            {
              q: "Can I read offline?",
              a: "Yes, once saved the PDF works offline.",
            },
            {
              q: "Why does it open in browser?",
              a: "Some browsers preview PDFs first — use the download/save icon in the viewer.",
            },
          ].map((f, i) => (
            <div key={i} className="flex flex-col gap-1">
              <h3 className="font-bold text-brand">{f.q}</h3>
              <p className="text-sm leading-6 text-tertiary">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SANITY-MANAGED SECTION — Urdu/English note from the CMS */}
      {downloadSection?.title && downloadSection?.body && (
        <section
          aria-labelledby="editable-section-heading"
          className="flex flex-col gap-6"
        >
          <Heading name={downloadSection.title} />
          <div className="bg-surface rounded-3xl border-2 border-gold/30 p-6 lg:p-10 leading-8 text-tertiary">
            <div
              dir={downloadSection.isUrdu ? "rtl" : "ltr"}
              className={`${
                downloadSection.isUrdu
                  ? "font-urdu text-start"
                  : "font-medium"
              }`}
            >
              <PortableText
                value={downloadSection.body}
                components={{
                  block: {
                    h2: ({ children }: any) => (
                      <h2 className="text-xl font-semibold mt-6 mb-3 text-brand">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }: any) => (
                      <h3 className="text-lg font-semibold mt-4 mb-2 text-brand">
                        {children}
                      </h3>
                    ),
                    normal: ({ children }: any) => (
                      <p className="mb-4 leading-8">{children}</p>
                    ),
                    blockquote: ({ children }: any) => (
                      <blockquote className="border-l-4 border-gold pl-4 my-4 italic opacity-80">
                        {children}
                      </blockquote>
                    ),
                  },
                  list: {
                    bullet: ({ children }: any) => (
                      <ul className="list-disc pl-6 mb-4">{children}</ul>
                    ),
                    number: ({ children }: any) => (
                      <ol className="list-decimal pl-6 mb-4">{children}</ol>
                    ),
                  },
                }}
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

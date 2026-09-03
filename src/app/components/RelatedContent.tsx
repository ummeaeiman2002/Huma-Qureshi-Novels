"use client";

import Novel from "./Cards/Novel";
import PDFCard from "./Cards/PDF";
import Heading from "./Heading";
import ReaderPoll from "./homePageComponents/ReaderPoll";
import { formatSafeDate } from "@/lib/seo";

interface Item {
  _id: string;
  title: string;
  banner?: string;
  slug?: { current?: string };
  novelreleasedate?: string;
  pdfreleasedate?: string;
  _createdAt?: string;
  writer?: { writername?: string; _id?: string };
  genre?: { genrename?: string; _id?: string };
  summary?: string;
  totalViews?: number;
}

interface RelatedContentProps {
  relatedNovels?: Item[];
  relatedPDFs?: Item[];
  otherWriters?: string[];
  heading?: string;
}

export default function RelatedContent({
  relatedNovels = [],
  relatedPDFs = [],
  otherWriters = [],
  heading = "Keep Reading",
}: RelatedContentProps) {
  if (relatedNovels.length === 0 && relatedPDFs.length === 0) return null;

  const novels = (relatedNovels || []).filter((n) => n && n._id && n.slug?.current);
  const pdfs = (relatedPDFs || []).filter((p) => p && p._id && p.slug?.current);

  return (
    <div className="flex flex-col gap-10">
      {novels.length > 0 && (
        <section aria-labelledby="related-novels-heading" className="flex flex-col gap-6">
          <Heading name="You May Also Like These Novels" />
          <div className="flex flex-wrap gap-5 justify-center lg:justify-start lg:px-4">
            {novels.slice(0, 6).map((n) => (
              <Novel
                key={n._id}
                href={n.slug?.current || ""}
                novelName={n.title || ""}
                writer={n.writer?.writername || ""}
                genre={n.genre?.genrename || ""}
                cardBanner={n.banner || ""}
                date={formatSafeDate(n.novelreleasedate)}
                summary={n.summary || ""}
              />
            ))}
          </div>
        </section>
      )}

      {pdfs.length > 0 && (
        <section aria-labelledby="related-pdfs-heading" className="flex flex-col gap-6">
          <Heading name="More PDF Novels" />
          <div className="flex flex-wrap gap-5 justify-center lg:justify-start lg:px-4">
            {pdfs.slice(0, 6).map((p) => (
              <PDFCard
                key={p._id}
                href={p.slug?.current || ""}
                novelName={p.title || ""}
                writer={p.writer?.writername || ""}
                genre={p.genre?.genrename || ""}
                cardBanner={p.banner || ""}
                date={formatSafeDate(p.pdfreleasedate)}
                summary={p.summary || ""}
              />
            ))}
          </div>
        </section>
      )}

      {otherWriters && otherWriters.length > 0 && (
        <section aria-labelledby="writers-heading" className="flex flex-col gap-6">
          <Heading name="Explore More Writers" />
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start lg:px-4">
            {otherWriters.slice(0, 8).map((w, i) => (
              <a
                key={i}
                href={`/novel?writer=${encodeURIComponent(w)}`}
                className="px-5 py-2 rounded-full border-2 border-[#1E5D50]/30 text-[#1E5D50] font-bold hover:border-[#1E5D50] hover:bg-[#1E5D50]/5 active:scale-95 transition"
              >
                {w}
              </a>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="reader-poll-heading" className="flex flex-col gap-6">
        <Heading name="Reader Poll" />
        <ReaderPoll />
      </section>
    </div>
  );
}

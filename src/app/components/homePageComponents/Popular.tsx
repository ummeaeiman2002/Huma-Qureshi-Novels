import React, { useEffect, useState } from "react";
import Novel from "../Cards/Novel";
import Heading from "../Heading";
import { client } from "@/sanity/lib/client";
import Loader from "../Loader";
import PDF from "../Cards/PDF";

interface BaseContent {
  _id: string;
  title: string;
  slug: { current: string };
  genre: { genrename: string; _id: string };
  writer: { writername: string; _id: string };
  type: "episodic" | "pdf";
}

interface NovelParent extends BaseContent {
  banner: string;
  novelreleasedate: string;
  viewsArray?: (number | null)[];
  totalViews?: number;
}

interface PDFContent extends BaseContent {
  banner: string;
  pdfreleasedate: string;
}

interface MergedContent extends BaseContent {
  cardbannerurl?: string;
  banner?: string;
  novelreleasedate?: string;
  pdfreleasedate?: string;
  totalViews?: number;
}

export default function Popular() {
  const [popular, setPopular] = useState<MergedContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      /* ===============================
         1️⃣ NOVELS QUERY (NO ORDER HERE)
         =============================== */
      const novelsQuery = `
        *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi"] {
          _id,
          title,
          banner,
          slug,
          novelreleasedate,
          genre->{genrename,_id},
          writer->{writername,_id},
          "viewsArray": *[_type == "novel" && references(^._id)].views
        }
      `;

      /* ===============================
         2️⃣ PDF QUERY (ORDER OK)
         =============================== */
      const pdfsQuery = `
        *[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now() && writer->writername == "Huma Qureshi"]
        | order(views desc)[0...5] {
          title,
          banner,
          slug,
          pdfreleasedate,
          _id,
          genre->{genrename,_id},
          writer->{writername,_id}
        }
      `;

      // const [novelsResult, pdfsResult] = await Promise.all<
      //   NovelParent[],
      //   PDFContent[]
      // >([client.fetch(novelsQuery), client.fetch(pdfsQuery)]);
      const [novelsResult, pdfsResult] = await Promise.all([
        client.fetch<NovelParent[]>(novelsQuery),
        client.fetch<PDFContent[]>(pdfsQuery),
      ]);

      /* ===============================
         3️⃣ SUM + SORT NOVELS (MAIN FIX)
         =============================== */
      const novelsWithTotals: (NovelParent & {
        totalViews: number;
        type: "episodic";
      })[] = novelsResult.map((novel) => {
        const totalViews = Array.isArray(novel.viewsArray)
          ? novel.viewsArray.reduce(
              (sum: number, v: number | null) => sum + (v ? Number(v) : 0),
              0
            )
          : 0;

        return {
          ...novel,
          totalViews,
          type: "episodic",
        };
      });

      // 🔥 SORT AFTER SUM (MOST IMPORTANT)
      novelsWithTotals.sort((a, b) => b.totalViews - a.totalViews);

      // top 2 novels only
      const topNovels = novelsWithTotals.slice(0, 5);

      /* ===============================
         4️⃣ PDFs MAP
         =============================== */
      const pdfs: (PDFContent & { type: "pdf" })[] = pdfsResult.map((pdf) => ({
        ...pdf,
        type: "pdf",
      }));

      /* ===============================
         5️⃣ COMBINE & SET STATE
         =============================== */
      const combined: MergedContent[] = [...topNovels, ...pdfs];

      console.table(
        novelsWithTotals.map((n) => ({
          title: n.title,
          totalViews: n.totalViews,
        }))
      );

      setPopular(combined);
    } catch (error) {
      console.error("Error fetching popular content", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="py-5 flex flex-col gap-6 lg:gap-10" id="popular">
      <Heading name="Popular" />

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader />
        </div>
      ) : popular.length > 0 ? (
        <div className="flex gap-5 flex-wrap justify-center lg:justify-start lg:px-28 lg:gap-10">
          {popular.map((p, index) => {
            if (p.type === "episodic") {
              return (
                <Novel
                  key={`episodic-${index}`}
                  date={new Date(p.novelreleasedate!).toLocaleDateString(
                    "en-GB"
                  )}
                  href={p.slug?.current}
                  cardBanner={p.banner!}
                  novelName={p.title}
                  writer={p.writer.writername}
                  genre={p.genre.genrename}
                />
              );
            }

            if (p.type === "pdf") {
              return (
                <PDF
                  key={`pdf-${index}`}
                  date={new Date(p.pdfreleasedate!).toLocaleDateString("en-GB")}
                  href={p.slug?.current}
                  cardBanner={p.banner!}
                  novelName={p.title}
                  writer={p.writer.writername}
                  genre={p.genre.genrename}
                />
              );
            }

            return null;
          })}
        </div>
      ) : (
        <p className="text-center text-tertiary opacity-50 py-3">
          No popular content available
        </p>
      )}
    </div>
  );
}

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
  cardbannerurl: string;
  novelreleasedate: string;
  monthlyViewsArray?: (number | null)[];
  totalMonthlyViews?: number;
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
  totalMonthlyViews?: number;
}

export default function Trending() {
  const [trending, setTrending] = useState<MergedContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // -------------------- 1️⃣ NOVELS QUERY --------------------
      const novelsQuery = `
        *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi"] {
          _id,
          title,
          banner,
          slug,
          novelreleasedate,
          genre->{genrename,_id},
          writer->{writername,_id},
          "monthlyViewsArray": *[_type == "novel" && references(^._id)].monthlyViews
        }
      `;

      // -------------------- 2️⃣ PDFs QUERY --------------------
      const pdfsQuery = `
        *[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now() && writer->writername == "Huma Qureshi"]
        | order(coalesce(monthlyViews,0) desc)[0...2] {
          _id,
          title,
          banner,
          slug,
          pdfreleasedate,
          genre->{genrename,_id},
          writer->{writername,_id}
        }
      `;

      // -------------------- 3️⃣ FETCH --------------------
      const [novelsResult, pdfsResult] = await Promise.all([
        client.fetch<NovelParent[]>(novelsQuery),
        client.fetch<PDFContent[]>(pdfsQuery),
      ]);

      // -------------------- 4️⃣ SUM + SORT NOVELS --------------------
      const novelsWithMonthlyTotals: (NovelParent & { totalMonthlyViews: number; type: "episodic" })[] | any[]=
        novelsResult.map((novel) => {
          // Calculate total monthly views for this novel parent by summing all its episodes' monthly views
          const monthlyViewsArray = novel.monthlyViewsArray || [];
          const totalMonthlyViews = monthlyViewsArray.reduce((sum, viewCount) => {
            // Handle null/undefined values safely
            return sum? + (viewCount !== null && viewCount !== undefined ? Number(viewCount) : 0): 0
          });

          return {
            ...novel,
            totalMonthlyViews,
            type: "episodic",
          };
        });

      // Sort novels by total monthly views in descending order
      novelsWithMonthlyTotals.sort((a, b) => b.totalMonthlyViews - a.totalMonthlyViews);

      // Take only the top 2 novels
      const topNovels = novelsWithMonthlyTotals.slice(0, 2);

      // -------------------- 5️⃣ PDFs --------------------
      const pdfs: (PDFContent & { type: "pdf" })[] = pdfsResult.map((pdf) => ({
        ...pdf,
        type: "pdf",
      }));

      // -------------------- 6️⃣ COMBINE --------------------
      const combined: MergedContent[] = [...topNovels, ...pdfs];

      console.table(
        novelsWithMonthlyTotals.map((n) => ({
          title: n.title,
          totalMonthlyViews: n.totalMonthlyViews,
        }))
      );

      setTrending(combined);
    } catch (error) {
      console.error("Error fetching trending content", error);
      // Set empty array in case of error to show the "no trending" message
      setTrending([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="py-5 flex flex-col gap-6 lg:gap-10" id="trending">
      <Heading name="Trending" />

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader />
        </div>
      ) : trending.length > 0 ? (
        <div className="flex gap-5 flex-wrap justify-center lg:justify-start lg:px-28 lg:gap-10">
          {trending.map((p, index) => {
            if (p.type === "episodic") {
              return (
                <Novel
                  key={`episodic-${index}`}
                  date={new Date(p.novelreleasedate!).toLocaleDateString("en-GB")}
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
          No trending novels this month
        </p>
      )}
    </div>
  );
}

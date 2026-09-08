import React, { useEffect, useState } from "react";
import Novel from "../Cards/Novel";
import Heading from "../Heading";
import { client } from "@/sanity/lib/client";
import Loader from "../Loader";
import PDF from "../Cards/PDF";

export default function Latest() {
  const [latest, setLatest] = useState<any>([]);
  const [loading, setLoading] = useState(true); // loading state

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch the latest 2 novels and 2 PDFs separately
      const query = `
      {
        "episodic": *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi"]
          | order(_createdAt desc) [0...5] {
            title, banner, novelreleasedate, slug, _id, genre->{genrename,_id}, writer->{writername,_id}
          },
        "pdf": *[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now() && writer->writername == "Huma Qureshi"]
          | order(_createdAt desc) [0...5] {
            title, banner, slug, pdfreleasedate, _id, genre->{genrename,_id}, writer->{writername,_id}
          }
      }
      `;

      const response = await client.fetch(query);

      // Merge both lists into one array for frontend, maintaining separate counts
      const episodicWithLimit = response.episodic.slice(0, 5);
      const pdfWithLimit = response.pdf.slice(0, 5);

      const combined = [
        ...episodicWithLimit.map((i: any) => ({ ...i, type: "episodic" })),
        ...pdfWithLimit.map((i: any) => ({ ...i, type: "pdf" })),
      ];

      setLatest(combined);
    } catch (error) {
      console.error("Error fetching novels", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="py-5 flex flex-col gap-6 lg:gap-10" id="latest">
        <Heading name="Latest" />
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader />
          </div>
        ) : latest.length > 0 ? (
          <div
            className={`flex gap-5 flex-wrap justify-center lg:justify-start lg:px-28 lg:gap-10`}
          >
            {latest?.map((p: any, index: number) => {
              if (p.type === "episodic") {
                return (
                  <Novel
                    key={`episodic-${index}`}
                    date={new Date(p.novelreleasedate).toLocaleDateString("en-GB")}
                    href={p.slug?.current}
                    cardBanner={p.banner}
                    novelName={p.title}
                    writer={p.writer.writername}
                    genre={p.genre.genrename}
                  />
                );
              } else if (p.type === "pdf") {
                return (
                  <PDF
                    key={`pdf-${index}`}
                    date={new Date(p.pdfreleasedate).toLocaleDateString("en-GB")}
                    href={p.slug?.current}
                    cardBanner={p.banner}
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
            No latest content available
          </p>
        )}
      </div>
    </>
  );
}

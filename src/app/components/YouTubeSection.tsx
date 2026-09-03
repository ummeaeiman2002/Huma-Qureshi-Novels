"use client";

import Link from "next/link";
import Heading from "./Heading";

interface YouTubeNovel {
  _id?: string;
  title?: string;
  youtubeurl?: string;
  writer?: { writername?: string };
}

interface YouTubeSectionProps {
  items?: YouTubeNovel[];
  id?: string;
}

export default function YouTubeSection({ items = [], id = "youtube-heading" }: YouTubeSectionProps) {
  const list = (items || []).filter(
    (n) => n && n.title && n.youtubeurl && n.youtubeurl.trim() !== ""
  );

  if (list.length === 0) return null;

  return (
    <section aria-labelledby={id} className="py-4">
      <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
        <Heading name={id === "youtube-heading" ? "Listen & Watch on YouTube" : "Listen & Watch on YouTube"} />
        <p className="max-w-4xl leading-7 font-medium">
          Prefer to listen? Many of our Urdu novels are also available as audio
          narration on YouTube. Pick a story below to start listening.
        </p>
        <div className="flex flex-col gap-5">
          {list.map((n, i) => {
            const url = n.youtubeurl || "";
            const valid = url.indexOf("http") === 0;
            return (
              <a
                key={n._id || i}
                href={valid ? url : "#"}
                target={valid ? "_blank" : "_self"}
                rel={valid ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-4 rounded-2xl border-2 border-[#1E5D50]/30 bg-[#FFFDF9] p-4 hover:border-[#1E5D50] hover:shadow-xl transition duration-300"
              >
                <span className="w-12 h-12 shrink-0 rounded-full bg-[#1E5D50] text-white flex items-center justify-center text-xl shadow">
                  ▶
                </span>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-extrabold text-[#1E5D50] group-hover:underline">
                    {n.title}
                  </span>
                  {n.writer?.writername && (
                    <span className="text-sm font-medium text-tertiary">
                      by {n.writer.writername}
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

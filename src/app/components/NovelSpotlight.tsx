import Heading from "@/app/components/Heading";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

type Peek = {
  _key?: string;
  imageUrl?: string;
  scene?: string;
  sceneIsUrdu?: boolean;
  caption?: string;
  chapterReference?: string;
  order?: number;
};

type SpotlightNovel = {
  title?: string;
  slug?: { current?: string };
  banner?: string;
  shortdescription?: string;
  genre?: { genrename?: string };
  writer?: { writername?: string };
  sneakPeeks?: Peek[];
};

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/dx1gryhqc/image/upload/v1759093412/humaqureshi_writerbanner_ajh5nx.png";

export default async function NovelSpotlight({
  novel,
  heading = "Sneak Peek",
}: {
  novel?: SpotlightNovel;
  heading?: string;
}) {
  const settings = await getSiteSettings();
  const slug = novel?.slug?.current;
  if (!novel || !slug) return null;

  const peeks = (novel.sneakPeeks || [])
    .filter((p) => p && (p.scene || p.imageUrl))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const peek = peeks[0];
  const excerpt = (peek?.scene || novel.shortdescription || "").trim();
  const excerptIsUrdu = Boolean(peek?.scene && peek.sceneIsUrdu);
  const image = peek?.imageUrl || novel.banner || settings.defaultBanner || FALLBACK_IMAGE;

  if (!excerpt && !peek?.imageUrl) return null;

  return (
    <section aria-labelledby="spotlight-heading" className="py-2">
      <Heading name={heading} />
      <div className="mx-2 overflow-hidden rounded-3xl border-2 border-gold/30 bg-surface shadow-xl sm:mx-6 lg:mx-20">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center justify-center p-6 lg:p-8">
            <div className="relative aspect-[5/6] w-full max-w-[300px] overflow-hidden rounded-lg">
              <Image
                src={image}
                alt={`${novel.title || "Novel"} preview`}
                fill
                sizes="(max-width: 1024px) 90vw, 320px"
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
              {novel.genre?.genrename && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-deep shadow">
                  {novel.genre.genrename}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 p-6 lg:p-8">
            <span className="ui-eyebrow">From a Novel</span>
            <h3 className="font-display text-2xl font-extrabold title-bright">
              {novel.title}
            </h3>
            {novel.writer?.writername && (
              <p className="text-sm font-semibold text-muted">
                by {novel.writer.writername}
              </p>
            )}
            {excerpt && (
              <p
                dir={excerptIsUrdu ? "rtl" : undefined}
                className={`line-clamp-6 leading-7 text-tertiary ${
                  excerptIsUrdu ? "font-urdu text-right" : "font-medium"
                }`}
              >
                {excerpt}
              </p>
            )}
            {(peek?.caption || peek?.chapterReference) && (
              <p className="text-xs font-semibold italic text-gold-dark">
                {peek?.caption}
                {peek?.chapterReference ? ` — ${peek.chapterReference}` : ""}
              </p>
            )}
            <Link
              href={`/novel/${slug}` as Route}
              className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-brand-dark active:scale-95"
            >
              Read {novel.title} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

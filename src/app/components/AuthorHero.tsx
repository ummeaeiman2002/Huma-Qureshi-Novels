import Image from "next/image";
import Link from "next/link";
import Container from "./ui/Container";
import Button from "./ui/Button";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

export type HeroBook = {
  title: string;
  slug: string;
  banner: string;
  genre?: string;
} | null;

/**
 * Premium author hero for the homepage.
 *
 * Content hierarchy follows the project constitution (section 12):
 * author label -> headline -> short introduction -> primary + secondary CTA,
 * with a real published book cover shown on the opposite column when available.
 */
export default async function AuthorHero({
  book,
  stats,
}: {
  book: HeroBook;
  stats: { novels: number; pdfs: number; genres: number };
}) {
  const settings = await getSiteSettings();
  const cover = book?.banner || settings.heroImage;
  const hasRealCover = Boolean(book?.banner);

  return (
    <section aria-labelledby="hero-heading" className="pt-6 lg:pt-8 pb-6">
      <div className="relative overflow-hidden rounded-3xl bg-brand-deep shadow-2xl ring-1 ring-gold/20">
        {/* Decorative background layers (matches shared PageHero pattern) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 -right-20 h-96 w-96 rounded-full bg-brand-soft/25 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
          <div className="hero-pattern absolute inset-0 opacity-[0.07]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        </div>

        <Container size="wide">
          <div className="relative grid gap-10 px-1 py-9 sm:py-12 lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-14 lg:py-16">
            {/* Text column */}
            <div className="flex flex-col items-start gap-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                Pakistani Urdu Fiction Writer
              </span>

              <h1
                id="hero-heading"
                className="font-display text-4xl font-extrabold leading-[1.08] text-cream sm:text-5xl lg:text-6xl"
              >
                Stories That Stay With You
              </h1>

              <span
                aria-hidden="true"
                className="h-1 w-24 rounded-full bg-gradient-to-r from-gold to-transparent"
              />

              <p className="max-w-xl text-base leading-8 font-medium text-cream/85 lg:text-lg">
                Explore the fictional worlds of Huma Qureshi through original Urdu
                novels, memorable characters, romance, suspense, and emotionally
                rich storytelling.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/novel"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-bold text-brand-deep shadow-md transition-all duration-200 hover:bg-gold-dark hover:text-cream active:scale-95 sm:text-base"
                >
                  Explore My Novels
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-cream/25 px-7 py-3 text-sm font-bold text-cream transition-all duration-200 hover:border-gold hover:text-gold active:scale-95 sm:text-base"
                >
                  About the Author
                </Link>
              </div>

              {/* Collection snapshot — real counts only */}
              <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-4">
                {[
                  { label: "Published Novels", value: stats.novels },
                  { label: "PDF Books", value: stats.pdfs },
                  { label: "Genres", value: stats.genres },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col">
                    <dd className="font-display text-2xl font-extrabold tabular-nums text-gold lg:text-3xl">
                      {item.value.toLocaleString("en-GB")}
                    </dd>
                    <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-cream/60">
                      {item.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            {/* Cover column */}
            <div className="flex justify-center lg:justify-end">
              {book ? (
                <Link
                  href={`/novel/${book.slug}`}
                  aria-label={`Read ${book.title}`}
                  className="group relative block w-52 overflow-hidden rounded-2xl border border-gold/30 bg-surface shadow-2xl transition-transform duration-300 hover:-translate-y-1.5 sm:w-60 lg:w-72"
                >
                  <div className="relative aspect-[3/4] w-full">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={`${book.title} cover`}
                        fill
                        priority
                        sizes="(max-width: 640px) 208px, (max-width: 1024px) 240px, 288px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="hero-pattern relative flex h-full w-full items-center justify-center bg-brand-deep">
                        <span className="font-display text-5xl font-extrabold text-gold/70">
                          {book.title.trim().charAt(0).toUpperCase() || "H"}
                        </span>
                      </div>
                    )}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-transparent to-transparent"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 px-4 pb-4">
                    {book.genre && (
                      <span className="w-fit rounded-full border border-gold/40 bg-brand-deep/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-gold backdrop-blur-sm">
                        {book.genre}
                      </span>
                    )}
                    <span className="line-clamp-2 font-display text-sm font-extrabold leading-snug text-cream">
                      {book.title}
                    </span>
                    <span className="text-[11px] font-semibold text-gold">
                      {hasRealCover ? "Featured Novel" : "Read Now"}
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="w-full max-w-xs rounded-2xl border border-gold/25 bg-white/5 p-6 text-center backdrop-blur-sm">
                  <p className="font-display text-3xl font-extrabold text-gold">
                    Huma Qureshi
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-cream/70">
                    Urdu Fiction &amp; Novels
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

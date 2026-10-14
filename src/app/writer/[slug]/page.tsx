import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWriterBySlug, getNovelsByWriter } from "@/lib/sanity/queries";
import { absoluteUrl, SITE_NAME, formatSafeDate, cleanDescriptionLong } from "@/lib/seo";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import Heading from "@/app/components/Heading";
import Novel from "@/app/components/Cards/Novel";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const writer = await getWriterBySlug(slug);
  if (!writer) return { title: "Author not found | Huma Qureshi Novels" };
  const description =
    writer.writerbio ||
    `Read Urdu novels and short stories by ${writer.writername} on ${SITE_NAME}.`;
  const url = absoluteUrl(`/writer/${slug}`);
  return {
    title: `${writer.writername} — Author`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${writer.writername} — Author`,
      description,
      url,
      type: "profile",
      images: writer.writerimage || writer.writercardimageurl ? [{ url: writer.writerimage || writer.writercardimageurl, alt: writer.writername }] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const writer = await getWriterBySlug(slug);
  if (!writer) notFound();

  const all = (await getNovelsByWriter(writer._id, 60)) || [];
  const novels = all.filter((n: any) => !n.isShortStory);
  const stories = all.filter((n: any) => n.isShortStory);
  const image = writer.writerimage || writer.writercardimageurl || "";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: writer.writername,
    description: writer.writerbio || undefined,
    image: image || undefined,
    url: absoluteUrl(`/writer/${slug}`),
  };

  return (
    <main className="flex flex-col gap-6 py-5">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Authors", href: "/novel" }, { label: writer.writername || "Author" }]} />

      <section className="relative overflow-hidden rounded-3xl border border-secondary/25 bg-secondary/5 p-6 lg:p-10 shadow-2xl">
        <div aria-hidden="true" className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary/15 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {image && (
            <Image
              src={image}
              alt={writer.writername}
              width={180}
              height={180}
              className="h-32 w-32 shrink-0 rounded-full border-4 border-surface object-cover shadow-lg sm:h-40 sm:w-40"
              priority
            />
          )}
          <div className="flex flex-col gap-3 text-center sm:text-start">
            <h1 className="text-3xl font-extrabold title-bright lg:text-4xl">{writer.writername}</h1>
            {writer.writerbio && (
              <p className="max-w-2xl leading-8 font-medium text-tertiary">{writer.writerbio}</p>
            )}
            {writer.sociallinks && writer.sociallinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                {writer.sociallinks.map((link: any) => (
                  <a
                    key={link._key || link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border-2 border-brand px-4 py-1.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
                  >
                    {link.label || link.url}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {writer.writerbiofull && (
        <section aria-label="Biography" className="px-1 sm:px-4">
          <p className="whitespace-pre-wrap leading-8 font-medium text-tertiary">{writer.writerbiofull}</p>
        </section>
      )}

      {novels.length > 0 && (
        <section aria-labelledby="author-novels-heading" className="flex flex-col gap-4">
          <Heading name={`Novels by ${writer.writername}`} />
          <div className="flex flex-wrap gap-5 justify-center lg:justify-start lg:px-2">
            {novels.map((item: any) => (
              <Novel
                key={item._id}
                date={formatSafeDate(item.novelreleasedate)}
                href={item.slug?.current || "unknown"}
                cardBanner={item.banner || ""}
                novelName={item.title || ""}
                writer={item.writer?.writername || ""}
                genre={item.genre?.genrename || ""}
                summary={item.shortdescription || cleanDescriptionLong(item.noveldescription, "")}
              />
            ))}
          </div>
        </section>
      )}

      {stories.length > 0 && (
        <section aria-labelledby="author-stories-heading" className="flex flex-col gap-4">
          <Heading name={`Short Stories by ${writer.writername}`} />
          <div className="flex flex-wrap gap-5 justify-center lg:justify-start lg:px-2">
            {stories.map((item: any) => (
              <Novel
                key={item._id}
                hrefBase="/short-stories"
                cta="Read More"
                date={formatSafeDate(item.novelreleasedate)}
                href={item.slug?.current || "unknown"}
                cardBanner={item.banner || ""}
                novelName={item.title || ""}
                writer={item.writer?.writername || ""}
                genre={item.genre?.genrename || ""}
                summary={item.shortdescription || cleanDescriptionLong(item.noveldescription, "")}
              />
            ))}
          </div>
        </section>
      )}

      {novels.length === 0 && stories.length === 0 && (
        <section className="mx-2 rounded-3xl border border-line bg-cream-soft p-8 text-center">
          <p className="font-bold text-brand">No published content yet.</p>
          <Link href="/novel" className="mt-4 inline-block rounded-full bg-brand px-6 py-2.5 font-bold text-white transition hover:bg-brand-dark">
            Browse Novels
          </Link>
        </section>
      )}
    </main>
  );
}

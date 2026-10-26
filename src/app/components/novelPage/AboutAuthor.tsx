import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import Heading from "@/app/components/Heading";

export default function AboutAuthor({
  writer,
  image: authorImage,
}: {
  writer?: {
    writername?: string;
    writerimage?: string;
    writercardimageurl?: string;
    writerbio?: string;
    writerslug?: { current?: string };
  } | null;
  image?: string;
}) {
  if (!writer?.writername) return null;
  const image = authorImage || writer.writerimage || writer.writercardimageurl || "";
  const slug = writer.writerslug?.current;

  return (
    <section aria-labelledby="about-author-heading" className="py-2">
      <Heading name="About the Author" />
      <div className="mx-2 flex flex-col items-center gap-5 rounded-3xl border border-line bg-cream-soft p-6 shadow-md sm:mx-6 sm:flex-row sm:items-start lg:mx-20">
        {image && (
          <Image
            src={image}
            alt={writer.writername}
            width={160}
            height={160}
            className="h-28 w-28 shrink-0 rounded-full border-4 border-surface object-cover shadow-lg sm:h-32 sm:w-32"
          />
        )}
        <div className="flex flex-col gap-2 text-center sm:text-start">
          <h3 className="text-xl font-extrabold text-brand">{writer.writername}</h3>
          {writer.writerbio && (
            <p className="leading-7 text-tertiary font-medium">{writer.writerbio}</p>
          )}
          {slug && (
            <Link
              href={`/writer/${slug}` as Route}
              className="mt-1 w-fit self-center rounded-full border-2 border-brand px-5 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-white sm:self-start"
            >
              View Author →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

import Heading from "@/app/components/Heading";
import Novel from "@/app/components/Cards/Novel";
import { formatSafeDate, resolveSummary } from "@/lib/seo";

export default function MoreFromAuthor({
  novels,
  authorName,
}: {
  novels?: any[];
  authorName?: string;
}) {
  if (!novels || novels.length === 0) return null;

  return (
    <section aria-labelledby="more-author-heading" className="py-2">
      <Heading name={authorName ? `More from ${authorName}` : "More from This Author"} />
      <div className="flex flex-wrap gap-5 justify-center lg:justify-start lg:px-10 lg:gap-6">
        {novels.map((item: any) => (
          <Novel
            key={item._id}
            date={formatSafeDate(item.novelreleasedate)}
            href={item.slug?.current || "unknown"}
            cardBanner={item.banner || ""}
            novelName={item.title || ""}
            writer={item.writer?.writername || ""}
            genre={item.genre?.genrename || ""}
            summary={resolveSummary(item)}
          />
        ))}
      </div>
    </section>
  );
}

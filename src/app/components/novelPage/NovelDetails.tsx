import Heading from "@/app/components/Heading";
import { formatSafeDate } from "@/lib/seo";

export default function NovelDetails({ novel, title = "Novel Details" }: { novel: any; title?: string }) {
  if (!novel) return null;

  const genres = [
    novel.genre?.genrename,
    ...(novel.additionalgenres || []).map((g: any) => g?.genrename),
  ].filter(Boolean);

  const items: { label: string; value: string | number }[] = [
    { label: "Author", value: novel.writer?.writername },
    { label: "Genre", value: genres.join(", ") },
    { label: "Language", value: novel.language },
    { label: "Pages", value: novel.numberofpages ?? novel.pdfnumberofpages },
    { label: "Chapters", value: novel.numberofchapters },
    { label: "Status", value: novel.novelstatus },
    {
      label: "Published",
      value: novel.novelreleasedate || novel.pdfreleasedate
        ? formatSafeDate(novel.novelreleasedate || novel.pdfreleasedate)
        : "",
    },
    { label: "File Format", value: novel.fileformat || novel.downloadformat },
    { label: "File Size", value: novel.filesize || novel.downloadsize },
  ].filter((item) => item.value !== undefined && item.value !== null && `${item.value}`.trim() !== "");

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="novel-details-heading" className="py-2">
      <Heading name={title} />
      <dl className="mx-2 grid grid-cols-1 gap-x-8 gap-y-3 rounded-3xl border border-line bg-surface p-6 shadow-md sm:mx-6 sm:grid-cols-2 lg:mx-20 lg:p-8">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 border-b border-line/60 pb-2 last:border-0"
          >
            <dt className="text-sm font-bold uppercase tracking-wide text-gold-dark">
              {item.label}
            </dt>
            <dd className="text-end font-semibold text-tertiary">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

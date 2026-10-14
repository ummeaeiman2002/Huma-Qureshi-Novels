import Heading from "@/app/components/Heading";

type Highlight = { _key?: string; title?: string; description?: string };

export default function ReaderHighlights({
  intro,
  highlights,
}: {
  intro?: string;
  highlights?: Highlight[];
}) {
  const valid = (highlights || []).filter((h) => h && h.title);
  if (valid.length === 0) return null;

  return (
    <section aria-labelledby="reader-highlights-heading" className="py-2">
      <Heading name="What Readers Will Love" />
      {intro && (
        <p className="mx-auto max-w-4xl px-5 pb-6 text-center leading-8 text-tertiary font-medium">
          {intro}
        </p>
      )}
      <div className="grid grid-cols-1 gap-5 px-2 sm:grid-cols-2 sm:px-6 lg:px-20">
        {valid.map((item, index) => (
          <article
            key={item._key || `${item.title}-${index}`}
            className="flex gap-4 rounded-2xl border border-line bg-surface p-5 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:shadow-xl"
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-cream"
            >
              {index + 1}
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-extrabold text-brand">{item.title}</h3>
              {item.description && (
                <p className="leading-7 text-tertiary font-medium">{item.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

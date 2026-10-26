import { PortableText } from "next-sanity";
import Heading from "@/app/components/Heading";

export default function FullStoryContent({
  content,
  isUrdu = false,
}: {
  content?: any[] | null;
  isUrdu?: boolean;
}) {
  if (!Array.isArray(content) || content.length === 0) return null;

  return (
    <section aria-labelledby="full-story-heading" className="py-2">
      <div className="px-4 sm:px-10">
        <Heading name="Read the Complete Story" />
      </div>
      <div
        dir={isUrdu ? "rtl" : "ltr"}
        lang={isUrdu ? "ur" : "en"}
        className={`mx-2 mt-4 rounded-3xl border border-line bg-surface p-6 text-[19px] leading-9 text-tertiary shadow-md sm:mx-6 lg:mx-20 lg:p-10 ${
          isUrdu ? "font-urdu text-right" : "text-left"
        }`}
      >
        <PortableText
          value={content}
          components={{
            block: {
              h2: ({ children }: any) => <h2 className="mb-4 mt-8 text-2xl font-semibold">{children}</h2>,
              h3: ({ children }: any) => <h3 className="mb-3 mt-6 text-xl font-semibold">{children}</h3>,
              h4: ({ children }: any) => <h4 className="mb-2 mt-4 text-lg font-semibold">{children}</h4>,
              normal: ({ children }: any) => <p className="mb-4 leading-9">{children}</p>,
              blockquote: ({ children }: any) => (
                <blockquote className="my-4 border-s-4 border-gold/50 ps-4 italic opacity-80">
                  {children}
                </blockquote>
              ),
            },
            list: {
              bullet: ({ children }: any) => <ul className="mb-4 list-disc ps-6">{children}</ul>,
              number: ({ children }: any) => <ol className="mb-4 list-decimal ps-6">{children}</ol>,
            },
          }}
        />
      </div>
    </section>
  );
}

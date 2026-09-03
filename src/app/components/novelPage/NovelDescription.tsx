import { PortableText } from "next-sanity";
import React from "react";

export default function NovelDescription({
  descText,
  font,
  dir,
}: {
  descText: any;
  font: string;
  dir: string;
}) {
  // portable text
  const portableTextComponents = {
    block: {
      h2: ({ children }: any) => (
        <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-lg font-semibold mt-4 mb-2">{children}</h4>
      ),
      normal: ({ children }: any) => (
        <p className="mb-4 leading-relaxed">{children}</p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 pl-4 italic my-4 opacity-80">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc pl-6 mb-4">{children}</ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal pl-6 mb-4">{children}</ol>
      ),
    },
  };

  return (
    <div
      className={`px-5 sm:px-10 lg:px-24 text-start text-tertiary text-[19px] leading-9 whitespace-pre-wrap break-words ${font}`}
    >
      <h3 className="heading-stylish text-3xl lg:text-4xl font-bold mb-3 text-start">
        Summary
      </h3>
      <div dir={dir}>
        <PortableText value={descText} components={portableTextComponents} />
      </div>
      {/* <p>{descText}</p> */}
    </div>
  );
}

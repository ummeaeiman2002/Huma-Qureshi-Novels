import { PortableText } from "next-sanity";
import React from "react";

export default function AuthorNote({
  note,
  font,
  dir,
}: {
  note: any;
  font: string;
  dir: string;
}) {
  return (
    <div
      className={`px-5 sm:px-10 lg:px-24 text-start text-tertiary text-[19px] leading-9 whitespace-pre-wrap break-words ${font}`}
    >
      <h3 className="heading-stylish text-3xl lg:text-4xl font-bold mb-3 text-start">
        Author's Note
      </h3>
      <div dir={dir}>
        <p>{note}</p>
      </div>
    </div>
  );
}

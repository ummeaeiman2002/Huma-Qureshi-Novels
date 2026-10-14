import React from "react";

export default function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2.5 text-xs px-4 sm:px-10 font-semibold">
      {tags?.map((t: any, index: number) => (
        <span
          key={index}
          className="text-secondary border border-secondary/40 bg-secondary/10 px-3 py-1.5 rounded-full"
        >
          #{t}
        </span>
      ))}
    </div>
  );
}

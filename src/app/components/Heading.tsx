import React from "react";

export default function Heading({
  name,
  level = "h2",
  className,
}: {
  name: string;
  level?: "h1" | "h2";
  className?: string;
}) {
  const Tag = level === "h1" ? "h1" : "h2";
  return (
    <div className="flex items-center gap-4">
      <Tag
        className={`heading-stylish text-2xl lg:text-3xl font-bold ${
          className || ""
        }`}
      >
        {name}
      </Tag>
      <div className="flex items-center flex-1 max-w-[260px]">
        <div className="h-[3px] w-16 lg:w-24 rounded-full bg-gradient-to-r from-gold to-secondary"></div>
        <div className="w-2 h-2 rounded-full bg-secondary mx-1"></div>
        <div className="h-[3px] flex-1 rounded-full bg-secondary/30"></div>
      </div>
    </div>
  );
}

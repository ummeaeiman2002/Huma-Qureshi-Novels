import React from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  level?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  level = "h2",
  align = "left",
  tone = "light",
  className = "",
}: SectionHeadingProps) {
  const Tag = level;
  const isDark = tone === "dark";
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-2 ${alignClass} ${className}`}>
      {eyebrow ? (
        <span className={`ui-eyebrow ${isDark ? "text-gold" : "text-gold-dark"}`}>
          {eyebrow}
        </span>
      ) : null}
      <div className={`flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}>
        <Tag
          className={`heading-stylish text-2xl lg:text-3xl font-bold ${
            isDark ? "text-cream" : ""
          }`}
          style={isDark ? { color: "var(--color-cream)" } : undefined}
        >
          {title}
        </Tag>
        <span
          aria-hidden="true"
          className="hidden sm:flex items-center flex-1 max-w-[200px]"
        >
          <span className="h-[3px] w-12 lg:w-16 rounded-full bg-gradient-to-r from-gold to-brand" />
          <span className="w-2 h-2 rounded-full bg-brand mx-1" />
          <span className={`h-[3px] flex-1 rounded-full ${isDark ? "bg-cream/20" : "bg-brand/30"}`} />
        </span>
      </div>
      {subtitle ? (
        <p className={`leading-7 font-medium max-w-3xl ${isDark ? "text-cream/80" : "text-muted"}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

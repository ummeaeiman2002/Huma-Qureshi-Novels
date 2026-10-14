import React from "react";

export default function Themes({ themes }: { themes?: string[] }) {
  const valid = (themes || []).filter((t) => t && `${t}`.trim() !== "");
  if (valid.length === 0) return null;

  return (
    <section aria-labelledby="themes-heading" className="px-4 sm:px-10">
      <h2
        id="themes-heading"
        className="mb-3 text-sm font-extrabold uppercase tracking-wide text-gold-dark"
      >
        Themes &amp; Tropes
      </h2>
      <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
        {valid.map((t, index) => (
          <span
            key={`${t}-${index}`}
            className="rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-gold-dark"
          >
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

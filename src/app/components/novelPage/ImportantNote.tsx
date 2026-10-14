import React from "react";

export default function ImportantNote({
  note,
  title = "Important Note",
  tone = "brand",
}: {
  note?: string;
  title?: string;
  tone?: "brand" | "warning";
}) {
  if (!note) return null;
  const border = tone === "warning" ? "border-[#e65564]/50" : "border-gold/50";
  const label = tone === "warning" ? "text-[#c0363f]" : "text-gold-dark";

  return (
    <section aria-label={title} className="py-2">
      <div
        className={`mx-2 rounded-2xl border-2 ${border} bg-surface p-5 shadow-md sm:mx-6 lg:mx-20`}
      >
        <h3
          className={`mb-2 text-sm font-extrabold uppercase tracking-wide ${label}`}
        >
          {title}
        </h3>
        <p className="whitespace-pre-wrap break-words font-medium leading-8 text-tertiary">
          {note}
        </p>
      </div>
    </section>
  );
}

import React from "react";

interface StatsBarProps {
  items: { value: number; label: string }[];
}

export default function StatsBar({ items }: StatsBarProps) {
  return (
    <section aria-label="Library statistics" className="rounded-3xl bg-brand-deep px-6 py-8 lg:px-12 shadow-lg">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {items.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1 text-center">
            <span className="text-3xl lg:text-5xl font-extrabold text-gold leading-none">
              {s.value.toLocaleString()}
            </span>
            <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-cream/80">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
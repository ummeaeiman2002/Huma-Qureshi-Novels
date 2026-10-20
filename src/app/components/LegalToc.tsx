"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; label: string };

export default function LegalToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = items.find((item) => visible.has(item.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Table of contents" className="lg:sticky lg:top-28 lg:self-start">
      <span className="ui-eyebrow">Contents</span>
      <ol className="mt-4 flex flex-col border-l border-line">
        {items.map((item, index) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`-ms-px flex items-baseline gap-2 border-l-2 py-2 ps-3 text-[13px] font-semibold transition-colors duration-200 ${
                  isActive
                    ? "border-gold text-brand"
                    : "border-transparent text-muted hover:border-line hover:text-brand"
                }`}
              >
                <span
                  className={`w-5 shrink-0 text-[11px] font-bold tabular-nums ${
                    isActive ? "text-gold" : "text-muted/70"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="leading-5">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

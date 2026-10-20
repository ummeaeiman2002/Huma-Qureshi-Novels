import React from "react";
import Link from "next/link";
import type { Route } from "next";

type Highlight = { value: string | number; label: string };
type Action = { label: string; href: Route };

interface PageHeroProps {
  title: string;
  description?: string;
  accent?: string;
  badge?: string;
  /** Optional stat tiles shown in the side panel (overrides the default quick links). */
  highlights?: Highlight[];
  /** Optional call-to-action buttons. */
  actions?: Action[];
  /** Fully custom right-hand panel content. */
  aside?: React.ReactNode;
  align?: "left" | "center";
  children?: React.ReactNode;
}

const DEFAULT_LINKS: Action[] = [
  { label: "All Novels", href: "/novel" },
  { label: "About the Author", href: "/about" },
];

export default function PageHero({
  title,
  description,
  accent,
  badge,
  highlights,
  actions,
  aside,
  align = "left",
  children,
}: PageHeroProps) {
  const centered = align === "center";

  return (
    <section className="relative overflow-hidden rounded-3xl bg-brand-deep shadow-2xl ring-1 ring-gold/20">
      {/* Decorative background layers */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -right-20 h-96 w-96 rounded-full bg-brand-soft/30 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="hero-pattern absolute inset-0 opacity-[0.07]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.55fr_1fr] lg:items-center lg:gap-12 lg:p-12">
        {/* Main content */}
        <div className={`flex flex-col gap-4 ${centered ? "items-center text-center" : "items-start text-left"}`}>
          {badge && (
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              {badge}
            </span>
          )}

          <h1 className="font-display text-3xl font-extrabold leading-[1.1] text-cream sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <span
            aria-hidden="true"
            className={`h-1 w-24 rounded-full bg-gradient-to-r from-gold to-transparent ${centered ? "mx-auto" : ""}`}
          />

          {description && (
            <p className="max-w-2xl text-base leading-8 font-medium text-cream/85 lg:text-lg">
              {description}
            </p>
          )}

          {accent && (
            <p className="max-w-2xl text-base leading-8 font-semibold text-gold lg:text-lg">
              {accent}
            </p>
          )}

          {actions && actions.length > 0 && (
            <div className={`flex flex-wrap gap-3 pt-1 ${centered ? "justify-center" : ""}`}>
              {actions.map((action, i) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={
                    i === 0
                      ? "inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-brand-deep shadow-md transition-all duration-200 hover:bg-gold-dark hover:text-cream active:scale-95 sm:text-base"
                      : "inline-flex items-center gap-2 rounded-full border-2 border-cream/25 px-6 py-3 text-sm font-bold text-cream transition-all duration-200 hover:border-gold hover:text-gold active:scale-95 sm:text-base"
                  }
                >
                  {action.label}
                </Link>
              ))}
            </div>
          )}

          {children}
        </div>

        {/* Side panel */}
        <div>
          {aside ? (
            aside
          ) : highlights && highlights.length > 0 ? (
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {highlights.map((h) => (
                <div
                  key={h.label}
                  className="rounded-2xl border border-gold/20 bg-white/5 p-4 text-center backdrop-blur-sm"
                >
                  <dt className="sr-only">{h.label}</dt>
                  <dd className="text-2xl font-extrabold text-gold lg:text-3xl">
                    {typeof h.value === "number" ? h.value.toLocaleString() : h.value}
                  </dd>
                  <dd className="mt-1 text-[11px] font-bold uppercase tracking-wide text-cream/70">
                    {h.label}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="rounded-2xl border border-cream/15 bg-white/5 p-5 backdrop-blur-sm lg:p-6">
              <p className="ui-eyebrow text-gold">Explore the Library</p>
              <ul className="mt-4 flex flex-col gap-2">
                {DEFAULT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center justify-between rounded-xl border border-transparent bg-brand/30 px-4 py-3 text-sm font-semibold text-cream transition-all duration-200 hover:border-gold/40 hover:bg-brand/50"
                    >
                      {link.label}
                      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import type { ReactNode } from "react";

const bodyText = "text-sm leading-7 text-ink/90 sm:text-[15px] sm:leading-8";

export function LegalP({ children }: { children: ReactNode }) {
  return <p className={bodyText}>{children}</p>;
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 ps-5 marker:text-gold">
      {items.map((item, i) => (
        <li key={i} className={bodyText}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function LegalStrong({ children }: { children: ReactNode }) {
  return <strong className="font-bold text-gold-dark">{children}</strong>;
}

export function LegalLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className="font-bold text-brand underline underline-offset-4 transition hover:text-gold"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function LegalMeta({
  summary,
  effectiveDate,
  contactEmail,
}: {
  summary: ReactNode;
  effectiveDate: string;
  contactEmail: string;
}) {
  return (
    <section className="rounded-3xl border border-gold/30 bg-surface p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="ui-eyebrow">Legal Document</span>
        <span aria-hidden="true" className="h-1 w-10 rounded-full bg-gradient-to-r from-gold to-transparent" />
      </div>

      <div className="mt-4 flex flex-col gap-3">{summary}</div>

      <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-dark">
            Effective
          </dt>
          <dd className="text-sm font-semibold text-brand">{effectiveDate}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-dark">
            Website
          </dt>
          <dd className="text-sm font-semibold text-brand">humaqureshinovels.com</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-dark">
            Contact
          </dt>
          <dd className="break-all text-sm font-semibold text-brand">{contactEmail}</dd>
        </div>
      </dl>
    </section>
  );
}

export default function LegalSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-32 rounded-3xl border border-line bg-surface p-5 shadow-sm transition-colors duration-300 sm:p-6 lg:p-8"
    >
      <div className="flex items-center gap-3 border-b border-line pb-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-display text-sm font-extrabold tabular-nums text-gold-dark">
          {number}
        </span>
        <h2
          id={`${id}-heading`}
          className="font-display text-xl font-extrabold leading-snug text-brand sm:text-2xl"
        >
          {title}
        </h2>
      </div>

      <div className="flex flex-col gap-3.5 pt-4">{children}</div>
    </section>
  );
}

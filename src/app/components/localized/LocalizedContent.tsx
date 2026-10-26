"use client";

import { useState } from "react";
import { PortableText } from "next-sanity";
import Heading from "@/app/components/Heading";

export type Language = "ur" | "en";
export type LocalizedTextValue = { ur?: string | null; en?: string | null };
export type LocalizedBlocksValue = { ur?: any[] | null; en?: any[] | null };

function cleanText(value?: string | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? value as string : "";
}

function hasBlocks(value?: any[] | null) {
  return Array.isArray(value) && value.length > 0;
}

function initialLanguage(hasUr: boolean, hasEn: boolean): Language {
  if (hasUr) return "ur";
  return hasEn ? "en" : "ur";
}

export function LanguageSwitch({
  language,
  onChange,
  hasUr,
  hasEn,
  label,
}: {
  language: Language;
  onChange: (language: Language) => void;
  hasUr: boolean;
  hasEn: boolean;
  label: string;
}) {
  if (!hasUr || !hasEn) return null;

  return (
    <div
      role="group"
      aria-label={`${label} language`}
      className="flex flex-wrap items-center gap-1.5"
    >
      <span className="text-[11px] font-bold uppercase tracking-wide text-gold-dark">
        Language
      </span>
      {(["ur", "en"] as Language[]).map((key) => {
        const active = language === key;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(key)}
            className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
              active
                ? "border-brand bg-brand text-cream"
                : "border-line bg-surface text-brand hover:border-brand"
            }`}
          >
            {key === "ur" ? "اردو" : "English"}
          </button>
        );
      })}
    </div>
  );
}

/**
 * A single localized text section. Every instance owns its own language state,
 * so changing this section never changes any other section.
 */
export function LocalizedTextSection({
  value,
  legacy,
  legacyIsUrdu = false,
  heading,
  id,
  className = "",
  textClassName = "",
}: {
  value?: LocalizedTextValue | null;
  legacy?: string | null;
  legacyIsUrdu?: boolean;
  heading?: string;
  id?: string;
  className?: string;
  textClassName?: string;
}) {
  const urValue = cleanText(value?.ur);
  const enValue = cleanText(value?.en);
  const hasLocalized = Boolean(urValue || enValue);

  const ur = hasLocalized ? urValue : legacyIsUrdu ? cleanText(legacy) : "";
  const en = hasLocalized ? enValue : !legacyIsUrdu ? cleanText(legacy) : "";

  const hasUr = Boolean(ur);
  const hasEn = Boolean(en);
  const [language, setLanguage] = useState<Language>(() => initialLanguage(hasUr, hasEn));

  if (!hasUr && !hasEn) return null;

  const active: Language = language === "ur" && hasUr ? "ur" : language === "en" && hasEn ? "en" : hasUr ? "ur" : "en";
  const text = active === "ur" ? ur : en;

  return (
    <section aria-labelledby={id} className={className || "py-2"}>
      {(heading || (hasUr && hasEn)) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-10">
          {heading ? <Heading name={heading} /> : <span />}
          <LanguageSwitch
            language={language}
            onChange={setLanguage}
            hasUr={hasUr}
            hasEn={hasEn}
            label={heading || "Section"}
          />
        </div>
      )}
      <div
        id={id}
        dir={active === "ur" ? "rtl" : "ltr"}
        lang={active === "ur" ? "ur" : "en"}
        className={`px-5 text-[19px] leading-9 text-tertiary whitespace-pre-wrap break-words sm:px-10 lg:px-24 ${
          active === "ur" ? "font-urdu text-right" : "text-left"
        } ${textClassName}`}
      >
        {text}
      </div>
    </section>
  );
}

const portableComponents = {
  block: {
    h2: ({ children }: any) => <h2 className="mt-8 mb-4 text-2xl font-semibold">{children}</h2>,
    h3: ({ children }: any) => <h3 className="mt-6 mb-3 text-xl font-semibold">{children}</h3>,
    h4: ({ children }: any) => <h4 className="mt-4 mb-2 text-lg font-semibold">{children}</h4>,
    normal: ({ children }: any) => <p className="mb-4 leading-9">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="my-4 border-s-4 border-gold/50 ps-4 italic opacity-80">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="mb-4 list-disc ps-6">{children}</ul>,
    number: ({ children }: any) => <ol className="mb-4 list-decimal ps-6">{children}</ol>,
  },
};

/**
 * Rich-text localized section with its own independent language selector.
 */
export function LocalizedRichTextSection({
  value,
  heading,
  id,
  className = "",
}: {
  value?: LocalizedBlocksValue | null;
  heading?: string;
  id?: string;
  className?: string;
}) {
  const ur = hasBlocks(value?.ur);
  const en = hasBlocks(value?.en);
  const [language, setLanguage] = useState<Language>(() => initialLanguage(ur, en));

  if (!ur && !en) return null;

  const active: Language = language === "ur" && ur ? "ur" : language === "en" && en ? "en" : ur ? "ur" : "en";
  const blocks = active === "ur" ? value?.ur : value?.en;

  return (
    <section aria-labelledby={id} className={className || "py-2"}>
      {(heading || (ur && en)) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-10">
          {heading ? <Heading name={heading} /> : <span />}
          <LanguageSwitch
            language={language}
            onChange={setLanguage}
            hasUr={ur}
            hasEn={en}
            label={heading || "Section"}
          />
        </div>
      )}
      <div
        id={id}
        dir={active === "ur" ? "rtl" : "ltr"}
        lang={active === "ur" ? "ur" : "en"}
        className={`px-5 text-[19px] leading-9 text-tertiary break-words sm:px-10 lg:px-24 ${
          active === "ur" ? "font-urdu text-right" : "text-left"
        }`}
      >
        {blocks ? <PortableText value={blocks} components={portableComponents} /> : null}
      </div>
    </section>
  );
}

export function LocalizedNovelTitle({
  value,
  fallback,
  englishFallback,
  className = "",
}: {
  value?: LocalizedTextValue | null;
  fallback?: string | null;
  englishFallback?: string | null;
  className?: string;
}) {
  const ur = cleanText(value?.ur) || cleanText(fallback);
  const en = cleanText(value?.en) || cleanText(englishFallback) || ur;
  const hasUr = Boolean(ur);
  const hasEn = Boolean(en);
  const [language, setLanguage] = useState<Language>(() => initialLanguage(hasUr, hasEn));

  if (!hasUr && !hasEn) return null;

  const active: Language = language === "ur" && hasUr ? "ur" : language === "en" && hasEn ? "en" : hasUr ? "ur" : "en";
  const text = active === "ur" ? ur : en;

  return (
    <div className={`flex flex-col items-center gap-2 lg:items-start ${className}`}>
      <h1
        dir={active === "ur" ? "rtl" : "ltr"}
        lang={active === "ur" ? "ur" : "en"}
        className={`text-2xl font-bold title-bright lg:text-4xl ${active === "ur" ? "font-urdu" : ""}`}
      >
        {text}
      </h1>
      <LanguageSwitch
        language={language}
        onChange={setLanguage}
        hasUr={hasUr}
        hasEn={hasEn}
        label="Novel title"
      />
    </div>
  );
}

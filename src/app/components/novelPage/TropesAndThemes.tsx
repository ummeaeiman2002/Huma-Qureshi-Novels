"use client";

import { useState } from "react";
import { LanguageSwitch, type Language } from "@/app/components/localized/LocalizedContent";

type Trope = {
  _id?: string;
  labelUr?: string;
  labelEn?: string;
};

function text(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

export default function TropesAndThemes({
  tropes,
  themes,
  heading = "Tropes & Themes",
}: {
  tropes?: Trope[] | null;
  themes?: string[] | null;
  heading?: string;
}) {
  const validTropes = (tropes || []).filter((t) => t && (text(t.labelUr) || text(t.labelEn)));
  const legacy = (themes || []).map((t) => `${t}`.trim()).filter(Boolean);

  const hasUrdu = validTropes.some((t) => text(t.labelUr));
  const hasEnglish = validTropes.some((t) => text(t.labelEn));
  const [language, setLanguage] = useState<Language>(hasUrdu ? "ur" : "en");

  const useControlled = validTropes.length > 0;
  if (!useControlled && legacy.length === 0) return null;

  const active: Language =
    language === "ur" && hasUrdu ? "ur" : language === "en" && hasEnglish ? "en" : hasUrdu ? "ur" : "en";

  const pills = useControlled
    ? validTropes
        .map((t) =>
          active === "ur"
            ? text(t.labelUr) || text(t.labelEn)
            : text(t.labelEn) || text(t.labelUr),
        )
        .filter(Boolean)
    : legacy;

  return (
    <section aria-label={heading} className="px-4 sm:px-10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-gold-dark">{heading}</h2>
        {useControlled && (
          <LanguageSwitch
            language={language}
            onChange={setLanguage}
            hasUr={hasUrdu}
            hasEn={hasEnglish}
            label={heading}
          />
        )}
      </div>
      <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
        {pills.map((t, index) => (
          <span
            key={`${t}-${index}`}
            dir={active === "ur" && useControlled ? "rtl" : "ltr"}
            lang={active === "ur" && useControlled ? "ur" : "en"}
            className={`rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-gold-dark ${
              active === "ur" && useControlled ? "font-urdu" : ""
            }`}
          >
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

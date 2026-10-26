"use client";

import { useState } from "react";
import Heading from "@/app/components/Heading";
import { LanguageSwitch, type Language } from "@/app/components/localized/LocalizedContent";

function text(value?: string | null) {
  return typeof value === "string" ? value.trim() : "";
}

export default function DownloadSection({
  data,
  slug,
  type = "novel",
  heading = "Download PDF",
}: {
  data: any;
  slug: string;
  type?: "novel" | "pdf";
  heading?: string;
}) {
  const fileUrl = data?.downloadfile?.asset?.url || "";
  const externalUrl = data?.externaldownloadurl || "";
  const legacyUrl = data?.pdfurl || "";
  const availability = data?.pdfAvailability || "";

  const pdfUrl =
    availability === "unavailable"
      ? ""
      : fileUrl || externalUrl || (legacyUrl.indexOf("http") === 0 ? legacyUrl : "");
  if (!pdfUrl) return null;

  const instructionsUr = text(data?.downloadInstructions?.ur);
  const instructionsEn = text(data?.downloadInstructions?.en);
  const legacyInstructions = text(data?.downloaddescription);
  const hasInstructions = Boolean(instructionsUr || instructionsEn || legacyInstructions);
  const hasUrduInstructions = Boolean(instructionsUr || (!instructionsEn && legacyInstructions));
  const hasEnglishInstructions = Boolean(instructionsEn || (!instructionsUr && legacyInstructions));
  const [language, setLanguage] = useState<Language>(hasUrduInstructions ? "ur" : "en");

  const activeLanguage: Language =
    language === "ur" && hasUrduInstructions
      ? "ur"
      : language === "en" && hasEnglishInstructions
        ? "en"
        : hasUrduInstructions
          ? "ur"
          : "en";
  const instructions =
    activeLanguage === "ur"
      ? instructionsUr || legacyInstructions || instructionsEn
      : instructionsEn || legacyInstructions || instructionsUr;

  const format = data?.downloadformat || data?.fileformat || "PDF";
  const size =
    data?.downloadsize ||
    data?.filesize ||
    (data?.downloadfile?.asset?.size
      ? `${(data.downloadfile.asset.size / (1024 * 1024)).toFixed(1)} MB`
      : "");
  const title = data?.downloadtitle || heading;
  const label = data?.downloadbuttonlabel || "Download PDF";
  const pageCount = data?.numberofpages || data?.pdfnumberofpages || data?.pageCount;
  const edition = data?.edition;

  const href = `/download/${slug}`;

  return (
    <section aria-label="Download PDF" className="py-2">
      <Heading name="Download PDF" />
      <div className="mx-2 flex flex-col items-center gap-4 rounded-3xl border-2 border-brand/30 bg-cream-soft p-6 text-center shadow-lg sm:mx-6 lg:mx-20 lg:p-8">
        <h3 className="text-xl font-extrabold text-brand">{title}</h3>
        {hasInstructions && (
          <div className="flex w-full max-w-2xl flex-col items-center gap-2">
            <LanguageSwitch
              language={language}
              onChange={setLanguage}
              hasUr={hasUrduInstructions}
              hasEn={hasEnglishInstructions}
              label="Download instructions"
            />
            <p
              dir={activeLanguage === "ur" ? "rtl" : "ltr"}
              lang={activeLanguage === "ur" ? "ur" : "en"}
              className={`leading-7 text-tertiary ${
                activeLanguage === "ur" ? "font-urdu text-right" : "font-medium text-center"
              }`}
            >
              {instructions}
            </p>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold uppercase tracking-wide text-gold-dark">
          <span className="rounded-full border border-line bg-surface px-3 py-1">
            Format: {format}
          </span>
          {size && (
            <span className="rounded-full border border-line bg-surface px-3 py-1">
              Size: {size}
            </span>
          )}
          {pageCount ? (
            <span className="rounded-full border border-line bg-surface px-3 py-1">
              Pages: {pageCount}
            </span>
          ) : null}
          {edition && (
            <span className="rounded-full border border-line bg-surface px-3 py-1">
              {edition}
            </span>
          )}
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-brand-dark hover:shadow-[0_0_20px_rgba(164,135,80,0.4)] active:scale-95 sm:text-base"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {label}
        </a>
      </div>
    </section>
  );
}

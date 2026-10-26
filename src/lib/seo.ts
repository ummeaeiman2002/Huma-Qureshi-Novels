export const SITE_URL = "https://humaqureshinovels.com";
export const SITE_NAME = "Huma Qureshi Novels";

export function absoluteUrl(path = "") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatSafeDate(value: unknown, locale = "en-GB"): string {
  if (!value || typeof value !== "string") return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const s = d.toLocaleDateString(locale);
  return s === "Invalid Date" ? "" : s;
}

export function isValidUrl(value: unknown): boolean {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function cleanDescription(value: unknown, fallback: string) {
  if (!value) return fallback;
  let text = "";
  if (typeof value === "string") {
    text = value.replace(/\s+/g, " ").trim();
  } else if (Array.isArray(value)) {
    text = value
      .map((block: any) =>
        Array.isArray(block?.children)
          ? block.children.map((child: any) => child?.text || "").join(" ")
          : "",
      )
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }
  if (!text) return fallback;
  if (text.length <= 160) return text;
  const truncated = text.slice(0, 160);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

export function cleanDescriptionLong(value: unknown, fallback: string) {
  if (!value) return fallback;
  let text = "";
  if (typeof value === "string") {
    text = value.replace(/\s+/g, " ").trim();
  } else if (Array.isArray(value)) {
    text = value
      .map((block: any) =>
        Array.isArray(block?.children)
          ? block.children.map((child: any) => child?.text || "").join(" ")
          : "",
      )
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }
  if (!text) return fallback;
  if (text.length <= 420) return text;
  const truncated = text.slice(0, 420);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

type SummaryFields = {
  summary?: unknown;
  shortdescription?: unknown;
  pdfshortdescription?: unknown;
  noveldescription?: unknown;
  pdfdescription?: unknown;
  seodescription?: unknown;
  tagline?: unknown;
};

function localizedText(value: unknown): unknown {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    for (const key of ["en", "ur", "urdu", "english"]) {
      if (cleanDescriptionLong(record[key], "")) return record[key];
    }
    return "";
  }
  return value;
}

/**
 * Resolves the best available card summary for a novel or PDF, supporting both
 * the newer Sanity fields (summary / SEO description / tagline) and legacy
 * rich-text descriptions. Never fabricates content — returns "" when nothing
 * is available.
 */
export function resolveSummary(source: SummaryFields | null | undefined, fallback = ""): string {
  if (!source) return fallback;
  const candidates = [
    source.summary,
    source.shortdescription,
    source.pdfshortdescription,
    source.noveldescription,
    source.pdfdescription,
    source.seodescription,
    source.tagline,
  ];
  for (const candidate of candidates) {
    const text = cleanDescriptionLong(localizedText(candidate), "");
    if (text) return text;
  }
  return fallback;
}

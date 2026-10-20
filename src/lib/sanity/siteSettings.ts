import { cache } from "react";
import { client } from "@/sanity/lib/client";
import { DEFAULT_SITE_IMAGES, SITE_IMAGE_KEYS, type SiteImages } from "@/lib/siteDefaults";

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  "logo": logo.asset->url,
  "heroImage": heroImage.asset->url,
  "authorImage": authorImage.asset->url,
  "defaultBanner": defaultBanner.asset->url,
  "socialFacebookIcon": socialFacebookIcon.asset->url,
  "socialYoutubeIcon": socialYoutubeIcon.asset->url,
  "socialInstagramIcon": socialInstagramIcon.asset->url,
  "socialEmailIcon": socialEmailIcon.asset->url,
  "locationIcon": locationIcon.asset->url,
  "searchIcon": searchIcon.asset->url,
  "backToTopIcon": backToTopIcon.asset->url,
  "downloadIcon": downloadIcon.asset->url,
  "youtubePlayIcon": youtubePlayIcon.asset->url
}`;

const FALLBACK: SiteImages = DEFAULT_SITE_IMAGES;

export type SiteSummaryImage = { url: string; alt: string };

export type SiteSummary = {
  eyebrow: string;
  title: string;
  titleUrdu: string;
  text: string;
  textUrdu: string;
  images: SiteSummaryImage[];
};

export const EMPTY_SITE_SUMMARY: SiteSummary = {
  eyebrow: "",
  title: "",
  titleUrdu: "",
  text: "",
  textUrdu: "",
  images: [],
};

const SITE_SUMMARY_QUERY = `*[_type == "siteSettings"][0]{
  "eyebrow": summaryEyebrow,
  "title": summaryTitle,
  "titleUrdu": summaryTitleUrdu,
  "text": summaryText,
  "textUrdu": summaryTextUrdu,
  "images": summaryImages[]{
    "url": asset->url,
    "alt": coalesce(alt, "")
  }
}`;

export const getSiteSummary = cache(async (): Promise<SiteSummary> => {
  try {
    const data = await client.fetch<Partial<SiteSummary> | null>(
      SITE_SUMMARY_QUERY,
      {},
      { next: { revalidate: 300, tags: ["siteSettings"] } }
    );
    if (!data) return EMPTY_SITE_SUMMARY;
    const images = Array.isArray(data.images)
      ? data.images
          .filter((img): img is SiteSummaryImage => !!img && typeof img.url === "string" && img.url.length > 0)
          .slice(0, 3)
      : [];
    return {
      eyebrow: typeof data.eyebrow === "string" ? data.eyebrow : "",
      title: typeof data.title === "string" ? data.title : "",
      titleUrdu: typeof data.titleUrdu === "string" ? data.titleUrdu : "",
      text: typeof data.text === "string" ? data.text : "",
      textUrdu: typeof data.textUrdu === "string" ? data.textUrdu : "",
      images,
    };
  } catch {
    return EMPTY_SITE_SUMMARY;
  }
});

export const getSiteSettings = cache(async (): Promise<SiteImages> => {
  try {
    const data = await client.fetch<Partial<SiteImages> | null>(
      SITE_SETTINGS_QUERY,
      {},
      { next: { revalidate: 300, tags: ["siteSettings"] } }
    );
    if (!data) return FALLBACK;
    const merged: SiteImages = { ...DEFAULT_SITE_IMAGES };
    for (const key of SITE_IMAGE_KEYS) {
      const value = data[key];
      if (typeof value === "string" && value.length > 0) merged[key] = value;
    }
    return merged;
  } catch {
    return FALLBACK;
  }
});

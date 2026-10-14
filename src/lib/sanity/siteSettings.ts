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

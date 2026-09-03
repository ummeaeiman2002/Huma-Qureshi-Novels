import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

async function getUrls() {
  const data = await client.fetch<{
    novels: { slug: { current: string } }[];
    pdfs: { slug: { current: string } }[];
    episodes: { novelSlug: string; episodeSlug: string }[];
  }>(
    `{
      "novels": *[_type == "novelparent" && defined(slug.current)] { slug },
      "pdfs": *[_type == "pdf" && defined(slug.current)] { slug },
      "episodes": *[_type == "novel" && defined(episodeslug.current) && novelparent->slug.current != null] { "novelSlug": novelparent->slug.current, "episodeSlug": episodeslug.current }
    }`,
    {},
    { next: { revalidate: 3600 } },
  );

  const staticPages = ["", "/about", "/contact", "/privacypolicy", "/terms", "/novel", "/pdf", "/short-stories"];
  const urls: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));

  for (const novel of data?.novels || []) {
    urls.push({ url: `${SITE_URL}/novel/${novel.slug.current}`, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const pdf of data?.pdfs || []) {
    urls.push({ url: `${SITE_URL}/pdf/${pdf.slug.current}`, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const ep of data?.episodes || []) {
    urls.push({ url: `${SITE_URL}/novel/${ep.novelSlug}/${ep.episodeSlug}`, changeFrequency: "daily", priority: 0.7 });
  }

  return urls;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    return await getUrls();
  } catch {
    return [];
  }
}

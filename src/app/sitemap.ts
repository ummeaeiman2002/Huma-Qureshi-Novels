import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

async function getUrls() {
  const data = await client.fetch<{
    novels: { slug: { current: string } }[];
    pdfs: { slug: { current: string } }[];
    episodes: { novelSlug: string; episodeSlug: string }[];
    writers: { slug: string }[];
    downloadables: { slug: string }[];
  }>(
    `{
      "novels": *[_type == "novelparent" && defined(slug.current) && writer->writername == "Huma Qureshi" && !coalesce(noIndex, false)] { slug },
      "pdfs": *[_type == "pdf" && defined(slug.current) && writer->writername == "Huma Qureshi"] { slug },
      "episodes": *[_type == "novel" && defined(episodeslug.current) && novelparent->slug.current != null && novelparent->writer->writername == "Huma Qureshi" && !coalesce(novelparent->noIndex, false)] { "novelSlug": novelparent->slug.current, "episodeSlug": episodeslug.current },
      "writers": *[_type == "writer" && defined(writerslug.current) && (count(*[_type == "novelparent" && references(^._id)]) > 0 || count(*[_type == "pdf" && references(^._id)]) > 0)] { "slug": writerslug.current },
      "downloadables": *[(_type == "novelparent" || _type == "pdf") && defined(slug.current) && writer->writername == "Huma Qureshi" && !coalesce(noIndex, false) && (defined(downloadfile.asset) || defined(externaldownloadurl) || (defined(pdfurl) && string::startsWith(pdfurl, "http"))) && coalesce(pdfAvailability, "available") != "unavailable"] { "slug": slug.current }
    }`,
    {},
    { next: { revalidate: 3600 } },
  );

  const staticPages = ["", "/about", "/contact", "/privacypolicy", "/terms", "/novel"];
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
  for (const writer of data?.writers || []) {
    urls.push({ url: `${SITE_URL}/writer/${writer.slug}`, changeFrequency: "monthly", priority: 0.7 });
  }
  const seenDownload = new Set<string>();
  for (const item of data?.downloadables || []) {
    const s = item.slug;
    if (!s || seenDownload.has(s)) continue;
    seenDownload.add(s);
    urls.push({ url: `${SITE_URL}/download/${s}`, changeFrequency: "weekly", priority: 0.6 });
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

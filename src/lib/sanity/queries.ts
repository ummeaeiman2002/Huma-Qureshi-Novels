// src/lib/sanity/queries.ts
import { client, optimizedClient } from "@/sanity/lib/client";
import { NovelCache } from "./cache";

// This website only publishes content by Huma Qureshi.
export const HUMA_WRITER_NAME = "Huma Qureshi";
export const HUMA_WRITER_FILTER = `writer->writername == "${HUMA_WRITER_NAME}"`;

function textSummary(value: unknown): string {
  if (!value) return "";
  let text = "";
  if (typeof value === "string") {
    text = value;
  } else if (Array.isArray(value)) {
    text = value
      .map((block: any) =>
        Array.isArray(block?.children)
          ? block.children.map((child: any) => child?.text || "").join(" ")
          : "",
      )
      .join(" ");
  }
  return text.replace(/\s+/g, " ").trim().slice(0, 420);
}

export async function getPaginatedNovels(page: number = 0, limit: number = 20) {
  // Check cache first
  const cached = NovelCache.getNovelsPage(page, limit);
  if (cached) {
    return cached;
  }

  const startIndex = page * limit;
  const endIndex = startIndex + limit;

  // Fetch novels with pagination
  const novelsQuery = `*[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && ${HUMA_WRITER_FILTER}] | order(_createdAt desc) [${startIndex}...${endIndex}] {
    title,
    englishtitle,
    banner,
    _id,
    _createdAt,
    slug,
    novelreleasedate,
    noveldescription,
    shortdescription,
    novelstatus,
    "isShortStory": coalesce(isShortStory, false),
    youtubeurl,
    tags,
    genre->{genrename},
    writer->{writername}
  }`;

  const novels = await optimizedClient.fetchWithTags(novelsQuery, [`novels-page-${page}`, 'novels']);

  // Fetch all episodes for calculating views
  const episodesQuery = `*[_type == "novel"] {
    _id,
    novelparent,
    views,
    monthlyViews
  }`;

  const episodes = await optimizedClient.fetchWithTags(episodesQuery, ['episodes']);

  // Map episodes to novels to calculate totals
  const novelsWithCalculatedViews = novels
    .filter((novel:any) => novel && novel._id) // Filter out null/undefined novels
    .map((novel: any) => {
      const novelEpisodes = episodes.filter(
        (episode: any) =>
          episode.novelparent && episode.novelparent._ref === novel._id
      );

      const totalViews = novelEpisodes.reduce(
        (sum: number, episode: any) => sum + (episode.views || 0),
        0
      );

      const totalMonthlyViews = novelEpisodes.reduce(
        (sum: number, episode: any) => sum + (episode.monthlyViews || 0),
        0
      );

      return {
        ...novel,
        summary: novel.shortdescription || textSummary(novel.noveldescription),
        episodeCount: novelEpisodes.length,
        totalViews,
        totalMonthlyViews,
      };
    });

  // Cache the results
  NovelCache.setNovelsPage(page, limit, novelsWithCalculatedViews);

  return novelsWithCalculatedViews;
}

export async function getNovelsByCategory(categorySlug: string) {
  const novelsQuery = `*[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && ${HUMA_WRITER_FILTER} && category->categoryslug.current == $categorySlug] | order(_createdAt desc) {
    title,
    englishtitle,
    banner,
    _id,
    _createdAt,
    slug,
    novelreleasedate,
    noveldescription,
    shortdescription,
    youtubeurl,
    tags,
    genre->{genrename},
    category->{categoryname, "slug": categoryslug.current},
    writer->{writername}
  }`;

  const novels = await optimizedClient.fetchWithTags(
    novelsQuery,
    [`novels-category-${categorySlug}`, "novels"],
    { categorySlug }
  );

  const episodes = await optimizedClient.fetchWithTags(
    `*[_type == "novel"] { _id, novelparent, views, monthlyViews }`,
    ["episodes"]
  );

  return (Array.isArray(novels) ? novels : [])
    .filter((novel: any) => novel && novel._id)
    .map((novel: any) => {
      const novelEpisodes = episodes.filter(
        (episode: any) =>
          episode.novelparent && episode.novelparent._ref === novel._id
      );

      return {
        ...novel,
        summary: novel.shortdescription || textSummary(novel.noveldescription),
        totalViews: novelEpisodes.reduce(
          (sum: number, episode: any) => sum + (episode.views || 0),
          0
        ),
        totalMonthlyViews: novelEpisodes.reduce(
          (sum: number, episode: any) => sum + (episode.monthlyViews || 0),
          0
        ),
      };
    });
}

export async function getAllMetadata() {
  // Check cache first
  const cachedWriters = NovelCache.getMetadata("writers");
  const cachedGenres = NovelCache.getMetadata("genres");

  if (cachedWriters && cachedGenres) {
    return { writers: cachedWriters, genres: cachedGenres };
  }

  // Fetch writers and genres separately for better caching
  const [writers, genres] = await Promise.all([
    optimizedClient.fetchWithTags(`*[_type == "writer" && writername == "${HUMA_WRITER_NAME}"] { writername }.writername`, ['writers']),
    optimizedClient.fetchWithTags(`*[_type == "genre"] { genrename }.genrename`, ['genres']),
  ]);

  // Ensure arrays are not null/undefined and filter out invalid entries
  const validWriters = Array.isArray(writers)
    ? writers.filter((w) => w != null)
    : [];
  const validGenres = Array.isArray(genres)
    ? genres.filter((g) => g != null)
    : [];

  // Cache the results
  NovelCache.setMetadata("writers", validWriters);
  NovelCache.setMetadata("genres", validGenres);

  return { writers: validWriters, genres: validGenres };
}

export async function getTotalNovelCount() {
  const countQuery = `count(*[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && ${HUMA_WRITER_FILTER}])`;
  const count = await client.fetch(countQuery);
  return count;
}

// PDF-related functions
export async function getPaginatedPDFs(page: number = 0, limit: number = 20) {
  const startIndex = page * limit;
  const endIndex = startIndex + limit;

  // Fetch PDFs with pagination
  const pdfsQuery = `*[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now() && ${HUMA_WRITER_FILTER}] | order(_createdAt desc) [${startIndex}...${endIndex}] {
    title,
    banner,
    _id,
    _createdAt,
    slug,
    pdfreleasedate,
    pdfdescription,
    pdfshortdescription,
    pdfurl,
    downloadformat,
    downloadsize,
    pdfnumberofpages,
    youtubeurl,
    genre->{genrename},
    writer->{writername},
    views,
    monthlyViews
  }`;

  const pdfs = await optimizedClient.fetchWithTags(pdfsQuery, [`pdfs-page-${page}`, 'pdfs']);

  // Calculate total and monthly views for PDFs (they have these fields directly)
  const pdfsWithCalculatedViews = pdfs
    .filter((pdf:any) => pdf && pdf._id) // Filter out null/undefined pdfs
    .map((pdf: any) => ({
      ...pdf,
      summary: pdf.pdfshortdescription || textSummary(pdf.pdfdescription),
      totalViews: pdf.views || 0,
      totalMonthlyViews: pdf.monthlyViews || 0,
    }));

  return pdfsWithCalculatedViews;
}

export async function getTotalPDFCount() {
  const countQuery = `count(*[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now() && ${HUMA_WRITER_FILTER}])`;
  const count = await client.fetch(countQuery);
  return count;
}

// Combined listing helpers — fetch every item (no pagination) for the unified "All Novels" page.
export async function getAllNovels() {
  const novels = await getPaginatedNovels(0, 1000);
  return (Array.isArray(novels) ? novels : []).map((novel: any) => ({
    ...novel,
    _kind: "novel" as const,
    date: novel.novelreleasedate,
  }));
}

export async function getAllPDFs() {
  const pdfs = await getPaginatedPDFs(0, 1000);
  return (Array.isArray(pdfs) ? pdfs : []).map((pdf: any) => ({
    ...pdf,
    _kind: "pdf" as const,
    date: pdf.pdfreleasedate,
  }));
}

// Prefetch utility for common pages
export async function prefetchPages(startPage: number, pageCount: number = 3) {
  const promises = [];
  for (let i = startPage; i < startPage + pageCount; i++) {
    // Check if already cached before prefetching
    if (!NovelCache.getNovelsPage(i, 20)) {
      promises.push(getPaginatedNovels(i, 20));
    }
  }
  return Promise.all(promises);
}

// Prefetch utility for PDFs
export async function prefetchPDFPages(
  startPage: number,
  pageCount: number = 3
) {
  const promises = [];
  for (let i = startPage; i < startPage + pageCount; i++) {
    promises.push(getPaginatedPDFs(i, 20));
  }
  return Promise.all(promises);
}

// Writer / Author queries
export async function getWriterBySlug(slug: string) {
  const query = `*[_type == "writer" && coalesce(writerslug.current, "") == $slug][0]{
    _id,
    writername,
    writercardimageurl,
    "writerimage": writerimage.asset->url,
    writerbio,
    writerbiofull,
    writerslug,
    sociallinks[]{_key, label, url}
  }`;
  return optimizedClient.fetchWithTags(query, [`writer-${slug}`, "writers"], { slug });
}

// Reader review images (testimonials) shown in the review marquee
export async function getTestimonials(limit: number = 12) {
  const query = `*[_type == "testimonial" && coalesce(active, true) == true && defined(image.asset)] | order(coalesce(order, 999999) asc, timestamp desc) [0...$limit] {
    _id,
    name,
    quote,
    platform,
    rating,
    link,
    timestamp,
    order,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt
  }`;
  return optimizedClient.fetchWithTags(query, ["testimonials"], { limit });
}

export async function getNovelsByWriter(writerId: string, limit: number = 60) {
  const query = `*[_type == "novelparent" && writer._ref == $writerId && defined(novelreleasedate) && novelreleasedate <= now()] | order(_createdAt desc) [0...$limit] {
    title,
    englishtitle,
    banner,
    _id,
    _createdAt,
    slug,
    novelreleasedate,
    noveldescription,
    shortdescription,
    "isShortStory": coalesce(isShortStory, false),
    genre->{genrename},
    writer->{writername}
  }`;
  return optimizedClient.fetchWithTags(query, [
    `writer-novels-${writerId}`,
    "novels",
  ], { writerId, limit });
}

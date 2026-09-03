// src/lib/sanity/queries.ts
import { client, optimizedClient } from "@/sanity/lib/client";
import { NovelCache } from "./cache";

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
  const novelsQuery = `*[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now()] | order(_createdAt desc) [${startIndex}...${endIndex}] {
    title,
    banner,
    _id,
    _createdAt,
    slug,
    novelreleasedate,
    noveldescription,
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
        summary: textSummary(novel.noveldescription),
        totalViews,
        totalMonthlyViews,
      };
    });

  // Cache the results
  NovelCache.setNovelsPage(page, limit, novelsWithCalculatedViews);

  return novelsWithCalculatedViews;
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
    optimizedClient.fetchWithTags(`*[_type == "writer"] { writername }.writername`, ['writers']),
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
  const countQuery = `count(*[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now()])`;
  const count = await client.fetch(countQuery);
  return count;
}

export async function getShortStories() {
  const cached = NovelCache.getShortStories();
  if (cached) {
    return cached;
  }

  const shortQuery = `*[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && coalesce(isShortStory, false) == true] | order(_createdAt desc) {
    title,
    banner,
    _id,
    _createdAt,
    slug,
    novelreleasedate,
    noveldescription,
    youtubeurl,
    tags,
    genre->{genrename},
    writer->{writername}
  }`;

  const shortStories = await optimizedClient.fetchWithTags(shortQuery, ['short-stories']);

  const episodesQuery = `*[_type == "novel"] {
    _id,
    novelparent,
    views,
    monthlyViews
  }`;

  const episodes = await optimizedClient.fetchWithTags(episodesQuery, ['episodes']);

  const storiesWithViews = shortStories
    .filter((story: any) => story && story._id)
    .map((story: any) => {
      const storyEpisodes = episodes.filter(
        (episode: any) => episode.novelparent && episode.novelparent._ref === story._id
      );

      const totalViews = storyEpisodes.reduce(
        (sum: number, episode: any) => sum + (episode.views || 0),
        0
      );

      const totalMonthlyViews = storyEpisodes.reduce(
        (sum: number, episode: any) => sum + (episode.monthlyViews || 0),
        0
      );

      return {
        ...story,
        summary: textSummary(story.noveldescription),
        totalViews,
        totalMonthlyViews,
      };
    });

  NovelCache.setShortStories(storiesWithViews);

  return storiesWithViews;
}

// PDF-related functions
export async function getPaginatedPDFs(page: number = 0, limit: number = 20) {
  const startIndex = page * limit;
  const endIndex = startIndex + limit;

  // Fetch PDFs with pagination
  const pdfsQuery = `*[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now()] | order(_createdAt desc) [${startIndex}...${endIndex}] {
    title,
    banner,
    _id,
    _createdAt,
    slug,
    pdfreleasedate,
    pdfdescription,
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
      summary: textSummary(pdf.pdfdescription),
      totalViews: pdf.views || 0,
      totalMonthlyViews: pdf.monthlyViews || 0,
    }));

  return pdfsWithCalculatedViews;
}

export async function getTotalPDFCount() {
  const countQuery = `count(*[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now()])`;
  const count = await client.fetch(countQuery);
  return count;
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

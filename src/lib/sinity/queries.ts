// src/lib/sanity/queries.ts
import { client } from '@/sanity/lib/client';

export async function getAllNovelsWithMetadata() {
  // Single comprehensive query to fetch all data at once
  const query = `
    {
      "novels": *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi"] | order(_createdAt desc) {
        title,
        "banner": coalesce(bannerImage.asset->url, banner),
        _id,
        _createdAt,
        slug,
        novelreleasedate,
        genre->{genrename},
        writer->{writername},
        // Pre-calculate total views by joining with episodes
        "totalViews": coalesce((
          *[_type == "novel" && references(^._id)].views
          | reduce(total, num) = total + (num ?: 0)
        ), 0),
        // Pre-calculate monthly views
        "totalMonthlyViews": coalesce((
          *[_type == "novel" && references(^._id)].monthlyViews
          | reduce(total, num) = total + (num ?: 0)
        ), 0)
      },
      "writers": *[_type == "writer" && writername == "Huma Qureshi"] { writername }.writername,
      "genres": *[_type == "genre"] { genrename }.genrename
    }
  `;

  const result = await client.fetch(query);
  return {
    novels: result.novels,
    writers: result.writers,
    genres: result.genres
  };
}
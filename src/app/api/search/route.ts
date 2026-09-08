import { NextRequest } from 'next/server';
import { client } from '@/sanity/lib/client';

// Define TypeScript interfaces
interface SearchResult {
  _id: string;
  _type: string;
  title: string;
  slug: {
    current: string;
  };
  tags?: string[];
  genre?: {
    genrename: string;
  };
  episodeCount?: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length < 1) {
      return new Response(JSON.stringify({ results: [], total: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Sanitize the query to prevent injection attacks
    const sanitizedQuery = query.trim().replace(/[^\w\s]/gi, '');

    // Search query that combines novels and PDFs with optimized GROQ
    const searchQuery = `
      {
        "novels": *[
          _type == "novelparent" &&
          writer->writername == "Huma Qureshi" &&
          (
            title match "${sanitizedQuery}*" ||
            title match "*${sanitizedQuery}*" ||
            array::join(coalesce(tags[], []), ", ") match "${sanitizedQuery}*" ||
            genre->genrename match "${sanitizedQuery}*"
          )
        ][0...5] {
          _id,
          _type,
          title,
          "slug": slug.current,
          "tags": coalesce(tags[], []),
          "genre": genre->genrename,
          // Count episodes for this novel
          "episodeCount": count(*[_type == "novel" && references(^._id)])
        },
        "pdfs": *[
          _type == "pdf" &&
          writer->writername == "Huma Qureshi" &&
          (
            title match "${sanitizedQuery}*" ||
            title match "*${sanitizedQuery}*" ||
            array::join(coalesce(tags[], []), ", ") match "${sanitizedQuery}*" ||
            genre->genrename match "${sanitizedQuery}*"
          )
        ][0...5] {
          _id,
          _type,
          title,
          "slug": slug.current,
          "tags": coalesce(tags[], []),
          "genre": genre->genrename
        }
      }
    `;

    const result = await client.fetch(searchQuery);

    // Combine novels and PDFs, then limit to 10 total results
    const allResults: SearchResult[] = [
      ...result.novels.map((novel: any) => ({
        ...novel,
        _type: 'novelparent',
        genre: { genrename: novel.genre },
        episodeCount: novel.episodeCount
      })),
      ...result.pdfs.map((pdf: any) => ({
        ...pdf,
        _type: 'pdf',
        genre: { genrename: pdf.genre }
      }))
    ].slice(0, 10);

    return new Response(JSON.stringify({
      results: allResults,
      total: allResults.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' // Cache for 1 minute
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return new Response(JSON.stringify({ error: 'Search failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
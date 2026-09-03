import { NextRequest } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: NextRequest) {
  try {
    const query = `
      {
        "latestNovel": *[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now()] | order(novelreleasedate desc) [0] {
          _id,
          title,
          "slug": slug.current,
          "type": "novel",
          novelreleasedate,
          banner
        },
        "latestEpisode": *[_type == "novel" && defined(novelreleasedate) && novelreleasedate <= now()] | order(novelreleasedate desc) [0] {
          _id,
          name,
          "episodeslug": episodeslug.current,
          "parentSlug": novelparent->slug.current,
          "parentTitle": novelparent->title,
          novelreleasedate
        },
        "latestPDF": *[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now()] | order(pdfreleasedate desc) [0] {
          _id,
          title,
          "slug": slug.current,
          "type": "pdf",
          pdfreleasedate
        }
      }
    `;

    const result = await client.fetch(query);

    const candidates: any = [];

    if (result.latestNovel) {
      candidates.push({
        ...result.latestNovel,
        date: result.latestNovel.novelreleasedate,
      });
    }

    if (result.latestEpisode) {
      candidates.push({
        _id: result.latestEpisode._id,
        title: result.latestEpisode.name,
        slug: result.latestEpisode.episodeslug,
        type: "episode",
        parentSlug: result.latestEpisode.parentSlug,
        parentTitle: result.latestEpisode.parentTitle,
        date: result.latestEpisode.novelreleasedate,
      });
    }

    if (result.latestPDF) {
      candidates.push({
        ...result.latestPDF,
        date: result.latestPDF.pdfreleasedate,
      });
    }

    if (candidates.length === 0) {
      return new Response(JSON.stringify({ alert: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
      });
    }

    candidates.sort((a: any, b: any) => (b.date || "") > (a.date || "") ? 1 : -1);

    const latest = candidates[0];

    let href = "/";
    let message = "";
    let title = "";

    if (latest.type === "novel") {
      href = `/novel/${latest.slug}`;
      title = latest.title;
      message = "A new novel has been uploaded!";
    } else if (latest.type === "episode") {
      href = `/novel/${latest.parentSlug}/${latest.slug}`;
      title = latest.title;
      message = latest.parentTitle ? `New episode added to "${latest.parentTitle}"!` : "A new episode has been uploaded!";
    } else if (latest.type === "pdf") {
      href = `/pdf/${latest.slug}`;
      title = latest.title;
      message = "A new PDF book has been uploaded!";
    }

    return new Response(JSON.stringify({ alert: { title, message, href, date: latest.date } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (error) {
    console.error("Latest upload alert API error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch latest upload" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

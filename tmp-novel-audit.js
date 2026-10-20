const fs = require("fs");
const { createClient } = require("@sanity/client");

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-06-12",
  useCdn: false,
});

(async () => {
  const novels = await client.fetch(`*[_type == "novelparent" && defined(novelreleasedate) && novelreleasedate <= now()] | order(_createdAt desc) {
    title, "slug": slug.current, novelstatus, isShortStory, tagline, englishtitle,
    "genre": genre->genrename, "addgenres": additionalgenres[]->genrename,
    "short": shortdescription, "hasFullDesc": defined(noveldescription) && count(noveldescription) > 0,
    "descBlocks": count(noveldescription),
    youtubeurl, numberofchapters, readingtime, "chapterCount": count(*[_type == "novel" && references(^._id)]),
    _id, _createdAt, novelreleasedate
  }`);
  console.log("NOVELS", novels.length);
  for (const n of novels) {
    console.log(JSON.stringify({
      t: n.title, s: n.slug, st: n.novelstatus, short: n.isShortStory,
      g: n.genre, ag: n.addgenres, sd: (n.short || "").slice(0, 40), full: n.hasFullDesc,
      yt: !!n.youtubeurl, ch: n.chapterCount, dd: n._createdAt
    }));
  }
  const pdfs = await client.fetch(`*[_type == "pdf" && defined(pdfreleasedate) && pdfreleasedate <= now()] | order(_createdAt desc) {
    title, "slug": slug.current, "genre": genre->genrename, "sd": pdfshortdescription,
    downloadformat, downloadsize, pdfnumberofpages, youtubeurl, "hasFull": defined(pdfdescription),
    _createdAt
  }`);
  console.log("PDFS", pdfs.length);
  for (const p of pdfs) console.log(JSON.stringify({ t: p.title, s: p.slug, g: p.genre, sd: (p.sd || "").slice(0, 40), f: p.downloadformat, sz: p.downloadsize, pg: p.pdfnumberofpages, yt: !!p.youtubeurl, full: p.hasFull }));
  const genres = await client.fetch(`*[_type == "genre"] | order(genrename asc) { genrename, "count": count(*[_type in ["novelparent","pdf"] && references(^._id)]) }`);
  console.log("GENRES", JSON.stringify(genres));
})().catch((e) => { console.error(e.message); process.exit(1); });

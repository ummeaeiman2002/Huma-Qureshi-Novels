import type { Metadata } from "next";
import BookmarksClient from "./BookmarksClient";
import { client } from "@/sanity/lib/client";
import { cleanDescriptionLong, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Your Bookmarks",
  description:
    "Your saved Urdu novels, PDFs and episodes by Huma Qureshi — stored privately on your device.",
  alternates: { canonical: absoluteUrl("/bookmarks") },
  robots: { index: false, follow: true },
};

async function getSuggestions() {
  const query = `{
    "novels": *[_type == "novelparent" && defined(slug.current) && defined(novelreleasedate) && novelreleasedate <= now() && writer->writername == "Huma Qureshi" && coalesce(isShortStory, false) != true] | order(novelreleasedate desc)[0...6] {
      _id, title, banner, slug, novelreleasedate, noveldescription, shortdescription, genre->{genrename}, writer->{writername}
    },
    "pdfs": *[_type == "pdf" && defined(slug.current) && defined(pdfreleasedate) && pdfreleasedate <= now() && writer->writername == "Huma Qureshi"] | order(coalesce(views, 0) desc)[0...3] {
      _id, title, banner, slug, pdfreleasedate, pdfdescription, pdfshortdescription, genre->{genrename}, writer->{writername}
    }
  }`;
  return client.fetch<any>(query, {}, { next: { revalidate: 300 } });
}

export default async function BookmarksPage() {
  const suggestions = await getSuggestions();
  const novels = (suggestions?.novels || []).map((n: any) => ({
    ...n,
    summary: n.shortdescription || cleanDescriptionLong(n.noveldescription, ""),
  }));
  const pdfs = (suggestions?.pdfs || []).map((p: any) => ({
    ...p,
    summary: p.pdfshortdescription || cleanDescriptionLong(p.pdfdescription, ""),
  }));

  return <BookmarksClient suggestions={{ novels, pdfs }} />;
}

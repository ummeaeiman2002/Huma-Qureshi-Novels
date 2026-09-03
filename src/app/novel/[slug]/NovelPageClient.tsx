"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { addCommentAction } from "@/app/actions/Comments";
import DownloadPDFButton from "@/app/components/novelPage/DownloadPDFButton";
import Tags from "@/app/components/novelPage/Tags";
import CommentForm from "@/app/components/novelPage/CommentForm";
import Comment from "@/app/components/novelPage/Comment";
import WatchOnYT from "@/app/components/novelPage/WatchOnYT";
import Episode from "@/app/components/Cards/Episode";
import Novel from "@/app/components/Cards/Novel";
import NovelDescription from "@/app/components/novelPage/NovelDescription";
import LoadMoreButton from "@/app/components/LoadMoreButton";
import Heading from "@/app/components/Heading";
import Heading2 from "@/app/components/Heading2";
import AuthorNote from "@/app/components/novelPage/AuthoNote";
import ViewsBadge from "@/app/components/ViewsBadge";
import { client } from "@/sanity/lib/client";
import { formatSafeDate, isValidUrl, cleanDescriptionLong } from "@/lib/seo";

type EpisodeItem = { name: string; episodereleasedate: string; episodeteaser: string; episodeslug: { current: string } };
type CommentItem = { _id: string; name: string; comment: string; _createdAt: string };

export default function NovelPageClient({ novel: initialNovel, episodes: initialEpisodes, hasMore: initialHasMore, slug, views, related }: { novel: any; episodes: EpisodeItem[]; hasMore: boolean; slug: string; views?: number; related?: any[] }) {
  const [novel] = useState(initialNovel);
  const [episodes, setEpisodes] = useState(initialEpisodes || []);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>(initialNovel.comment || []);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const limit = 4;

  const [lastRead, setLastRead] = useState<{ episodeSlug: string; name: string; page: number; ts: number } | null>(null);

  useEffect(() => {
    if (!novel?._id) return;
    fetch("/api/novel-views", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ novelId: novel._id }) }).catch(() => {});
  }, [novel?._id]);

  // Load last-read episode for this novel from localStorage
  useEffect(() => {
    if (!slug) return;
    try {
      const raw = localStorage.getItem(`last_read_${slug}`);
      if (raw) setLastRead(JSON.parse(raw));
    } catch {}
  }, [slug]);

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const query = `*[_type == "novel" && references($id) && defined(episodereleasedate) && episodereleasedate <= now()] | order(_createdAt asc) [$start...$end] {name, episodeslug, _id, episodeteaser, episodereleasedate}`;
    try {
      const next = await client.fetch<EpisodeItem[]>(query, { id: novel._id, start: page * limit, end: (page + 1) * limit });
      setEpisodes((old) => [...old, ...next]);
      setHasMore(next.length === limit);
      setPage((p) => p + 1);
    } finally { setLoadingMore(false); }
  }

  async function submitComment() {
    if (!commentName.trim() || !commentText.trim()) return;
    const created = await addCommentAction(novel._id, commentName.trim(), commentText.trim());
    setComments((old) => [...old, { _id: created._id, name: commentName.trim(), comment: commentText.trim(), _createdAt: created._createdAt }]);
    setCommentName(""); setCommentText("");
  }

  return (
    <main className="flex flex-col py-5 gap-6 lg:gap-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-secondary/25 bg-secondary/5 p-6 lg:p-10 shadow-2xl">
        <div aria-hidden="true" className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary/15 blur-3xl"></div>
        <div aria-hidden="true" className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-[#C9A96E]/10 blur-3xl"></div>
        <div className="relative flex flex-col gap-6">
          <h1 className="text-2xl lg:text-4xl font-bold text-center lg:text-start title-bright">
            {novel.title}{novel.writer?.writername ? ` by ${novel.writer.writername}` : ""}
          </h1>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Written by: {novel.writer?.writername || ""}</p>
            <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Genre: {novel.genre?.genrename || ""}</p>
            {novel.novelreleasedate && <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Published: {formatSafeDate(novel.novelreleasedate)}</p>}
            <ViewsBadge views={views} />
          </div>
          <div className="rounded-2xl overflow-hidden border border-secondary/30 shadow-2xl">
            <Image src={novel.banner || "https://res.cloudinary.com/dx1gryhqc/image/upload/v1759093412/humaqureshi_writerbanner_ajh5nx.png"} alt={`${novel.title} banner`} width={1920} height={1080} priority quality={85} className="w-full h-auto object-cover" />
          </div>
          <div className="mx-auto max-w-4xl text-center text-sm leading-7 opacity-80 text-tertiary">
            <p>&copy; {new Date().getFullYear()} humaqureshinovels.com</p>
            <p>This novel is an original work by the author. All rights reserved.</p>
          </div>
        </div>
      </section>

      {novel.noveldescription && <NovelDescription descText={novel.noveldescription} font={novel.descriptionlanguage ? "font-urdu" : ""} dir={novel.descriptionlanguage ? "rtl" : "ltr"} />}
      {novel.authornote && <AuthorNote note={novel.authornote} font={novel.authornotelang ? "font-urdu" : ""} dir={novel.authornotelang ? "rtl" : "ltr"} />}
      {lastRead && (
        <section aria-labelledby="continue-heading" className="py-1">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-[#1E5D50] bg-[#1E5D50]/5 p-5 lg:px-8">
            <div className="flex flex-col gap-1 text-center sm:text-start">
              <span className="text-xs font-bold uppercase tracking-wide text-[#8B6914]">Continue Reading</span>
              <span className="text-lg font-extrabold text-[#1E5D50]">{lastRead.name}</span>
              {lastRead.page > 1 && <span className="text-sm opacity-70">Page {lastRead.page}</span>}
            </div>
            <Link
              href={`/novel/${slug}/${lastRead.episodeSlug}?page=${lastRead.page > 1 ? lastRead.page : 1}`}
              className="shrink-0 bg-[#1E5D50] text-white font-bold px-7 py-3 rounded-full hover:bg-[#16483E] active:scale-95 transition shadow-lg"
            >
              Resume Reading
            </Link>
          </div>
        </section>
      )}
      {episodes.length > 0 && (
      <section aria-labelledby="episodes-heading">
        <Heading name="Episodes" />
        <div className="flex flex-wrap gap-5 justify-center lg:justify-start px-2 sm:px-6 lg:px-20 lg:gap-10">
          {episodes.map((episode) => <Episode key={episode.episodeslug?.current || episode.name} date={formatSafeDate(episode.episodereleasedate)} href={`/novel/${slug}/${episode.episodeslug?.current}`} episodeTitle={episode.name} teaser={episode.episodeteaser} />)}
        </div>
        {hasMore && <div className="flex justify-center py-5"><LoadMoreButton onclick={loadMore} /></div>}
        {loadingMore && <p className="text-center opacity-60">Loading more episodes…</p>}
      </section>
      )}
      {episodes.length === 0 && (
        <section className="text-center py-8 bg-[#FAF7F2] rounded-2xl border-2 border-[#DCCFC2] mx-4 lg:mx-0">
          <p className="text-lg font-bold text-[#1E5D50]">No episodes available yet</p>
          <p className="mt-2 text-sm opacity-70">Episodes for this novel will be published soon. Check back later!</p>
        </section>
      )}

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-5 justify-center items-center px-4 sm:px-0">
        {isValidUrl(novel.pdfurl) && <DownloadPDFButton pdf={novel.pdfurl} />}
        {isValidUrl(novel.youtubeurl) && <WatchOnYT YTurl={novel.youtubeurl} />}
      </div>
      <Tags tags={novel.tags || []} />

      {related && related.length > 0 && (
        <section aria-labelledby="related-heading" className="py-2">
          <Heading name="More Urdu Novels to Read" />
          <p className="mx-auto max-w-4xl px-5 pb-4 text-center leading-7 font-medium">
            If you enjoyed {novel.title}, you may also enjoy these related Urdu novels and stories on our library.
          </p>
          <div className="flex gap-5 flex-wrap justify-center lg:justify-start lg:px-10 lg:gap-6">
            {related.map((item: any) => (
              <Novel key={item._id} date={formatSafeDate(item.novelreleasedate)} href={item.slug.current} cardBanner={item.banner} novelName={item.title} writer={item.writer?.writername || ""} genre={item.genre?.genrename || ""} summary={cleanDescriptionLong(item.noveldescription, "")} />
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-10" aria-labelledby="comments-heading">
        <Heading name="Comments" />
        <div className="flex flex-col gap-10 lg:mx-10">
          <CommentForm handleCommentSubmit={submitComment} commentName={commentName} commentNameHandle={(e: any) => setCommentName(e.target.value)} commentText={commentText} commentTextHandle={(e: any) => setCommentText(e.target.value)} />
          {comments.map((c) => <Comment key={c._id} name={c.name} createdAt={c._createdAt} comment={c.comment} />)}
        </div>
      </section>
    </main>
  );
}

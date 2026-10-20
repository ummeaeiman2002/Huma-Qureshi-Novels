"use client";
import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { addCommentAction } from "@/app/actions/Comments";
import NovelBody from "@/app/components/novelPage/NovelBody";
import Tags from "@/app/components/novelPage/Tags";
import CommentForm from "@/app/components/novelPage/CommentForm";
import Comment from "@/app/components/novelPage/Comment";
import Heading from "@/app/components/Heading";
import ViewsBadge from "@/app/components/ViewsBadge";
import Reactions from "@/app/components/Reactions";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";

type CommentItem = { _id: string; name: string; comment: string; _createdAt: string };
type EpisodeSibling = { name: string; slug: string };

const WORDS_PER_PAGE = 1200;

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB");
}

function paginateText(text: string, wordsPerPage: number): string[] {
  const tokens = text.split(/(\s+)/).filter((t) => t.length > 0);
  const pages: string[] = [];
  let current: string[] = [];
  let wordCount = 0;
  for (const tok of tokens) {
    const isWord = /\S/.test(tok);
    if (isWord) {
      if (wordCount >= wordsPerPage) {
        pages.push(current.join(""));
        current = [];
        wordCount = 0;
      }
      current.push(tok);
      wordCount++;
    } else if (current.length) {
      current.push(tok);
    }
  }
  if (current.length) pages.push(current.join(""));
  return pages.length ? pages : [text];
}

export default function EpisodePageClient({ episode, initialComments, prevEpisode, nextEpisode, reviewsSlot }: { episode: any; initialComments: CommentItem[]; prevEpisode?: EpisodeSibling | null; nextEpisode?: EpisodeSibling | null; reviewsSlot?: ReactNode }) {
  const { defaultBanner } = useSiteSettings();
  const [comments] = useState(initialComments || []);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pages = paginateText(episode.body || "", WORDS_PER_PAGE);
  const totalPages = pages.length;
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Math.min(Math.max(isNaN(rawPage) ? 1 : rawPage, 1), totalPages);

  const novelSlug = episode.novelparent?.slug?.current || "";
  const episodeSlug = episode.episodeslug?.current || "";

  // Load saved reading position and jump to it if the URL has no explicit page
  useEffect(() => {
    if (!episodeSlug) return;
    try {
      const saved = localStorage.getItem(`reading_${novelSlug}_${episodeSlug}`);
      if (saved) {
        const savedPage = parseInt(saved, 10);
        if (!isNaN(savedPage) && savedPage > 1 && savedPage <= totalPages && !searchParams.get("page")) {
          const url = `${pathname}?page=${savedPage}`;
          window.history.replaceState(null, "", url);
        }
      }
    } catch {}
  }, [episodeSlug, novelSlug, totalPages, pathname, searchParams]);

  // Save reading position whenever currentPage changes
  useEffect(() => {
    if (!episodeSlug || currentPage <= 1) return;
    try {
      localStorage.setItem(`reading_${novelSlug}_${episodeSlug}`, String(currentPage));
    } catch {}
  }, [currentPage, episodeSlug, novelSlug]);

  // Track the most recent episode read for the novel (for Continue button)
  useEffect(() => {
    if (!episodeSlug) return;
    try {
      localStorage.setItem(`last_read_${novelSlug}`, JSON.stringify({ episodeSlug, name: episode.name, page: currentPage, ts: Date.now() }));
    } catch {}
  }, [currentPage, episodeSlug, novelSlug, episode.name]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [currentPage]);

  useEffect(() => {
    if (!episode._id) return;
    const key = `viewed_${episode._id}`;
    if (localStorage.getItem(key)) return;
    fetch("/api/views", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: episode._id }) }).catch(() => {});
    localStorage.setItem(key, "true");
  }, [episode._id]);

  // Track reading achievements (episodes read + novel completion)
  useEffect(() => {
    if (!episode._id) return;
    try {
      // Track unique episodes read
      const readEpisodesRaw = localStorage.getItem("hq_read_episodes");
      const readEpisodes: string[] = readEpisodesRaw ? JSON.parse(readEpisodesRaw) : [];
      if (!readEpisodes.includes(episode._id)) {
        readEpisodes.push(episode._id);
        localStorage.setItem("hq_read_episodes", JSON.stringify(readEpisodes));
      }

      // Track completed novels: if this is the last episode, mark novel complete
      const totalEpisodes = episode.novelparent?.totalEpisodes || 0;
      const latestEpisodeOrder = episode.order || 0;
      // We don't have an order field reliably; use a collection of read episodes per novel
      const readNovelsRaw = localStorage.getItem("hq_read_novels");
      const readNovels: string[] = readNovelsRaw ? JSON.parse(readNovelsRaw) : [];
      const parentId = episode.novelparent?._id || episode.novelparent?.slug?.current || "";
      if (parentId && !readNovels.includes(parentId + "__" + episode._id)) {
        readNovels.push(parentId + "__" + episode._id);
        localStorage.setItem("hq_read_novels", JSON.stringify(readNovels));
      }
    } catch {}
  }, [episode._id, episode.novelparent]);

  async function submitComment() {
    if (!commentName.trim() || !commentText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addCommentAction(episode._id, commentName.trim(), commentText.trim());
      setCommentName(""); setCommentText("");
      alert("Thank you! Your comment has been submitted and will appear after review.");
    } catch (err) {
      console.error("Comment submission failed:", err);
      alert("Sorry, your comment could not be posted. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const pageLink = (n: number) => `${pathname}?page=${n}` as any;

  return <main className="flex flex-col py-5 gap-6 lg:gap-10">
    {/* HERO */}
    <section className="relative overflow-hidden rounded-3xl border border-secondary/25 bg-secondary/5 p-6 lg:p-10 shadow-2xl">
      <div aria-hidden="true" className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary/15 blur-3xl"></div>
      <div aria-hidden="true" className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-gold/10 blur-3xl"></div>
      <div className="relative flex flex-col gap-6">
        <h1 className="text-2xl lg:text-4xl font-bold text-center lg:text-start title-bright">{episode.novelparent?.title} — {episode.name}</h1>
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Written by: {episode.writer?.writername || ""}</p>
          <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Genre: {episode.genre?.genrename || ""}</p>
          {formatDate(episode.episodereleasedate) && <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Published: {formatDate(episode.episodereleasedate)}</p>}
          <ViewsBadge views={episode.views} />
        </div>
        <div className="rounded-2xl overflow-hidden border border-secondary/30 shadow-2xl">
          <Image src={episode.novelparent?.banner || defaultBanner} alt={`${episode.novelparent?.title || "Novel"} banner`} width={0} height={0} sizes="(max-width: 1024px) 100vw, 900px" priority quality={85} style={{ width: "100%", height: "auto" }} />
        </div>
      </div>
    </section>

    <Heading name={episode.name} className="title-bright" />

    <Reactions slug={`${novelSlug}/${episodeSlug}`} />

    {/* reading area + pagination */}
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-secondary/25 bg-secondary/5 shadow-xl">
        <NovelBody novelText={pages[currentPage - 1]} />
      </div>

      {totalPages > 1 && (
        <nav className="flex flex-wrap items-center justify-center gap-2 px-2 sm:px-10" aria-label="Pagination">
        {currentPage > 1 && <Link href={pageLink(currentPage - 1)} className="px-4 py-2 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-primary transition">Prev</Link>}
        {pages.map((_, i) => {
          const n = i + 1;
          const isCurrent = n === currentPage;
          return <Link key={n} href={pageLink(n)} aria-current={isCurrent ? "page" : undefined} className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm transition ${isCurrent ? "bg-secondary text-primary font-semibold border-secondary" : "border-secondary text-secondary hover:bg-secondary hover:text-primary"}`}>{n}</Link>;
        })}
        {currentPage < totalPages && <Link href={pageLink(currentPage + 1)} className="px-4 py-2 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-primary transition">Next</Link>}
      </nav>
      )}
    </div>

    {(prevEpisode || nextEpisode) && (
      <nav aria-label="Episode navigation" className="flex flex-col sm:flex-row items-stretch justify-between gap-3">
        {prevEpisode ? (
          <Link href={`/novel/${novelSlug}/${prevEpisode.slug}`} className="order-2 sm:order-1 flex flex-col gap-0.5 rounded-2xl border border-line bg-surface px-5 py-3 hover:border-brand hover:shadow-lg transition max-w-full sm:max-w-[48%]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark">← Previous Episode</span>
            <span className="font-extrabold text-brand line-clamp-1">{prevEpisode.name}</span>
          </Link>
        ) : <span className="hidden sm:block sm:order-1" />}
        {nextEpisode ? (
          <Link href={`/novel/${novelSlug}/${nextEpisode.slug}`} className="order-1 sm:order-2 flex flex-col gap-0.5 rounded-2xl border border-line bg-surface px-5 py-3 hover:border-brand hover:shadow-lg transition text-end max-w-full sm:max-w-[48%] sm:ms-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark">Next Episode →</span>
            <span className="font-extrabold text-brand line-clamp-1">{nextEpisode.name}</span>
          </Link>
        ) : <span className="hidden sm:block sm:order-2" />}
      </nav>
    )}

    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
      <Link href={`/novel/${episode.novelparent?.slug?.current}`} className="flex items-center gap-2 bg-gold-dark text-white font-bold text-sm sm:text-base w-fit self-center justify-center px-5 py-2.5 sm:px-7 sm:py-3 rounded-full shadow-lg hover:bg-brand active:scale-95 transition">
        Read Full Novel
      </Link>
    </div>

    <Tags tags={episode.tags || []} />

    {reviewsSlot}

    <section className="flex flex-col gap-10"><Heading name="Comments" /><div className="flex flex-col gap-10 lg:mx-10"><CommentForm handleCommentSubmit={submitComment} commentName={commentName} commentNameHandle={(e: any) => setCommentName(e.target.value)} commentText={commentText} commentTextHandle={(e: any) => setCommentText(e.target.value)} isSubmitting={isSubmitting} />{comments.map((c) => <Comment key={c._id} name={c.name} createdAt={c._createdAt} comment={c.comment} />)}</div></section>
  </main>;
}

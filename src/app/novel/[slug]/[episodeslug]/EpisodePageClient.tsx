"use client";
import { useEffect, useState } from "react";
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
import ReaderReviews from "@/app/components/ReaderReviews";
import ReaderPoll from "@/app/components/homePageComponents/ReaderPoll";
import BookmarkButton from "@/app/components/BookmarkButton";
import Reactions from "@/app/components/Reactions";
import ReadingStreak from "@/app/components/ReadingStreak";
import Achievements from "@/app/components/Achievements";

type CommentItem = { _id: string; name: string; comment: string; _createdAt: string };

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

export default function EpisodePageClient({ episode, initialComments }: { episode: any; initialComments: CommentItem[] }) {
  const [comments, setComments] = useState(initialComments || []);
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
      const created = await addCommentAction(episode._id, commentName.trim(), commentText.trim());
      setComments((old) => [...old, { _id: created._id, name: commentName.trim(), comment: commentText.trim(), _createdAt: created._createdAt }]);
      setCommentName(""); setCommentText("");
      alert("Your comment has been posted. Thank you!");
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
      <div aria-hidden="true" className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-[#C9A96E]/10 blur-3xl"></div>
      <div className="relative flex flex-col gap-6">
        <h1 className="text-2xl lg:text-4xl font-bold text-center lg:text-start title-bright">{episode.novelparent?.title} — {episode.name}</h1>
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Written by: {episode.writer?.writername || ""}</p>
          <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Genre: {episode.genre?.genrename || ""}</p>
          {formatDate(episode.episodereleasedate) && <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Published: {formatDate(episode.episodereleasedate)}</p>}
          <ViewsBadge views={episode.views} />
        </div>
        <div className="rounded-2xl overflow-hidden border border-secondary/30 shadow-2xl">
          <Image src={episode.novelparent?.banner || "https://res.cloudinary.com/dx1gryhqc/image/upload/v1759093412/humaqureshi_writerbanner_ajh5nx.png"} alt={`${episode.novelparent?.title || "Novel"} banner`} width={1920} height={1080} priority quality={85} className="w-full h-auto object-cover" />
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

    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
      <BookmarkButton slug={`${novelSlug}/${episodeSlug}`} title={`${episode.name} — ${episode.novelparent?.title || ""}`} type="episode" />
      <Link href={`/novel/${episode.novelparent?.slug?.current}`} className="flex items-center gap-2 bg-[#e65564] text-white font-bold text-sm sm:text-base w-fit self-center justify-center px-5 py-2.5 sm:px-7 sm:py-3 rounded-full shadow-lg hover:bg-[#c94050] active:scale-95 transition">
        Read Full Novel
      </Link>
    </div>

    <Tags tags={episode.tags || []} />

    <ReaderReviews storageKey={`review_episode_${episode._id || episodeSlug}`} />

    <ReadingStreak />

    <Achievements />

    <section aria-labelledby="poll-heading" className="py-4">
      <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
        <Heading name="Reader Poll" />
        <ReaderPoll />
      </div>
    </section>

    <section className="flex flex-col gap-10"><Heading name="Comments" /><div className="flex flex-col gap-10 lg:mx-10"><CommentForm handleCommentSubmit={submitComment} commentName={commentName} commentNameHandle={(e: any) => setCommentName(e.target.value)} commentText={commentText} commentTextHandle={(e: any) => setCommentText(e.target.value)} isSubmitting={isSubmitting} />{comments.map((c) => <Comment key={c._id} name={c.name} createdAt={c._createdAt} comment={c.comment} />)}</div></section>
  </main>;
}

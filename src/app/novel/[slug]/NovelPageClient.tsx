"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { addCommentAction } from "@/app/actions/Comments";
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
import Reactions from "@/app/components/Reactions";
import AboutAuthor from "@/app/components/novelPage/AboutAuthor";
import ImportantNote from "@/app/components/novelPage/ImportantNote";
import SneakPeeks from "@/app/components/novelPage/SneakPeeks";
import Characters from "@/app/components/novelPage/Characters";
import ReaderHighlights from "@/app/components/novelPage/ReaderHighlights";
import TropesAndThemes from "@/app/components/novelPage/TropesAndThemes";
import NovelDetails from "@/app/components/novelPage/NovelDetails";
import DownloadSection from "@/app/components/novelPage/DownloadSection";
import FullStoryContent from "@/app/components/novelPage/FullStoryContent";
import MoreFromAuthor from "@/app/components/novelPage/MoreFromAuthor";
import ShareButton from "@/app/components/novelPage/ShareButton";
import {
  LocalizedNovelTitle,
  LocalizedRichTextSection,
  LocalizedTextSection,
} from "@/app/components/localized/LocalizedContent";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import { client } from "@/sanity/lib/client";
import { formatSafeDate, isValidUrl, resolveSummary } from "@/lib/seo";

type EpisodeItem = { name: string; episodereleasedate: string; episodeteaser: string; episodeslug: { current: string } };
type CommentItem = { _id: string; name: string; comment: string; _createdAt: string };

export default function NovelPageClient({ novel: initialNovel, episodes: initialEpisodes, hasMore: initialHasMore, slug, views, related, moreFromAuthor, fullStory, reviewsSlot }: { novel: any; episodes: EpisodeItem[]; hasMore: boolean; slug: string; views?: number; related?: any[]; moreFromAuthor?: any[]; fullStory?: ReactNode; reviewsSlot?: ReactNode }) {
  const { defaultBanner, authorImage } = useSiteSettings();
  const [novel] = useState(initialNovel);
  const [episodes, setEpisodes] = useState(initialEpisodes || []);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [comments] = useState<CommentItem[]>(initialNovel.comment || []);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const limit = 4;
  const onlineReadingEnabled = novel.enableonlinereading !== false;
  const mainCharacters = Array.isArray(novel.mainCharacters) ? novel.mainCharacters : [];
  const sideCharacters = Array.isArray(novel.sideCharacters) ? novel.sideCharacters : [];
  const hasNewSummary = Boolean(novel.summary?.ur || novel.summary?.en);
  const fallbackSummary = novel.shortdescription || novel.seodescription || "";
  const hasNewAuthorNote = Boolean(novel.authorNote?.ur?.length || novel.authorNote?.en?.length);
  const hasNewSneakPeek = Boolean(novel.sneakPeek?.ur?.length || novel.sneakPeek?.en?.length);
  const fullStoryContent = Array.isArray(novel.fullStoryContent) && novel.fullStoryContent.length > 0
    ? novel.fullStoryContent
    : Array.isArray(novel.storycontent) && novel.storycontent.length > 0
      ? novel.storycontent
      : null;
  const isCompleteNovel = novel.contentFormat === "complete" && Boolean(fullStoryContent);

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
    if (!commentName.trim() || !commentText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addCommentAction(novel._id, commentName.trim(), commentText.trim());
      setCommentName(""); setCommentText("");
      alert("Thank you! Your comment has been submitted and will appear after review.");
    } catch (err) {
      console.error("Comment submission failed:", err);
      alert("Sorry, your comment could not be posted. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-col py-5 gap-6 lg:gap-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-secondary/25 bg-secondary/5 p-6 lg:p-10 shadow-2xl">
        <div aria-hidden="true" className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary/15 blur-3xl"></div>
        <div aria-hidden="true" className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-gold/10 blur-3xl"></div>
        <div className="relative flex flex-col gap-6">
          <LocalizedNovelTitle
            value={novel.titleLocalized}
            fallback={novel.title}
            englishFallback={novel.englishtitle}
          />
          {novel.writer?.writername && (
            <p className="text-center text-base font-medium opacity-80 lg:text-start">
              by {novel.writer.writername}
            </p>
          )}
          {novel.tagline && (
            <p className="text-center lg:text-start text-base italic opacity-80">{novel.tagline}</p>
          )}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Written by: {novel.writer?.writername || ""}</p>
            <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Genre: {[novel.genre?.genrename, ...(novel.additionalgenres || []).map((g: any) => g?.genrename)].filter(Boolean).join(", ") || ""}</p>
            {novel.language && <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Language: {novel.language}</p>}
            {novel.novelstatus && <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Status: {novel.novelstatus}</p>}
            {novel.novelreleasedate && <p className="px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">Published: {formatSafeDate(novel.novelreleasedate)}</p>}
            <ViewsBadge views={views} />
          </div>
          <div className="rounded-2xl overflow-hidden border border-secondary/30 shadow-2xl">
            <Image src={novel.banner || defaultBanner} alt={novel.coverImageAlt || `${novel.title} cover`} width={0} height={0} sizes="(max-width: 1024px) 100vw, 900px" priority quality={85} style={{ width: "100%", height: "auto" }} />
          </div>
        </div>
      </section>

      {hasNewSummary ? (
        <LocalizedTextSection value={novel.summary} heading="Summary" />
      ) : novel.noveldescription ? (
        <NovelDescription descText={novel.noveldescription} font={novel.descriptionlanguage ? "font-urdu" : ""} dir={novel.descriptionlanguage ? "rtl" : "ltr"} />
      ) : fallbackSummary ? (
        <LocalizedTextSection
          legacy={fallbackSummary}
          legacyIsUrdu={novel.descriptionlanguage}
          heading="Summary"
        />
      ) : null}

      {(novel.storyIntroduction?.ur || novel.storyIntroduction?.en || novel.storyintro) && (
        <LocalizedTextSection
          value={novel.storyIntroduction}
          legacy={novel.storyintro}
          legacyIsUrdu={novel.descriptionlanguage}
          heading="Story Introduction"
        />
      )}

      {novel.aboutnovel && (
        <NovelDescription
          descText={novel.aboutnovel}
          font={novel.descriptionlanguage ? "font-urdu" : ""}
          dir={novel.descriptionlanguage ? "rtl" : "ltr"}
          title="About This Novel"
        />
      )}

      {mainCharacters.length > 0 ? (
        <Characters characters={mainCharacters} heading="Main Characters" />
      ) : (
        <Characters intro={novel.characterintro} characters={novel.characters} heading="Characters" />
      )}
      {sideCharacters.length > 0 && (
        <Characters characters={sideCharacters} heading="Side Characters" />
      )}

      <TropesAndThemes tropes={novel.tropesAndThemes} themes={novel.themes} />

      {hasNewAuthorNote ? (
        <LocalizedRichTextSection value={novel.authorNote} heading="Author's Note" />
      ) : novel.authornote ? (
        <AuthorNote note={novel.authornote} font={novel.authornotelang ? "font-urdu" : ""} dir={novel.authornotelang ? "rtl" : "ltr"} />
      ) : null}

      {hasNewSneakPeek ? (
        <LocalizedRichTextSection value={novel.sneakPeek} heading="Sneak Peek" />
      ) : (
        <SneakPeeks peeks={novel.sneakPeeks} />
      )}

      <ImportantNote note={novel.contentwarning} title="Content Warning" tone="warning" />

      {fullStoryContent && (
        <FullStoryContent content={fullStoryContent} isUrdu={novel.language === "Urdu"} />
      )}
      {lastRead && (
        <section aria-labelledby="continue-heading" className="py-1">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-brand bg-brand/5 p-5 lg:px-8">
            <div className="flex flex-col gap-1 text-center sm:text-start">
              <span className="text-xs font-bold uppercase tracking-wide text-gold-dark">Continue Reading</span>
              <span className="text-lg font-extrabold text-brand">{lastRead.name}</span>
              {lastRead.page > 1 && <span className="text-sm opacity-70">Page {lastRead.page}</span>}
            </div>
            <Link
              href={`/novel/${slug}/${lastRead.episodeSlug}?page=${lastRead.page > 1 ? lastRead.page : 1}`}
              className="shrink-0 bg-brand text-white font-bold px-5 py-2.5 sm:px-7 sm:py-3 rounded-full text-sm sm:text-base hover:bg-brand-dark active:scale-95 transition shadow-lg"
            >
              Resume Reading
            </Link>
          </div>
        </section>
      )}
      {onlineReadingEnabled && !isCompleteNovel && episodes.length > 0 && (
      <section aria-labelledby="episodes-heading">
        <Heading name="Episodes" />
        {novel.onlinereadingintro && (
          <p className="mx-auto max-w-4xl px-5 pb-4 text-center leading-7 text-tertiary font-medium">{novel.onlinereadingintro}</p>
        )}

        {/* New Episode alert banner */}
        {episodes.length > 0 && (() => {
          const latest = [...episodes].sort((a, b) => new Date(b.episodereleasedate).getTime() - new Date(a.episodereleasedate).getTime())[0];
          if (!latest) return null;
          return (
            <div className="mx-2 sm:mx-6 lg:mx-20 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-gold bg-gradient-to-r from-surface to-gold/15 p-5 shadow-xl">
              <div className="flex flex-col gap-1 text-center sm:text-start">
                <span className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-gold-dark text-white text-xs font-extrabold uppercase tracking-wide">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></svg>
                  New Episode
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-brand mt-1">{latest.name}</span>
                <span className="text-sm text-tertiary font-medium">Latest episode is now available to read. Tap below to open it.</span>
              </div>
              <Link
                href={`/novel/${slug}/${latest.episodeslug?.current}`}
                className="shrink-0 bg-brand text-white font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base hover:bg-brand-dark active:scale-95 transition shadow-lg"
              >
                Read Now
              </Link>
            </div>
          );
        })()}

        <div className="flex flex-wrap gap-5 justify-center lg:justify-start px-2 sm:px-6 lg:px-20 lg:gap-10">
          {episodes.map((episode) => {
            const isLatest = episode.episodeslug?.current === [...episodes].sort((a, b) => new Date(b.episodereleasedate).getTime() - new Date(a.episodereleasedate).getTime())[0]?.episodeslug?.current;
            return <Episode key={episode.episodeslug?.current || episode.name} isNew={isLatest} date={formatSafeDate(episode.episodereleasedate)} href={`/novel/${slug}/${episode.episodeslug?.current}`} episodeTitle={episode.name} teaser={episode.episodeteaser} />;
          })}
        </div>
        {hasMore && <div className="flex justify-center py-5"><LoadMoreButton onclick={loadMore} /></div>}
        {loadingMore && <p className="text-center opacity-60">Loading more episodes…</p>}
      </section>
      )}
      {onlineReadingEnabled && !isCompleteNovel && episodes.length === 0 && (
        <section className="text-center py-8 bg-cream-soft rounded-2xl border border-line mx-4 lg:mx-0">
          <p className="text-lg font-bold text-brand">No episodes available yet</p>
          <p className="mt-2 text-sm opacity-70">Episodes for this novel will be published soon. Check back later!</p>
        </section>
      )}

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-5 justify-center items-center px-4 sm:px-0">
        <ShareButton title={novel.title || ""} />
        {isValidUrl(novel.youtubeurl) && <WatchOnYT YTurl={novel.youtubeurl} />}
      </div>
      <DownloadSection data={novel} slug={slug} />

      <LocalizedTextSection value={novel.readerHighlightsLocalized} heading="Reader Highlights" />
      <ReaderHighlights intro={novel.readerhighlightintro} highlights={novel.readerhighlights} />

      {novel.importantNote?.ur || novel.importantNote?.en ? (
        <LocalizedTextSection value={novel.importantNote} heading="Important Note for Readers" />
      ) : (
        <ImportantNote note={novel.importantnote} title="Important Note for Readers" />
      )}

      <NovelDetails novel={novel} />
      <AboutAuthor writer={novel.writer} image={authorImage} />

      <Reactions slug={slug} />
      <Tags tags={novel.tags || []} />

      {related && related.length > 0 && (
        <section aria-labelledby="related-heading" className="py-2">
          <Heading name="More Urdu Novels to Read" />
          <p className="mx-auto max-w-4xl px-5 pb-4 text-center leading-7 font-medium">
            If you enjoyed {novel.title}, you may also enjoy these related Urdu novels and stories on our library.
          </p>
          <div className="flex gap-5 flex-wrap justify-center lg:justify-start lg:px-10 lg:gap-6">
            {related.map((item: any) => (
              <Novel key={item._id} date={formatSafeDate(item.novelreleasedate)} href={item.slug.current} cardBanner={item.banner} novelName={item.title} writer={item.writer?.writername || ""} genre={item.genre?.genrename || ""} summary={resolveSummary(item)} />
            ))}
          </div>
        </section>
      )}

      <MoreFromAuthor novels={moreFromAuthor} authorName={novel.writer?.writername} />

      {fullStory}

      {reviewsSlot}

      <section className="flex flex-col gap-10" aria-labelledby="comments-heading">
        <Heading name="Comments" />
        <div className="flex flex-col gap-10 lg:mx-10">
          <CommentForm handleCommentSubmit={submitComment} commentName={commentName} commentNameHandle={(e: any) => setCommentName(e.target.value)} commentText={commentText} commentTextHandle={(e: any) => setCommentText(e.target.value)} isSubmitting={isSubmitting} />
          {comments.map((c) => <Comment key={c._id} name={c.name} createdAt={c._createdAt} comment={c.comment} />)}
        </div>
      </section>
    </main>
  );
}

// src/app/pdf/PDFPageClient.tsx
'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Filter from '../components/Filter';
import PDF from '../components/Cards/PDF';
import Heading from '../components/Heading';
import { getPaginatedPDFs } from '@/lib/sanity/queries';
import Loader2 from "../components/Loader2";
import { formatSafeDate } from "@/lib/seo";
import YouTubeSection from "../components/YouTubeSection";
import ReaderPoll from "../components/homePageComponents/ReaderPoll";

interface PDFPageProps {
  initialPDFs: any[];
  writers: string[];
  genres: string[];
  totalPDFCount: number;
}

export default function PDFPageClient({
  initialPDFs,
  writers,
  genres,
  totalPDFCount
}: PDFPageProps) {
  const [filters, setFilters] = useState({
    selectedWriter: '',
    selectedSort: '',
    selectedGenres: [] as string[],
    youtubeOnly: false,
  });
  const [allLoadedPDFs, setAllLoadedPDFs] = useState<any[]>(initialPDFs || []);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const isLoadingRef = useRef(false);

  // Fetch more PDFs when needed
  const loadMorePDFs = useCallback(async () => {
    if (isLoadingRef.current || !hasMore || filters.selectedSort) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const nextPage = currentPage + 1;
      const morePDFs = await getPaginatedPDFs(nextPage, 20);

      if (!morePDFs || morePDFs.length === 0) {
        setHasMore(false);
        setShowLoadMore(false);
      } else {
        const sanitizedPDFs = morePDFs.filter(
          (pdf: any) => pdf && pdf._id
        );
        setAllLoadedPDFs(prev => [...prev, ...sanitizedPDFs]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more PDFs:', error);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [currentPage, hasMore, filters.selectedSort]);

  // Reset data when filters change
  useEffect(() => {
    const sanitizedInitialPDFs = Array.isArray(initialPDFs)
      ? initialPDFs.filter((pdf) => pdf && pdf._id)
      : [];

    if (filters.selectedSort) {
      // For special sorts, only show top 4 from initial data
      setAllLoadedPDFs(sanitizedInitialPDFs);
      setHasMore(false);
      setShowLoadMore(false);
    } else {
      // For default view, reset pagination
      setAllLoadedPDFs(sanitizedInitialPDFs);
      setCurrentPage(0);
      setHasMore(true);
      setShowLoadMore(true);
    }
  }, [filters.selectedSort, initialPDFs]);

  // Client-side filtering with useMemo for performance
  const filteredPDFs = useMemo(() => {
    let result = [...allLoadedPDFs].filter((pdf) => pdf && pdf._id); // Filter out null/undefined PDFs

    // Apply writer filter
    if (filters.selectedWriter) {
      result = result.filter(
        (pdf) => pdf && pdf.writer?.writername === filters.selectedWriter
      );
    }

    // Apply genre filters
    if (filters.selectedGenres.length > 0) {
      result = result.filter(
        (pdf) =>
          pdf && filters.selectedGenres.includes(pdf.genre?.genrename)
      );
    }

    // Apply YouTube-only filter
    if (filters.youtubeOnly) {
      result = result.filter(
        (pdf) => pdf && pdf.youtubeurl && pdf.youtubeurl.trim() !== ""
      );
    }

    // Apply sorting
    switch (filters.selectedSort) {
      case 'Latest':
        result = result
          .sort(
            (a, b) =>
              new Date(b._createdAt).getTime() -
              new Date(a._createdAt).getTime()
          )
          .slice(0, 4);
        break;
      case 'Popular':
        result = result
          .sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))
          .slice(0, 4);
        break;
      case 'Trending':
        result = result
          .sort(
            (a, b) => (b.totalMonthlyViews || 0) - (a.totalMonthlyViews || 0)
          )
          .slice(0, 4);
        break;
      default:
        result = result.sort(
          (a, b) =>
            new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
        );
    }

    return result;
  }, [allLoadedPDFs, filters]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  // Handle scroll for infinite loading
  useEffect(() => {
    if (filters.selectedSort || !showLoadMore) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Load more when user scrolls near bottom
      if (
        scrollTop + windowHeight >= documentHeight - 1000 &&
        !isLoading &&
        hasMore
      ) {
        loadMorePDFs();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMorePDFs, isLoading, hasMore, filters.selectedSort, showLoadMore]);

  const handleLoadMoreClick = () => {
    loadMorePDFs();
  };

  return (
    <div className="flex flex-col gap-6 py-5 justify-center">
      {/* Hero Banner */}
      <section className="relative mx-4 lg:mx-0 rounded-3xl overflow-hidden bg-[#1E5D50] shadow-2xl">
        <div aria-hidden="true" className="absolute inset-0 -z-0">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] rounded-full bg-[#2F7565]/40 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[200px] rounded-full bg-[#C9A96E]/15 blur-3xl"></div>
        </div>
        <div className="relative text-center px-6 py-12 lg:py-16 flex flex-col items-center gap-4">
          <span className="inline-block px-5 py-2 rounded-full border-2 border-[#C9A96E]/60 text-[#C9A96E] text-sm font-bold tracking-wide uppercase">
            {totalPDFCount} PDFs
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            PDF Library
          </h1>
          <p className="mx-auto max-w-2xl text-base lg:text-lg leading-8 text-white/80">
            Complete Urdu novels available as PDF downloads. Read offline on your phone or computer.
          </p>
          <p className="mx-auto max-w-2xl text-base lg:text-lg leading-8 text-[#C9A96E] font-semibold">
            Download any title for free and enjoy your favourite stories anywhere, without internet.
          </p>
        </div>
      </section>

      {/* STATS BAR — social proof */}
      <section aria-labelledby="stats-heading" className="mx-4 lg:mx-0">
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 px-6 py-8 lg:px-12 shadow-md">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl lg:text-5xl font-extrabold text-[#1E5D50] leading-none">{totalPDFCount.toLocaleString()}</span>
              <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-[#8B6914]">PDF Downloads</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl lg:text-5xl font-extrabold text-[#1E5D50] leading-none">{writers.length.toLocaleString()}</span>
              <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-[#8B6914]">Writers</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl lg:text-5xl font-extrabold text-[#1E5D50] leading-none">{genres.length.toLocaleString()}</span>
              <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-[#8B6914]">Genres</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl lg:text-5xl font-extrabold text-[#1E5D50] leading-none">{(initialPDFs || []).reduce((a: number, p: any) => a + (p.views || 0), 0).toLocaleString()}</span>
              <span className="text-sm lg:text-base font-bold uppercase tracking-wide text-[#8B6914]">Total Reads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section — matches homepage style */}
      <section className="py-2 bg-[#FAF7F2] rounded-3xl mx-4 lg:mx-0 px-6 py-8">
        <Heading name="Browse PDFs" />
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-4 pt-4">
          <p className="text-center leading-7 font-medium">
            Filter PDF novels by writer and genre. Choose your options and press Apply filter.
          </p>
          <Filter
            dropdowns={[
              {
                label: "Writers",
                options: writers,
                value: filters.selectedWriter,
                onChange: (value: any) =>
                  handleFilterChange({
                    ...filters,
                    selectedWriter: value,
                  }),
              },
              {
                label: "Sort By",
                options: ["Latest", "Trending", "Popular"],
                value: filters.selectedSort,
                onChange: (value: any) =>
                  handleFilterChange({
                    ...filters,
                    selectedSort: value,
                  }),
              },
            ]}
            checkboxes={genres.map((genre) => ({
              label: genre,
              checked: filters.selectedGenres.includes(genre),
              onChange: (checked: any) => {
                const newGenres = checked
                  ? [...filters.selectedGenres, genre]
                  : filters.selectedGenres.filter((g) => g !== genre);

                handleFilterChange({
                  ...filters,
                  selectedGenres: newGenres,
                });
              },
            }))}
            toggle={{
              label: "YouTube PDFs",
              value: filters.youtubeOnly,
              onChange: (value: boolean) =>
                handleFilterChange({ ...filters, youtubeOnly: value }),
            }}
            onclick={() => {}}
          />
          {(filters.selectedWriter || filters.selectedSort || filters.selectedGenres.length > 0 || filters.youtubeOnly) && (
            <button
              onClick={() => handleFilterChange({ selectedWriter: "", selectedSort: "", selectedGenres: [], youtubeOnly: false })}
              className="border-2 border-[#DCCFC2] text-[#111111] font-bold px-5 py-2 sm:px-6 text-sm rounded-full hover:border-[#1E5D50] hover:text-[#1E5D50] hover:shadow-[0_0_12px_rgba(30,93,80,0.15)] active:scale-95 transition-all duration-300"
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>

      {/* PDF Grid */}
      <ul className="flex flex-wrap gap-5 justify-center lg:justify-start lg:px-4">
        {filteredPDFs
          .filter((pdf) => pdf && pdf._id)
          .map((pdf, index) => (
            <PDF
              key={`${pdf._id}-${index}`}
              date={
                pdf.pdfreleasedate
                  ? formatSafeDate(pdf.pdfreleasedate)
                  : ""
              }
              href={
                pdf?.slug?.current ? pdf.slug.current : "unknown"
              }
              cardBanner={pdf.banner || "https://res.cloudinary.com/dx1gryhqc/image/upload/v1759093412/humaqureshi_writerbanner_ajh5nx.png"}
              novelName={pdf.title || ""}
              writer={pdf.writer?.writername || ""}
              genre={pdf.genre?.genrename || ""}
              summary={pdf.summary || ""}
            />
          ))}
      </ul>

      {/* Load More */}
      {filters.selectedSort === "" && showLoadMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMoreClick}
            disabled={isLoading}
            className="bg-[#1E5D50] text-white font-bold px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base hover:bg-[#16483E] active:scale-95 transition shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2"><Loader2 /> Loading...</span>
            ) : (
              "Load More PDFs"
            )}
          </button>
        </div>
      )}

      {/* End of list */}
      {!hasMore && !isLoading && filters.selectedSort === "" && (
        <div className="text-center py-6 font-bold text-[#1E5D50]">
          You&apos;ve reached the end of the list
        </div>
      )}

      {/* ABOUT PDF LIBRARY — SEO content */}
      <section aria-labelledby="about-pdf-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-10 flex flex-col gap-5">
            <h2 id="about-pdf-heading" className="text-2xl lg:text-3xl font-extrabold text-[#1E5D50]">
              About the PDF Library
            </h2>
            <div className="leading-8 text-tertiary font-medium flex flex-col gap-4">
              <p>
                Our PDF library contains complete Urdu novels and stories that are ready to
                download and read offline. Unlike episodic novels that are published chapter
                by chapter, a PDF novel is the entire story in one file — from the first page
                to the last.
              </p>
              <p>
                These PDFs are perfect for readers who prefer to enjoy a full story in one
                sitting or want to read on the go without an internet connection. Simply
                download the file to your phone, tablet, or computer and start reading
                immediately.
              </p>
              <p>
                The collection includes romance, women-centric fiction, family drama,
                mystery, suspense, and short afsanas. Every PDF is free to download —
                no sign-up, no payment, no restrictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY DOWNLOAD PDF — SEO content */}
      <section aria-labelledby="why-pdf-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-10 flex flex-col gap-5">
            <h2 id="why-pdf-heading" className="text-2xl lg:text-3xl font-extrabold text-[#1E5D50]">
              Why Download PDF Novels?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Read Offline",
                  desc: "Download once and read anywhere — on the bus, in a park, or anywhere without internet. The story goes wherever you go.",
                },
                {
                  title: "Complete Story",
                  desc: "Unlike episodic reading, a PDF gives you the entire novel from start to finish. No waiting for new chapters.",
                },
                {
                  title: "Works on Any Device",
                  desc: "PDF files open on phones, tablets, laptops, and e-readers. No special app needed — just open and read.",
                },
                {
                  title: "Free Forever",
                  desc: "Every PDF in our library is completely free to download. There are no hidden charges or subscription requirements.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-2xl border-2 border-[#1E5D50]/30 bg-[#FFFDF9] p-6 hover:border-[#1E5D50] hover:shadow-xl hover:-translate-y-0.5 transition duration-300"
                >
                  <h3 className="text-lg font-extrabold text-[#1E5D50]">{item.title}</h3>
                  <p className="leading-7 text-tertiary font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO DOWNLOAD — Guide */}
      <section aria-labelledby="guide-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <Heading name="How to Download & Read PDF Novels" />
          <div className="rounded-3xl border-2 border-[#1E5D50]/30 bg-[#FFFDF9] p-6 lg:p-10 flex flex-col gap-5">
            <ol className="flex flex-col gap-4">
              {[
                {
                  title: "Find a Novel",
                  desc: "Browse the PDF list above or use the filters to find a story by writer or genre. Click on any PDF card to open its details page.",
                },
                {
                  title: "Read the Description",
                  desc: "Before downloading, read the summary to make sure the story is what you are looking for. Each PDF page includes the full description and author notes.",
                },
                {
                  title: "Download the PDF",
                  desc: "Click the Download PDF button on the novel page. The file will save to your device. Open it with any PDF reader to start reading.",
                },
                {
                  title: "Read Offline",
                  desc: "Once downloaded, you can read the full novel anytime without internet. Carry it on your phone or transfer it to any device.",
                },
              ].map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="w-9 h-9 shrink-0 rounded-full bg-[#8B6914] text-white font-extrabold flex items-center justify-center shadow">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-extrabold text-[#1E5D50]">
                      {step.title}
                    </h3>
                    <p className="leading-7 text-tertiary font-medium">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* WATCH / LISTEN ON YOUTUBE — before FAQ */}
      <YouTubeSection
        items={(initialPDFs || []).filter(
          (p) => p && p.youtubeurl && p.youtubeurl.trim() !== ""
        )}
      />

      {/* FAQs — SEO content */}
      <section aria-labelledby="faq-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <Heading name="Frequently Asked Questions" />
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-10 flex flex-col gap-6">
            {[
              {
                q: "Are all PDF novels free to download?",
                a: "Yes. Every PDF novel in our library is completely free to download and read. There are no charges, subscriptions, or sign-up requirements.",
              },
              {
                q: "What format are the novel files in?",
                a: "All files are in standard PDF format. They open on any phone, tablet, laptop, or e-reader using a built-in PDF reader or any free PDF app.",
              },
              {
                q: "Can I read the PDF on my phone?",
                a: "Absolutely. PDF files work on all modern smartphones. Download the file and open it with your phone's default document viewer or any PDF reader app.",
              },
              {
                q: "How do I find a specific novel?",
                a: "Use the filter section above to search by writer name or genre. You can also sort by latest, trending, or popular to discover new stories.",
              },
              {
                q: "What genres are available as PDF?",
                a: "Our PDF collection includes romance, women-centric fiction, family drama, mystery, suspense, short stories (afsanas), and more. Use the genre filter to explore.",
              },
              {
                q: "Is there a limit on how many PDFs I can download?",
                a: "No. You can download as many PDF novels as you want. There is no daily or monthly limit on downloads.",
              },
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-1">
                <h3 className="text-lg font-extrabold text-[#1E5D50]">{f.q}</h3>
                <p className="leading-7 text-tertiary font-medium">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* READER POLL — after FAQ */}
      <section aria-labelledby="poll-heading" className="py-4">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 flex flex-col gap-6">
          <Heading name="Reader Poll" />
          <ReaderPoll />
        </div>
      </section>
    </div>
  );
}
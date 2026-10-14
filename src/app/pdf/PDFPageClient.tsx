// src/app/pdf/PDFPageClient.tsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Filter from '../components/Filter';
import PDF from '../components/Cards/PDF';
import Heading from '../components/Heading';
import PageHero from '../components/PageHero';
import StatsBar from '../components/StatsBar';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Pagination from '../components/ui/Pagination';
import ListingSidebar from '../components/ListingSidebar';
import { formatSafeDate } from "@/lib/seo";
import YouTubeSection from "../components/YouTubeSection";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";

interface PDFPageProps {
  initialPDFs: any[];
  writers: string[];
  genres: string[];
  totalPDFCount: number;
  currentPage: number;
  totalPages: number;
}

export default function PDFPageClient({
  initialPDFs,
  writers,
  genres,
  totalPDFCount,
  currentPage,
  totalPages,
}: PDFPageProps) {
  const { defaultBanner } = useSiteSettings();
  const [filters, setFilters] = useState({
    selectedWriter: '',
    selectedSort: '',
    selectedGenres: [] as string[],
    youtubeOnly: false,
  });
  const [pdfs, setPdfs] = useState<any[]>(initialPDFs || []);
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("genre") || "";

  // Sync list whenever the server sends a new page of results
  useEffect(() => {
    setPdfs(
      Array.isArray(initialPDFs)
        ? initialPDFs.filter((pdf) => pdf && pdf._id)
        : []
    );
  }, [initialPDFs]);

  // Pre-apply a genre filter when arriving from a genre link (?genre=...)
  useEffect(() => {
    if (genreParam && genres.includes(genreParam)) {
      setFilters((prev) =>
        prev.selectedGenres.includes(genreParam)
          ? prev
          : { ...prev, selectedGenres: [genreParam] }
      );
    }
  }, [genreParam, genres]);

  // Client-side filtering of the current page
  const filteredPDFs = useMemo(() => {
    let result = [...pdfs].filter((pdf) => pdf && pdf._id);

    if (filters.selectedWriter) {
      result = result.filter(
        (pdf) => pdf.writer?.writername === filters.selectedWriter
      );
    }

    if (filters.selectedGenres.length > 0) {
      result = result.filter((pdf) =>
        filters.selectedGenres.includes(pdf.genre?.genrename)
      );
    }

    if (filters.youtubeOnly) {
      result = result.filter(
        (pdf) => pdf.youtubeurl && pdf.youtubeurl.trim() !== ""
      );
    }

    switch (filters.selectedSort) {
      case 'Latest':
        result = result.sort(
          (a, b) =>
            new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
        );
        break;
      case 'Popular':
        result = result.sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0));
        break;
      case 'Trending':
        result = result.sort(
          (a, b) => (b.totalMonthlyViews || 0) - (a.totalMonthlyViews || 0)
        );
        break;
      default:
        result = result.sort(
          (a, b) =>
            new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
        );
    }

    return result;
  }, [pdfs, filters]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const hasFilters =
    Boolean(filters.selectedWriter) ||
    Boolean(filters.selectedSort) ||
    filters.selectedGenres.length > 0 ||
    filters.youtubeOnly;

  const paginationParams: Record<string, string> = genreParam
    ? { genre: genreParam }
    : {};

  return (
    <div className="flex flex-col gap-6 py-5">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "PDF" }]}
      />

      {/* Hero Banner */}
      <PageHero
        badge={`${totalPDFCount} PDFs`}
        title="Urdu Novels PDF"
        description="Browse available Urdu novels in PDF format. Select a novel to view its details and continue to the dedicated download page."
        accent="Download any title for free and enjoy your favourite stories anywhere, without internet."
        actions={[
          { label: "Read Novels Online", href: "/novel" },
          { label: "Short Stories", href: "/short-stories" },
        ]}
      />

      {/* STATS BAR — social proof */}
      <StatsBar
        items={[
          { value: totalPDFCount, label: "PDF Downloads" },
          { value: writers.length, label: writers.length === 1 ? "Writer" : "Writers" },
          { value: genres.length, label: "Genres" },
          {
            value: (initialPDFs || []).reduce(
              (a: number, p: any) => a + (p.views || 0),
              0
            ),
            label: "Total Reads",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-w-0 flex-col gap-6">
      {/* Filter Section */}
      <section className="rounded-3xl bg-cream-soft border border-line p-6 lg:p-8">
        <Heading name="Filter PDFs" />
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-4 pt-4">
          <p className="text-center leading-7 font-medium">
            Filter PDF novels by writer and genre. Choose your options and press Apply filter.
          </p>
          <Filter
            dropdowns={[
              {
                label: writers.length > 1 ? "Writers" : "Writer",
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
          {hasFilters && (
            <button
              onClick={() =>
                handleFilterChange({
                  selectedWriter: "",
                  selectedSort: "",
                  selectedGenres: [],
                  youtubeOnly: false,
                })
              }
              className="border-2 border-line text-ink font-bold px-5 py-2 sm:px-6 text-sm rounded-full hover:border-brand hover:text-brand hover:shadow-[0_0_12px_rgba(30,93,80,0.15)] active:scale-95 transition-all duration-300"
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* Results header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
        <h2 className="heading-stylish text-2xl lg:text-3xl font-bold">
          Available PDF Novels ({totalPDFCount})
        </h2>
        {hasFilters && (
          <p className="text-sm font-bold text-brand">
            Showing {filteredPDFs.length} on this page
          </p>
        )}
      </div>

      {/* PDF Grid */}
      <ul className="flex flex-wrap gap-5 justify-center lg:justify-start lg:px-2">
        {filteredPDFs.map((pdf, index) => (
          <PDF
            key={`${pdf._id}-${index}`}
            date={pdf.pdfreleasedate ? formatSafeDate(pdf.pdfreleasedate) : ""}
            href={pdf?.slug?.current ? pdf.slug.current : "unknown"}
            cardBanner={pdf.banner || defaultBanner}
            novelName={pdf.title || ""}
            writer={pdf.writer?.writername || ""}
            genre={pdf.genre?.genrename || ""}
            summary={pdf.summary || ""}
            format={pdf.downloadformat || ""}
            size={pdf.downloadsize || ""}
          />
        ))}
      </ul>

      {filteredPDFs.length === 0 && (
        <p className="text-center py-6 font-bold text-brand">
          No PDFs match your filters.
        </p>
      )}

      {/* Numbered pagination */}
      {!hasFilters && (
        <Pagination
          current={currentPage}
          total={totalPages}
          basePath="/pdf"
          params={paginationParams}
        />
      )}
      </div>

      {/* Desktop sidebar — useful navigation */}
      <ListingSidebar
        tags={genres}
        tagsBasePath="/pdf"
        authorCount={totalPDFCount}
        authorCountLabel="PDFs"
      />
      </div>

      {/* ABOUT PDF LIBRARY — SEO content */}
      <section aria-labelledby="about-pdf-heading" className="py-4">
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
          <div className="bg-surface rounded-3xl border border-brand/30 p-6 lg:p-10 flex flex-col gap-5">
            <h2 id="about-pdf-heading" className="text-2xl lg:text-3xl font-extrabold text-brand">
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
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
          <div className="bg-surface rounded-3xl border border-brand/30 p-6 lg:p-10 flex flex-col gap-5">
            <h2 id="why-pdf-heading" className="text-2xl lg:text-3xl font-extrabold text-brand">
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
                  className="flex flex-col gap-3 rounded-2xl border border-brand/30 bg-surface p-6 hover:border-brand hover:shadow-xl hover:-translate-y-0.5 transition duration-300"
                >
                  <h3 className="text-lg font-extrabold text-brand">{item.title}</h3>
                  <p className="leading-7 text-tertiary font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO DOWNLOAD — Guide */}
      <section aria-labelledby="guide-heading" className="py-4">
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
          <Heading name="How to Download & Read PDF Novels" />
          <div className="rounded-3xl border border-brand/30 bg-surface p-6 lg:p-10 flex flex-col gap-5">
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
                  <span className="w-9 h-9 shrink-0 rounded-full bg-gold-dark text-white font-extrabold flex items-center justify-center shadow">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-extrabold text-brand">
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
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
          <Heading name="Frequently Asked Questions" />
          <div className="bg-surface rounded-3xl border border-brand/30 p-6 lg:p-10 flex flex-col gap-6">
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
                <h3 className="text-lg font-extrabold text-brand">{f.q}</h3>
                <p className="leading-7 text-tertiary font-medium">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

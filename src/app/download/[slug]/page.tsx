import React from "react";
import Link from "next/link";
import Heading from "@/app/components/Heading";
import { PortableText } from "next-sanity";
import { client } from "@/sanity/lib/client";
import ReaderPoll from "@/app/components/homePageComponents/ReaderPoll";
import ReaderReviews from "@/app/components/ReaderReviews";

export const metadata = {
  title: "Download Your Novel PDF",
  description:
    "Step-by-step guide to download and read your Urdu novel PDF on any device — phone, tablet, or computer. Free no sign-up needed.",
};

const STEPS = [
  {
    title: "Tap the Download Now Button",
    desc: "Click the Download Now button below. Your PDF will open in a new tab on this screen.",
  },
  {
    title: "Check Your Browser Downloads",
    desc: "The file downloads automatically. On Android or desktop look at the download bar at the top or bottom of your screen.",
  },
  {
    title: "iPhone / iPad",
    desc: "Tap the download icon in the top-right (a small arrow in a circle), then choose Save to Files to keep it in your device storage.",
  },
  {
    title: "Open the PDF",
    desc: "Tap the downloaded file to open it in your default PDF viewer and start reading. On mobile, the PDF may open in the browser first.",
  },
  {
    title: "Read Offline Anytime",
    desc: "Once saved, the PDF works without internet. Keep it in your library and enjoy reading at your own pace, anywhere.",
  },
];

export default async function DownloadPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pdf?: string; type?: string }>;
}) {
  const { slug } = await params;
  const { pdf, type } = await searchParams;
  const pdfUrl = pdf || "";
  const validPdf = pdfUrl.indexOf("http") === 0;

  const downloadSection =
    await client.fetch<{
      title: string;
      body: any;
      isUrdu?: boolean;
    } | null>(
      `*[_type == "downloadSection" && enabled == true] | order(_createdAt desc)[0]`
    );

  return (
    <main className="flex flex-col gap-6 lg:gap-10 max-w-5xl mx-auto px-5 lg:px-10 py-5">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-secondary/25 bg-secondary/5 p-6 lg:p-10 shadow-2xl">
        <div aria-hidden="true" className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary/15 blur-3xl"></div>
        <div aria-hidden="true" className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-[#C9A96E]/10 blur-3xl"></div>
        <div className="relative flex flex-col gap-4 text-center lg:text-start">
          <span className="inline-flex w-fit items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E5D50]/10 text-[#1E5D50] text-xs font-extrabold uppercase tracking-wide">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {type === "pdf" ? "PDF Download" : "Download Guide"}
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold title-bright">
            Download &amp; Read Your Urdu Novel
          </h1>
          <p className="max-w-2xl leading-7 text-tertiary font-medium">
            Follow the simple steps below to download the complete novel as a PDF and
            read it offline on your phone, tablet, or computer. It is completely free
            and works on all devices.
          </p>
        </div>
      </section>

      {!validPdf ? (
        <section className="text-center py-12 bg-[#FAF7F2] rounded-3xl border-2 border-[#DCCFC2]">
          <p className="text-4xl mb-3">📄</p>
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Download link unavailable</h2>
          <p className="mt-2 text-sm opacity-70 max-w-md mx-auto">
            This novel&apos;s PDF could not be prepared. Please go back and try another title from the library.
          </p>
          <Link href="/pdf" className="inline-block mt-6 px-6 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#1E5D50] text-white font-bold text-sm sm:text-base hover:bg-[#16483E] transition">
            Browse PDF Library
          </Link>
        </section>
      ) : (
        <>
          {/* MAIN DOWNLOAD BUTTON */}
          <section aria-labelledby="download-now-heading" className="flex flex-col items-center gap-4 rounded-3xl border-2 border-[#1E5D50]/30 bg-[#FFFDF9] p-8 shadow-xl">
            <div className="text-center flex flex-col gap-2">
              <Heading name="Download Now" />
              <p className="text-sm text-tertiary font-medium">
                Tap the button below to download the full novel PDF to this device.
              </p>
            </div>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#1E5D50] text-white font-bold text-sm sm:text-base lg:text-lg px-6 py-3 sm:px-7 sm:py-3.5 rounded-full shadow-lg hover:bg-[#16483E] hover:shadow-[0_0_20px_rgba(30,93,80,0.4)] active:scale-95 transition-all duration-300"
            >
                <svg width="18" height="18" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download PDF
            </a>
            <Link href="/pdf" className="text-sm font-bold text-[#1E5D50] hover:underline transition">
              Or browse more PDFs
            </Link>
          </section>
        </>
      )}

      {/* STEPS */}
      <section aria-labelledby="steps-heading" className="flex flex-col gap-6">
        <Heading name="How to Download & Open the PDF" />
        <div className="rounded-3xl border-2 border-[#C9A96E]/30 bg-[#FFFDF9] p-6 lg:p-10 flex flex-col gap-5">
          <ol className="flex flex-col gap-4">
            {STEPS.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="w-9 h-9 shrink-0 rounded-full bg-[#8B6914] text-white font-extrabold flex items-center justify-center shadow">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-extrabold text-[#1E5D50]">{step.title}</h3>
                  <p className="leading-7 text-tertiary font-medium">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHY DOWNLOAD — helpful reader value */}
      <section aria-labelledby="why-pdf-heading" className="flex flex-col gap-6">
        <Heading name="Why Read Urdu Novels as PDF" />
        <div className="rounded-3xl border-2 border-[#C9A96E]/30 bg-[#FFFDF9] p-6 lg:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Read Offline, Anywhere",
                desc: "Once downloaded, your Urdu novel works without internet. Enjoy it during travel, power cuts, or bedtime reading on any device.",
              },
              {
                title: "A Complete Book in One File",
                desc: "Unlike episodic reading that waits for the next chapter, a PDF gives you the entire story at once — start and finish on your own schedule.",
              },
              {
                title: "Keep Your Collection Forever",
                desc: "Downloaded PDFs stay in your device's library. Re-read your favourite Huma Qureshi novels again and again without needing the internet.",
              },
              {
                title: "Completely Free, No Sign-up",
                desc: "Every PDF here is free. No account, no payment, no subscription — just tap download and the book is yours.",
              },
              {
                title: "Clear Urdu Text on Every Screen",
                desc: "The script, diacritics and reading flow are preserved in the PDF so the Urdu text stays clean and readable on phones, tablets and computers.",
              },
              {
                title: "Share with Family and Friends",
                desc: "A saved PDF can be easily shared with friends and family who also love reading Urdu novels — spread the joy of reading.",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-2xl border-2 border-[#1E5D50]/30 bg-[#FFFDF9] p-5 hover:border-[#1E5D50] hover:shadow-xl hover:-translate-y-0.5 transition duration-300">
                <h3 className="text-lg font-extrabold text-[#1E5D50]">{item.title}</h3>
                <p className="leading-7 text-tertiary font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* READ ON ANY DEVICE */}
      <section aria-labelledby="devices-heading" className="flex flex-col gap-6">
        <Heading name="Read on Any Device" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Android Phones", note: "PDFs save to the Downloads folder. Open instantly with the built-in PDF reader or Google PDF Viewer." },
            { name: "iPhone & iPad", note: "Use the download icon, choose Save to Files, then open in Books or any PDF app. No extra account needed." },
            { name: "Laptop & Desktop", note: "Works on Windows and Mac. Open with any browser, Adobe Reader, or your system's built-in viewer." },
          ].map((d, i) => (
            <div key={i} className="rounded-3xl border-2 border-[#1E5D50]/30 bg-[#FFFDF9] p-6 flex flex-col gap-3">
              <h3 className="text-lg font-extrabold text-[#1E5D50]">{d.name}</h3>
              <p className="leading-7 text-tertiary font-medium">{d.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="dl-faq-heading" className="py-2">
        <div className="flex flex-col gap-6">
          <Heading name="Downloading Help" />
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-10 flex flex-col gap-6">
            {[
              {
                q: "Is the PDF download really free?",
                a: "Yes. Every PDF on Huma Qureshi Novels is completely free to download. There is no payment, subscription, or sign-up required at any step.",
              },
              {
                q: "Where does the PDF get saved on my phone?",
                a: "On Android the download lands in the Downloads folder, while on iPhone/iPad you can tap the download icon and choose Save to Files to keep it permanently.",
              },
              {
                q: "Can I read the PDF without internet?",
                a: "Yes. Once the PDF is saved on your device, you can open and read it anytime, even when you are completely offline.",
              },
              {
                q: "What Urdu novels can I download as PDF?",
                a: "The complete library of Huma Qureshi novels is available as free PDFs — romantic stories, family dramas and female-centric Urdu novels, all beautifully formatted.",
              },
              {
                q: "Do I need to create an account to download?",
                a: "No. There is no sign-up and no email required. Simply tap the download button and the PDF is saved directly to your device.",
              },
              {
                q: "Why does the PDF open in my browser instead of downloading?",
                a: "Some browsers preview PDFs first. Just tap the download icon in the browser's PDF viewer (usually a small arrow at the top or bottom) to save it permanently.",
              },
              {
                q: "Can I share the downloaded PDF with others?",
                a: "Yes — many readers share Urdu novels with family and friends. We only ask that you keep sharing to personal use and do not sell or republish the book.",
              },
              {
                q: "Will new novels be added to the PDF library?",
                a: "Yes, new Huma Qureshi novels are added regularly. Check back often or watch the site for new upload announcements.",
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

      {/* ABOUT — SEO content */}
      <section aria-labelledby="about-pdf-heading" className="py-2">
        <div className="flex flex-col gap-6">
          <Heading name="About Huma Qureshi Urdu Novel PDFs" />
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E5D50]/30 p-6 lg:p-10 flex flex-col gap-5">
            <div className="leading-8 text-tertiary font-medium flex flex-col gap-4">
              <p>
                Urdu novels have a timeless charm, and reading them as PDF books makes
                them even more convenient. Huma Qureshi is a beloved Urdu novelist
                whose stories explore love, family, emotions and the everyday lives of
                women in South Asia. Her novels are published chapter by chapter on
                this website, and the complete books are offered as free PDF downloads.
              </p>
              <p>
                A PDF copy of an Urdu novel lets readers keep the entire story in one
                place. There is no waiting for the next episode, no need for an
                internet connection, and no worry about losing your place. It is the
                simplest way to build a personal library of quality Urdu literature.
              </p>
              <p>
                Whether you are new to Urdu novels or a lifelong reader, the download
                process above takes under a minute. Pick a book, tap download, and
                enjoy an immersive reading experience on your phone, tablet or
                computer — completely free, with no sign-up required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SANITY-MANAGED SECTION — Urdu/English note from the CMS */}
      {downloadSection?.title && downloadSection?.body && (
        <section
          aria-labelledby="editable-section-heading"
          className="flex flex-col gap-6"
        >
          <Heading name={downloadSection.title} />
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#C9A96E]/30 p-6 lg:p-10 leading-8 text-tertiary">
            <div
              dir={downloadSection.isUrdu ? "rtl" : "ltr"}
              className={`${
                downloadSection.isUrdu
                  ? "font-urdu text-start"
                  : "font-medium"
              }`}
            >
              <PortableText
                value={downloadSection.body}
                components={{
                  block: {
                    h2: ({ children }: any) => (
                      <h2 className="text-xl font-semibold mt-6 mb-3 text-[#1E5D50]">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }: any) => (
                      <h3 className="text-lg font-semibold mt-4 mb-2 text-[#1E5D50]">
                        {children}
                      </h3>
                    ),
                    normal: ({ children }: any) => (
                      <p className="mb-4 leading-8">{children}</p>
                    ),
                    blockquote: ({ children }: any) => (
                      <blockquote className="border-l-4 border-[#C9A96E] pl-4 my-4 italic opacity-80">
                        {children}
                      </blockquote>
                    ),
                  },
                  list: {
                    bullet: ({ children }: any) => (
                      <ul className="list-disc pl-6 mb-4">{children}</ul>
                    ),
                    number: ({ children }: any) => (
                      <ol className="list-decimal pl-6 mb-4">{children}</ol>
                    ),
                  },
                }}
              />
            </div>
          </div>
        </section>
      )}

      <ReaderReviews storageKey={`review_download_${slug}`} heading="Reviews" />

      <section className="py-2">
        <div className="flex flex-col gap-6">
          <Heading name="Reader Poll" />
          <ReaderPoll />
        </div>
      </section>
    </main>
  );
}

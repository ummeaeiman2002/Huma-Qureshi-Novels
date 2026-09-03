import React from "react";
import Link from "next/link";
import Heading from "@/app/components/Heading";
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
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-1">
                <h3 className="text-lg font-extrabold text-[#1E5D50]">{f.q}</h3>
                <p className="leading-7 text-tertiary font-medium">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

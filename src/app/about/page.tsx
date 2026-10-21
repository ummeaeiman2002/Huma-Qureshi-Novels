import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "../components/PageHero";
import StatsBar from "../components/StatsBar";
import { getSiteSettings } from "@/lib/sanity/siteSettings";
import { SITE_NAME } from "@/lib/seo";

const TITLE = "About Huma Qureshi";
const DESCRIPTION =
  "Learn about Huma Qureshi — a passionate Urdu novelist, story writer, and ghost writer from Pakistan. Read about her writing journey, published works, and creative vision.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://humaqureshinovels.com/about" },
  openGraph: {
    type: "profile",
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "https://humaqureshinovels.com/about",
    siteName: SITE_NAME,
    images: [{ url: "/icon", width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary",
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    images: ["/icon"],
  },
};

const eyebrow = "text-xs font-bold uppercase tracking-[0.2em] text-gold-dark";

const cardClass =
  "flex flex-col gap-3 rounded-3xl border border-line bg-surface p-6 lg:p-8 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-xl";

const listItem = "flex items-start gap-3 leading-7 font-medium text-tertiary";

function Tick() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold-dark"
    >
      ✓
    </span>
  );
}

export default async function Page() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-10 py-5">
      {/* Hero Banner */}
      <PageHero
        badge="About the Author"
        title="About Me"
        description="A passionate storyteller, novelist, and ghost writer from Pakistan."
        accent="Writing for me is not just talent — it is an emotion, a voice, and a lifelong craft."
        actions={[
          { label: "Read My Novels", href: "/novel" },
          { label: "Get in Touch", href: "/contact" },
        ]}
      />

      {/* SOME WORDS ABOUT ME */}
      <section aria-labelledby="about-intro-heading" className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className={eyebrow}>Some Words About Me</span>
          <h2
            id="about-intro-heading"
            className="max-w-2xl text-2xl font-extrabold text-brand lg:text-4xl"
          >
            A storyteller shaped by women, emotion and everyday life
          </h2>
          <p className="max-w-3xl leading-8 font-medium text-muted">
            Hi, I&apos;m <span className="font-bold text-brand">Huma Qureshi</span>. I write primarily
            under my pen name, a tribute to my mother, the woman who shaped my love for literature.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2" id="writing-journey">
          <div className={cardClass}>
            <span className={eyebrow}>The Craft</span>
            <h3 className="text-xl font-extrabold text-brand">My Writing Journey</h3>
            <p className="leading-7 font-medium text-tertiary">
              I began writing five years ago, publishing my earliest work on social platforms. From
              there my stories spread across different mediums — not through marketing, but through
              readers who kept sharing, recommending, and reposting them.
            </p>
            <Link
              href="#about-story"
              className="mt-1 w-fit text-sm font-bold text-gold-dark underline-offset-4 transition hover:text-brand hover:underline"
            >
              Read more →
            </Link>
          </div>

          <div className={cardClass} id="why-i-write">
            <span className={eyebrow}>The Purpose</span>
            <h3 className="text-xl font-extrabold text-brand">Why I Write</h3>
            <p className="leading-7 font-medium text-tertiary">
              Because stories matter. Because women deserve narratives where they fight, fall, break,
              rise, and win. Because fiction should entertain — but also question, challenge, and
              reveal.
            </p>
            <Link
              href="#about-story"
              className="mt-1 w-fit text-sm font-bold text-gold-dark underline-offset-4 transition hover:text-brand hover:underline"
            >
              Read more →
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT THE AUTHOR — image + story */}
      <section
        id="about-story"
        aria-labelledby="about-story-heading"
        className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-12"
      >
        <div className="relative overflow-hidden rounded-3xl border border-line bg-cream-soft shadow-lg">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={settings.authorImage}
              alt="Huma Qureshi, Urdu novelist"
              fill
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover"
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-deep/70 via-transparent to-transparent"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-gold/30 bg-brand-deep/70 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm font-bold text-cream">Huma Qureshi</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              Urdu Novelist &amp; Ghost Writer
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <span className={eyebrow}>The Voice Behind the Stories</span>
          <h2 id="about-story-heading" className="text-2xl font-extrabold text-brand lg:text-4xl">
            About Huma Qureshi
          </h2>
          <p className="leading-8 font-medium text-tertiary">
            Although I occasionally use my real name, Aiman Qureshi, I write primarily under my pen
            name Huma Qureshi. Writing is my way of exploring the many shades of human relationships —
            love, betrayal, sacrifice, and resilience.
          </p>
          <p className="leading-8 font-medium text-tertiary">
            I have published on Amazon Kindle, including collaborative and ghost-written projects, and
            I strongly believe literature is a mirror: it reflects society as it is, and as it could
            be.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl border border-line bg-surface p-4 text-center">
              <p className="text-2xl font-extrabold text-gold-dark lg:text-3xl">10</p>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Full-Length Novels</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4 text-center">
              <p className="text-2xl font-extrabold text-gold-dark lg:text-3xl">10</p>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Short Novels &amp; Afsanas</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="mx-auto w-full max-w-5xl">
        <StatsBar
          items={[
            { value: 10, label: "Full-Length Novels" },
            { value: 10, label: "Short Novels & Afsanas" },
            { value: 5, label: "Years Writing" },
            { value: 5, label: "Genres Explored" },
          ]}
        />
      </div>

      {/* WHAT I'VE WRITTEN + GENRES */}
      <section aria-labelledby="written-heading" className="mx-auto w-full max-w-5xl">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className={cardClass}>
            <span className={eyebrow}>The Work</span>
            <h2 id="written-heading" className="text-2xl font-extrabold text-brand">
              Till Now, I Have Written
            </h2>
            <ul className="mt-1 flex flex-col gap-2.5">
              {[
                "10 full-length Urdu novels",
                "10 short novels & afsanas",
                "Multiple short fiction pieces",
                "Low-content books (Amazon)",
                "Commissioned ghost writing (Urdu & English)",
              ].map((item) => (
                <li key={item} className={listItem}>
                  <Tick />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={cardClass}>
            <span className={eyebrow}>The Themes</span>
            <h2 className="text-2xl font-extrabold text-brand">My Stories Often Explore</h2>
            <ul className="mt-1 flex flex-col gap-2.5">
              {[
                "Romance & emotional fiction",
                "Women-centric narratives",
                "Social drama",
                "Mystery & suspense (occasionally)",
                "Realistic & thought-provoking themes",
              ].map((item) => (
                <li key={item} className={listItem}>
                  <Tick />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PUBLISHED ON */}
      <section aria-labelledby="published-heading" className="mx-auto w-full max-w-5xl">
        <div className="rounded-3xl border border-line bg-cream-soft p-6 lg:p-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className={eyebrow}>Where to Find My Work</span>
            <h2 id="published-heading" className="text-2xl font-extrabold text-brand lg:text-3xl">
              Published &amp; Available On
            </h2>
            <p className="max-w-2xl leading-8 font-medium text-tertiary">
              Some of my stories are widely circulated online, shared by readers and platforms across
              the web.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              "Amazon Kindle",
              "Google Play Books",
              "Online reading websites",
              "YouTube channels",
              "Digital storytelling platforms",
            ].map((platform) => (
              <span
                key={platform}
                className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-bold text-brand shadow-sm transition hover:border-brand/40 hover:shadow"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WHY I WRITE — quote */}
      <section aria-label="Why I write" className="mx-auto w-full max-w-5xl">
        <figure className="relative overflow-hidden rounded-3xl bg-brand-deep p-8 text-center shadow-xl ring-1 ring-inset ring-gold/20 lg:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-brand-soft/20 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          </div>
          <div className="relative flex flex-col items-center gap-4">
            <span className="font-display text-6xl leading-none text-gold">“</span>
            <blockquote className="max-w-2xl text-lg font-medium leading-9 text-cream lg:text-2xl">
              Literature is a mirror. It reflects society as it is — and as it could be.
            </blockquote>
            <figcaption className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Huma Qureshi
            </figcaption>
          </div>
        </figure>
      </section>

      {/* CONNECT */}
      <section className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-brand/30 bg-surface p-6 text-center lg:p-10">
          <span className={eyebrow}>Let&apos;s Connect</span>
          <h2 className="text-2xl font-extrabold text-brand lg:text-3xl">Work With Me</h2>
          <p className="max-w-2xl leading-8 font-medium text-tertiary">
            For collaborations, ghost writing requests, rights inquiries, or general messages, I&apos;d
            love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Link
              href="/contact"
              className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-brand-deep shadow-md transition hover:bg-gold-dark hover:text-cream active:scale-95"
            >
              Contact Me
            </Link>
            <Link
              href="/novel"
              className="rounded-full border-2 border-line px-6 py-3 text-sm font-bold text-brand transition hover:border-brand hover:shadow active:scale-95"
            >
              Browse My Novels
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

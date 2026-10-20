import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "./components/PageHero";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex flex-col gap-6 py-5">
      <PageHero
        title="Page Not Found"
        description="The page you were looking for could not be found. It may have been moved or removed."
      />
      <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl border border-line bg-surface p-6 text-center lg:p-10">
        <p className="leading-8 text-muted">
          Check the address for typos, or continue browsing the library from the links below.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            Go to Home
          </Link>
          <Link
            href="/novel"
            className="rounded-full border border-brand/40 px-6 py-2.5 text-sm font-bold text-brand transition hover:border-brand hover:bg-brand/5"
          >
            Browse Novels
          </Link>
        </div>
      </section>
    </main>
  );
}

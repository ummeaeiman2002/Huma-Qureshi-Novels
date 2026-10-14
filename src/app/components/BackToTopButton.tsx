"use client";

export default function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="group flex items-center gap-2 px-5 py-2 rounded-full border border-secondary/40 bg-secondary/10 text-secondary text-sm font-semibold hover:bg-secondary hover:text-primary transition"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="group-hover:-translate-y-0.5 transition-transform"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
      Back to Top
    </button>
  );
}

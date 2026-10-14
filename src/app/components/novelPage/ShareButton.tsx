"use client";

import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // user cancelled or clipboard unavailable — fail silently
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="flex w-fit items-center justify-center gap-2 rounded-full border-2 border-brand bg-surface px-5 py-2.5 text-sm font-bold text-brand transition-all duration-300 hover:bg-brand hover:text-white active:scale-95 sm:px-6 sm:py-3 sm:text-base"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v12m0-12l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {copied ? "Link Copied" : "Share"}
    </button>
  );
}

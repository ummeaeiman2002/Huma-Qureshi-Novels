"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../Logo";
import Search from "./Search";
import { NAV_LINKS, BOOKMARKS_LINK } from "./navLinks";

export default function DesktopHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`hidden lg:block sticky top-0 z-50 bg-surface/95 backdrop-blur text-brand border-b border-line shadow-[0_2px_14px_rgba(11,59,52,0.08)] transition-all duration-300 ${
        scrolled ? "py-1.5" : "py-3"
      }`}
    >
      <div className="mx-auto w-full px-5 lg:px-10 max-w-7xl grid grid-cols-[auto_1fr_auto] items-center gap-6">
        <Logo scrolled={scrolled} invert />

        <nav aria-label="Primary" className="flex items-center justify-center gap-1 flex-wrap">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full text-sm font-bold text-brand/90 hover:text-brand-deep hover:bg-brand/8 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 justify-end">
          <Search />
          <Link
            href={BOOKMARKS_LINK.href}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border border-gold/60 text-gold-dark hover:bg-gold hover:text-brand-deep transition-colors whitespace-nowrap"
          >
            {BOOKMARKS_LINK.label}
          </Link>
        </div>
      </div>
    </header>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../Logo";
import Search from "./Search";
import { NAV_LINKS, BOOKMARKS_LINK } from "./navLinks";

export default function MobileHeader() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menu) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (scrollY) window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <header className="lg:hidden sticky top-0 z-50 bg-surface/95 backdrop-blur text-brand border-b border-line shadow-[0_2px_14px_rgba(11,59,52,0.08)]">
        <div className={`flex items-center justify-between px-5 transition-all duration-300 ${scrolled ? "py-1.5" : "py-2.5"}`}>
          <Logo scrolled={scrolled} invert />

          <button
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-controls="mobile-nav"
            aria-label={menu ? "Close menu" : "Open menu"}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand/10 transition-colors"
          >
            <span className="flex flex-col gap-1.5">
              <span className={`block w-6 h-0.5 bg-brand rounded-full transition-all duration-300 ${menu ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block w-6 h-0.5 bg-brand rounded-full transition-all duration-300 ${menu ? "opacity-0" : "opacity-100"}`} />
              <span className={`block w-6 h-0.5 bg-brand rounded-full transition-all duration-300 ${menu ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>

        {!scrolled && (
          <div className="px-5 pb-3">
            <Search />
          </div>
        )}
      </header>

      {menu && (
        <div
          className="lg:hidden fixed inset-0 top-0 bg-black/40 z-40"
          onClick={() => setMenu(false)}
          aria-hidden="true"
        />
      )}

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`lg:hidden fixed top-0 right-0 h-full w-[80%] max-w-[320px] bg-surface border-l border-line shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col pt-24 px-6 pb-8 overflow-y-auto ${
          menu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenu(false)}
              className="px-4 py-3 rounded-xl text-base font-bold text-brand hover:text-brand-deep hover:bg-brand/8 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={BOOKMARKS_LINK.href}
            onClick={() => setMenu(false)}
            className="mt-2 px-4 py-3 rounded-xl text-base font-bold border border-gold/60 text-gold-dark hover:bg-gold hover:text-brand-deep transition-colors text-center"
          >
            {BOOKMARKS_LINK.label}
          </Link>
        </div>
      </nav>
    </>
  );
}

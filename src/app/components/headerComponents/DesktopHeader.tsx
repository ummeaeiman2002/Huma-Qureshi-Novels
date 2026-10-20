"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../Logo";
import Search from "./Search";
import { NAV_LINKS } from "./navLinks";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DesktopHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 hidden border-b border-gold/15 bg-brand-deep/95 backdrop-blur-md text-cream transition-all duration-300 lg:block ${
        scrolled ? "shadow-[0_10px_30px_-12px_rgba(41,40,36,0.65)]" : ""
      }`}
    >
      {/* Gold crown line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold/70 to-transparent"
      />

      <div
        className={`mx-auto flex w-full max-w-7xl items-center gap-8 px-5 transition-all duration-300 lg:px-10 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <Logo scrolled={scrolled} />

        <nav aria-label="Primary" className="flex flex-1 items-center justify-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className="group relative px-3 py-2"
              >
                <span
                  className={`text-[12px] font-bold uppercase tracking-[0.18em] transition-colors duration-200 ${
                    active ? "text-gold" : "text-cream/75 group-hover:text-cream"
                  }`}
                >
                  {link.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 bottom-1 h-px bg-gradient-to-r from-transparent via-gold to-transparent transition-opacity duration-300 ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Search />
          <Link
            href="/novel"
            className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gold transition-all duration-200 hover:bg-gold hover:text-brand-deep"
          >
            Read Now
          </Link>
        </div>
      </div>
    </header>
  );
}

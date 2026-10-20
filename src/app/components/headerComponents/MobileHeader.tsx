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

export default function MobileHeader() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
      <header className="sticky top-0 z-50 border-b border-gold/15 bg-brand-deep/95 backdrop-blur-md text-cream lg:hidden">
        {/* Gold crown line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold/70 to-transparent"
        />

        <div
          className={`flex items-center justify-between px-5 transition-all duration-300 ${
            scrolled ? "py-1.5" : "py-2.5"
          }`}
        >
          <Logo scrolled={scrolled} />

          <button
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-controls="mobile-nav"
            aria-label={menu ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 bg-white/5 transition-colors hover:border-gold/50"
          >
            <span className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-6 rounded-full bg-gold transition-all duration-300 ${
                  menu ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 rounded-full bg-gold transition-all duration-300 ${
                  menu ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-6 rounded-full bg-gold transition-all duration-300 ${
                  menu ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
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
          className="fixed inset-0 top-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMenu(false)}
          aria-hidden="true"
        />
      )}

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-[330px] flex-col border-l border-gold/20 bg-brand-deep px-6 pb-8 pt-24 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          menu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <span className="ui-eyebrow text-gold">Menu</span>

        <div className="mt-5 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenu(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-bold transition-colors duration-200 ${
                  active
                    ? "bg-gold/10 text-gold"
                    : "text-cream/80 hover:bg-white/5 hover:text-cream"
                }`}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-gold"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto border-t border-cream/10 pt-6">
          <Link
            href="/novel"
            onClick={() => setMenu(false)}
            className="flex w-full items-center justify-center rounded-full border border-gold/40 bg-gold/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gold transition-all duration-200 hover:bg-gold hover:text-brand-deep"
          >
            Read Now
          </Link>
        </div>
      </nav>
    </>
  );
}

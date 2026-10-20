import React from "react";
import Link from "next/link";
import Image from "next/image";
import BackToTopButton from "../BackToTopButton";
import CookiePreferencesButton from "../CookiePreferencesButton";
import { SOCIALS, EMAIL_SOCIAL } from "./socials";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

const linkClass =
  "w-fit text-sm text-cream/70 transition-colors duration-200 hover:text-gold";
const headingClass = "text-xs font-bold uppercase tracking-[0.18em] text-gold";

export default async function Footer() {
  const settings = await getSiteSettings();

  const iconByAlt: Record<string, string> = {
    Facebook: settings.socialFacebookIcon,
    YouTube: settings.socialYoutubeIcon,
    Instagram: settings.socialInstagramIcon,
    Email: settings.socialEmailIcon,
  };
  const socials = [...SOCIALS, EMAIL_SOCIAL].map((s) => ({
    ...s,
    icon: iconByAlt[s.alt] || s.icon,
  }));

  return (
    <footer className="relative mt-16 overflow-hidden bg-brand-deep text-cream ring-1 ring-inset ring-gold/15">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="absolute -top-28 right-0 h-72 w-72 rounded-full bg-brand-soft/20 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
          {/* Brand */}
          <div className="flex max-w-sm flex-col gap-5">
            <Link href="/" className="flex items-center gap-3" aria-label="Huma Qureshi Novels Home">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-white/5">
                <Image
                  src={settings.logo}
                  alt="Huma Qureshi Novels"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-display text-lg font-extrabold tracking-tight text-cream">
                  Huma Qureshi
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Novels
                </span>
              </span>
            </Link>

            <p className="text-sm leading-6 text-cream/65">
              Original Urdu novels, episodic stories and PDF books by Huma Qureshi.
            </p>

            <div className="flex items-center gap-3 pt-1">
              {socials.map((social) => (
                <a
                  key={social.alt}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.alt}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 bg-white/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-gold/10"
                >
                  <Image
                    src={social.icon}
                    alt={social.alt}
                    width={18}
                    height={18}
                    className="h-[18px] w-[18px] object-contain"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Explore" className="flex flex-col gap-4">
            <p className={headingClass}>Explore</p>
            <div className="flex flex-col gap-3">
              <Link href="/" className={linkClass}>Home</Link>
              <Link href="/novel" className={linkClass}>All Novels</Link>
              <Link href="/#featured" className={linkClass}>Featured</Link>
              <Link href="/#genres" className={linkClass}>Genres</Link>
            </div>
          </nav>

          {/* Author */}
          <nav aria-label="Author" className="flex flex-col gap-4">
            <p className={headingClass}>Author</p>
            <div className="flex flex-col gap-3">
              <Link href="/about" className={linkClass}>About the Author</Link>
              <Link href="/contact" className={linkClass}>Contact Me</Link>
            </div>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal" className="flex flex-col gap-4">
            <p className={headingClass}>Legal</p>
            <div className="flex flex-col gap-3">
              <Link href="/privacypolicy" className={linkClass}>Privacy Policy</Link>
              <Link href="/terms" className={linkClass}>Terms &amp; Conditions</Link>
              <CookiePreferencesButton className={linkClass} />
            </div>
          </nav>

        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-cream/10 pt-8 sm:flex-row">
          <p className="text-xs text-cream/55">
            &copy; {new Date().getFullYear()} Huma Qureshi Novels. All rights reserved.
          </p>
          <BackToTopButton />
        </div>
      </div>
    </footer>
  );
}

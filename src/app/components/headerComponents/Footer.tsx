import React from "react";
import Image from "next/image";
import Link from "next/link";
import BackToTopButton from "../BackToTopButton";
import { SOCIALS, EMAIL_SOCIAL } from "./socials";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

const linkClass = "text-cream/75 hover:text-gold transition-colors font-medium";

export default async function Footer() {
  const images = await getSiteSettings();
  const iconByAlt: Record<string, string> = {
    Facebook: images.socialFacebookIcon,
    YouTube: images.socialYoutubeIcon,
    Instagram: images.socialInstagramIcon,
    Email: images.socialEmailIcon,
  };
  const socials = [...SOCIALS, EMAIL_SOCIAL].map((s) => ({
    ...s,
    icon: iconByAlt[s.alt] || s.icon,
  }));
  return (
    <div className="bg-brand-deep text-cream w-full mt-12 border-t border-gold/20">
      <footer className="mx-auto max-w-7xl flex flex-col px-6 lg:px-10 py-12 gap-10 lg:flex-row lg:flex-wrap lg:gap-16">
        <div className="flex flex-col gap-4 max-w-xs">
          <Link href="/" aria-label="Huma Qureshi Novels — Home" className="w-fit">
            <Image
              src={images.logo}
              alt="Huma Qureshi Novels"
              width={72}
              height={72}
              className="w-16 h-16 object-contain"
            />
          </Link>
          <p className="text-cream/70 text-sm leading-6">
            Original Urdu novels, episodic stories and PDF books by Huma Qureshi.
          </p>
        </div>

        <div className="flex w-full gap-10 flex-wrap lg:w-fit lg:gap-16">
          <nav aria-label="Useful pages" className="text-sm flex flex-col gap-3">
            <p className="font-bold text-gold uppercase tracking-wide text-xs">Useful Pages</p>
            <Link href="/" className={linkClass}>Home</Link>
            <Link href="/about" className={linkClass}>About Us</Link>
            <Link href="/contact" className={linkClass}>Contact Us</Link>
            <Link href="/privacypolicy" className={linkClass}>Privacy Policy</Link>
            <Link href="/terms" className={linkClass}>Terms &amp; Conditions</Link>
          </nav>

          <nav aria-label="Quick links" className="text-sm flex flex-col gap-3">
            <p className="font-bold text-gold uppercase tracking-wide text-xs">Quick Links</p>
            <Link href="/pdf" className={linkClass}>PDF Library</Link>
            <Link href="/novel" className={linkClass}>Episodic Novels</Link>
            <Link href="/short-stories" className={linkClass}>Short Stories</Link>
            <Link href="/#featured" className={linkClass}>Featured</Link>
            <Link href="/#genres" className={linkClass}>Genres</Link>
            <Link href="/#about-author" className={linkClass}>About the Author</Link>
          </nav>

          <nav aria-label="More" className="text-sm flex flex-col gap-3">
            <p className="font-bold text-gold uppercase tracking-wide text-xs">More</p>
            <Link href="/bookmarks" className={linkClass}>My Bookmarks</Link>
            <Link href="/novel" className={linkClass}>Browse Novels</Link>
            <Link href="/pdf" className={linkClass}>Browse PDFs</Link>
          </nav>
        </div>
      </footer>

      <div className="w-full flex flex-col items-center gap-4 px-6 pb-10">
        <BackToTopButton />
        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <a
              key={s.alt}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.alt}
              className="w-10 h-10 rounded-full border border-cream/20 bg-white/5 flex items-center justify-center hover:bg-white/15 hover:border-gold transition-colors"
            >
              <Image src={s.icon} alt={s.alt} width={20} height={20} className="w-5 h-5 object-contain" />
            </a>
          ))}
        </div>
        <p className="text-xs text-cream/60 text-center">
          © {new Date().getFullYear()} Huma Qureshi Novels. All rights reserved.
        </p>
        <p className="text-[10px] sm:text-xs text-cream/60 text-center">
          Developed by{" "}
          <Link href="https://agentack.co" target="_blank" rel="noopener noreferrer" className="font-bold text-gold hover:underline">
            Agentack
          </Link>
          {" "}·{" "}
          <Link href="https://agentack.co" target="_blank" rel="noopener noreferrer" className="font-bold text-cream hover:text-gold hover:underline">
            Let&apos;s talk
          </Link>
        </p>
      </div>
    </div>
  );
}

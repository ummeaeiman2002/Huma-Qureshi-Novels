"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";

export default function Logo({ scrolled = false }: { scrolled?: boolean }) {
  const { logo } = useSiteSettings();
  return (
    <Link
      href="/"
      aria-label="Huma Qureshi Novels — Home"
      className="group inline-flex shrink-0 items-center gap-3"
    >
      <span
        className={`flex items-center justify-center rounded-xl border border-gold/30 bg-white/5 transition-all duration-300 group-hover:border-gold/60 group-hover:bg-gold/10 ${
          scrolled ? "h-10 w-10" : "h-12 w-12"
        }`}
      >
        <Image
          src={logo}
          alt="Huma Qureshi Novels"
          width={40}
          height={40}
          priority
          className={`object-contain transition-all duration-300 ${
            scrolled ? "h-7 w-7" : "h-8 w-8"
          }`}
        />
      </span>

      <span className="flex flex-col leading-tight">
        <span className="font-display text-base font-extrabold tracking-tight text-cream">
          Huma Qureshi
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
          Novels
        </span>
      </span>
    </Link>
  );
}

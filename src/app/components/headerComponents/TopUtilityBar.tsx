import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SOCIALS } from "./socials";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

const UTILITY_LINKS: { href: Route; label: string }[] = [
  { href: "/about", label: "About the Author" },
  { href: "/contact", label: "Contact" },
  { href: "/privacypolicy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export default async function TopUtilityBar() {
  const images = await getSiteSettings();
  const iconByAlt: Record<string, string> = {
    Facebook: images.socialFacebookIcon,
    YouTube: images.socialYoutubeIcon,
    Instagram: images.socialInstagramIcon,
  };
  const socials = SOCIALS.map((s) => ({ ...s, icon: iconByAlt[s.alt] || s.icon }));
  return (
    <div className="bg-brand-deep text-cream/85 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-5 lg:px-10 min-h-9 py-1.5 flex items-center justify-between gap-4 text-xs">
        <nav aria-label="Utility" className="flex items-center flex-wrap gap-x-3 gap-y-1">
          {UTILITY_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center gap-x-3">
              {i > 0 && <span aria-hidden="true" className="text-cream/25">·</span>}
              <Link
                href={link.href}
                className="hover:text-gold transition-colors font-medium whitespace-nowrap"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-1 shrink-0">
          {socials.map((s) => (
            <a
              key={s.alt}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.alt}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Image src={s.icon} alt="" width={15} height={15} className="w-[15px] h-[15px] object-contain" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

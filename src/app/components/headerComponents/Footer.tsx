import React from "react";
import Image from "next/image";
import Link from "next/link";
import BackToTopButton from "../BackToTopButton";

export default function Footer() {
  const socials = [
    {
      href: "https://www.facebook.com/share/1FmEpe6h1p/",
      alt: "Facebook",
      icon: "https://res.cloudinary.com/dx1gryhqc/image/upload/v1758662209/facebook_vgnanl.png",
    },
    {
      href: "https://youtube.com/@writerhumaqureshinovells?si=UzQ_r6YKbTz-dI2z",
      alt: "YouTube",
      icon: "https://res.cloudinary.com/dx1gryhqc/image/upload/v1758664074/youtube_dpg3g8.png",
    },
    {
      href: "https://www.instagram.com/humaqureshiwriter007?igsh=amp6Y3B5OXJvb3lh",
      alt: "Instagram",
      icon: "https://res.cloudinary.com/dx1gryhqc/image/upload/v1758663992/instagram_mxjgaa.png",
    },
    {
      href: "mailto:humaqureshiofficial73@gmail.com",
      alt: "Email",
      icon: "https://res.cloudinary.com/dx1gryhqc/image/upload/v1758662225/mail_psqetd.png",
    },
  ];

  return (
    <div className="bg-[#FAF7F2] w-full py-8 mt-12 border-t border-[#DCCFC2]">
      <footer className="flex flex-col px-8 lg:px-20 pb-8 w-full justify-center lg:flex-row lg:flex-wrap lg:gap-16 items-start gap-10">
        {/* logo + tagline */}
        <div className="flex flex-col gap-3 w-fit">
          <Link href="/" className="w-fit bg-[#FFFDF9] border border-[#DCCFC2] px-3 py-2 rounded-xl block">
            <Image src={"https://res.cloudinary.com/dx1gryhqc/image/upload/v1758662209/Logo_ox1c8z.png"} alt="Huma Qureshi Novels" width={100} height={100} className="w-16 h-16 sm:w-20 sm:h-20 object-contain invert" />
          </Link>
          <p className="text-[#111111]/70 text-sm max-w-[220px] leading-6">
            Original Urdu novels, episodic stories and PDF books by Huma Qureshi.
          </p>
        </div>
        {/* pages */}
        <div className="flex w-full gap-10 flex-wrap justify-start lg:w-fit lg:gap-14">
          <div className="text-sm w-fit flex flex-col gap-2">
            <p className="font-bold text-[#C9A96E]">Useful Pages</p>
            <Link href="/" className="text-[#111111] font-bold hover:text-secondary transition">
              Home
            </Link>
            <Link href="/about" className="text-[#111111] font-bold hover:text-secondary transition">
              About Us
            </Link>

            <Link href="/contact" className="text-[#111111] font-bold hover:text-secondary transition">
              Contact Us
            </Link>
            <Link href="/privacypolicy" className="text-[#111111] font-bold hover:text-secondary transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[#111111] font-bold hover:text-secondary transition">
              Terms & Conditions
            </Link>
          </div>
          <div className="text-sm w-fit flex flex-col gap-2">
            <p className="font-bold text-[#C9A96E]">Quick Links</p>
            <Link href="/pdf" className="text-[#111111] font-bold hover:text-secondary transition">
              PDF Library
            </Link>
            <Link href="/novel" className="text-[#111111] font-bold hover:text-secondary transition">
              Episodic Novels
            </Link>
            <Link href="/short-stories" className="text-[#111111] font-bold hover:text-secondary transition">
              Short Stories
            </Link>            <Link href="/#latest" className="text-[#111111] font-bold hover:text-secondary transition">
              Latest
            </Link>
            <Link href="/#trending" className="text-[#111111] font-bold hover:text-secondary transition">
              Trending
            </Link>
            <Link href="/#popular" className="text-[#111111] font-bold hover:text-secondary transition">
              Popular
            </Link>
          </div>
          <div className="text-sm w-fit flex flex-col gap-2">
            <p className="font-bold text-[#C9A96E]">Bookmarks</p>
            <Link
              href="/bookmarks"
              className="text-[#111111] font-bold hover:text-secondary transition w-fit"
            >
              View My Bookmarks
            </Link>
            <Link
              href="/novel"
              className="text-[#111111] font-bold hover:text-secondary transition w-fit"
            >
              Browse Novels
            </Link>
            <Link
              href="/pdf"
              className="text-[#111111] font-bold hover:text-secondary transition w-fit"
            >
              PDF Library
            </Link>
          </div>
        </div>
      </footer>

      {/* social + copyright */}
      <div className="w-full flex flex-col items-center gap-4 px-8">
        <BackToTopButton />
        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <Link
              key={s.alt}
              href={s.href as any}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.alt}
              className="w-10 h-10 rounded-full border border-secondary/30 bg-secondary/10 flex items-center justify-center hover:bg-secondary/25 hover:border-secondary transition"
            >
              <Image
                src={s.icon}
                alt={s.alt}
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
            </Link>
          ))}
        </div>
        <p className="text-xs text-[#111111]/60 text-center">
          © {new Date().getFullYear()} Huma Qureshi Novels. All rights reserved.
        </p>
        <div className="w-full max-w-[70vw] h-px bg-secondary/20"></div>
        <p className="text-xs text-[#111111]/70 pt-1 text-center">
          Built with <span className="text-[#e65564]">♥</span> by{" "}
          <Link
            href="https://agentack.co"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#C9A96E] hover:text-secondary hover:underline transition"
          >
            Agentack
          </Link>{" "}
          · Want a site like this?{" "}
          <Link
            href="https://agentack.co"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#1E5D50] hover:text-secondary hover:underline transition"
          >
            Let&apos;s talk
          </Link>
        </p>
      </div>
    </div>
  );
}

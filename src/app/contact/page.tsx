import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Huma Qureshi for collaborations, ghost writing, story development, content creation, or general inquiries. Based in Karachi, available globally.",
  alternates: { canonical: "https://humaqureshinovels.com/contact" },
};

export default async function page() {
  const images = await getSiteSettings();
  return (
    <div className="flex flex-col gap-6 py-5 overflow-hidden">
      {/* Hero Banner */}
      <PageHero
        title="Get In Touch"
        description="Whether you're a reader, publisher, collaborator, or fellow creative — I'd love to hear from you."
      />

      {/* Content */}
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Let's Connect */}
        <div className="bg-surface rounded-2xl border border-line p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-2xl font-extrabold text-brand">Let&apos;s Connect</h2>
          <p className="leading-8">
            Have a project in mind? Want to discuss a story idea, a freelance opportunity, or just want to say hello? Feel free to drop a message. I personally read every email, and I&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {/* Collaboration */}
        <div className="bg-surface rounded-2xl border border-line p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-2xl font-extrabold text-brand">Looking for Professional Collaboration?</h2>
          <p className="leading-8 font-medium">I&apos;m open to:</p>
          <ul className="list-disc ps-6 flex flex-col gap-2 font-medium">
            <li>Freelance writing</li>
            <li>Story development &amp; ghostwriting</li>
            <li>Content creation</li>
            <li>Screenplay or novel consultation</li>
            <li>Guest posts or interviews</li>
          </ul>
        </div>

        {/* Contact Details */}
        <div className="bg-surface rounded-2xl border border-line p-6 lg:p-8 flex flex-col gap-5">
          <h2 className="text-2xl font-extrabold text-brand">Contact Details</h2>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
              <Image src={images.locationIcon} alt="" width={24} height={24} className="w-6 h-6 object-contain" />
            </div>
            <p className="font-medium">Karachi, Pakistan (Available for global projects remotely)</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
              <Image src={images.socialEmailIcon} alt="" width={24} height={24} className="w-6 h-6 object-contain" />
            </div>
            <Link href="mailto:humaqureshiofficial73@gmail.com" className="font-bold text-brand underline underline-offset-4 hover:text-gold transition">
              humaqureshiofficial73@gmail.com
            </Link>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-brand-deep rounded-2xl p-3 sm:p-5 lg:p-8 flex flex-col items-center gap-5 break-words">
          <h2 className="text-2xl font-extrabold text-white">Follow Me</h2>
          <div className="flex items-center gap-4">
            <Link href="mailto:humaqureshiofficial73@gmail.com" className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition">
              <Image src={images.socialEmailIcon} alt="Email" width={28} height={28} className="w-7 h-7 object-contain" />
            </Link>
            <Link href="https://youtube.com/@writerhumaqureshinovells?si=UzQ_r6YKbTz-dI2z" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition">
              <Image src={images.socialYoutubeIcon} alt="YouTube" width={28} height={28} className="w-7 h-7 object-contain" />
            </Link>
            <Link href="https://www.facebook.com/share/1FmEpe6h1p/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition">
              <Image src={images.socialFacebookIcon} alt="Facebook" width={28} height={28} className="w-7 h-7 object-contain" />
            </Link>
            <Link href="https://www.instagram.com/humaqureshiwriter007?igsh=amp6Y3B5OXJvb3lh" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition">
              <Image src={images.socialInstagramIcon} alt="Instagram" width={28} height={28} className="w-7 h-7 object-contain" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

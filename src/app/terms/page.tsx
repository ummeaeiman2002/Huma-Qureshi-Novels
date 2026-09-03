import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for Huma Qureshi Novels. Content ownership, copyright protection, DMCA policy, plagiarism rules, and limitation of liability.",
  alternates: { canonical: "https://humaqureshinovels.com/terms" },
};

export default function page() {
  return (
    <div className="flex flex-col gap-6 py-5 overflow-hidden">
      {/* Hero Banner */}
      <section className="relative mx-4 lg:mx-0 rounded-3xl overflow-hidden bg-[#1E5D50] shadow-2xl">
        <div aria-hidden="true" className="absolute inset-0 -z-0">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] rounded-full bg-[#2F7565]/40 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[200px] rounded-full bg-[#C9A96E]/15 blur-3xl"></div>
        </div>
        <div className="relative text-center px-6 py-12 lg:py-16 flex flex-col items-center gap-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Terms &amp; Disclaimer
          </h1>
          <p className="mx-auto max-w-2xl text-base lg:text-lg leading-8 text-white/80">
            Please read these terms carefully before using this website.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="flex flex-col gap-5 max-w-4xl mx-auto px-3 sm:px-4">
        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">General Terms</h2>
          <p className="leading-8">
            By accessing and using this website, you agree to the following terms and conditions. If you do not agree with any part of these terms, please refrain from using the website.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Content Ownership</h2>
          <p className="leading-8">
            This website is dedicated exclusively to the works of Huma Qureshi. It features her original Urdu novels, PDF books, episodic stories, and afsanas. All content published on this website belongs to Huma Qureshi and is protected under copyright law.
          </p>
          <p className="leading-8">
            Unauthorized copying, reproduction, translation, republishing, hosting, or distribution of any content from this website is strictly prohibited. All rights are reserved by the author, Huma Qureshi.
          </p>
        </div>

<div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Fictional Disclaimer</h2>
          <p className="leading-8">
            All stories, characters, events, and places mentioned on this website are works of fiction unless clearly stated as real. Any resemblance to actual persons (living or dead), places, or incidents is purely coincidental.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">No Plagiarism Allowed</h2>
          <p className="leading-8 font-medium">Visitors and readers are not allowed to:</p>
          <ul className="list-disc ps-6 flex flex-col gap-2 font-medium">
            <li>Copy or steal written material</li>
            <li>Use content under their name or for commercial purposes</li>
            <li>Share full stories without credit or permission</li>
          </ul>
          <p className="leading-8 font-bold text-[#8B6914]">
            Legal action may be taken in case of violation of content rights.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Collaborations &amp; Permissions</h2>
          <p className="leading-8">
            For sharing, quoting, or collaborating professionally, please contact us directly through the Contact Page or email at{" "}
            <Link href="mailto:humaqureshiofficial73@gmail.com" className="font-bold text-[#1E5D50] underline underline-offset-4 hover:text-[#C9A96E] transition">
              humaqureshiofficial73@gmail.com
            </Link>
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Privacy &amp; Data Use</h2>
          <p className="leading-8">
            Any personal data submitted through contact forms (such as name or email) will be kept confidential and never shared with third parties without consent.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Disclaimer of Liability</h2>
          <p className="leading-8">
            While we try to keep all information accurate and updated, this website makes no guarantees about the completeness, reliability, or accuracy of the content.
          </p>
          <p className="leading-8">
            The website owner is not liable for any misinterpretation, emotional impact, or external use of the content.
          </p>
          <p className="leading-8">
            Use of any content on this website is entirely at the reader&apos;s own risk. The website owner is not responsible for any loss or damage arising from the use of this website or its content.
          </p>
          <p className="leading-8">
            The website owner shall not be held liable for any data breach, unauthorized access, hacking, server failure, or loss of data caused by events beyond reasonable control. Users submit their information voluntarily and at their own risk.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">External Links Disclaimer</h2>
          <p className="leading-8">
            This website may contain links to external websites (e.g., YouTube, Facebook, Instagram, or PDF hosting services). We do not control the content or policies of these external websites and are not responsible for their content, privacy practices, or availability.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Download Responsibility</h2>
          <p className="leading-8">
            PDFs and files available for download on this website are provided for the reader&apos;s personal use. We are not responsible for how downloaded files are used, distributed, or stored by the user, or for any damage caused to devices during download.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Copyright Protection &amp; DMCA Policy</h2>
          <p className="leading-8">
            All novels, PDF books, stories, afsanas, and creative content published on this website are the original works of Huma Qureshi and are protected by copyright law.
          </p>
          <p className="leading-8 font-bold text-[#8B6914]">
            If any website, platform, individual, or entity is found copying, reproducing, hosting, or distributing our content without written permission from Huma Qureshi, we will take immediate DMCA takedown action and legal proceedings against them.
          </p>
          <p className="leading-8">
            We actively monitor the internet for unauthorized use of our content. If you find our work being used elsewhere without permission, please report it to us at{" "}
            <Link href="mailto:humaqureshiofficial73@gmail.com" className="font-bold text-[#1E5D50] underline underline-offset-4 hover:text-[#C9A96E] transition">
              humaqureshiofficial73@gmail.com
            </Link>.
          </p>
          <p className="leading-8">
            We will file DMCA takedown requests with hosting providers, search engines, and platforms to have infringing content removed. Repeat infringers may face legal action for copyright damages and intellectual property theft.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Copyright &amp; Content Removal Requests</h2>
          <p className="leading-8">
            All content on this website is the original work of Huma Qureshi and is protected by copyright. If you believe any content on this website infringes your copyright or has been published without proper authorization, please contact us at{" "}
            <Link href="mailto:humaqureshiofficial73@gmail.com" className="font-bold text-[#1E5D50] underline underline-offset-4 hover:text-[#C9A96E] transition">
              humaqureshiofficial73@gmail.com
            </Link>{" "}
            with the details, and we will review and address your request promptly.
          </p>
        </div>
      </div>
    </div>
  );
}

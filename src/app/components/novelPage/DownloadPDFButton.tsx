"use client";

import Image from "next/image";
import React from "react";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";

export default function DownloadPDFButton({
  pdf,
  slug,
  type = "pdf",
}: {
  pdf: string;
  slug?: string;
  type?: "pdf" | "novel";
}) {
  const { downloadIcon } = useSiteSettings();
  const href =
    slug && pdf
      ? `/download/${slug}?type=${type}&pdf=${encodeURIComponent(pdf)}`
      : pdf;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-center items-center gap-2 bg-brand text-white font-bold text-sm sm:text-base w-fit px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-lg hover:bg-brand-dark hover:shadow-[0_0_16px_rgba(30,93,80,0.4)] active:scale-95 transition-all duration-300"
    >
      <p>Download PDF</p>
      <Image
        className="w-5 h-5 sm:w-6 sm:h-6"
        src={downloadIcon}
        width={100}
        height={100}
        alt=""
      />
    </a>
  );
}

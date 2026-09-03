"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useUserId } from "@/app/context/UserIdContext";

export default function Novel({
  href,
  novelName,
  writer,
  genre,
  cardBanner,
  date,
  summary,
}: {
  href: string;
  novelName: string;
  writer: string;
  genre: string;
  cardBanner: string;
  date: string;
  summary?: string;
}) {
  const { userId, isPremium } = useUserId();

  const blockCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  // Generate user-specific link if premium
  const getLink = () => {
    if (isPremium && userId) {
      return `/${userId}/novel/${href}`;
    }
    return `/novel/${href}`;
  };

  return (
    <Link
      // href={getLink()}
      href={`/novel/${href}`}
      onCopy={blockCopy}
      onCut={blockCopy}
      className="group relative text-tertiary w-full max-w-[260px] rounded-2xl flex flex-col justify-start items-center py-5 px-4 gap-3 bg-[#FFFDF9] border-2 border-[#DCCFC2] shadow-lg hover:border-[#1E5D50] hover:shadow-[0_0_24px_rgba(30,93,80,0.35)] hover:-translate-y-1 active:scale-[1.03] transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-2xl bg-[#1E5D50]/0 group-hover:bg-[#1E5D50]/5 transition-all duration-300 pointer-events-none" />
      {cardBanner ? (
        <div className="w-[200px] h-[112px] self-center rounded-lg overflow-hidden">
          <Image
            alt=""
            width={320}
            height={180}
            src={cardBanner}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-2.5 w-full items-center">
        {date && <p className="text-[11px] text-right pr-4 opacity-60 w-full">{date}</p>}
        <h3 className="text-lg font-extrabold text-wrap text-center px-3 title-bright leading-snug">
          {novelName}
        </h3>
        {summary && (
          <div className="flex flex-col gap-1 px-3 w-full">
            <p className="text-[11px] uppercase tracking-wider font-bold text-[#8B6914]">
              Summary
            </p>
            <p className="text-xs text-start leading-5 text-tertiary line-clamp-4 overflow-hidden">
              {summary}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-1 w-full px-5 text-sm">
          <p>
            <span className="font-bold text-[#8B6914]">Writer : </span>
            <span className="text-tertiary">{writer}</span>
          </p>
          <p>
            <span className="font-bold text-[#8B6914]">Genre : </span>
            <span className="text-tertiary">{genre}</span>
          </p>
        </div>
        <button className="mt-1 bg-[#1E5D50] text-white font-bold px-6 py-2 rounded-full hover:bg-[#16483E] hover:shadow-[0_0_14px_rgba(30,93,80,0.5)] active:scale-95 transition-all duration-300">
          Read
        </button>
      </div>
    </Link>
  );
}
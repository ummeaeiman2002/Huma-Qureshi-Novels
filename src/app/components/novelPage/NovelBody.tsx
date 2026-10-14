"use client";
import React from "react";

export default function NovelBody({ novelText }: { novelText: string }) {
  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="px-5 lg:px-24 text-right text-tertiary text-[19px] leading-9 whitespace-pre-wrap font-urdu break-words overflow-hidden select-none"
      dir="rtl"
      onCopy={handleCopy}
      onCut={handleCopy}
      style={{ userSelect: "none" }}
    >
      <p>{novelText}</p>
    </div>
  );
}

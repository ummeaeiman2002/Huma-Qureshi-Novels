import React from "react";

export default function Comment({
  name,
  createdAt,
  comment,
}: {
  name: string;
  createdAt: string;
  comment: string;
}) {
  return (
    <div className="flex gap-4 lg:gap-5 items-start rounded-2xl border border-secondary/25 bg-secondary/5 p-5 shadow-xl">
      {/* user icon */}
      <div className="w-12 h-12 shrink-0 rounded-full bg-secondary/15 border border-secondary/40 flex items-center justify-center text-secondary">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      {/* username, date, and comment */}
      <div className="flex flex-col gap-2 text-sm flex-1">
        <div className="flex items-center flex-wrap gap-3">
          <p className="font-bold text-secondary">{name}</p>
          <p className="text-xs text-tertiary/60">
            {new Date(createdAt).toDateString()}
          </p>
        </div>
        <p className="text-wrap text-tertiary leading-6">{comment}</p>
      </div>
    </div>
  );
}

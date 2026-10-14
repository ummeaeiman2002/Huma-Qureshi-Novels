"use client";

import { useEffect, useState } from "react";
import Heading from "./Heading";

interface Review {
  name: string;
  rating: number;
  text: string;
  date: number;
}

interface ReaderReviewsProps {
  storageKey: string;
  heading?: string;
}

const AVATAR_PALETTE = ["#1E5D50", "#8B6914", "#e65564", "#2F7565", "#5B7C99", "#9B6BA8"];

export default function ReaderReviews({
  storageKey,
  heading = "Reader Reviews",
}: ReaderReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const list = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list)) setReviews(list);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  function addReview() {
    if (!name.trim() || !text.trim() || rating < 1) return;
    const next = [
      { name: name.trim(), text: text.trim(), rating, date: Date.now() },
      ...reviews,
    ];
    localStorage.setItem(storageKey, JSON.stringify(next));
    setReviews(next);
    setName("");
    setText("");
    setRating(0);
  }

  const average =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section aria-labelledby="reviews-heading" className="py-4">
      <Heading name={heading} />

      <div className="rounded-3xl border-2 border-[#C9A96E]/40 bg-gradient-to-br from-[#FFFDF9] to-[#FFF8EC] p-5 sm:p-6 lg:p-10 shadow-xl overflow-hidden">
          {/* Header with average rating */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1 text-center sm:text-start">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B6914]">
                Community Rating
              </span>
              {average ? (
                <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#1E5D50]">{average}</span>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-0.5 text-[#C9A96E] shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill={s <= Math.round(Number(average)) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <path d="M12 2l2.9 6.26 6.6.6-5 4.4 1.5 6.5L12 16.9 5.9 19.8l1.5-6.5-5-4.4 6.6-.6L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-tertiary font-medium">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              ) : (
                <span className="text-tertiary font-medium">No reviews yet — be the first to share yours</span>
              )}
            </div>
            <div className="text-xs text-[#8B6914]/80 font-semibold uppercase tracking-wide">
              Free · No login needed
            </div>
          </div>

          {/* Review form */}
          <div className="rounded-2xl border border-[#C9A96E]/30 bg-[#FFFDF9] p-5 lg:p-6 flex flex-col gap-4 shadow-sm">
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#1E5D50]">
              Write Your Review
            </span>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-col gap-1.5 shrink-0">
                <span className="text-xs font-bold text-[#8B6914] uppercase tracking-wide">Your Rating <span className="text-[#e65564]">*</span></span>
                <div className="flex items-center gap-0.5 sm:gap-1" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={rating === s}
                      aria-label={`${s} star${s !== 1 ? "s" : ""}`}
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHover(s)}
                      onMouseLeave={() => setHover(0)}
                      className="transition active:scale-90"
                    >
                      <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill={(hover || rating) >= s ? "#C9A96E" : "none"} stroke="#C9A96E" strokeWidth="1.5" aria-hidden="true">
                        <path d="M12 2l2.9 6.26 6.6.6-5 4.4 1.5 6.5L12 16.9 5.9 19.8l1.5-6.5-5-4.4 6.6-.6L12 2z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-1 text-sm font-bold text-[#e65564]">*</span>
                </div>
              </div>
              <label className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="text-xs font-bold text-[#8B6914] uppercase tracking-wide">Your Name <span className="text-[#e65564]">*</span></span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[#C9A96E]/40 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1E5D50] focus:ring-2 focus:ring-[#1E5D50]/20 transition"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#8B6914] uppercase tracking-wide">Your Review <span className="text-[#e65564]">*</span></span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="Share your thoughts on this story…"
                className="rounded-xl border border-[#C9A96E]/40 bg-white px-4 py-3 text-sm outline-none focus:border-[#1E5D50] focus:ring-2 focus:ring-[#1E5D50]/20 transition resize-none"
              />
            </label>
            {(!name.trim() || !text.trim() || rating < 1) && (
              <p className="text-xs text-[#e65564] font-semibold">
                Please select a rating, enter your name and write a review.
              </p>
            )}
            <div className="flex justify-end">
              <button
                onClick={addReview}
                disabled={!name.trim() || !text.trim() || rating < 1}
                className="bg-[#1E5D50] text-white font-bold px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm hover:bg-[#16483E] active:scale-95 transition shadow disabled:opacity-40"
              >
                Post Review
              </button>
            </div>
          </div>

          {/* Reviews list */}
          {reviews.length > 0 && (
            <div className="mt-8 flex flex-col gap-4">
              {reviews.map((r, i) => (
                <div key={i} className="flex gap-3 sm:gap-4 items-start rounded-2xl border border-[#C9A96E]/25 bg-[#FFFDF9] p-4 sm:p-5 shadow-sm overflow-hidden">
                  <span
                    className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full text-white font-extrabold flex items-center justify-center text-base shadow"
                    style={{ backgroundColor: AVATAR_PALETTE[i % AVATAR_PALETTE.length] }}
                  >
                    {(r.name || "R").charAt(0).toUpperCase()}
                  </span>
                  <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-[#1E5D50] truncate">{r.name || "Reader"}</span>
                      <span className="flex gap-0.5 text-[#C9A96E] shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= r.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                            <path d="M12 2l2.9 6.26 6.6.6-5 4.4 1.5 6.5L12 16.9 5.9 19.8l1.5-6.5-5-4.4 6.6-.6L12 2z" />
                          </svg>
                        ))}
                      </span>
                      <span className="text-xs text-tertiary/60 font-medium shrink-0">
                        {new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <p className="leading-6 text-tertiary font-medium break-words">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </section>
  );
}

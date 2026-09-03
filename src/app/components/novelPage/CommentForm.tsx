"use client";
import React from "react";

export default function CommentForm({
  handleCommentSubmit,
  commentName,
  commentNameHandle,
  commentText,
  commentTextHandle,
  isSubmitting,
}: {
  handleCommentSubmit: any;
  commentName: string;
  commentNameHandle: any;
  commentText: string;
  commentTextHandle: any;
  isSubmitting?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 text-tertiary w-full lg:max-w-[40vw] rounded-2xl border border-secondary/25 bg-secondary/5 p-6 shadow-xl">
      <h3 className="heading-stylish text-xl font-bold text-[#C9A96E]">
        Leave a Comment
      </h3>
      <input
        type="text"
        placeholder="Your name"
        value={commentName}
        onChange={commentNameHandle}
        disabled={isSubmitting}
        className="rounded-lg border border-secondary/30 bg-transparent px-4 py-2.5 text-sm text-tertiary placeholder:text-tertiary/40 focus:outline-none focus:border-secondary transition disabled:opacity-60"
      />
      <textarea
        placeholder="Share your thoughts..."
        rows={3}
        value={commentText}
        onChange={commentTextHandle}
        disabled={isSubmitting}
        className="rounded-lg border border-secondary/30 bg-transparent px-4 py-2.5 text-sm text-tertiary placeholder:text-tertiary/40 focus:outline-none focus:border-secondary resize-none transition disabled:opacity-60"
      />
      <button
        onClick={handleCommentSubmit}
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 self-start bg-secondary text-primary font-semibold px-5 py-2 rounded-full text-sm hover:bg-tertiary active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting && (
          <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </div>
  );
}

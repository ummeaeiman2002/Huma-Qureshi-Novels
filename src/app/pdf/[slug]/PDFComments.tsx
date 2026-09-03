"use client";

import { useEffect, useState } from "react";
import { addCommentAction } from "@/app/actions/Comments";
import CommentForm from "@/app/components/novelPage/CommentForm";
import Comment from "@/app/components/novelPage/Comment";

type CommentItem = { _id: string; name: string; comment: string; _createdAt: string };

export default function PDFComments({ pdfId, initialComments }: { pdfId: string; initialComments: CommentItem[] }) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments || []);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!pdfId) return;
    const key = `viewed_${pdfId}`;
    if (localStorage.getItem(key)) return;
    fetch("/api/views", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: pdfId }) }).catch(() => {});
    localStorage.setItem(key, "true");
  }, [pdfId]);

  async function submitComment() {
    if (!commentName.trim() || !commentText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const created = await addCommentAction(pdfId, commentName.trim(), commentText.trim());
      setComments((old) => [...old, { _id: created._id, name: commentName.trim(), comment: commentText.trim(), _createdAt: created._createdAt }]);
      setCommentName("");
      setCommentText("");
      alert("Your comment has been posted. Thank you!");
    } catch (err) {
      console.error("Comment submission failed:", err);
      alert("Sorry, your comment could not be posted. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <CommentForm
        handleCommentSubmit={submitComment}
        commentName={commentName}
        commentNameHandle={(e: any) => setCommentName(e.target.value)}
        commentText={commentText}
        commentTextHandle={(e: any) => setCommentText(e.target.value)}
        isSubmitting={isSubmitting}
      />
      {comments.map((c) => <Comment key={c._id} name={c.name} createdAt={c._createdAt} comment={c.comment} />)}
    </>
  );
}

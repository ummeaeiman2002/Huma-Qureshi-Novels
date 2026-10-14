// app/actions/addComment.ts
"use server";

import { client } from "@/sanity/lib/client";


export async function addCommentAction(novelId: string, name: string, commentText: string) {
  const newComment = await client.create({
    _type: "comment",
    name,
    comment: commentText,
    _createdAt: new Date().toISOString(),
  });

  await client
    .patch(novelId)
    .setIfMissing({ comment: [] })
    .append("comment", [{ _type: "reference", _ref: newComment._id }])
    .commit();

  return newComment;
}

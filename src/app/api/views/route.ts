import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    console.log("Got from body:", slug);

    const updated = await client
      .patch(slug)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();

    return NextResponse.json({ success: true, views: updated.views  });
  } catch (err) {
    console.error("Error updating view count:", err);
    return NextResponse.json({ success: false });
  }
}

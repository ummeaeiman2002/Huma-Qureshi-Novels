import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { novelId } = await req.json();

    if (!novelId) {
      return NextResponse.json(
        { success: false, message: "novelId missing" },
        { status: 400 }
      );
    }

    const updated = await client
      .patch(novelId)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();

    return NextResponse.json({
      success: true,
      views: updated.views,
    });
  } catch (err) {
    console.error("Error updating novel views:", err);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

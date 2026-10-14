import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { novelId, type } = await req.json();

    if (!novelId || !type) {
      return NextResponse.json(
        { success: false, message: "novelId and type are required" },
        { status: 400 }
      );
    }

    // Check if it's a new month and reset monthly views if needed
    await resetMonthlyViewsIfNeeded();

    let updated;
    if (type === "episode") {
      // Update monthly views for an episode
      updated = await client
        .patch(novelId)
        .setIfMissing({ monthlyViews: 0 })
        .inc({ monthlyViews: 1 })
        .commit();
    } else if (type === "pdf") {
      // Update monthly views for a PDF
      updated = await client
        .patch(novelId)
        .setIfMissing({ monthlyViews: 0 })
        .inc({ monthlyViews: 1 })
        .commit();
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid type. Use 'episode' or 'pdf'" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      monthlyViews: updated.monthlyViews,
    });
  } catch (err) {
    console.error("Error updating monthly views:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Function to check if we need to reset monthly views
async function resetMonthlyViewsIfNeeded() {
  // Get the last reset date from Sanity (store it as a document)
  try {
    const resetDateDoc = await client.fetch(
      `*[_type == "systemConfig" && configId == "monthlyResetDate"][0]{lastReset}`
    );

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let shouldReset = true;

    if (resetDateDoc && resetDateDoc.lastReset) {
      const lastReset = new Date(resetDateDoc.lastReset);
      const lastResetMonth = lastReset.getMonth();
      const lastResetYear = lastReset.getFullYear();

      // Check if the month and year are the same as the last reset
      if (lastResetMonth === currentMonth && lastResetYear === currentYear) {
        shouldReset = false;
      }
    }

    if (shouldReset) {
      // Reset all monthly views to 0
      await resetAllMonthlyViews();

      // Update the reset date
      await client.createOrReplace({
        _id: "monthlyResetDate",
        _type: "systemConfig",
        configId: "monthlyResetDate",
        lastReset: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error checking/resetting monthly views:", error);
  }
}

async function resetAllMonthlyViews() {
  try {
    // Reset monthly views for all episodes
    const episodes = await client.fetch(`*[_type == "novel"]{_id}`);
    for (const episode of episodes) {
      await client.patch(episode._id).set({ monthlyViews: 0 }).commit();
    }

    // Reset monthly views for all PDFs
    const pdfs = await client.fetch(`*[_type == "pdf"]{_id}`);
    for (const pdf of pdfs) {
      await client.patch(pdf._id).set({ monthlyViews: 0 }).commit();
    }
  } catch (error) {
    console.error("Error resetting all monthly views:", error);
  }
}

// Optional: GET endpoint to check the last reset date
export async function GET() {
  try {
    const resetDateDoc = await client.fetch(
      `*[_type == "systemConfig" && configId == "monthlyResetDate"][0]{lastReset}`
    );

    return NextResponse.json({
      success: true,
      lastReset: resetDateDoc?.lastReset || null,
    });
  } catch (err) {
    console.error("Error fetching reset date:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { createHash } from "crypto";

const KEYS = ["like", "love", "wow", "sad", "fire"] as const;
type Key = (typeof KEYS)[number];

// Non-CDN client so reads are fresh and writes are consistent
const db = client.withConfig({ useCdn: false });

function docId(slug: string) {
  return `reaction_${createHash("sha256").update(slug).digest("hex").slice(0, 32)}`;
}

function sanitizeSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const slug = value.trim();
  if (!slug || slug.length > 300) return null;
  return slug;
}

function sanitizeKey(value: unknown): Key | null {
  return typeof value === "string" && (KEYS as readonly string[]).includes(value)
    ? (value as Key)
    : null;
}

function emptyCounts() {
  const counts: Record<string, number> = {};
  for (const key of KEYS) counts[key] = 0;
  return counts;
}

async function readCounts(slug: string) {
  const doc = await db.fetch<Record<string, unknown> | null>(
    `*[_type == "reaction" && _id == $id && slugkey == $slug][0]{ ${KEYS.join(", ")} }`,
    { id: docId(slug), slug },
    { cache: "no-store" }
  );
  const counts = emptyCounts();
  for (const key of KEYS) {
    const n = Number(doc?.[key]);
    if (Number.isFinite(n) && n > 0) counts[key] = Math.floor(n);
  }
  return counts;
}

export async function GET(req: Request) {
  try {
    const slug = sanitizeSlug(new URL(req.url).searchParams.get("slug"));
    if (!slug) {
      return NextResponse.json({ success: false, error: "Missing slug" }, { status: 400 });
    }
    return NextResponse.json({ success: true, counts: await readCounts(slug) });
  } catch (err) {
    console.error("Reactions GET error:", err);
    return NextResponse.json({ success: false, counts: emptyCounts() }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = sanitizeSlug(body?.slug);
    const key = sanitizeKey(body?.key);
    const delta = body?.delta === -1 ? -1 : 1;

    if (!slug || !key) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const _id = docId(slug);

    await db.createIfNotExists({
      _id,
      _type: "reaction",
      slugkey: slug,
      like: 0,
      love: 0,
      wow: 0,
      sad: 0,
      fire: 0,
    });

    const updated = await db
      .patch(_id)
      .setIfMissing({ [key]: 0 })
      .inc({ [key]: delta })
      .commit({ returnDocuments: true });

    // Never let a count go negative
    if (Number(updated?.[key]) < 0) {
      await db.patch(_id).set({ [key]: 0 }).commit();
    }

    return NextResponse.json({ success: true, counts: await readCounts(slug) });
  } catch (err) {
    console.error("Reactions POST error:", err);
    return NextResponse.json({ success: false, counts: emptyCounts() }, { status: 500 });
  }
}

import { NextResponse, type NextRequest } from "next/server";
import { kv } from "@vercel/kv";

const KEY_PREFIX = "live_users:";
const TTL_SECONDS = 24 * 60 * 60; // 24 hours
const COUNT_KEY = "live_users:count";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json({ liveUsers: 0, simulated: true });
  }
  const keys = await kv.keys(`${KEY_PREFIX}*`);
  const ids = keys
    .map((k: string) => k.slice(KEY_PREFIX.length))
    .filter(Boolean);
  return NextResponse.json({ liveUsers: ids.length });
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json({ ok: true, simulated: true });
  }
  const body = await req.json().catch(() => ({ visitorId: "" as string }));
  const visitorId = String(body?.visitorId || "").trim();
  if (!visitorId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const key = KEY_PREFIX + visitorId;
  await kv.set(key, Date.now(), { ex: TTL_SECONDS });
  await kv.incr(COUNT_KEY);
  return NextResponse.json({ ok: true });
}

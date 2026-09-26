import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

// GET /api/settings — public, read-only. The storefront calls this (or reads
// it at render time) instead of hardcoding the WhatsApp number, delivery
// charge, announcement text, etc.
export async function GET() {
  try {
    const rows = await db.select().from(siteSettings);
    const map: Record<string, unknown> = {};
    for (const row of rows) map[row.key] = row.value;
    return NextResponse.json(map);
  } catch (err) {
    console.error("GET /api/settings: database error:", err);
    return NextResponse.json(
      { error: "Settings are temporarily unavailable" },
      { status: 503 }
    );
  }
}

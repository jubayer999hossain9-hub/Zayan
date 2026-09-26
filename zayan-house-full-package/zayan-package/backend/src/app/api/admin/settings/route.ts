import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { siteSettings, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";

async function requireAdmin() {
  const jar = await cookies();
  const session = verifySessionToken(jar.get(SESSION_COOKIE)?.value);
  return session; // null if not logged in / expired / tampered
}

// PUT /api/admin/settings  { key: "whatsapp_number", value: "+8801..." }
// This is the real SMC write path: Admin Panel -> here -> site_settings row
// -> every future GET /api/settings (and any page that reads it) sees the
// new value immediately. No redeploy needed.
export async function PUT(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { key, value } = await req.json();
  if (!key) {
    return NextResponse.json({ error: "key is required" }, { status: 400 });
  }

  const [existing] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
  const oldValue = existing?.value ?? null;

  await db
    .insert(siteSettings)
    .values({ key, value })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } });

  await db.insert(activityLogs).values({
    adminEmail: session.email,
    action: "update_setting",
    module: "smc",
    details: { key, oldValue, newValue: value },
  });

  return NextResponse.json({ ok: true, key, value });
}

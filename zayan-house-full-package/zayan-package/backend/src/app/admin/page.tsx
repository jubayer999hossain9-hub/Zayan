import { db } from "@/db";
import { siteSettings, activityLogs } from "@/db/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { desc } from "drizzle-orm";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const jar = await cookies();
  const session = verifySessionToken(jar.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");

  const settings = await db.select().from(siteSettings);
  const logs = await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(10);

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 640, margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: 22 }}>SMC — Settings & Management</h1>
      <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>Logged in as {session.email} ({session.role})</p>

      <SettingsForm settings={settings} />

      <h2 style={{ fontSize: 16, marginTop: 32, marginBottom: 10 }}>Recent Activity Log</h2>
      <div style={{ fontSize: 12.5, color: "#555", display: "grid", gap: 6 }}>
        {logs.length === 0 && <div>No changes yet.</div>}
        {logs.map((l) => (
          <div key={l.id} style={{ borderBottom: "1px solid #eee", paddingBottom: 6 }}>
            {l.adminEmail} changed <b>{(l.details as { key?: string })?.key}</b> from{" "}
            {JSON.stringify((l.details as { oldValue?: unknown })?.oldValue)} to{" "}
            {JSON.stringify((l.details as { newValue?: unknown })?.newValue)} —{" "}
            {l.createdAt.toLocaleString()}
          </div>
        ))}
      </div>
    </main>
  );
}

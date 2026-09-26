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

  let settings: (typeof siteSettings.$inferSelect)[] = [];
  let logs: (typeof activityLogs.$inferSelect)[] = [];
  let dbError = false;
  try {
    [settings, logs] = await Promise.all([
      db.select().from(siteSettings),
      db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(10),
    ]);
  } catch (err) {
    console.error("Admin dashboard: failed to load data from the database:", err);
    dbError = true;
  }

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 640, margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: 22 }}>SMC — Settings & Management</h1>
      <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>Logged in as {session.email} ({session.role})</p>

      {dbError ? (
        <p style={{ color: "#a15c00", background: "#fff3e0", padding: "10px 14px", borderRadius: 6, fontSize: 13 }}>
          The database is temporarily unavailable — settings can&apos;t be loaded or saved right now.
        </p>
      ) : (
        <>
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
        </>
      )}
    </main>
  );
}

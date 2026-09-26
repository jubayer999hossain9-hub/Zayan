import { db } from "@/db";
import { products, siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic"; // always hit the DB, never cache stale data

export default async function HomePage() {
  const allProducts = await db.select().from(products).where(eq(products.isActive, true));
  const [announcement] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "announcement_text"));
  const [whatsapp] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "whatsapp_number"));

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 720, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ background: "#0E3B2E", color: "#fff", padding: "10px 16px", borderRadius: 6, marginBottom: 24, fontSize: 13 }}>
        {String(announcement?.value ?? "")}
      </div>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Zayan House</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        This list is read live from PostgreSQL on every request — nothing here is hardcoded.
      </p>
      <div style={{ display: "grid", gap: 14 }}>
        {allProducts.map((p) => (
          <div key={p.id} style={{ border: "1px solid #e6ded4", borderRadius: 10, padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 32 }}>{p.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{p.sku}</div>
            </div>
            <div style={{ fontWeight: 700 }}>
              {p.salePrice ? (
                <>
                  ৳{p.salePrice} <span style={{ color: "#999", textDecoration: "line-through", fontWeight: 400, fontSize: 12 }}>৳{p.regularPrice}</span>
                </>
              ) : (
                <>৳{p.regularPrice}</>
              )}
            </div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 28, fontSize: 12, color: "#888" }}>
        WhatsApp order number (from SMC/database): <b>{String(whatsapp?.value ?? "")}</b>
      </p>
      <p style={{ fontSize: 12, color: "#888" }}>
        Try changing it: <code>/admin/login</code> → edit → refresh this page.
      </p>
    </main>
  );
}

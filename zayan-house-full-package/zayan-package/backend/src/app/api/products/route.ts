import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/products — real read from Postgres, no hardcoded data.
export async function GET() {
  try {
    const rows = await db.select().from(products).where(eq(products.isActive, true));
    return NextResponse.json({ products: rows });
  } catch (err) {
    console.error("GET /api/products: database error:", err);
    return NextResponse.json(
      { products: [], error: "Products are temporarily unavailable" },
      { status: 503 }
    );
  }
}

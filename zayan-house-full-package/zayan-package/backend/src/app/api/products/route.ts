import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/products — real read from Postgres, no hardcoded data.
export async function GET() {
  const rows = await db.select().from(products).where(eq(products.isActive, true));
  return NextResponse.json({ products: rows });
}

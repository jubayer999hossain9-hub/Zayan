import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug));
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id));
  return NextResponse.json({ product, variants });
}

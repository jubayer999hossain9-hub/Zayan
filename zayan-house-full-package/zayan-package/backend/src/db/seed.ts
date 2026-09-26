import "dotenv/config";
import { db } from "./index";
import {
  categories,
  collections,
  products,
  productVariants,
  siteSettings,
  adminUsers,
} from "./schema";
import { scryptSync, randomBytes } from "crypto";

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Seeding Zayan House database...");

  const [womens] = await db
    .insert(categories)
    .values({ name: "Women's", slug: "womens", displayOrder: 1 })
    .returning();
  const [mens] = await db
    .insert(categories)
    .values({ name: "Men's", slug: "mens", displayOrder: 2 })
    .returning();
  const [kids] = await db
    .insert(categories)
    .values({ name: "Kids'", slug: "kids", displayOrder: 3 })
    .returning();

  const [festive] = await db
    .insert(collections)
    .values({
      name: "Festive Edit",
      slug: "festive-edit",
      description: "Limited pieces for the festive season.",
      bannerEmoji: "🎁",
      displayOrder: 1,
    })
    .returning();

  const [p1] = await db
    .insert(products)
    .values({
      sku: "ZH-KURTI-001",
      name: "Embroidered Kurti",
      slug: "embroidered-kurti",
      categoryId: womens.id,
      collectionId: festive.id,
      description:
        "Hand-embroidered cotton-blend kurti with a relaxed A-line fit.",
      regularPrice: "2000.00",
      salePrice: "1650.00",
      emoji: "👗",
      isNewArrival: true,
    })
    .returning();

  await db.insert(productVariants).values([
    { productId: p1.id, size: "M", color: "Green", stockQty: 12 },
    { productId: p1.id, size: "L", color: "Green", stockQty: 8 },
    { productId: p1.id, size: "M", color: "Gold", stockQty: 5 },
  ]);

  const [p2] = await db
    .insert(products)
    .values({
      sku: "ZH-PANJABI-001",
      name: "Premium Linen Panjabi",
      slug: "premium-linen-panjabi",
      categoryId: mens.id,
      description: "Breathable linen panjabi, tailored fit.",
      regularPrice: "1450.00",
      emoji: "👔",
      isBestseller: true,
    })
    .returning();

  await db.insert(productVariants).values([
    { productId: p2.id, size: "L", color: "Charcoal", stockQty: 10 },
    { productId: p2.id, size: "XL", color: "Charcoal", stockQty: 4 },
  ]);

  await db.insert(products).values({
    sku: "ZH-KIDSET-001",
    name: "Kids Kurta Set",
    slug: "kids-kurta-set",
    categoryId: kids.id,
    description: "Festive kurta set for ages 3-10.",
    regularPrice: "950.00",
    emoji: "🧒",
    isFeatured: true,
  });

  // --- SMC settings: this is the table that makes SMC real ---
  await db.insert(siteSettings).values([
    { key: "whatsapp_number", value: "+8801700000000" },
    { key: "whatsapp_message_template", value: "Hi, I'm interested in {product_name}" },
    { key: "delivery_charge_dhaka", value: 70 },
    { key: "delivery_charge_outside_dhaka", value: 130 },
    { key: "free_delivery_threshold", value: 2000 },
    { key: "cod_enabled", value: true },
    { key: "announcement_text", value: "Free delivery inside Dhaka over ৳2000" },
  ]);

  await db.insert(adminUsers).values({
    email: "admin@zayanhouse.com",
    passwordHash: hashPassword("ChangeMe123!"),
    role: "super_admin",
  });

  console.log("Seed complete.");
  console.log("Admin login -> admin@zayanhouse.com / ChangeMe123! (change immediately)");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * Zayan House — core database schema (Drizzle ORM / PostgreSQL)
 *
 * This is a deliberately-scoped MVP schema: enough real tables to prove the
 * full chain (Admin/SMC -> Database -> Storefront) genuinely works end to
 * end. Extend it with the remaining entities (Coupon, Review, ReturnRequest,
 * PaymentTransaction, etc.) the same way as the business grows.
 */

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  description: text("description"),
  bannerEmoji: varchar("banner_emoji", { length: 8 }), // placeholder visual until real photography is supplied
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 60 }).notNull().unique(),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  categoryId: integer("category_id").references(() => categories.id),
  collectionId: integer("collection_id").references(() => collections.id),
  description: text("description"),
  regularPrice: numeric("regular_price", { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
  emoji: varchar("emoji", { length: 8 }), // placeholder visual until real photography is supplied
  isFeatured: boolean("is_featured").notNull().default(false),
  isBestseller: boolean("is_bestseller").notNull().default(false),
  isNewArrival: boolean("is_new_arrival").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  size: varchar("size", { length: 20 }),
  color: varchar("color", { length: 40 }),
  stockQty: integer("stock_qty").notNull().default(0),
  priceDelta: numeric("price_delta", { precision: 10, scale: 2 }).notNull().default("0"),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  address: text("address"),
  district: varchar("district", { length: 80 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNo: varchar("order_no", { length: 30 }).notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id),
  status: varchar("status", { length: 30 }).notNull().default("pending"),
  source: varchar("source", { length: 20 }).notNull().default("website"), // website | whatsapp | manual
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryCharge: numeric("delivery_charge", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull().default("cod"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id)
    .notNull(),
  productId: integer("product_id").references(() => products.id),
  variantId: integer("variant_id").references(() => productVariants.id),
  qty: integer("qty").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
});

// One row per SMC setting. This is the table that makes SMC "real": every
// storefront read (WhatsApp number, delivery charge, hero text, etc.) comes
// from here instead of being hardcoded, and every Admin/SMC save writes here.
export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 200 }).notNull(),
  role: varchar("role", { length: 30 }).notNull().default("super_admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  adminEmail: varchar("admin_email", { length: 160 }).notNull(),
  action: varchar("action", { length: 60 }).notNull(),
  module: varchar("module", { length: 60 }).notNull(),
  details: jsonb("details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

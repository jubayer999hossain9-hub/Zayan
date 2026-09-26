# Zayan Collection — Master Blueprint V1.0

Premium E-commerce Platform | Bangladesh Market | Phase 1: Planning

---

## 1. Complete Website Sitemap

```
/ (Homepage)
/collections/[slug]              → Dynamic collection pages
/collections/all                 → Shop All
/products/[slug]                 → Product Details
/cart
/checkout
/order-confirmation/[order-id]
/track-order
/account
  /account/orders
  /account/profile
/wishlist
/search
/about
/contact
/policy/delivery
/policy/return-refund
/policy/privacy
/policy/terms

--- Admin (protected) ---
/admin/login
/admin/dashboard
/admin/products
/admin/collections
/admin/orders
/admin/customers
/admin/inventory
/admin/reports
/admin/smc/*   → all SMC modules (see §4)
```

## 2. Customer Website — Page Structure

| Page | Key Elements |
|---|---|
| Homepage | 20 modular sections (announcement bar → footer), all admin-controlled |
| Collection Page | Banner, filters, sort, grid, pagination, related collections |
| Product Details | Gallery w/ zoom, variants, stock, Add to Cart, Buy Now, WhatsApp Order, related products |
| Cart | Line items, qty update, delivery charge, grand total |
| Checkout | Name, phone, address, district, COD, order summary |
| Track Order | Order ID/phone lookup → status timeline |
| Account | Order history, saved address, profile |

## 3. Admin Dashboard Structure

- **Overview**: Total/Today's Orders, Total/Monthly Sales, Pending/Confirmed/Delivered/Cancelled counts, Total Products, Low Stock, Best Sellers — all live DB-driven, with date-range filter.
- **Products**: list, create/edit, variants, bulk actions, stock alerts.
- **Collections**: create/edit/delete, ordering, active toggle.
- **Orders**: queue by status, confirmation workflow, WhatsApp-originated order intake.
- **Customers**: profile, order history, contact.
- **Inventory**: stock ledger, low-stock threshold alerts.
- **Reports**: sales trends, top products, channel breakdown (Website vs WhatsApp).

## 4. SMC — Settings & Management Center (Module Structure)

1. **General** — name, logo, favicon, brand colors, typography, contact, social links
2. **Homepage Management** — banners, section show/hide, reorder, featured collections
3. **Collection Settings** — full CRUD, images, banners, order, status
4. **Product Settings** — categories, attributes, size/color, tags
5. **Order Settings** — ID format, status flow, cancellation rules
6. **Delivery Settings** — inside/outside Dhaka rates, custom zones, free-delivery threshold
7. **Payment Settings** — COD now; bKash/Nagad/gateway-ready config later
8. **WhatsApp Settings** — number, default message template, support message
9. **Admin & Permissions** — accounts, roles, permissions, activity log
10. **SEO & Website Settings** — meta title/description, social share image, maintenance mode

Every SMC change must write to the live config used by the storefront — no hardcoded values downstream.

## 5. Homepage — Section-by-Section Layout

1. Announcement Bar
2. Header (logo, search, account/cart icons)
3. Main Navigation
4. Category Navigation
5. Hero Banner / Slider
6. Shop by Category
7. Featured Collections
8. New Arrivals
9. Best Sellers
10. Exclusive Collection
11. Promotional Banner
12. Trending Products
13. Special Offers
14. Shop by Lifestyle/Occasion
15. Customer Reviews
16. Trust/Brand Benefits
17. Newsletter Signup
18. Footer
19. Floating WhatsApp Button

Each section: show/hide + reorder + content edit, all from SMC.

## 6. Product & Collection Data Structure

**Collection**: id, name, slug, image, banner, description, seo_title, seo_description, display_order, status, product_ids[]

**Product**: id, sku, name, slug, category_id, collection_ids[], images[], description, regular_price, sale_price, stock_qty, variants[{size, color, stock, price_delta}], tags[], is_featured, is_bestseller, is_new_arrival, is_active

## 7. Recommended Technology Stack

| Layer | Recommendation | Why |
|---|---|---|
| Frontend | Next.js (React) | SSR/SSG for SEO on product & collection pages, fast mobile perf |
| Styling | Tailwind CSS | Fast, consistent, easy to theme when brand colors are finalized |
| Backend/API | Next.js API routes or Node.js/Express | Same-language stack, simpler maintenance |
| Database | PostgreSQL (via Prisma ORM) | Relational integrity for orders/inventory; scalable |
| Auth (Admin) | NextAuth or JWT-based | Role-based access for admin/staff |
| Image Hosting | Cloudinary or S3-compatible storage | Handles product image optimization |
| Hosting | Vercel (frontend) + managed Postgres (Railway/Supabase/Neon) | Low-ops, scales with traffic |
| Payments (future) | bKash/Nagad merchant API, modular gateway layer | Bangladesh-specific, added without re-architecture |

*Note:* a fully static (HTML/CSS/JS-only) build cannot satisfy the dynamic Collection System, live Admin Dashboard, or real inventory — so this stack assumes a real backend + database from the start, as required in §10 of your guideline.

## 8. Development Roadmap

- **Phase 1** — Research & Planning ✅ (this document)
- **Phase 2** — Design System: temporary brand identity, type, color tokens, buttons, product card, responsive rules
- **Phase 3** — Homepage: full build across breakpoints
- **Phase 4** — E-commerce pages: shop all, collections, product details, cart, checkout, account, track order
- **Phase 5** — Admin & SMC: dashboard, product/collection/order management, inventory, all 10 SMC modules
- **Phase 6** — Integration & Testing: DB wiring, order workflow, WhatsApp integration, responsive QA, security review, performance pass

Each phase ends with your review/approval before moving to the next.

## 9. Initial Design Direction

- Clean, light background; generous whitespace; elegant sans-serif typography
- Premium product cards with subtle hover lift/zoom
- Restrained motion — no heavy animation that hurts load speed
- No dark theme
- Placeholder brand color: a neutral charcoal + warm gold accent (easy to swap once real branding is set) — text-based logo for now
- One consistent design system reused across every page

## 10. Project Folder Structure Proposal

```
zayan-collection/
├── app/                      # Next.js routes
│   ├── (storefront)/
│   ├── admin/
│   └── api/
├── components/
│   ├── ui/                   # buttons, cards, inputs
│   ├── storefront/
│   └── admin/
├── lib/                      # db client, auth, whatsapp helper, pricing
├── prisma/                   # schema.prisma, migrations
├── public/
├── styles/
└── config/                   # runtime SMC-driven config cache
```

---

### What's next
A homepage visual prototype follows separately — real product/category imagery, premium banners, and the typography direction above, so you can react to an actual design before Phase 3 begins in full.

# Zayan Collection — Admin Panel & SMC Blueprint V1.0
*(Phase 2.5 — Planning, before Admin/SMC coding begins)*

## 1. Admin Panel Sitemap & Navigation

```
/admin/login
/admin/dashboard
/admin/orders            (list, detail, status workflow)
/admin/products          (list, create/edit, variants, stock)
/admin/collections       (list, create/edit, ordering)
/admin/customers
/admin/inventory
/admin/reports
/admin/smc/
  branding
  homepage-builder
  header-nav
  collections-settings
  product-display
  order-settings
  delivery-shipping
  payment
  whatsapp-comms
  customer-account
  seo-website
  footer-content
  admin-users
  activity-logs
  backup-config
```
Sidebar groups: **Overview** (Dashboard) → **Operations** (Orders, Products, Collections, Customers, Inventory, Reports) → **SMC** (all 15 modules, own section, collapsible) → **System** (Admin Users, Logs, Backup).

## 2. SMC Module Hierarchy & Sub-Settings

| Module | Sub-settings |
|---|---|
| **Branding & Identity** | Logo upload, favicon, brand colors (ink/paper/gold tokens), typography (display/body font pick), contact info, social links |
| **Homepage Builder** | Section list (drag-reorder), per-section show/hide toggle, banner image/text/CTA editor per section, featured-collection picker |
| **Header & Nav Manager** | Main nav items (add/edit/reorder/link), category nav items, mobile bottom-nav icons, announcement bar text (EN/BN) |
| **Collection & Category Manager** | Create/edit/delete collection, image/banner, SEO fields, display order, active toggle, subcategory tree |
| **Product Display Settings** | Card layout (image ratio, badge rules), sort/filter defaults, "New"/"Best Seller" auto-tag thresholds |
| **Order Management Settings** | Order ID format, status stages, cancellation window, auto-confirmation rules |
| **Delivery & Shipping** | Inside/outside Dhaka rates, custom zones, free-delivery threshold |
| **Payment Settings** | COD toggle, bKash/Nagad credentials (future), payment instructions text |
| **WhatsApp & Communication** | WhatsApp number, default order-message template, support message, order-confirmation channel |
| **Customer & Account Settings** | Guest checkout toggle, required fields, account verification rules |
| **SEO & Website Settings** | Site title, meta description, social share image, maintenance mode |
| **Footer & Content Manager** | Footer links, policy pages (delivery/return/privacy/terms) rich-text editor |
| **Admin Users & Permissions** | Staff accounts, role assignment, per-module permission matrix |
| **Activity Logs** | Filterable log of every admin/SMC change (who/what/when) |
| **Backup & Configuration** | Export current config as JSON, restore from backup, version history |

## 3. Proposed Database / Configuration Structure

```
users(id, name, email, password_hash, role, is_active)
roles(id, name, permissions_json)
products(id, sku, name, slug, category_id, description, regular_price, sale_price,
         stock_qty, is_featured, is_bestseller, is_new_arrival, is_active, created_at)
product_variants(id, product_id, size, color, stock_qty, price_delta)
collections(id, name, slug, image_url, banner_url, description, seo_title, seo_description,
            display_order, is_active)
product_collections(product_id, collection_id)     -- many-to-many
orders(id, order_no, customer_id, status, source['website'|'whatsapp'],
       subtotal, delivery_charge, total, payment_method, created_at)
order_items(id, order_id, product_id, variant_id, qty, unit_price)
customers(id, name, phone, address, district, created_at)
inventory_log(id, product_id, variant_id, change_qty, reason, created_at)
site_config(module_key, config_json, updated_by, updated_at)   -- one row per SMC module
homepage_sections(id, section_key, is_visible, display_order, content_json)
activity_logs(id, user_id, action, module, details_json, created_at)
media(id, url, alt_text, uploaded_by, created_at)
```
`site_config` + `homepage_sections` are the two tables every SMC module ultimately reads/writes — this is what makes settings *live* rather than cosmetic.

## 4. SMC Module → Storefront Component Mapping

| SMC Module | Controls on live storefront |
|---|---|
| Branding & Identity | Header logo, favicon, global color tokens, font tokens |
| Homepage Builder | Order/visibility/content of all 19 homepage sections |
| Header & Nav Manager | Announcement bar text, main nav, category nav, mobile bottom nav |
| Collection & Category Manager | `/collections/[slug]` pages, Shop-by-Category cards |
| Product Display Settings | Product card badges, default sort/filter on collection & shop-all pages |
| Order Management Settings | Checkout flow status labels, order confirmation logic |
| Delivery & Shipping | Cart/checkout delivery-charge calculation |
| Payment Settings | Checkout payment-method options & instructions text |
| WhatsApp & Communication | WhatsApp button link + pre-filled message on every product page |
| Customer & Account Settings | Checkout form fields, account page behavior |
| SEO & Website Settings | `<title>`, meta tags, social preview image site-wide |
| Footer & Content Manager | Footer links, policy pages |
| Admin Users & Permissions | Who can access which Admin/SMC screen |
| Activity Logs | Read-only audit trail (doesn't affect storefront) |
| Backup & Configuration | Disaster-recovery only (doesn't affect storefront) |

## 5. Admin Dashboard Layout

- Top bar: page title, admin avatar/name, quick "View Storefront" link.
- Sidebar: grouped nav (Overview / Operations / SMC / System), collapsible on tablet, off-canvas drawer on mobile.
- Body: 4-column stat-card row (Today's Orders, Total Sales, Pending Orders, Low Stock) → Recent Orders table → Recent Activity feed, in a 2-column layout on desktop, stacked on mobile.
- Date-range filter top-right of the stat-card row.

## 6. SMC Interface Layout

- SMC is **not** one long page — each of the 15 modules is its own screen, reached via the sidebar's SMC group.
- Every module screen shares one layout: page header (module name + short description) → grouped setting cards (each card = one sub-setting cluster) → a sticky "Save Changes" bar at the bottom.
- Toggle switches, color swatches, drag-handles (for reorderable lists like Homepage Builder), and inline validation are the shared control patterns across all modules — so the owner learns the UI once and reuses it everywhere.

## 7. Prototype vs Real Functionality (this phase)

| Will be real in this prototype | Requires backend/DB (later phase) |
|---|---|
| Full navigation between Dashboard and all 15 SMC module screens | Saving any setting persistently |
| Toggle switches / inputs visually respond to clicks | Settings actually changing the live storefront |
| Responsive sidebar (desktop/tablet/mobile) | Authentication & role permissions enforcement |
| Static, realistic-looking dashboard numbers | Real sales/order data from a database |
| Drag-reorder *visual* on Homepage Builder list | Activity Logs, Backup/Restore, multi-admin roles |

No prototype control here should be mistaken for a working save — every "Save" action in V1.0 is cosmetic until Phase 5 backend integration.

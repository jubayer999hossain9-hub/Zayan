# Zayan House — Real Backend (MVP)

This is a **real, working Next.js + PostgreSQL backend** — not a mockup. Every
command below was actually run and verified while building this, including a
full production build (`npm run build`) and a live end-to-end test of the
core SMC flow (see "What's proven to work" below).

## Stack

- Next.js 16 (App Router) + TypeScript
- PostgreSQL
- Drizzle ORM (chosen over Prisma for this MVP — see note at the bottom)
- Plain `crypto`-based session cookies (no third-party auth service needed for this MVP)

## What's actually in here

- `src/db/schema.ts` — real tables: categories, collections, products,
  product_variants, customers, orders, order_items, site_settings,
  admin_users, activity_logs
- `src/app/api/products` and `/api/products/[slug]` — public read endpoints, real DB queries
- `src/app/api/settings` — public read of SMC settings (WhatsApp number, delivery charge, announcement text, etc.)
- `src/app/api/admin/login` — real login: checks password hash in the database, sets a signed session cookie
- `src/app/api/admin/settings` — **protected** write endpoint: requires a valid session, updates `site_settings`, and writes an `activity_logs` row recording who changed what
- `src/app/page.tsx` — homepage that server-renders products **read live from the database** (not hardcoded)
- `src/app/admin/login` and `src/app/admin` — a minimal (intentionally plain, unstyled) login + settings screen proving the write path works. For the actual premium UI, keep using the HTML prototypes from the design package — wire their "Save" buttons to `PUT /api/admin/settings` the same way `SettingsForm.tsx` does here.

## What's proven to work (not claimed — actually tested)

1. `npm run build` completes with zero errors (TypeScript + Next.js production build).
2. Homepage renders real product rows from Postgres, with live prices.
3. `PUT /api/admin/settings` without logging in → `401 Not authenticated`.
4. Login with wrong password → `401 Invalid credentials`.
5. Login with correct seeded credentials → session cookie issued.
6. Authenticated `PUT` to change `whatsapp_number` → succeeds, and the very
   next `GET /api/settings` (and the homepage) immediately shows the new
   number — no redeploy, no restart. **This is the core SMC principle from
   the spec, genuinely working.**
7. Every settings change writes a row to `activity_logs` with old/new value and who made it.

## Running it yourself

```bash
# 1. Install dependencies
npm install

# 2. Point DATABASE_URL at a real Postgres database
cp .env.example .env
# edit .env — set DATABASE_URL to your own Postgres instance
# (Vercel Postgres, Supabase, Neon, Railway, or a local Postgres all work)

# 3. Create the tables
npm run db:migrate

# 4. Load realistic sample data (products, settings, one admin user)
npm run db:seed
# prints the seeded admin login — CHANGE THE PASSWORD after first login

# 5. Run it
npm run dev
# open http://localhost:3000        — homepage, reading live from the DB
# open http://localhost:3000/admin/login
```

To inspect/edit data visually without writing SQL: `npm run db:studio`
(opens Drizzle Studio in the browser).

## Deploying

- **Vercel**: push this to a GitHub repo, import it in Vercel, add the same
  environment variables from `.env.example` in the Vercel project settings,
  and add a Postgres database (Vercel Postgres, Neon, or Supabase all have
  one-click integrations). Deploy.
- **Netlify**: works too since this has no feature that requires the Vercel
  runtime specifically — set the same environment variables and connect a
  Postgres provider the same way.

## Extending this toward the full 87-part spec

This MVP deliberately proves the *architecture* (DB ↔ API ↔ Admin ↔
Storefront) with a realistic but small slice: products, one collection, one
SMC-controlled setting end-to-end, and a real login. Everything else in the
master spec (coupons, reviews, returns, multi-payment-gateway support,
SMS/email providers, full admin CRUD for every entity, RBAC roles, order
tracking, etc.) follows the **exact same pattern** already established here:

1. Add the table(s) to `src/db/schema.ts`
2. `npm run db:generate && npm run db:migrate`
3. Add an API route under `src/app/api/...`
4. Add/extend a page or wire it into the existing HTML prototype's UI

Because this is now a real multi-file, git-friendly codebase, the fastest way
to keep extending it is with **Claude Code** (Anthropic's coding agent) — it
can work through the remaining parts of the spec file-by-file, run the dev
server, and test each addition the same way this MVP was tested, rather than
in this chat.

## Why Drizzle instead of Prisma

The original blueprint proposed Prisma. Prisma's CLI needs to download a
platform-specific query-engine binary from `binaries.prisma.sh` at
`generate`/`migrate` time. The sandbox this was built in only allows network
access to a fixed list of package registries (npm, PyPI, GitHub, Ubuntu
apt) and `prisma.sh` isn't on it — so Prisma's CLI could not actually be run
and verified here. Drizzle is pure TypeScript (talks to Postgres directly
over the standard `pg` driver, no binary download), so every command above
could be genuinely executed and tested rather than written on faith. Prisma
will work completely normally in your own environment if you prefer it —
this isn't a limitation of Prisma itself, only of this sandbox.

# Supabase Migrations

Run these in order via the Supabase SQL editor (or `supabase db push` if
you wire up the Supabase CLI). Each file is idempotent and safe to
re-run.

| #    | File                                          | What it does                                                       |
| ---- | --------------------------------------------- | ------------------------------------------------------------------ |
| 0001 | `0001_init.sql`                               | Original schema: `products`, `orders`, `customers`, RLS, indexes   |
| 0002 | `0002_seed_products.sql`                      | Seed data (5 sample products). Optional. Skip in production.       |
| 0003 | `0003_admin_rbac.sql`                         | `profiles` table + `is_admin()` helper + tightened RLS policies    |
| 0004 | `0004_stripe_event_log.sql`                   | `stripe_events` table for webhook idempotency                      |
| 0005 | `0005_inventory_function.sql`                 | `reserve_inventory()` and `apply_inventory_for_order()` functions  |

After applying, see `../db.md` for the operational runbook
(creating the first admin, manually adjusting inventory, etc.).

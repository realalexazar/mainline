-- =====================================================================
-- 0001_init.sql
-- Initial schema: products, orders, customers + RLS + indexes
-- =====================================================================
-- This is the same content that previously lived in supabase/schema.sql,
-- minus the seed data (moved to 0002_seed_products.sql) and minus the
-- overly-permissive "any authenticated user is admin" policies (replaced
-- in 0003_admin_rbac.sql).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  price decimal(10,2) not null,
  compare_at_price decimal(10,2),
  images text[] default '{}',
  category text default 'general',
  variants jsonb default '[]',
  printify_product_id text,
  tiktok_shop_id text,
  active boolean default true,
  featured boolean default false,
  inventory_count integer default -1, -- -1 means "unlimited / not tracked"
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  order_number serial,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  customer_email text not null,
  customer_name text,
  shipping_address jsonb,
  items jsonb not null,
  subtotal decimal(10,2),
  shipping_cost decimal(10,2) default 0,
  total decimal(10,2) not null,
  status text default 'pending',
  fulfillment_status text default 'unfulfilled',
  printify_order_id text,
  tracking_number text,
  tracking_url text,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------
create table if not exists customers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  addresses jsonb default '[]',
  order_count integer default 0,
  total_spent decimal(10,2) default 0,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
-- Enable RLS on all tables. NOTE: the service-role key bypasses RLS, so
-- the server-side admin client (lib/supabase/server.ts) is unaffected.
-- These policies govern what the *anon* and *authenticated* keys can do.
alter table products enable row level security;
alter table orders enable row level security;
alter table customers enable row level security;

-- Public read access for active products (anon + authenticated).
drop policy if exists "Products are viewable by everyone" on products;
create policy "Products are viewable by everyone"
  on products for select
  using (active = true);

-- Orders + customers: NO public read/write. Server uses service-role key.
-- Admin policies are added in 0003_admin_rbac.sql.

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
create index if not exists idx_products_active on products(active);
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_featured on products(featured) where featured = true;
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_stripe_session on orders(stripe_checkout_session_id);
create index if not exists idx_orders_printify on orders(printify_order_id);
create index if not exists idx_customers_email on customers(email);

-- ---------------------------------------------------------------------
-- Auto-update updated_at
-- ---------------------------------------------------------------------
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

drop trigger if exists update_products_updated_at on products;
create trigger update_products_updated_at
  before update on products
  for each row execute function update_updated_at_column();

drop trigger if exists update_orders_updated_at on orders;
create trigger update_orders_updated_at
  before update on orders
  for each row execute function update_updated_at_column();

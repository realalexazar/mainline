-- =====================================================================
-- 0003_admin_rbac.sql
-- Real role-based access control.
-- =====================================================================
-- Replaces the old "any authenticated user has full admin access" model
-- with a `profiles` table keyed to auth.users and an `is_admin()`
-- helper that backend code uses to gate /api/admin/* routes.
--
-- One-time setup after running this migration:
--   1. Sign up an admin user via the /admin login page (or in
--      Supabase dashboard -> Authentication -> Add user).
--   2. In SQL editor, run:
--        update profiles set role = 'admin'
--          where id = (select id from auth.users where email = 'you@example.com');
--   3. Verify: select email, role from profiles
--                join auth.users on auth.users.id = profiles.id;
-- =====================================================================

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create a profile row when a new auth.users row is created.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Backfill profiles for any users that already exist.
insert into profiles (id, email)
  select id, email from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- is_admin() helper
-- ---------------------------------------------------------------------
-- SECURITY DEFINER so it can read profiles regardless of caller's RLS.
create or replace function is_admin(uid uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles where id = uid and role = 'admin'
  );
$$;

-- Convenience: check the *current* request's user.
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(is_admin(auth.uid()), false);
$$;

-- ---------------------------------------------------------------------
-- RLS policies for profiles
-- ---------------------------------------------------------------------
alter table profiles enable row level security;

drop policy if exists "Users can read own profile" on profiles;
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "Admins can read all profiles" on profiles;
create policy "Admins can read all profiles"
  on profiles for select
  using (is_admin());

drop policy if exists "Admins can update profiles" on profiles;
create policy "Admins can update profiles"
  on profiles for update
  using (is_admin());

-- ---------------------------------------------------------------------
-- Tighten products / orders / customers policies to use is_admin()
-- ---------------------------------------------------------------------
-- Drop the old "authenticated == admin" policies from 0001.
drop policy if exists "Admin full access to products" on products;
drop policy if exists "Admin full access to orders" on orders;
drop policy if exists "Admin full access to customers" on customers;

create policy "Admins can manage products"
  on products for all
  using (is_admin())
  with check (is_admin());

create policy "Admins can manage orders"
  on orders for all
  using (is_admin())
  with check (is_admin());

create policy "Admins can manage customers"
  on customers for all
  using (is_admin())
  with check (is_admin());

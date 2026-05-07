-- =====================================================================
-- 0005_inventory_function.sql
-- Atomic inventory check + decrement.
-- =====================================================================
-- Two functions, one transaction-safe semantic each:
--
--   reserve_inventory(items)
--     -> Called by /api/checkout BEFORE creating the Stripe session.
--     -> Returns true if every item has enough stock OR is untracked
--        (inventory_count = -1). Does NOT decrement; we don't reserve
--        stock for unpaid carts to avoid the abandoned-cart inventory
--        leak. Use is purely a soft pre-check.
--
--   apply_inventory_for_order(items)
--     -> Called by the Stripe webhook AFTER the order is paid, inside
--        the same dedupe-guarded path. Atomically decrements stock
--        for each tracked item with FOR UPDATE row locks.
--     -> Raises an exception if any item is out of stock, which the
--        webhook handler should catch and surface (mark order
--        'requires_attention' so an admin can refund/contact).
--
-- `items` shape: jsonb array of { product_id: uuid, quantity: int }
-- =====================================================================

create or replace function reserve_inventory(items jsonb)
returns boolean
language plpgsql
security definer
as $$
declare
  it record;
  available int;
begin
  for it in
    select
      (value->>'product_id')::uuid as product_id,
      (value->>'quantity')::int   as quantity
    from jsonb_array_elements(items)
  loop
    select inventory_count into available
      from products
      where id = it.product_id and active = true;

    if available is null then
      return false; -- unknown / inactive product
    end if;

    if available = -1 then
      continue; -- untracked, unlimited
    end if;

    if available < it.quantity then
      return false;
    end if;
  end loop;

  return true;
end;
$$;

create or replace function apply_inventory_for_order(items jsonb)
returns void
language plpgsql
security definer
as $$
declare
  it record;
  current_count int;
begin
  for it in
    select
      (value->>'product_id')::uuid as product_id,
      (value->>'quantity')::int   as quantity
    from jsonb_array_elements(items)
  loop
    select inventory_count into current_count
      from products
      where id = it.product_id
      for update;

    if current_count is null then
      raise exception 'Product % not found while applying inventory', it.product_id;
    end if;

    if current_count = -1 then
      continue;
    end if;

    if current_count < it.quantity then
      raise exception 'Insufficient inventory for product % (have %, need %)',
        it.product_id, current_count, it.quantity;
    end if;

    update products
      set inventory_count = inventory_count - it.quantity
      where id = it.product_id;
  end loop;
end;
$$;

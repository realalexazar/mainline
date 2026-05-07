# Mainline Hub — Database Runbook

Operational notes for the Supabase project. For schema definitions
themselves, see `./migrations/`.

## First-time setup

1. Create a Supabase project, copy the URL and the `anon` + `service_role`
   keys into `.env.local` (see `../.env.example`).
2. In the Supabase SQL editor, run each migration in order:
   - `migrations/0001_init.sql`
   - `migrations/0002_seed_products.sql` *(optional sample data)*
   - `migrations/0003_admin_rbac.sql`
   - `migrations/0004_stripe_event_log.sql`
   - `migrations/0005_inventory_function.sql`
3. Sign up the first admin user:
   - Visit `/admin` on the running app and sign up via the login form,
     OR create a user in Supabase Dashboard → Authentication → Add user.
   - Then in the SQL editor:
     ```sql
     update profiles set role = 'admin'
       where id = (select id from auth.users where email = 'YOUR_EMAIL');
     ```
   - Verify:
     ```sql
     select u.email, p.role from profiles p
       join auth.users u on u.id = p.id;
     ```

## Webhooks

### Stripe

- Endpoint: `https://YOUR_DOMAIN/api/webhooks/stripe`
- Events to subscribe to (minimum):
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `checkout.session.async_payment_failed`
- Copy the signing secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`.
- For local dev: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
  and use the secret it prints.

### Printify

- Endpoint: `https://YOUR_DOMAIN/api/webhooks/printify`
- Events to subscribe to:
  - `order:shipment:created`
  - `order:shipment:delivered`
  - `order:cancelled`
  - `order:created` (optional, for parity)
- When registering the webhook via the Printify API, pass a `secret`
  field equal to your `PRINTIFY_WEBHOOK_SECRET`. The handler uses HMAC-SHA256
  to verify each delivery.

## Common operations

### Adjust inventory manually

```sql
update products set inventory_count = 100 where slug = 'mainline-hub-logo-mug';
-- Set to -1 for "untracked / unlimited"
update products set inventory_count = -1 where slug = 'wheres-nancy-tee';
```

### Inspect recent orders

```sql
select order_number, customer_email, total, status, fulfillment_status,
       created_at
  from orders
  order by created_at desc
  limit 20;
```

### Replay a missed Stripe event

The webhook handler short-circuits on duplicate `event.id`. To force a
reprocess (rare, only after a code fix):

```sql
delete from stripe_events where id = 'evt_XXXXXXXX';
```

then trigger a Stripe redelivery from the Dashboard.

### Promote / demote an admin

```sql
update profiles set role = 'admin'    where email = 'someone@example.com';
update profiles set role = 'customer' where email = 'someone@example.com';
```

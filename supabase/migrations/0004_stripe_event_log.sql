-- =====================================================================
-- 0004_stripe_event_log.sql
-- Webhook idempotency.
-- =====================================================================
-- Stripe (and most webhook senders) will retry failed deliveries. Without
-- a dedupe layer we'd insert the same order multiple times and call
-- Printify multiple times for the same payment.
--
-- The webhook handler MUST insert the event.id here as its first step,
-- inside the same transaction as the order insert (or use it as a
-- pre-check). If the insert fails on the unique constraint, we know
-- we've already processed this event and can return 200 immediately.
-- =====================================================================

create table if not exists stripe_events (
  id text primary key,           -- Stripe's evt_... id
  type text not null,            -- e.g. 'checkout.session.completed'
  payload jsonb,                 -- Full event payload, useful for debugging
  processed_at timestamptz default now()
);

create index if not exists idx_stripe_events_type on stripe_events(type);
create index if not exists idx_stripe_events_processed_at
  on stripe_events(processed_at desc);

-- Service-role only; no public access.
alter table stripe_events enable row level security;

-- Same pattern for Printify.
create table if not exists printify_events (
  id text primary key,           -- Synthetic: type + ':' + resource.id + ':' + occurred_at
  type text not null,
  payload jsonb,
  processed_at timestamptz default now()
);

create index if not exists idx_printify_events_processed_at
  on printify_events(processed_at desc);

alter table printify_events enable row level security;

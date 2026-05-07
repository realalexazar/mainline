-- =====================================================================
-- 0002_seed_products.sql
-- Seed data: 5 sample products. OPTIONAL - skip in production.
-- =====================================================================
-- Idempotent: uses ON CONFLICT (slug) DO NOTHING so re-running is a
-- no-op once the slugs exist.
-- =====================================================================

insert into products (name, slug, description, price, compare_at_price, category, variants, active, featured, inventory_count)
values
  (
    'Where''s Nancy? Tee',
    'wheres-nancy-tee',
    'The iconic "Where''s Nancy?" graphic tee. Premium cotton blend, screen-printed design. A conversation starter for the politically aware.',
    24.99,
    29.99,
    'tees',
    '[{"name": "Size", "options": ["S", "M", "L", "XL", "2XL"]}]'::jsonb,
    true,
    true,
    -1
  ),
  (
    'Political Mashup Tee',
    'political-mashup-tee',
    'Bold political mashup design on premium cotton. Express yourself with this eye-catching graphic tee that blends political imagery in unexpected ways.',
    24.99,
    null,
    'tees',
    '[{"name": "Size", "options": ["S", "M", "L", "XL", "2XL"]}]'::jsonb,
    true,
    true,
    -1
  ),
  (
    'Mainline Hub Logo Mug',
    'mainline-hub-logo-mug',
    'Start your morning with a cup of coffee in the official Mainline Hub ceramic mug. LCARS-inspired design, dishwasher safe.',
    14.99,
    null,
    'accessories',
    '[]'::jsonb,
    true,
    true,
    50
  ),
  (
    'Starfleet Sticker Pack',
    'starfleet-sticker-pack',
    'A pack of 10 high-quality vinyl stickers featuring LCARS-inspired designs. Weather-resistant, perfect for laptops, water bottles, and more.',
    8.99,
    null,
    'accessories',
    '[]'::jsonb,
    true,
    false,
    100
  ),
  (
    'Command Gold Snapback',
    'command-gold-snapback',
    'Adjustable snapback cap in command gold with embroidered Mainline Hub logo. One size fits most.',
    19.99,
    null,
    'accessories',
    '[]'::jsonb,
    true,
    true,
    30
  )
on conflict (slug) do nothing;

-- Mainline Hub Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'general',
  variants JSONB DEFAULT '[]',
  printify_product_id TEXT,
  tiktok_shop_id TEXT,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  inventory_count INTEGER DEFAULT -1,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number SERIAL,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  shipping_address JSONB,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2),
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  fulfillment_status TEXT DEFAULT 'unfulfilled',
  printify_order_id TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  addresses JSONB DEFAULT '[]',
  order_count INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Public read access for active products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (active = true);

-- Authenticated users get full access (admin)
CREATE POLICY "Admin full access to products"
  ON products FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to orders"
  ON orders FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to customers"
  ON customers FOR ALL USING (auth.role() = 'authenticated');

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data: sample products
INSERT INTO products (name, slug, description, price, compare_at_price, category, variants, active, featured, inventory_count)
VALUES
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
    NULL,
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
    NULL,
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
    NULL,
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
    NULL,
    'accessories',
    '[]'::jsonb,
    true,
    true,
    30
  );

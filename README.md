# Mainline Hub

A retro Star Trek LCARS-themed e-commerce store built with Next.js 14, TypeScript, Tailwind CSS, Supabase, Stripe, and Printify.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS v3 with custom LCARS color palette
- **Database:** Supabase (Postgres + Auth + Storage)
- **Payments:** Stripe (Checkout Sessions + Webhooks)
- **Fulfillment:** Printify REST API (for print-on-demand products)
- **State Management:** Zustand (cart with localStorage persistence)
- **Fonts:** Share Tech Mono + Inter

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local` and fill in your keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Printify
PRINTIFY_API_KEY=your-printify-api-key
PRINTIFY_SHOP_ID=your-shop-id

# App
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_STORE_NAME=Mainline Hub
```

### 3. Set Up Supabase Database

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor. This creates the tables, RLS policies, indexes, and seed data.

### 4. Create an Admin User

In Supabase Dashboard > Authentication, create a user with email/password. This user will have access to the `/admin` panel.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Set Up Stripe Webhooks (for local dev)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 7. Set Up Printify Webhooks

In your Printify dashboard, set the webhook URL to:
`https://your-domain.com/api/webhooks/printify`

## Project Structure

```
app/                    # Next.js App Router pages and API routes
  api/                  # API routes (checkout, products, webhooks, admin)
  admin/                # Admin dashboard (auth-protected)
  products/             # Product listing and detail pages
  cart/                 # Shopping cart
  order/success/        # Order confirmation
  policies/             # Shipping, returns, privacy pages
components/
  lcars/                # LCARS design system (Frame, Button, Panel, Bar, Input, Loading, Modal)
  ProductCard.tsx       # Product card component
  ProductGrid.tsx       # Product grid layout
  CartItem.tsx          # Cart line item
  VariantSelector.tsx   # Size/variant picker
  QuantitySelector.tsx  # Quantity +/- control
lib/
  supabase/             # Supabase client setup (browser + server)
  stripe.ts             # Stripe client
  printify.ts           # Printify API helpers
  utils.ts              # Formatters and helpers
stores/
  cart.ts               # Zustand cart store with localStorage
types/
  index.ts              # TypeScript interfaces
supabase/
  schema.sql            # Database schema + seed data
```

## Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Add all environment variables
4. Deploy

Set up Stripe and Printify webhook URLs to point to your production domain.

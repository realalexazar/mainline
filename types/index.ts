export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  images: string[];
  category: string;
  variants: ProductVariant[];
  printify_product_id: string | null;
  tiktok_shop_id: string | null;
  active: boolean;
  featured: boolean;
  inventory_count: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  name: string;
  options: string[];
  printify_variant_ids?: Record<string, number>;
}

export interface CartItem {
  product_id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  variant: string | null;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: number;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  customer_email: string;
  customer_name: string | null;
  shipping_address: ShippingAddress | null;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: OrderStatus;
  fulfillment_status: FulfillmentStatus;
  printify_order_id: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  variant: string | null;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Customer {
  id: string;
  email: string;
  name: string | null;
  addresses: ShippingAddress[];
  order_count: number;
  total_spent: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled';
export type FulfillmentStatus = 'unfulfilled' | 'processing' | 'fulfilled' | 'shipped';

export interface CheckoutRequest {
  items: {
    product_id: string;
    variant: string | null;
    quantity: number;
  }[];
}

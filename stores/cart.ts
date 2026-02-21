import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant?: string | null, quantity?: number) => void;
  removeItem: (productId: string, variant?: string | null) => void;
  updateQuantity: (productId: string, variant: string | null, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant = null, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product_id === product.id && i.variant === variant
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === product.id && i.variant === variant
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                product_id: product.id,
                name: product.name,
                slug: product.slug,
                image: product.images[0] || '',
                price: product.price,
                variant,
                quantity,
              },
            ],
          };
        });
      },

      removeItem: (productId, variant = null) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product_id === productId && i.variant === variant)
          ),
        }));
      },

      updateQuantity: (productId, variant, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variant);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId && i.variant === variant
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'mainline-hub-cart',
    }
  )
);

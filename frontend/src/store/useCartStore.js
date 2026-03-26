import { create } from 'zustand';

// Unique key per (product + ingredient combination)
export function cartItemKey(productId, excludedIngredients) {
  return `${productId}::${[...excludedIngredients].sort().join(',')}`;
}

function ensureCartKey(item) {
  if (item.cartKey) return item;
  return { ...item, cartKey: cartItemKey(item.id, item.excludedIngredients ?? []) };
}

export const useCartStore = create((set) => ({
  cart: [],

  // Normalize items on hydration (e.g. from URL sync)
  setCart: (nextCart) => set({ cart: nextCart.map(ensureCartKey) }),

  // Same product + same excluded ingredients → increment quantity
  // Same product + different excluded ingredients → new entry
  addToCart: (product, excludedIngredients = []) => {
    const key = cartItemKey(product.id, excludedIngredients);
    set((state) => {
      const existing = state.cart.find((item) => item.cartKey === key);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.cartKey === key ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }
      return {
        cart: [
          ...state.cart,
          { ...product, quantity: 1, excludedIngredients, cartKey: key },
        ],
      };
    });
  },

  // Decrement quantity or remove entry if quantity reaches 0
  removeFromCart: (cartKey) => {
    set((state) => {
      const existing = state.cart.find((item) => item.cartKey === cartKey);
      if (!existing) return state;
      if (existing.quantity > 1) {
        return {
          cart: state.cart.map((item) =>
            item.cartKey === cartKey ? { ...item, quantity: item.quantity - 1 } : item,
          ),
        };
      }
      return { cart: state.cart.filter((item) => item.cartKey !== cartKey) };
    });
  },

  // Remove an entry entirely regardless of quantity
  deleteCartItem: (cartKey) => {
    set((state) => ({ cart: state.cart.filter((item) => item.cartKey !== cartKey) }));
  },

  clearCart: () => set({ cart: [] }),
}));

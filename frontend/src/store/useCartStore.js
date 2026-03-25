import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: [],
  setCart: (nextCart) => set({ cart: nextCart }),
  // add product to cart or increase quantity if already exists
  addToCart: (product, excludedIngredients = []) => {
    set((state) => {
      const existingProduct = state.cart.find((item) => item.id === product.id);
      if (existingProduct) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1, excludedIngredients }
              : item,
          ),
        };
      } else {
        return {
          cart: [...state.cart, { ...product, quantity: 1, excludedIngredients }],
        };
      }
    });
  },
  // remove product from cart or decrease quantity if more than 1
  removeFromCart: (productId) => {
    set((state) => {
      const existingProduct = state.cart.find((item) => item.id === productId);
      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          return {
            cart: state.cart.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            ),
          };
        }

        return {
          cart: state.cart.filter((item) => item.id !== productId),
        };
      }

      return state;
    });
  },
}));

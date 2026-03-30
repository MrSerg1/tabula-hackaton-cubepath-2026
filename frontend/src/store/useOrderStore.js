import { create } from 'zustand';

export const useOrderStore = create((set) => ({
  orders: [],

  submitOrder: async ({ apiUrl, mesa, cart }) => {
    const payload = {
      mesa,
      items: cart.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        excludedIngredients: item.excludedIngredients ?? [],
      })),
    };

    const response = await fetch(`${apiUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error ?? `Error ${response.status}`);
    }

    const { data } = await response.json();
    set((state) => ({ orders: [...state.orders, data] }));
    return data;
  },
}));

import { create } from 'zustand';
import { requestJson } from '../utils/requestJson';

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

    const { data } = await requestJson(`${apiUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    set((state) => ({ orders: [...state.orders, data] }));
    return data;
  },
}));

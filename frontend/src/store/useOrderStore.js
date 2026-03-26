import { create } from 'zustand';

export const useOrderStore = create((set) => ({
  orders: [],

  // Snapshot current cart into a new order and persist it
  submitOrder: (cart) => {
    const order = {
      id: crypto.randomUUID(),
      items: cart.map((item) => ({ ...item })),
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ orders: [...state.orders, order] }));
    return order;
  },
}));

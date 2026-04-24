import { create } from 'zustand';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderStore,
  SubmitOrderInput,
} from '../types';
import { requestJson } from '../utils/requestJson';

export const useOrderStore = create<OrderStore>()((set) => ({
  orders: [],

  submitOrder: async ({ apiUrl, mesa, cart }: SubmitOrderInput) => {
    const payload: CreateOrderRequest = {
      mesa,
      items: cart.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        excludedIngredients: item.excludedIngredients ?? [],
      })),
    };

    const { data } = await requestJson<CreateOrderResponse>(`${apiUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    set((state) => ({ orders: [...state.orders, data] }));
    return data;
  },
}));

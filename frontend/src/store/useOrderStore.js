import { create } from 'zustand';
import { requestJson } from '../utils/requestJson';

/**
 * @typedef {import('../types').OrderStore} OrderStore
 * @typedef {import('../types').SubmitOrderInput} SubmitOrderInput
 * @typedef {import('../types').CreateOrderRequest} CreateOrderRequest
 * @typedef {import('../types').CreateOrderResponse} CreateOrderResponse
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<OrderStore>>} */
export const useOrderStore = create((set) => ({
  orders: [],

  /**
   * @param {SubmitOrderInput} param0
   */
  submitOrder: async ({ apiUrl, mesa, cart }) => {
    /** @type {CreateOrderRequest} */
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

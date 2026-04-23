import type { Dispatch, SetStateAction } from 'react';
import type { Order, Product, TableNumber } from './domain';

export interface CartItem extends Product {
  quantity: number;
  excludedIngredients: string[];
  cartKey: string;
}

export type SelectedIngredientsMap = Record<string, boolean>;

export type OrderSubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export interface MesaContextValue {
  mesa: string | null;
  setMesa: (mesaValue: string | number | null | undefined) => void;
}

export interface CartState {
  cart: CartItem[];
}

export interface CartActions {
  setCart: (nextCart: CartItem[]) => void;
  addToCart: (product: Product, excludedIngredients?: string[]) => void;
  removeFromCart: (cartKey: string) => void;
  deleteCartItem: (cartKey: string) => void;
  clearCart: () => void;
}

export type CartStore = CartState & CartActions;

export interface OrderState {
  orders: Order[];
}

export interface SubmitOrderInput {
  apiUrl: string;
  mesa: TableNumber;
  cart: CartItem[];
}

export interface OrderActions {
  submitOrder: (input: SubmitOrderInput) => Promise<Order>;
}

export type OrderStore = OrderState & OrderActions;

export interface UseSelectedIngredientsResult {
  selectedIngredients: SelectedIngredientsMap;
  setSelectedIngredients: Dispatch<SetStateAction<SelectedIngredientsMap>>;
  toggleIngredient: (productId: string, ingredient: string) => void;
}

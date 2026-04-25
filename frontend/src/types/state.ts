import type { Dispatch, SetStateAction } from 'react';
import type { Ingredient, Order, Product, ProductId, TableNumber } from './domain';

export interface CartItem extends Product {
  quantity: number;
  excludedIngredients: Ingredient[];
  cartKey: string;
}

export type CartInputItem = Omit<CartItem, 'cartKey'> & Partial<Pick<CartItem, 'cartKey'>>;

export type SelectedIngredientsMap = Record<string, boolean>;

export type OrderSubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export type ToggleIngredient = (productId: ProductId, ingredient: Ingredient) => void;

export interface MesaContextValue {
  mesa: string | null;
  setMesa: (mesaValue: string | number | null | undefined) => void;
}

export interface CartState {
  cart: CartItem[];
}

export interface CartActions {
  setCart: (nextCart: CartInputItem[]) => void;
  addToCart: (product: Product, excludedIngredients?: Ingredient[]) => void;
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
  toggleIngredient: ToggleIngredient;
}

export interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOrder: () => Promise<void>;
  onOrderSuccess?: () => void;
}

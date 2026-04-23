export type ProductId = string;
export type OrderId = string;
export type AlertId = string;
export type TableNumber = number;
export type ISODateString = string;

export interface Product {
  id: ProductId;
  title: string;
  description: string;
  ingredients: string[];
  price: number;
  image: string;
}

export interface OrderItem {
  id: ProductId;
  title: string;
  quantity: number;
  price: number;
  excludedIngredients: string[];
}

export type OrderStatus = 'pending';

export interface Order {
  id: OrderId;
  mesa: TableNumber;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type AlertType = 'call-waiter' | 'request-bill' | 'clean-table';

export type AlertStatus = 'pending';

export interface Alert {
  id: string;
  table: TableNumber;
  type: AlertType;
  status: AlertStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface WaiterTable {
  table: TableNumber;
  orders: Order[];
  alerts: Alert[];
}

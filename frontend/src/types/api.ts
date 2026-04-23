import type {
  Alert,
  AlertType,
  Order,
  OrderItem,
  Product,
  TableNumber,
  WaiterTable,
} from './domain';

export interface ApiErrorResponse {
  error: string;
}

export interface HealthResponse {
  status: string;
  uptime: number;
}

export interface MenuListRequestQuery {
  mesa: TableNumber;
  limit?: number;
  offset?: number;
}

export interface MenuListResponse {
  mesa: TableNumber;
  limit: number;
  offset: number;
  total: number;
  data: Product[];
}

export interface MenuByIdRequestParams {
  id: Product['id'];
}

export interface MenuByIdRequestQuery {
  mesa: TableNumber;
}

export interface MenuByIdResponse {
  mesa: TableNumber;
  data: Product;
}

export type CreateOrderItemRequest = Pick<
  OrderItem,
  'id' | 'title' | 'quantity' | 'price' | 'excludedIngredients'
>;

export interface CreateOrderRequest {
  mesa: TableNumber;
  items: CreateOrderItemRequest[];
}

export interface CreateOrderResponse {
  data: Order;
}

export interface CreateAlertRequest {
  table: TableNumber;
  type: AlertType;
}

export type CreateAlertResponse = Alert;

export interface WaiterDashboardResponse {
  tables: WaiterTable[];
}

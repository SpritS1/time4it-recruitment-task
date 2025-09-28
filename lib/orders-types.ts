export type OrderStatus =
  | "new"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  status: OrderStatus;
  dueDate: string;
  totalGross: number;
}

export interface ApiList<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export type SortOrder = "asc" | "desc";

export type AddOrderFormValues = {
  customer: string;
  orderNumber: string;
  status: OrderStatus;
  totalGross: string;
  dueDate: string;
};

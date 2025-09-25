export type OrderStatus = "new" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
    id: string;
    orderNumber: string;
    customer: string;
    status: OrderStatus;
    dueDate: string;
    totalGross: number;
}

export interface ApiList<T> { items: T[] }

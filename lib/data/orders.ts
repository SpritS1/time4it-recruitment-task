"use server";

import {
  AddOrderFormValues,
  ApiList,
  Order,
  SortOrder,
} from "@/lib/orders-types";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

interface GetOrdersOptions {
  page?: number;
  perPage?: number;
  sortField?: string;
  sortOrder?: SortOrder;
}

export const getOrders = async ({
  page = 1,
  perPage = 7,
  sortField = "dueDate",
  sortOrder = "asc",
}: GetOrdersOptions = {}): Promise<ApiList<Order>> => {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
    sortField,
    sortOrder,
  });

  const res = await fetch(`${baseUrl}/api/orders?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.statusText}`);
  }

  const data: ApiList<Order> = await res.json();
  return data;
};

export const deleteOrder = async (orderId: string) => {
  const response = await fetch(`${baseUrl}/api/orders/${orderId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Błąd podczas usuwania zamówienia");
  }

  return true;
};

export const addOrder = async (order: AddOrderFormValues) => {
  const res = await fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    const data = await res.json();

    return {
      success: false,
      fieldErrors: data.fieldErrors ?? [],
      status: res.status,
    };
  }

  return {
    success: true,
    status: res.status,
  };
};

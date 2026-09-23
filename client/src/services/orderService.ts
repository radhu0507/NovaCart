import api from "./api";
import type { Order, OrderStatus } from "../types";

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export async function createOrder(
  items: CreateOrderItem[],
  shippingAddress: string
): Promise<Order> {
  const res = await api.post<{ data: { order: Order } }>("/orders", {
    items,
    shippingAddress,
  });
  return res.data.data.order;
}

export async function getOrders(): Promise<Order[]> {
  const res = await api.get<{ data: { orders: Order[] } }>("/orders");
  return res.data.data.orders;
}

export async function getOrder(id: string): Promise<Order> {
  const res = await api.get<{ data: { order: Order } }>(`/orders/${id}`);
  return res.data.data.order;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const res = await api.put<{ data: { order: Order } }>(`/orders/${id}/status`, { status });
  return res.data.data.order;
}
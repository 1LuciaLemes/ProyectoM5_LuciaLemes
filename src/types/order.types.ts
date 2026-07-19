import type { Timestamp } from "firebase/firestore";

export type OrderStatus = "Pendiente" | "Procesando" | "Confirmada" | "Cancelada";

export type OrderItemSnapshot = {
  productId: string;
  title: string;
  image: string;
  priceAtPurchase: number;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItemSnapshot[];
  total: number;
  status: OrderStatus;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

export type CreateOrderPayload = {
  userId: string;
  items: OrderItemSnapshot[];
  total: number;
  status?: OrderStatus;
};

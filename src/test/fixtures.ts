import { Timestamp } from "firebase/firestore";
import type { AuthUser } from "@/contexts/auth/auth.type";
import type { CartItem } from "@/contexts/Cart/CartContext.type";
import type { Order, OrderItemSnapshot } from "@/types/order.types";
import type { Product } from "@/contexts/Products/product.type";

export const adminUserFixture: AuthUser = {
  uid: "u_admin",
  email: "admin@mail.com",
  role: "admin",
};

export const customUserFixture: AuthUser = {
  uid: "u_customer",
  email: "customer@mail.com",
  role: "customer",
};

export const productFixture: Product = {
  id: "prod_1",
  title: "Sauvage Eau de Parfum",
  brand: "Dior",
  image: "https://example.com/sauvage.jpg",
  description: "Fragancia intensa y fresca con notas amaderadas.",
  price: 125,
  stock: 10,
  gender: "male",
  createdAt: Timestamp.fromDate(new Date("2026-01-10T12:00:00.000Z")),
};

export const cartItemFixture: CartItem = {
  ...productFixture,
  quantity: 2,
};

export const orderItemSnapshotFixture: OrderItemSnapshot = {
  productId: productFixture.id,
  title: productFixture.title,
  image: productFixture.image,
  priceAtPurchase: productFixture.price,
  quantity: cartItemFixture.quantity,
};

export const orderFixture: Order = {
  id: "order_1",
  userId: customUserFixture.uid,
  items: [orderItemSnapshotFixture],
  total: orderItemSnapshotFixture.priceAtPurchase * orderItemSnapshotFixture.quantity,
  status: "Confirmada",
  createdAt: Timestamp.fromDate(new Date("2026-01-11T15:30:00.000Z")),
};

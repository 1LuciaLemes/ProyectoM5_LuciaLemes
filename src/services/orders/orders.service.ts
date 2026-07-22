import { db } from "../firebase/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import type { CartItem } from "../../contexts/Cart/CartContext.type";
import type {
  CreateOrderPayload,
  Order,
  OrderItemSnapshot,
  OrderStatus,
} from "../../types/order.types";
import { decreaseStock } from "../products/productsService";

const ordersRef = collection(db, "orders");

type OrderDocument = Omit<Order, "id">;

const mapFirestoreOrder = (
  snapshot: QueryDocumentSnapshot<DocumentData>,
): Order => {
  const data = snapshot.data() as OrderDocument;

  return {
    id: snapshot.id,
    ...data,
  };
};

const createOrderItemsSnapshot = (items: CartItem[]): OrderItemSnapshot[] => {
  return items.map((item) => ({
    productId: item.id,
    title: item.title,
    image: item.image,
    priceAtPurchase: item.price,
    quantity: item.quantity,
  }));
};

const createOrder = async ({
  userId,
  items,
  total,
  status = "Pendiente",
}: CreateOrderPayload): Promise<Order> => {
  const payload: Omit<Order, "id"> = {
    userId,
    items,
    total,
    status,
    createdAt: serverTimestamp() as never,
  };

  const docRef = await addDoc(ordersRef, payload);

  return {
    id: docRef.id,
    userId,
    items,
    total,
    status,
    createdAt: payload.createdAt as unknown as Order["createdAt"],
  };
};

const createOrderFromCartItems = async (
  userId: string,
  cartItems: CartItem[],
  total: number,
): Promise<Order> => {

  const items = createOrderItemsSnapshot(cartItems);

  const order = await createOrder({
    userId,
    items,
    total,
  });

  for (const item of cartItems) {
    await decreaseStock(item.id, item.quantity);
  }

  return order;
};

const getOrders = async (): Promise<Order[]> => {
  const snapshot = await getDocs(
    query(ordersRef, orderBy("createdAt", "desc")),
  );
  return snapshot.docs.map(mapFirestoreOrder);
};

const getOrderById = async (id: string): Promise<Order | null> => {
  const snapshot = await getDoc(doc(ordersRef, id));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as OrderDocument),
  };
};

const getUserOrders = async (userId: string): Promise<Order[]> => {
  const snapshot = await getDocs(
    query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    ),
  );

  return snapshot.docs.map(mapFirestoreOrder);
};

const getOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
  const snapshot = await getDocs(
    query(
      ordersRef,
      where("status", "==", status),
      orderBy("createdAt", "desc"),
    ),
  );

  return snapshot.docs.map(mapFirestoreOrder);
};

const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
): Promise<void> => {
  await updateDoc(doc(ordersRef, id), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const OrderService = {
  createOrder,
  createOrderFromCartItems,
  getOrders,
  getOrderById,
  getUserOrders,
  getOrdersByStatus,
  updateOrderStatus,
};

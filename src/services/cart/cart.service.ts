import { db } from "../firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import type { CartItem } from "@/contexts/Cart/CartContext.type";
import type { Product } from "@/contexts/Products/product.type";

const COLLECTION = "carts";

async function getCart(userId: string): Promise<CartItem[]> {
  const ref = doc(db, COLLECTION, userId);

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return [];
  }

  return snapshot.data().items as CartItem[];
}

async function saveCart(
  userId: string,
  items: CartItem[],
): Promise<void> {
  const ref = doc(db, COLLECTION, userId);

  await setDoc(ref, {
    items,
  });
}

async function addToCart(
  userId: string,
  product: Product,
): Promise<void> {
  const items = await getCart(userId);

  const existing = items.find((item) => item.id === product.id);

  let updatedItems: CartItem[];

  if (existing) {
    updatedItems = items.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );
  } else {
    updatedItems = [
      ...items,
      {
        ...product,
        quantity: 1,
      },
    ];
  }

  await saveCart(userId, updatedItems);
}

async function updateCartItems(
  userId: string,
  items: CartItem[],
): Promise<void> {
  const ref = doc(db, COLLECTION, userId);

  await updateDoc(ref, {
    items,
  });
}

async function deleteCart(
  userId: string,
): Promise<void> {
  const ref = doc(db, COLLECTION, userId);

  await deleteDoc(ref);
}

export const CartService = {
  addToCart,
  getCart,
  saveCart, 
  updateCartItems,
  deleteCart
}
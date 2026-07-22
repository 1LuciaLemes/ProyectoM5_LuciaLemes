import { createContext } from "react";
import type { Product } from "../Products/product.type";

export type CartItem = Pick<
  Product,
  "id" | "title" | "brand" | "image" | "price" | "stock" | "description"
> & {
  quantity: number;
};

export type CartState = {
  itemsByUser: Record<string, CartItem[]>;
};

export type CartAction =
  | {
      type: "LOAD_CART";
      userId: string;
      payload: CartItem[];
    }
  | {
      type: "ADD_ITEM";
      userId: string;
      payload: Product;
    }
  | {
      type: "REMOVE_ITEM";
      userId: string;
      payload: string;
    }
  | {
      type: "CLEAR_CART";
      userId: string;
    };

export type CartContextType = {
  items: CartItem[];
  total: number;
  totalItems: number;

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

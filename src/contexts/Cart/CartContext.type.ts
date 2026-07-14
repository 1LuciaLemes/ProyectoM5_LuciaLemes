import { createContext } from "react";
import type { Product } from "../Products/product.type";

export type CartItem = Product & {
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export type CartAction =
  | { 
    type: "ADD_ITEM"; 
    payload: Product 
    }
  | { 
    type: "REMOVE_ITEM"; 
    payload: string 
    }
  | { 
    type: "CLEAR_CART" 
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

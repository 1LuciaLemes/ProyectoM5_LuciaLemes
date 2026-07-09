import { createContext } from "react";
import type { CartItem } from "../types/cart.type";
import type { Product } from "../types/product.type";

export type CartContextType = {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
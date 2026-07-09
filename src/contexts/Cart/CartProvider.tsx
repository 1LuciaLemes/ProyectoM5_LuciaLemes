import { CartContext } from "../contexts/CartContext.type";
import type { CartItem } from "./cart.type";
import type { Product } from "../Products/product.type";
import React from "react";
import { useState } from "react";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // funcion addItem
  const addItem = (product: Product) => {
    setItems((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.productId === product.id,
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...prevCart,
        {
          productId: product.id,
          quantity: 1,
        },
      ];
    });
  };

  // funcion removeitem
  const removeItem = (productId: string) => {
    setItems((prevCart) => {
      const item = prevCart.find((item) => item.productId === productId);

      if (!item) return prevCart;

      if (item.quantity === 1) {
        return prevCart.filter((item) => item.productId !== productId);
      }

      return prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
    });
  };

  // función limpiar carrito
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

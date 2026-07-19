import { useReducer } from "react";
import { CartReducer, initialState } from "./cart.reducer";
import { CartContext } from "./CartContext.type";
import type { Product } from "../Products/product.type";
import { useAuth } from "../auth/useAuth";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(CartReducer, initialState);
  const { user } = useAuth();
  const userId = user?.uid;
  const items = userId ? state.itemsByUser[userId] ?? [] : [];

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  function addItem(product: Product) {
    if (!userId) {
      return;
    }

    dispatch({
      type: "ADD_ITEM",
      userId,
      payload: product,
    });
  }

  function removeItem(id: string) {
    if (!userId) {
      return;
    }

    dispatch({
      type: "REMOVE_ITEM",
      userId,
      payload: id,
    });
  }

  function clearCart() {
    if (!userId) {
      return;
    }

    dispatch({
      type: "CLEAR_CART",
      userId,
    });
  }

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        totalItems,
        addItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

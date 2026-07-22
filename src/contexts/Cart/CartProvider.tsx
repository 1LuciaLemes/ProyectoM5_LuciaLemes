import { useEffect, useReducer } from "react";
import { CartReducer, initialState } from "./cart.reducer";
import { CartContext } from "./CartContext.type";
import type { Product } from "../Products/product.type";
import { useAuth } from "../auth/useAuth";
import { CartService } from "@/services/cart/cart.service";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(CartReducer, initialState);

  const { user } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    if (!userId) return;

    const currentUserId = userId;

    async function loadCart() {
      const items = await CartService.getCart(currentUserId);

      dispatch({
        type: "LOAD_CART",
        userId: currentUserId,
        payload: items,
      });
    }

    loadCart();
  }, [userId]);

  const items = userId ? (state.itemsByUser[userId] ?? []) : [];

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  async function addItem(product: Product) {
    if (!userId) return;

    await CartService.addToCart(userId, product )

    dispatch({
      type: "ADD_ITEM",
      userId,
      payload: product,
    });
  }

  async function removeItem(id: string) {
    if (!userId) return;

    const updatedItems = items.filter((item) => item.id !== id);

    await CartService.updateCartItems(userId, updatedItems);

    dispatch({
      type: "REMOVE_ITEM",
      userId,
      payload: id,
    });
  }

  async function clearCart() {
    if (!userId) return;

    await CartService.deleteCart(userId);

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

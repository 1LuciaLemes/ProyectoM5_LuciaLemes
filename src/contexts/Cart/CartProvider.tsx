import { useReducer } from "react";
import { CartReducer, initialState } from "./cart.reducer";
import { CartContext } from "./CartContext.type";
import type { Product } from "../Products/product.type";

export function CartProvider ({children}: {children: React.ReactNode}){ 
  const [state, dispatch] = useReducer(CartReducer, initialState);

  const total = state.items.reduce(
    (acc, item) => acc + item.price * item.quantity, 0
  )

  const totalItems = state.items.reduce(
    (acc, item) => acc + item.quantity, 0
  )

  function addItem(product: Product) {
    dispatch({
      type: "ADD_ITEM",
      payload: product,
    }) 
  }

  function removeItem(id: string) {
    dispatch({
      type: "REMOVE_ITEM",
      payload: id,
    })
  }

  function clearCart() {
    dispatch({
      type: "CLEAR_CART",
    })
  }

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        total,
        totalItems,

        addItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
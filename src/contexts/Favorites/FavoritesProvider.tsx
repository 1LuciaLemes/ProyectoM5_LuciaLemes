import { useReducer } from "react";
import type { ReactNode } from "react";
import type { Product } from "../Products/product.type";
import { useAuth } from "../auth/useAuth";
import { FavoritesContext } from "./FavoritesContext.type";
import { FavoritesReducer, initialState } from "./favorites.reducer";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(FavoritesReducer, initialState);
  const { user } = useAuth();
  const userId = user?.uid;
  const favorites = userId ? state.itemsByUser[userId] ?? [] : [];
  const favoriteIds = favorites.map((item) => item.id);

  function isFavorite(productId: string) {
    return favoriteIds.includes(productId);
  }

  function toggleFavorite(product: Product) {
    if (!userId) {
      return;
    }

    dispatch({
      type: "TOGGLE_FAVORITE",
      userId,
      payload: product,
    });
  }

  function removeFavorite(productId: string) {
    if (!userId) {
      return;
    }

    dispatch({
      type: "REMOVE_FAVORITE",
      userId,
      payload: productId,
    });
  }

  function clearFavorites() {
    if (!userId) {
      return;
    }

    dispatch({
      type: "CLEAR_FAVORITES",
      userId,
    });
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

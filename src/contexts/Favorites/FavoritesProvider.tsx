import { useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import type { Product } from "../Products/product.type";
import { useAuth } from "../auth/useAuth";
import { FavoritesContext } from "./FavoritesContext.type";
import { FavoritesReducer, initialState } from "./favorites.reducer";

const STORAGE_KEY = "favorites";

function loadFavorites(userId: string): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all: Record<string, Product[]> = JSON.parse(raw);
    return all[userId] ?? [];
  } catch {
    return [];
  }
}

function saveFavorites(userId: string, products: Product[]) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: Record<string, Product[]> = raw ? JSON.parse(raw) : {};
    all[userId] = products;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // silently ignore storage errors
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.uid;

  const [state, dispatch] = useReducer(FavoritesReducer, initialState, (init) => {
    if (!userId) return init;
    return {
      ...init,
      itemsByUser: { ...init.itemsByUser, [userId]: loadFavorites(userId) },
    };
  });

  useEffect(() => {
    if (!userId) return;
    const current = state.itemsByUser[userId] ?? [];
    saveFavorites(userId, current);
  }, [state, userId]);

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

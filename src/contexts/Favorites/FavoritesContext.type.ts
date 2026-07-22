import { createContext } from "react";
import type { Product } from "../Products/product.type";

export type FavoritesState = {
  itemsByUser: Record<string, Product[]>;
};

export type FavoritesAction =
  | {
      type: "TOGGLE_FAVORITE";
      userId: string;
      payload: Product;
    }
  | {
      type: "REMOVE_FAVORITE";
      userId: string;
      payload: string;
    }
  | {
      type: "CLEAR_FAVORITES";
      userId: string;
    };

export type FavoritesContextType = {
  favorites: Product[];
  favoriteIds: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
};

export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

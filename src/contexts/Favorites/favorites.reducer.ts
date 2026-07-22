import type { FavoritesAction, FavoritesState } from "./FavoritesContext.type";
import type { Product } from "../Products/product.type";

export const initialState: FavoritesState = {
  itemsByUser: {},
};

function getUserFavorites(state: FavoritesState, userId: string): Product[] {
  return state.itemsByUser[userId] ?? [];
}

export function FavoritesReducer(
  state: FavoritesState,
  action: FavoritesAction,
): FavoritesState {
  switch (action.type) {
    case "TOGGLE_FAVORITE": {
      const userFavorites = getUserFavorites(state, action.userId);
      const exists = userFavorites.some((item) => item.id === action.payload.id);

      return {
        ...state,
        itemsByUser: {
          ...state.itemsByUser,
          [action.userId]: exists
            ? userFavorites.filter((item) => item.id !== action.payload.id)
            : [...userFavorites, action.payload],
        },
      };
    }

    case "REMOVE_FAVORITE": {
      const userFavorites = getUserFavorites(state, action.userId);

      return {
        ...state,
        itemsByUser: {
          ...state.itemsByUser,
          [action.userId]: userFavorites.filter((item) => item.id !== action.payload),
        },
      };
    }

    case "CLEAR_FAVORITES":
      return {
        ...state,
        itemsByUser: {
          ...state.itemsByUser,
          [action.userId]: [],
        },
      };

    default:
      return state;
  }
}

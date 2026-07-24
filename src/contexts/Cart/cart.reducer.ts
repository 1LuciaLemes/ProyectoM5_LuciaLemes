import type { CartAction, CartState, CartItem } from "./CartContext.type";

export const initialState: CartState = {
  itemsByUser: {},
};

function getUserItems(state: CartState, userId: string): CartItem[] {
  return state.itemsByUser[userId] ?? [];
}

export function CartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_CART":
      return {
        ...state,
        itemsByUser: {
          ...state.itemsByUser,
          [action.userId]: action.payload,
        },
      };

    case "ADD_ITEM": {
      const userItems = getUserItems(state, action.userId);
      const existingItem = userItems.find(
        (item) => item.id === action.payload.id,
      );

      const nextItems = existingItem
        ? userItems.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [
            ...userItems,
            {
              ...action.payload,
              quantity: 1,
            },
          ];

      return {
        ...state,
        itemsByUser: {
          ...state.itemsByUser,
          [action.userId]: nextItems,
        },
      };
    }

    case "REMOVE_ITEM": {
      const userItems = getUserItems(state, action.userId);

      return {
        ...state,
        itemsByUser: {
          ...state.itemsByUser,
          [action.userId]: userItems.filter(
            (item) => item.id !== action.payload,
          ),
        },
      };
    }

    case "INCREASE_QUANTITY": {
      const userItems = getUserItems(state, action.userId);

      return {
        ...state,
        itemsByUser: {
          ...state.itemsByUser,
          [action.userId]: userItems.map((item) =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        },
      };
    }

    case "DECREASE_QUANTITY": {
      const userItems = getUserItems(state, action.userId);
      const targetItem = userItems.find((item) => item.id === action.payload);

      if (targetItem && targetItem.quantity <= 1) {
        return {
          ...state,
          itemsByUser: {
            ...state.itemsByUser,
            [action.userId]: userItems.filter(
              (item) => item.id !== action.payload,
            ),
          },
        };
      }

      return {
        ...state,
        itemsByUser: {
          ...state.itemsByUser,
          [action.userId]: userItems.map((item) =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          ),
        },
      };
    }

    case "CLEAR_CART":
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

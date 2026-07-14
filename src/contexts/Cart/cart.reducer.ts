import type { CartAction, CartState } from "./CartContext.type";

export const initialState: CartState = {
    items: [],
}

export function CartReducer(
    state: CartState,
    action: CartAction, 
): CartState {
    switch (action.type) {
        case "ADD_ITEM": {
            const existingItem = state.items.find(
                (item) => item.id === action.payload.id,
            );

            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map((item) =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item,
                    ),
                };
            }

            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        ...action.payload,
                        quantity: 1,
                    },
                ],
            };
        }

        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter(
                    (item) => item.id !== action.payload,
                ),
            };

        case "CLEAR_CART":
            return {
                ...state,
                items: [],
            };
            
        default:
            return state;
    }
}

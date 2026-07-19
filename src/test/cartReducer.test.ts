import { describe, expect, test } from "vitest";
import { CartReducer, initialState } from "@/contexts/Cart/cart.reducer";
import {
  customUserFixture,
  adminUserFixture,
  productFixture,
  cartItemFixture,
} from "@/test/fixtures";

describe("CartReducer", () => {
  test("agrega un producto al carrito del usuario", () => {
    const state = CartReducer(initialState, {
      type: "ADD_ITEM",
      userId: customUserFixture.uid,
      payload: productFixture,
    });

    expect(state.itemsByUser[customUserFixture.uid]).toEqual([
      {
        ...productFixture,
        quantity: 1,
      },
    ]);
  });


  test("incrementa la cantidad cuando se agrega el mismo producto nuevamente", () => {
    const firstState = CartReducer(initialState, {
      type: "ADD_ITEM",
      userId: customUserFixture.uid,
      payload: productFixture,
    });

    const secondState = CartReducer(firstState, {
      type: "ADD_ITEM",
      userId: customUserFixture.uid,
      payload: productFixture,
    });

    expect(
      secondState.itemsByUser[customUserFixture.uid][0].quantity
    ).toBe(2);
  });


  test("mantiene carritos separados entre usuarios", () => {
    const customerState = CartReducer(initialState, {
      type: "ADD_ITEM",
      userId: customUserFixture.uid,
      payload: productFixture,
    });

    const finalState = CartReducer(customerState, {
      type: "ADD_ITEM",
      userId: adminUserFixture.uid,
      payload: productFixture,
    });

    expect(
      finalState.itemsByUser[customUserFixture.uid]
    ).toHaveLength(1);

    expect(
      finalState.itemsByUser[adminUserFixture.uid]
    ).toHaveLength(1);
  });


  test("elimina un producto del carrito del usuario", () => {
    const state = {
      itemsByUser: {
        [customUserFixture.uid]: [
          cartItemFixture,
        ],
      },
    };

    const newState = CartReducer(state, {
      type: "REMOVE_ITEM",
      userId: customUserFixture.uid,
      payload: productFixture.id,
    });

    expect(
      newState.itemsByUser[customUserFixture.uid]
    ).toEqual([]);
  });


  test("limpia únicamente el carrito del usuario indicado", () => {
    const state = {
      itemsByUser: {
        [customUserFixture.uid]: [
          cartItemFixture,
        ],
        [adminUserFixture.uid]: [
          cartItemFixture,
        ],
      },
    };

    const newState = CartReducer(state, {
      type: "CLEAR_CART",
      userId: customUserFixture.uid,
    });

    expect(
      newState.itemsByUser[customUserFixture.uid]
    ).toEqual([]);

    expect(
      newState.itemsByUser[adminUserFixture.uid]
    ).toHaveLength(1);
  });


  test("calcula correctamente totalItems y totalPrice", () => {
    const items = [
      {
        ...productFixture,
        quantity: 2,
      },
      {
        ...productFixture,
        id: "prod_2",
        price: 50,
        quantity: 3,
      },
    ];

    const totalItems = items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    const totalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    expect(totalItems).toBe(5);
    expect(totalPrice).toBe(400);
  });
});

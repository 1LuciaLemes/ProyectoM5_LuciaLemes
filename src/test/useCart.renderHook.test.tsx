import { renderHook, act } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import type { ReactNode } from "react";
import { useCart } from "@/contexts/Cart/useCart";
import { CartProvider } from "@/contexts/Cart/CartProvider";
import { AuthContext, type AuthContextType } from "@/contexts/auth/AuthContext.type";
import { productFixture, customUserFixture } from "./fixtures";

vi.mock("@/services/cart/cart.service", () => ({
  CartProvider: ({ children }: { children: ReactNode }) => children,
  CartService: {
    addToCart: vi.fn().mockResolvedValue(undefined),
    updateCartItems: vi.fn().mockResolvedValue(undefined),
    deleteCart: vi.fn().mockResolvedValue(undefined),
    getCart: vi.fn().mockResolvedValue([]),
  },
}));

const mockAuthValue: AuthContextType = {
  user: customUserFixture,
  loading: false,
  signin: vi.fn(),
  signup: vi.fn(),
  signinWhitGoogle: vi.fn(),
  logout: vi.fn(),
};

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AuthContext.Provider value={mockAuthValue}>
        <CartProvider>{children}</CartProvider>
      </AuthContext.Provider>
    );
  };
}

describe("useCart with renderHook", () => {
  test("inicia con el carrito vacío", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.total).toBe(0);
  });

  test("addItem agrega un producto y actualiza totales", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addItem(productFixture);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(productFixture.id);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.total).toBe(productFixture.price);
  });

  test("addItem dos veces incrementa la cantidad", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addItem(productFixture);
    });

    await act(async () => {
      await result.current.addItem(productFixture);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  test("removeItem elimina un producto del carrito", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addItem(productFixture);
    });

    await act(async () => {
      result.current.removeItem(productFixture.id);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.total).toBe(0);
  });

  test("increaseQuantity incrementa la cantidad", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addItem(productFixture);
    });

    await act(async () => {
      await result.current.increaseQuantity(productFixture.id);
    });

    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  test("decreaseQuantity decrementa la cantidad", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addItem(productFixture);
    });

    await act(async () => {
      await result.current.addItem(productFixture);
    });

    await act(async () => {
      await result.current.decreaseQuantity(productFixture.id);
    });

    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
  });

  test("decreaseQuantity elimina si quantity es 1", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addItem(productFixture);
    });

    await act(async () => {
      await result.current.decreaseQuantity(productFixture.id);
    });

    expect(result.current.items).toHaveLength(0);
  });

  test("clearCart vacía todo el carrito", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addItem(productFixture);
    });

    await act(async () => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.total).toBe(0);
  });
});

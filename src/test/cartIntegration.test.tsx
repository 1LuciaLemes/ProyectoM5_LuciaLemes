import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "@/contexts/Cart/CartProvider";
import { useCart } from "@/contexts/Cart/useCart";
import { AuthContext, type AuthContextType } from "@/contexts/auth/AuthContext.type";
import { productFixture, customUserFixture } from "./fixtures";

vi.mock("@/services/cart/cart.service", () => ({
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

function CartWithAddButton() {
  const { addItem, items, removeItem } = useCart();

  return (
    <div>
      <button onClick={() => addItem(productFixture)}>Agregar</button>
      <p>items:{items.length}</p>
      {items.length > 0 && (
        <button onClick={() => removeItem(productFixture.id)}>Eliminar</button>
      )}
    </div>
  );
}

function CartWithQuantity() {
  const { addItem, items, increaseQuantity, decreaseQuantity } = useCart();

  return (
    <div>
      <button onClick={() => addItem(productFixture)}>Agregar</button>
      <p>qty:{items[0]?.quantity ?? 0}</p>
      {items.length > 0 && (
        <>
          <button onClick={() => increaseQuantity(productFixture.id)}>+</button>
          <button onClick={() => decreaseQuantity(productFixture.id)}>-</button>
        </>
      )}
    </div>
  );
}

function CartPageEmpty() {
  const { items } = useCart();
  return (
    <main>
      {items.length === 0 && <p>Tu carrito está vacío.</p>}
    </main>
  );
}

describe("Flujo completo del carrito (integración)", () => {
  test("el carrito empieza vacío", () => {
    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <AuthContext.Provider value={mockAuthValue}>
          <CartProvider>
            <CartPageEmpty />
          </CartProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
  });

  test("agregar y luego eliminar un producto vacía el carrito", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthValue}>
          <CartProvider>
            <CartWithAddButton />
          </CartProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText("items:0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Agregar" }));
    expect(screen.getByText("items:1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(screen.getByText("items:0")).toBeInTheDocument();
  });

  test("increaseQuantity y decreaseQuantity modifican la cantidad", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthValue}>
          <CartProvider>
            <CartWithQuantity />
          </CartProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Agregar" }));
    expect(screen.getByText("qty:1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "+" }));
    expect(screen.getByText("qty:2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "-" }));
    expect(screen.getByText("qty:1")).toBeInTheDocument();
  });
});

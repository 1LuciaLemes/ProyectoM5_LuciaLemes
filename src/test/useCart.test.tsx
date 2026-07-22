import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { useCart } from "@/contexts/Cart/useCart";
import { productFixture } from "./fixtures";
import { renderWithProvider } from "./renderWithProvider";
import { vi } from "vitest";

vi.mock("@/services/cart/cart.service", () => ({
  CartService: {
    addToCart: vi.fn().mockResolvedValue(undefined),
    updateCartItems: vi.fn().mockResolvedValue(undefined),
    deleteCart: vi.fn().mockResolvedValue(undefined),
    getCart: vi.fn().mockResolvedValue([]),
  },
}));

function CartConsumer() {
  const { items, totalItems, total, addItem, removeItem } = useCart();

  return (
    <div>
      <p>items:{items.length}</p>
      <p>totalItems:{totalItems}</p>
      <p>total:{total.toFixed(2)}</p>
      <p>firstItem:{items[0]?.id ?? "none"}</p>
      <p>firstQuantity:{items[0]?.quantity ?? 0}</p>
      <button type="button" onClick={() => addItem(productFixture)}>
        add
      </button>
      <button type="button" onClick={() => removeItem(productFixture.id)}>
        remove
      </button>
    </div>
  );
}

describe("useCart", () => {
  test("si el carrito empieza vacío termina vacío", () => {
    renderWithProvider(<CartConsumer />);

    expect(screen.getByText("items:0")).toBeInTheDocument();
    expect(screen.getByText("totalItems:0")).toBeInTheDocument();
    expect(screen.getByText("total:0.00")).toBeInTheDocument();
    expect(screen.getByText("firstItem:none")).toBeInTheDocument();
  });

  test("si agrego un item, termino con el mismo item", async () => {
    const user = userEvent.setup();

    renderWithProvider(<CartConsumer />);

    await user.click(screen.getByRole("button", { name: "add" }));

    expect(screen.getByText(`items:1`)).toBeInTheDocument();
    expect(screen.getByText(`totalItems:1`)).toBeInTheDocument();
    expect(screen.getByText(`total:${productFixture.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`firstItem:${productFixture.id}`)).toBeInTheDocument();
    expect(screen.getByText("firstQuantity:1")).toBeInTheDocument();
  });

  test("si elimino un item, lo mismo", async () => {
    const user = userEvent.setup();

    renderWithProvider(<CartConsumer />);

    await user.click(screen.getByRole("button", { name: "add" }));
    await user.click(screen.getByRole("button", { name: "remove" }));

    expect(screen.getByText("items:0")).toBeInTheDocument();
    expect(screen.getByText("totalItems:0")).toBeInTheDocument();
    expect(screen.getByText("total:0.00")).toBeInTheDocument();
    expect(screen.getByText("firstItem:none")).toBeInTheDocument();
  });
});

import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { CartService } from "../services/cart/cart.service";

import {
  cartItemFixture,
  productFixture,
} from "./fixtures";

import type { CartItem } from "@/contexts/Cart/CartContext.type";
import type { DocumentSnapshot } from "firebase/firestore";

const { mockDocumentReference } = vi.hoisted(() => ({
  mockDocumentReference: {
    id: "u_customer",
  },
}));

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({
    name: "test-app",
  })),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
  })),
}));

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("firebase/firestore")>();

  return {
    ...actual,

    getFirestore: vi.fn(() => ({
      type: "test-firestore",
    })),

    doc: vi.fn(() => mockDocumentReference),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
  };
});

const createMissingSnapshot = (): DocumentSnapshot =>
  ({
    exists: () => false,
    data: () => undefined,
  }) as unknown as DocumentSnapshot;

const createExistingSnapshot = (
  items: CartItem[],
): DocumentSnapshot =>
  ({
    exists: () => true,
    data: () => ({
      items,
    }),
  }) as unknown as DocumentSnapshot;

describe("CartService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCart", () => {
    test("debería devolver un carrito vacío si el carrito no existe", async () => {
      vi.mocked(getDoc).mockResolvedValue(
        createMissingSnapshot(),
      );

      const result = await CartService.getCart(
        "u_customer",
      );

      expect(result).toEqual([]);

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        "carts",
        "u_customer",
      );

      expect(getDoc).toHaveBeenCalled();
    });

    test("debería devolver los items si el carrito existe", async () => {
      vi.mocked(getDoc).mockResolvedValue(
        createExistingSnapshot([cartItemFixture]),
      );

      const result = await CartService.getCart(
        "u_customer",
      );

      expect(result).toEqual([cartItemFixture]);
    });
  });

  describe("saveCart", () => {
    test("debería guardar los items del carrito", async () => {
      vi.mocked(setDoc).mockResolvedValue(undefined);

      const items: CartItem[] = [cartItemFixture];

      await CartService.saveCart(
        "u_customer",
        items,
      );

      expect(setDoc).toHaveBeenCalledWith(
        mockDocumentReference,
        {
          items,
        },
      );
    });
  });

  describe("addToCart", () => {
    test("debería agregar un producto nuevo con quantity 1", async () => {
      vi.mocked(getDoc).mockResolvedValue(
        createMissingSnapshot(),
      );

      vi.mocked(setDoc).mockResolvedValue(undefined);

      await CartService.addToCart(
        "u_customer",
        productFixture,
      );

      expect(setDoc).toHaveBeenCalledWith(
        mockDocumentReference,
        {
          items: [
            {
              ...productFixture,
              quantity: 1,
            },
          ],
        },
      );
    });

    test("debería incrementar quantity si el producto ya existe", async () => {
      vi.mocked(getDoc).mockResolvedValue(
        createExistingSnapshot([cartItemFixture]),
      );

      vi.mocked(setDoc).mockResolvedValue(undefined);

      await CartService.addToCart(
        "u_customer",
        productFixture,
      );

      expect(setDoc).toHaveBeenCalledWith(
        mockDocumentReference,
        {
          items: [
            {
              ...cartItemFixture,
              quantity: 3,
            },
          ],
        },
      );
    });

    test("debería mantener los productos diferentes", async () => {
      const otherProduct: CartItem = {
        ...productFixture,
        id: "prod_2",
        title: "Chanel Bleu",
        brand: "Chanel",
        quantity: 1,
      };

      vi.mocked(getDoc).mockResolvedValue(
        createExistingSnapshot([otherProduct]),
      );

      vi.mocked(setDoc).mockResolvedValue(undefined);

      await CartService.addToCart(
        "u_customer",
        productFixture,
      );

      expect(setDoc).toHaveBeenCalledWith(
        mockDocumentReference,
        {
          items: [
            otherProduct,
            {
              ...productFixture,
              quantity: 1,
            },
          ],
        },
      );
    });
  });

  describe("updateCartItems", () => {
    test("debería actualizar los items del carrito", async () => {
      vi.mocked(updateDoc).mockResolvedValue(undefined);

      const items: CartItem[] = [cartItemFixture];

      await CartService.updateCartItems(
        "u_customer",
        items,
      );

      expect(updateDoc).toHaveBeenCalledWith(
        mockDocumentReference,
        {
          items,
        },
      );
    });
  });

  describe("deleteCart", () => {
    test("debería eliminar el carrito del usuario", async () => {
      vi.mocked(deleteDoc).mockResolvedValue(undefined);

      await CartService.deleteCart(
        "u_customer",
      );

      expect(deleteDoc).toHaveBeenCalledWith(
        mockDocumentReference,
      );
    });
  });
});
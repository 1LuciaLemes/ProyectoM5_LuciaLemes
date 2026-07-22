import {
  addDoc,
  deleteDoc,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  updateDoc,
  where,
} from "firebase/firestore";

import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  addProduct,
  decreaseStock,
  deleteProduct,
  getProductById,
  getProducts,
  getProductsPage,
  increaseStock,
  updateProduct,
} from "../services/products/productsService";

import { productFixture } from "./fixtures";

import type { DocumentSnapshot } from "firebase/firestore";
import type { Product } from "@/contexts/Products/product.type";

const {
  mockProductsCollection,
  mockProductDocument,
  mockTimestamp,
} = vi.hoisted(() => ({
  mockProductsCollection: {
    id: "products-collection",
  },

  mockProductDocument: {
    id: "prod_1",
  },

  mockTimestamp: {
    seconds: 0,
    nanoseconds: 0,
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

    collection: vi.fn(() => mockProductsCollection),

    doc: vi.fn(() => mockProductDocument),

    addDoc: vi.fn(),

    deleteDoc: vi.fn(),

    getDoc: vi.fn(),

    getDocs: vi.fn(),

    updateDoc: vi.fn(),

    query: vi.fn(),

    where: vi.fn(),

    orderBy: vi.fn(),

    startAfter: vi.fn(),

    startAt: vi.fn(),

    endAt: vi.fn(),

    limit: vi.fn(),

    serverTimestamp: vi.fn(() => ({
      type: "server-timestamp",
    })),

    increment: vi.fn((value: number) => ({
      type: "increment",
      value,
    })),

    Timestamp: {
      now: vi.fn(() => mockTimestamp),

      fromDate: vi.fn((date: Date) => ({
        toDate: () => date,
      })),
    },
  };
});

const createDocumentSnapshot = (
  product: Product,
): DocumentSnapshot =>
  ({
    id: product.id,

    exists: (): boolean => true,

    data: () => ({
      title: product.title,
      brand: product.brand,
      image: product.image,
      description: product.description,
      price: product.price,
      stock: product.stock,
      gender: product.gender,
      createdAt: product.createdAt,
    }),
  }) as unknown as DocumentSnapshot;

const createMissingDocumentSnapshot = (): DocumentSnapshot =>
  ({
    exists: (): boolean => false,

    data: () => undefined,
  }) as unknown as DocumentSnapshot;

const createProductPayload = () => ({
  title: productFixture.title,
  brand: productFixture.brand,
  image: productFixture.image,
  description: productFixture.description,
  price: productFixture.price,
  stock: productFixture.stock,
  gender: productFixture.gender,
});

describe("ProductService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProductsPage", () => {
    test(
      "debería devolver los productos y detectar que hay más páginas",
      async () => {
        const product2: Product = {
          ...productFixture,
          id: "prod_2",
          title: "Bleu de Chanel",
          brand: "Chanel",
        };

        const product3: Product = {
          ...productFixture,
          id: "prod_3",
          title: "Acqua di Gio",
          brand: "Giorgio Armani",
        };

        vi.mocked(getDocs).mockResolvedValue({
          docs: [
            createDocumentSnapshot(productFixture),
            createDocumentSnapshot(product2),
            createDocumentSnapshot(product3),
          ],
        } as never);

        const result = await getProductsPage({
          pageSize: 2,
        });

        expect(result.products).toHaveLength(2);

        expect(result.products).toEqual([
          productFixture,
          product2,
        ]);

        expect(result.lastDoc).toBeDefined();

        expect(result.hasMore).toBe(true);

        expect(query).toHaveBeenCalled();

        expect(limit).toHaveBeenCalledWith(3);
      },
    );

    test(
      "debería devolver todos los productos cuando no hay más páginas",
      async () => {
        vi.mocked(getDocs).mockResolvedValue({
          docs: [
            createDocumentSnapshot(productFixture),
          ],
        } as never);

        const result = await getProductsPage({
          pageSize: 10,
        });

        expect(result.products).toEqual([
          productFixture,
        ]);

        expect(result.lastDoc).toEqual(
          expect.anything(),
        );

        expect(result.hasMore).toBe(false);
      },
    );

    test(
      "debería aplicar el filtro de marca",
      async () => {
        vi.mocked(getDocs).mockResolvedValue({
          docs: [],
        } as never);

        await getProductsPage({
          pageSize: 10,
          brandFilter: "Dior",
        });

        expect(where).toHaveBeenCalledWith(
          "brand",
          "==",
          "Dior",
        );
      },
    );

    test(
      "debería filtrar productos masculinos y unisex",
      async () => {
        vi.mocked(getDocs).mockResolvedValue({
          docs: [],
        } as never);

        await getProductsPage({
          pageSize: 10,
          genderFilter: "male",
        });

        expect(where).toHaveBeenCalledWith(
          "gender",
          "in",
          ["male", "unisex"],
        );
      },
    );

    test(
      "debería filtrar productos femeninos y unisex",
      async () => {
        vi.mocked(getDocs).mockResolvedValue({
          docs: [],
        } as never);

        await getProductsPage({
          pageSize: 10,
          genderFilter: "female",
        });

        expect(where).toHaveBeenCalledWith(
          "gender",
          "in",
          ["female", "unisex"],
        );
      },
    );

    test(
      "debería filtrar únicamente productos unisex",
      async () => {
        vi.mocked(getDocs).mockResolvedValue({
          docs: [],
        } as never);

        await getProductsPage({
          pageSize: 10,
          genderFilter: "unisex",
        });

        expect(where).toHaveBeenCalledWith(
          "gender",
          "==",
          "unisex",
        );
      },
    );

    test(
      "debería aplicar la búsqueda cuando el término tiene al menos dos caracteres",
      async () => {
        vi.mocked(getDocs).mockResolvedValue({
          docs: [],
        } as never);

        await getProductsPage({
          pageSize: 10,
          searchTerm: "Dior",
        });

        expect(startAt).toHaveBeenCalledWith(
          "dior",
        );

        expect(endAt).toHaveBeenCalledWith(
          "dior\uf8ff",
        );
      },
    );

    test(
      "no debería aplicar búsqueda con menos de dos caracteres",
      async () => {
        vi.mocked(getDocs).mockResolvedValue({
          docs: [],
        } as never);

        await getProductsPage({
          pageSize: 10,
          searchTerm: "D",
        });

        expect(startAt).not.toHaveBeenCalled();

        expect(endAt).not.toHaveBeenCalled();

        expect(orderBy).toHaveBeenCalledWith(
          "nameLower",
        );
      },
    );

    test(
      "debería aplicar el cursor de paginación",
      async () => {
        const cursor =
          createDocumentSnapshot(productFixture);

        vi.mocked(getDocs).mockResolvedValue({
          docs: [],
        } as never);

        await getProductsPage({
          pageSize: 10,
          cursor,
        });

        expect(startAfter).toHaveBeenCalledWith(
          cursor,
        );
      },
    );
  });

  describe("getProducts", () => {
    test(
      "debería devolver los productos usando una página de 10 elementos",
      async () => {
        vi.mocked(getDocs).mockResolvedValue({
          docs: [
            createDocumentSnapshot(productFixture),
          ],
        } as never);

        const result = await getProducts();

        expect(result).toEqual([
          productFixture,
        ]);

        expect(limit).toHaveBeenCalledWith(11);
      },
    );
  });

  describe("addProduct", () => {
    test(
      "debería agregar un producto y devolverlo con su id",
      async () => {
        vi.mocked(addDoc).mockResolvedValue({
          id: "prod_new",
        } as never);

        const payload =
          createProductPayload();

        const result = await addProduct(payload);

        expect(addDoc).toHaveBeenCalledWith(
          mockProductsCollection,
          {
            ...payload,
            nameLower:
              payload.title.toLowerCase(),
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          },
        );

        expect(result).toEqual({
          id: "prod_new",
          ...payload,
          createdAt: mockTimestamp,
        });
      },
    );
  });

  describe("updateProduct", () => {
    test(
      "debería actualizar un producto y devolverlo",
      async () => {
        vi.mocked(updateDoc).mockResolvedValue(
          undefined,
        );

        const payload =
          createProductPayload();

        const result = await updateProduct(
          productFixture.id,
          payload,
        );

        expect(doc).toHaveBeenCalledWith(
          mockProductsCollection,
          productFixture.id,
        );

        expect(updateDoc).toHaveBeenCalledWith(
          mockProductDocument,
          {
            ...payload,
            nameLower:
              payload.title.toLowerCase(),
            updatedAt: expect.anything(),
          },
        );

        expect(result).toEqual({
          id: productFixture.id,
          ...payload,
          createdAt: mockTimestamp,
        });
      },
    );
  });

  describe("deleteProduct", () => {
    test(
      "debería eliminar el producto",
      async () => {
        vi.mocked(deleteDoc).mockResolvedValue(
          undefined,
        );

        await deleteProduct(
          productFixture.id,
        );

        expect(doc).toHaveBeenCalledWith(
          mockProductsCollection,
          productFixture.id,
        );

        expect(deleteDoc).toHaveBeenCalledWith(
          mockProductDocument,
        );
      },
    );
  });

  describe("getProductById", () => {
    test(
      "debería devolver el producto si existe",
      async () => {
        vi.mocked(getDoc).mockResolvedValue(
          createDocumentSnapshot(
            productFixture,
          ),
        );

        const result =
          await getProductById(
            productFixture.id,
          );

        expect(result).toEqual(
          productFixture,
        );

        expect(doc).toHaveBeenCalledWith(
          mockProductsCollection,
          productFixture.id,
        );
      },
    );

    test(
      "debería devolver null si el producto no existe",
      async () => {
        vi.mocked(getDoc).mockResolvedValue(
          createMissingDocumentSnapshot(),
        );

        const result =
          await getProductById(
            "non-existent-product",
          );

        expect(result).toBeNull();
      },
    );
  });

  describe("decreaseStock", () => {
    test(
      "debería disminuir el stock",
      async () => {
        vi.mocked(updateDoc).mockResolvedValue(
          undefined,
        );

        await decreaseStock(
          productFixture.id,
          2,
        );

        expect(updateDoc).toHaveBeenCalledWith(
          mockProductDocument,
          {
            stock: {
              type: "increment",
              value: -2,
            },
            updatedAt: expect.anything(),
          },
        );
      },
    );
  });

  describe("increaseStock", () => {
    test(
      "debería aumentar el stock",
      async () => {
        vi.mocked(updateDoc).mockResolvedValue(
          undefined,
        );

        await increaseStock(
          productFixture.id,
          3,
        );

        expect(updateDoc).toHaveBeenCalledWith(
          mockProductDocument,
          {
            stock: {
              type: "increment",
              value: 3,
            },
            updatedAt: expect.anything(),
          },
        );
      },
    );
  });
});
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
  cartItemFixture,
  customUserFixture,
  orderFixture,
  orderItemSnapshotFixture,
} from "./fixtures";

const firestoreMocks = vi.hoisted(() => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  doc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  serverTimestamp: vi.fn(() => "server-timestamp"),
}));

vi.mock("@/services/firebase/firebase", () => ({
  db: { mocked: true },
}));

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/firestore")>();

  return {
    ...actual,
    collection: firestoreMocks.collection,
    addDoc: firestoreMocks.addDoc,
    getDocs: firestoreMocks.getDocs,
    getDoc: firestoreMocks.getDoc,
    updateDoc: firestoreMocks.updateDoc,
    doc: firestoreMocks.doc,
    query: firestoreMocks.query,
    where: firestoreMocks.where,
    orderBy: firestoreMocks.orderBy,
    serverTimestamp: firestoreMocks.serverTimestamp,
  };
});

const mockOrdersRef = { ref: "orders-ref" };

async function loadService() {
  return import("@/services/orders/orders.service");
}

describe("OrderService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMocks.collection.mockReturnValue(mockOrdersRef);
    firestoreMocks.query.mockReturnValue({ query: true });
    firestoreMocks.doc.mockReturnValue({ doc: true });
    firestoreMocks.where.mockReturnValue({ where: true });
    firestoreMocks.orderBy.mockReturnValue({ orderBy: true });
  });

  test("createOrder crea la orden sin tocar Firebase real", async () => {
    const { OrderService } = await loadService();
    firestoreMocks.addDoc.mockResolvedValue({ id: orderFixture.id });

    const result = await OrderService.createOrder({
      userId: customUserFixture.uid,
      items: [orderItemSnapshotFixture],
      total: orderFixture.total,
    });

    expect(firestoreMocks.collection).toHaveBeenCalledWith(
      expect.objectContaining({ mocked: true }),
      "orders",
    );
    expect(firestoreMocks.addDoc).toHaveBeenCalledWith(mockOrdersRef, {
      userId: customUserFixture.uid,
      items: [orderItemSnapshotFixture],
      total: orderFixture.total,
      status: "Pendiente",
      createdAt: "server-timestamp",
    });
    expect(result).toEqual({
      id: orderFixture.id,
      userId: customUserFixture.uid,
      items: [orderItemSnapshotFixture],
      total: orderFixture.total,
      status: "Pendiente",
      createdAt: "server-timestamp",
    });
  });

  test("createOrderFromCartItems crea la orden desde los items del carrito", async () => {
    const { OrderService } = await loadService();
    firestoreMocks.addDoc.mockResolvedValue({ id: orderFixture.id });

    const result = await OrderService.createOrderFromCartItems(
      customUserFixture.uid,
      [cartItemFixture],
      orderFixture.total,
    );

    expect(result).toEqual({
      id: orderFixture.id,
      userId: customUserFixture.uid,
      items: [orderItemSnapshotFixture],
      total: orderFixture.total,
      status: "Pendiente",
      createdAt: "server-timestamp",
    });
  });

  test("getOrders devuelve todas las órdenes ordenadas por fecha", async () => {
    const { OrderService } = await loadService();
    const docs = [
      {
        id: orderFixture.id,
        data: () => ({
          userId: orderFixture.userId,
          items: orderFixture.items,
          total: orderFixture.total,
          status: orderFixture.status,
          createdAt: orderFixture.createdAt,
        }),
      },
    ] as unknown as QueryDocumentSnapshot<DocumentData>[];

    firestoreMocks.getDocs.mockResolvedValue({ docs });

    const result = await OrderService.getOrders();

    expect(firestoreMocks.orderBy).toHaveBeenCalledWith("createdAt", "desc");
    expect(firestoreMocks.query).toHaveBeenCalled();
    expect(firestoreMocks.getDocs).toHaveBeenCalledWith({ query: true });
    expect(result).toEqual([
      {
        id: orderFixture.id,
        userId: orderFixture.userId,
        items: orderFixture.items,
        total: orderFixture.total,
        status: orderFixture.status,
        createdAt: orderFixture.createdAt,
      },
    ]);
  });

  test("getUserOrders consulta por userId y devuelve las �rdenes mapeadas", async () => {
    const { OrderService } = await loadService();
    const docs = [
      {
        id: orderFixture.id,
        data: () => ({
          userId: orderFixture.userId,
          items: orderFixture.items,
          total: orderFixture.total,
          status: orderFixture.status,
          createdAt: orderFixture.createdAt,
        }),
      },
    ] as unknown as QueryDocumentSnapshot<DocumentData>[];

    firestoreMocks.getDocs.mockResolvedValue({ docs });

    const result = await OrderService.getUserOrders(customUserFixture.uid);

    expect(firestoreMocks.where).toHaveBeenCalledWith(
      "userId",
      "==",
      customUserFixture.uid,
    );
    expect(firestoreMocks.orderBy).toHaveBeenCalledWith("createdAt", "desc");
    expect(firestoreMocks.getDocs).toHaveBeenCalled();
    expect(result).toEqual([
      {
        id: orderFixture.id,
        userId: orderFixture.userId,
        items: orderFixture.items,
        total: orderFixture.total,
        status: orderFixture.status,
        createdAt: orderFixture.createdAt,
      },
    ]);
  });
});

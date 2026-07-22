import { db } from "../firebase/firebase";
import type {
  Product,
  ProductBrand,
  ProductGender,
} from "../../contexts/Products/product.type";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  startAfter,
  startAt,
  endAt,
  limit,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  type DocumentSnapshot,
  type QueryConstraint,
  increment,
} from "firebase/firestore";

const productsRef = collection(db, "products");

type ProductPayload = Omit<Product, "id" | "createdAt">;

type FetchProductsParams = {
  pageSize?: number;
  cursor?: DocumentSnapshot | null;
  brandFilter?: ProductBrand;
  genderFilter?: ProductGender;
  searchTerm?: string;
};

const buildProductsQuery = ({
  pageSize = 10,
  cursor,
  brandFilter,
  genderFilter,
  searchTerm,
}: FetchProductsParams) => {
  const trimmedSearch = searchTerm?.trim();
  const constraints: QueryConstraint[] = [];

  const searchEnabled = trimmedSearch && trimmedSearch.length >= 2;

  if (searchEnabled) {
    constraints.push(orderBy("nameLower"));
    constraints.push(startAt(trimmedSearch.toLowerCase()));
    constraints.push(endAt(`${trimmedSearch.toLowerCase()}\uf8ff`));
  } else {
    constraints.push(orderBy("nameLower"));
  }

  if (brandFilter) {
    constraints.push(where("brand", "==", brandFilter));
  }

  if (genderFilter) {
    if (genderFilter === "male") {
      constraints.push(where("gender", "in", ["male", "unisex"]));
    } else if (genderFilter === "female") {
      constraints.push(where("gender", "in", ["female", "unisex"]));
    } else {
      constraints.push(where("gender", "==", "unisex"));
    }
  }

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  constraints.push(limit(pageSize + 1));

  return query(productsRef, ...constraints);
};

export const getProductsPage = async (
  params: FetchProductsParams,
): Promise<{
  products: Product[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}> => {
  try {
    const productQuery = buildProductsQuery(params);
    const querySnapshot = await getDocs(productQuery);

    const fetchedDocs = querySnapshot.docs;
    const effectivePageSize = params.pageSize ?? 10;
    const hasMore = fetchedDocs.length > effectivePageSize;
    const productDocs = hasMore ? fetchedDocs.slice(0, effectivePageSize) : fetchedDocs;

    const products = productDocs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Product,
    );

    const lastDoc = productDocs[productDocs.length - 1] ?? null;

    return {
      products,
      lastDoc,
      hasMore,
    };
  } catch (error) {
    console.error("Error obteniendo productos paginados:", error);
    throw error;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  const result = await getProductsPage({ pageSize: 10 });
  return result.products;
};

export const addProduct = async (payload: ProductPayload): Promise<Product> => {
  const newProduct = {
    ...payload,
    nameLower: payload.title.toLowerCase(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(productsRef, newProduct);

  return {
    id: docRef.id,
    ...payload,
    createdAt: Timestamp.now(),
  } as Product;
};

export const updateProduct = async (
  id: string,
  payload: ProductPayload,
): Promise<Product> => {
  const productRef = doc(productsRef, id);

  await updateDoc(productRef, {
    ...payload,
    nameLower: payload.title.toLowerCase(),
    updatedAt: serverTimestamp(),
  });

  return {
    id,
    ...payload,
    createdAt: Timestamp.now(),
  } as Product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(productsRef, id));
};

export const getProductById = async (
  id: string,
): Promise<Product | null> => {
  try {
    const productRef = doc(productsRef, id);

    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
      return null;
    }

    return {
      id: productSnapshot.id,
      ...productSnapshot.data(),
    } as Product;
  } catch (error) {
    console.error("Error obteniendo producto:", error);
    throw error;
  }
};

export const decreaseStock = async (
  productId: string,
  quantity: number,
): Promise<void> => {
  const productRef = doc(productsRef, productId);

  await updateDoc(productRef, {
    stock: increment(-quantity),
    updatedAt: serverTimestamp(),
  });
};

export const increaseStock = async (
  productId: string,
  quantity: number,
): Promise<void> => {
  const productRef = doc(productsRef, productId);

  await updateDoc(productRef, {
    stock: increment(quantity),
    updatedAt: serverTimestamp(),
  });
};

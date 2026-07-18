import type React from "react";
import type { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ProductsContext,
  type ListProductsParams,
} from "../Products/ProductContext.type";
import { getProductsPage } from "../../services/products/productsService";
import type { Product } from "./product.type";

const DEFAULT_PAGE_SIZE = 10;

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentParams, setCurrentParams] = useState<
    Omit<ListProductsParams, "cursor"> | null
  >(null);

  const loadFirstPage = async (
    params: Omit<ListProductsParams, "cursor"> = {},
    shouldReset = true,
  ) => {
    const normalizedParams: Omit<ListProductsParams, "cursor"> = {
      pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
      ...(params.brandFilter ? { brandFilter: params.brandFilter } : {}),
      ...(params.genderFilter ? { genderFilter: params.genderFilter } : {}),
      ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
    };

    if (shouldReset) {
      setLoading(true);
      setError(null);
      setProducts([]);
      setLastDoc(null);
      setHasMore(false);
    }

    try {
      const result = await getProductsPage({
        ...normalizedParams,
        cursor: null,
      });
      setProducts(result.products);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
      setCurrentParams(normalizedParams);
    } catch {
      setError("No se pudieron cargar los productos.");
    } finally {
      if (shouldReset) {
        setLoading(false);
      }
    }
  };

  const loadMore = async () => {
    if (!currentParams || !hasMore || loadingMore || !lastDoc) {
      return;
    }

    setLoadingMore(true);
    setError(null);

    try {
      const result = await getProductsPage({
        ...currentParams,
        cursor: lastDoc,
      });
      setProducts((prevProducts) => [...prevProducts, ...result.products]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch {
      setError("No se pudieron cargar más productos.");
    } finally {
      setLoadingMore(false);
    }
  };

  const reset = () => {
    setProducts([]);
    setLastDoc(null);
    setHasMore(false);
    setCurrentParams(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadFirstPage());
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        setProducts,
        loading,
        loadingMore,
        error,
        lastDoc,
        hasMore,
        loadFirstPage,
        loadMore,
        reset,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

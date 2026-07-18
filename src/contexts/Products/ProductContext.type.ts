import { createContext } from "react";
import type { Product, ProductBrand, ProductGender } from "./product.type";
import type { DocumentSnapshot } from "firebase/firestore";

export type ListProductsParams = {
  pageSize?: number;
  cursor?: DocumentSnapshot | null;
  brandFilter?: ProductBrand;
  genderFilter?: ProductGender;
  searchTerm?: string;
};

export type ProductsState = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  loading: boolean;
  error: string | null;
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
  loadingMore: boolean;
};

export type ProductsContextType = ProductsState & {
  loadFirstPage: (params?: Omit<ListProductsParams, "cursor">) =>
    Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
};

export const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

import { createContext } from "react";
import type { Product } from "./product.type";

export type ProductContextType = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  loading: boolean;
  error: string | null;
};

export const ProductsContext = createContext<ProductContextType | undefined>(undefined);

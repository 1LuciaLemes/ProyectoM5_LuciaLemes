import { createContext } from "react";
import type { Product } from "./product.type";

export type ProductContextType = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  // loading: boolean;  Agregar estado para comunicar al usuario que estoy cargando datos
};

export const ProductsContext = createContext<ProductContextType | undefined>(undefined);
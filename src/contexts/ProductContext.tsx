import { createContext } from "react";
import type { Product } from "../types/product.type";

export type ProductsContextType = {
    products: Product[],
}

export const ProductsContext = createContext<ProductsContextType | undefined>(undefined);
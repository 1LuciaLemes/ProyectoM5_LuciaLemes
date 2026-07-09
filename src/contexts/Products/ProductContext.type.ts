import { createContext } from "react";
import type { Product } from "./product.type";

export type ProductsContextType = {
    products: Product[];
   // loading: boolean;  Agregar estado para comunicar al usuario que estoy cargando datos
}

export const ProductsContext = createContext<ProductsContextType | undefined>(undefined);
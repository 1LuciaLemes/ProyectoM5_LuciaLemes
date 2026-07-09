import type React from "react";
import { productsMock } from "../services/ProductsService";
import { useState } from "react";
import { ProductsContext } from "../contexts/Products/ProductContext.type";

export function ProductsProvider ( {children} : {children: React.ReactNode}) {
    
    const [products] = useState(productsMock);

    return (
        <ProductsContext.Provider
            value={{
                products
            }}
        >
            {children}
        </ProductsContext.Provider>
    )
}
import type React from "react";
import { getProducts } from "../../services/products/ProductsService";
import { useEffect, useState } from "react";
import { ProductsContext } from "../Products/ProductContext.type";
import type { Product } from "./product.type";

export function ProductsProvider({ children }: { children: React.ReactNode }) {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
        };

        fetchProducts();

    }, []);


    return (
        <ProductsContext.Provider
            value={{
                products
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
}
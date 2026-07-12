import type React from "react";
import { getProducts } from "../../services/products/productsService";
import { useEffect, useState } from "react";
import { ProductsContext } from "../Products/ProductContext.type";
import type { Product } from "./product.type";

export function ProductsProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getProducts();
                setProducts(data);
            } catch {
                setError("No se pudieron cargar los productos.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <ProductsContext.Provider
            value={{
                products,
                loading,
                error,
                setProducts,
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
}

import { ProductList } from "../../components/Products/ProductList";
import { LoadingState } from "../../components/State/Loading.State";
import { ErrorState } from "../../components/State/Error.State";
import { EmptyState } from "../../components/State/Empty.State";
import { getProducts } from "../../services/products/productsService";
import {
  getFemaleProducts,
  getMaleProducts,
  getUnisexProducts,
  getProductsByBrand,
} from "../../services/products/products.filter.service";
import {
  sortByHighestPrice,
  sortByLowestPrice,
} from "../../utils/productsSort";
import { Button } from "../../UI/Button";
import { useProducts } from "../../contexts/Products/useProducts";
import type { Product } from "../../contexts/Products/product.type";
import "./ProductsPage.css";

export function ProductPage() {
  const { products, setProducts, loading, error } = useProducts();

  const applyProductFilter = (filter: (products: Product[]) => Product[]) => {
    const filteredProducts = filter(products);
    setProducts(filteredProducts);
  };

  const applyAsyncFilter = async (filter: () => Promise<Product[]>) => {
    const filteredProducts = await filter();
    setProducts(filteredProducts);
  };

  return (
    <main>
      <h1>ƒragranza</h1>

      <div>
        <Button onClick={() => applyAsyncFilter(getProducts)}>Todos</Button>
        <Button onClick={() => applyAsyncFilter(getFemaleProducts)}>
          Femenino
        </Button>
        <Button onClick={() => applyAsyncFilter(getMaleProducts)}>
          Masculino
        </Button>
        <Button onClick={() => applyAsyncFilter(getUnisexProducts)}>
          Unisex
        </Button>
        <Button onClick={() => applyProductFilter(sortByHighestPrice)}>
          Mayor Precio
        </Button>
        <Button onClick={() => applyProductFilter(sortByLowestPrice)}>
          Menor Precio
        </Button>
        <Button
          onClick={() => applyAsyncFilter(() => getProductsByBrand("Dior"))}
        >
          Dior
        </Button>

        <Button
          onClick={() =>
            applyAsyncFilter(() => getProductsByBrand("Giorgio Armani"))
          }
        >
          Giorgio Armani
        </Button>

        <Button
          onClick={() => applyAsyncFilter(() => getProductsByBrand("Chanel"))}
        >
          Chanel
        </Button>

        <Button
          onClick={() =>
            applyAsyncFilter(() => getProductsByBrand("Yves Saint Laurent"))
          }
        >
          Yves Saint Laurent
        </Button>

        <Button
          onClick={() => applyAsyncFilter(() => getProductsByBrand("Tom Ford"))}
        >
          Tom Ford
        </Button>

        <Button
          onClick={() => applyAsyncFilter(() => getProductsByBrand("Creed"))}
        >
          Creed
        </Button>

        <Button
          onClick={() =>
            applyAsyncFilter(() =>
              getProductsByBrand("Maison Francis Kurkdjian"),
            )
          }
        >
          Maison Francis Kurkdjian
        </Button>
      </div>

      <ErrorState
        id="products"
        error={error}
        fallback={<p>No se pudieron cargar los productos.</p>}
      >
        <LoadingState
          id="products"
          loading={loading}
          fallback={<p>Cargando productos...</p>}
        >
          <EmptyState id="products" isEmpty={products.length === 0}>
            <ProductList />
          </EmptyState>
        </LoadingState>
      </ErrorState>
    </main>
  );
}

import { ProductList } from "../../components/Products/ProductList";
import { getProducts } from "../../services/products/productsService";
import {
  getFemaleProducts,
  getChildProducts,
  getMaleProducts,
  getUnisexProducts
} from "../../services/products/products.filter.service";
import {
  sortByHighestPrice,
  sortByLowestPrice,
} from "../../utils/productsSort";
import { FilterButton } from "../../components/Products/FilterButton";
import { useProducts } from "../../contexts/Products/useProducts";
import type { Product } from "../../contexts/Products/product.type";
import "./ProductsPage.css";

export function ProductPage() {
  const { products, setProducts } = useProducts();

  const applyProductFilter = (
    filter: (products: Product[]) => Product[]
  ) => {
    const filteredProducts = filter(products);

    setProducts(filteredProducts);
  };

  const applyAsyncFilter = async (
  filter: () => Promise<Product[]>
) => {
  const filteredProducts = await filter();

  setProducts(filteredProducts);
};

  return (
    <main>
      <h1>Fragancias</h1>

      <div>
        <FilterButton
          label="Todos"
          onClick={() => applyAsyncFilter(getProducts)}
        />

        <FilterButton
          label="Femenino"
          onClick={() => applyAsyncFilter(getFemaleProducts)}
        />

        <FilterButton
          label="Masculino"
          onClick={() => applyAsyncFilter(getMaleProducts)}
        />

        <FilterButton
          label="Niños"
          onClick={() => applyAsyncFilter(getChildProducts)}
        />

        <FilterButton
          label="Unisex"
          onClick={() => applyAsyncFilter(getUnisexProducts)}
        />

        <FilterButton
          label="Mayor Precio"
          onClick={() => applyProductFilter(sortByHighestPrice)}
        />

        <FilterButton
          label="Menor Precio"
          onClick={() => applyProductFilter(sortByLowestPrice)}
        />
      </div>

      <ProductList />
    </main>
  );
}
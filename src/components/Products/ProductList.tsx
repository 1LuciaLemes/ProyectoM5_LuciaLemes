import { useProducts } from "../../contexts/Products/useProducts";
import { ProductCard } from "../../components/Products/ProductCard";

export function ProductList() {
  const { products } = useProducts();

  return (
    <section className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}

import type { Product } from "../../contexts/Products/product.type";
import { useCart } from "../../contexts/Cart/useCart";
import "./ProductCard.css"
import { Button } from "../../UI/Button";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({product} : ProductCardProps) {
  const { addItem } = useCart();

  return (
    <article className="product-item">
      <img
        className="product-item-img"
        src={product.image}
        alt={product.title}
      />

      <h2 className="product-item-title">{product.title}</h2>

      <p className="product-item-description">{product.description}</p>

      <span className="product-item-price">US${product.price}</span>

      <Button onClick={() => addItem(product)}>
        Añadir al carrito
      </Button>
    </article>
  );
}

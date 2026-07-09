import { productImages } from "../../utils/productImages";
import type { Product } from "../../contexts/Products/product.type";
import "./ProductCard.css"

type ProductCardProps = {
  product: Product;
};

export function ProductCard({product} : ProductCardProps) {
  return (
    <article className="product-item">
      <img
        className="product-item-img"
        src={productImages[product.image]}
        alt={product.title}
      />

      <h2 className="product-item-title">{product.title}</h2>

      <p className="product-item-description">{product.description}</p>

      <span className="product-item-price">US${product.price}</span>
    </article>
  );
}
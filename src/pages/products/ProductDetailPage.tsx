import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "../../contexts/Products/product.type";
import { getProductById } from "../../services/products/productsService";
import { useCart } from "../../contexts/Cart/useCart";
import { useAuth } from "../../contexts/auth/useAuth";
import { Button } from "../../UI/Button";
import { ShoppingBag } from "lucide-react";
import "./ProductDetailPage.css";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    getProductById(id)
      .then((data) => {
        setProduct(data);
        if (!data) setError("Producto no encontrado.");
      })
      .catch(() => setError("No se pudo cargar el producto."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!user) {
      navigate("/signin");
      return;
    }
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <main className="product-detail-page">
        <p className="product-detail-message">Cargando producto...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-detail-page">
        <p className="product-detail-error">{error ?? "Producto no encontrado."}</p>
        <Button onClick={() => navigate("/")}>Volver al catálogo</Button>
      </main>
    );
  }

  return (
    <main className="product-detail-page">
      <Button className="product-detail-back" onClick={() => navigate(-1)}>
        ← Volver
      </Button>

      <article className="product-detail">
        <div className="product-detail-image-wrap">
          <img
            className="product-detail-image"
            src={product.image}
            alt={product.title}
          />
        </div>

        <div className="product-detail-info">
          <span className="product-detail-brand">{product.brand}</span>
          <h1 className="product-detail-title">{product.title}</h1>
          <p className="product-detail-description">{product.description}</p>

          <div className="product-detail-meta">
            <span className="product-detail-gender">
              {product.gender === "male"
                ? "Masculino"
                : product.gender === "female"
                  ? "Femenino"
                  : "Unisex"}
            </span>
            <span className="product-detail-stock">
              Stock: {product.stock > 0 ? product.stock : "Agotado"}
            </span>
          </div>

          <span className="product-detail-price">US${product.price.toFixed(2)}</span>

          <Button
            className="product-detail-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || added}
          >
            <ShoppingBag size={18} />
            {added
              ? "¡Agregado!"
              : product.stock <= 0
                ? "Sin stock"
                : "Añadir al carrito"}
          </Button>
        </div>
      </article>
    </main>
  );
}

import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../contexts/Products/product.type";
import { useCart } from "../../../contexts/Cart/useCart";
import { useAuth } from "../../../contexts/auth/useAuth";
import { useFavorites } from "../../../contexts/Favorites/useFavorites";
import { useToast } from "../../../components/Toast/Toast";
import { Button } from "../../../UI/Button";
import { Heart, ShoppingBag } from "lucide-react";
import "./ProductCard.css";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  function handleAddToCart() {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    addItem(product);
    toast(`${product.title} agregado al carrito`, "success");
  }

  function handleFavoriteClick() {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    toggleFavorite(product);
  }

  function handleCardClick() {
    navigate(`/products/${product.id}`);
  }

  function handleSigninRedirect() {
    setIsAuthModalOpen(false);
    navigate("/signin");
  }

  function handleCancelAuthModal() {
    setIsAuthModalOpen(false);
  }

  const favoriteActive = isFavorite(product.id);

  return (
    <article className="product-item" onClick={handleCardClick} role="link" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(); }}>
      <div className="product-item-image-wrap">
        <img
          className="product-item-img"
          src={product.image}
          alt={product.title}
        />
      </div>
      <div className="product-item-actions" onClick={(e) => e.stopPropagation()}>
        <Button onClick={handleAddToCart} className="product-item-cart-btn button-actions">
          <ShoppingBag size={16} />
          <span>AÑADIR AL CARRITO</span>
        </Button>

        <button
          type="button"
          className={`product-item-heart-btn${favoriteActive ? " is-active" : ""}`}
          aria-label="Favorito"
          aria-pressed={favoriteActive}
          onClick={handleFavoriteClick}
        >
          <Heart size={16} fill={favoriteActive ? "currentColor" : "none"} />
        </button>
      </div>

      <h2 className="product-item-title">{product.title}</h2>

      <span className="product-item-price">US${product.price}</span>

      {isAuthModalOpen &&
        createPortal(
          <div className="product-item-modal-overlay" role="presentation">
            <section
              className="product-item-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`auth-modal-title-${product.id}`}
              aria-describedby={`auth-modal-desc-${product.id}`}
            >
              <h3 id={`auth-modal-title-${product.id}`}>
                Iniciar sesión requerido
              </h3>
              <p id={`auth-modal-desc-${product.id}`}>
                Para agregar productos al carrito, debes iniciar sesión.
              </p>

              <div className="product-item-modal-actions">
                <Button
                  onClick={handleSigninRedirect}
                  className="product-item-modal-primary-btn"
                >
                  Iniciar sesión
                </Button>
                <Button
                  onClick={handleCancelAuthModal}
                  className="product-item-modal-secondary-btn"
                >
                  Cancelar
                </Button>
              </div>
            </section>
          </div>,
          document.body,
        )}
    </article>
  );
}

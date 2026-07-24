import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/Cart/useCart";
import { Button } from "../../UI/Button";
import "./CartPage.css";

export function CartPage() {
  const { items, total, totalItems, removeItem, increaseQuantity, decreaseQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <main className="cart-page">
        <>
          <h1>Mi carrito</h1>
          <section className="cart-header">
            <p>
              Artículos: <strong>{totalItems}</strong>
            </p>
            <p>
              Total: <strong>US${total.toFixed(2)}</strong>
            </p>
          </section>

          {items.length === 0 ? (
            <section className="cart-empty">
              <p>Tu carrito está vacío. Añade productos desde la tienda.</p>
            </section>
          ) : (
            <>
              <ul className="cart-list">
                {items.map((item) => (
                  <li key={item.id} className="cart-item">
                    <img
                      className="cart-item-image"
                      src={item.image}
                      alt={item.title}
                    />

                    <div className="cart-item-info">
                      <h2>{item.title}</h2>

                      <p className="cart-item-description">
                        {item.description}
                      </p>
                    </div>

                    <div className="cart-item-details">
                      <span>
                        Precio:
                        <strong>US${item.price.toFixed(2)}</strong>
                      </span>

                      <span className="cart-quantity-controls">
                        Cantidad:
                        <button
                          className="cart-qty-btn"
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label={`Disminuir cantidad de ${item.title}`}
                        >
                          -
                        </button>
                        <strong>{item.quantity}</strong>
                        <button
                          className="cart-qty-btn"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label={`Aumentar cantidad de ${item.title}`}
                        >
                          +
                        </button>
                      </span>

                      <span>
                        Stock:
                        <strong>{item.stock}</strong>
                      </span>
                    </div>

                    <div className="cart-item-actions">
                      <Button
                        onClick={() => removeItem(item.id)}
                        className="cart-item-remove"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cart-actions">
                <Button
                  onClick={() => navigate("/checkout")}
                  className="cart-checkout-btn"
                >
                  Ir a checkout
                </Button>
                <Button onClick={clearCart} className="cart-clear-btn">
                  Vaciar carrito
                </Button>
              </div>
            </>
          )}
        </>
    </main>
  );
}

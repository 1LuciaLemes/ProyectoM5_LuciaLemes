import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/Cart/useCart";
import { Button } from "../../UI/Button";
import { OrderService } from "../../services/orders/orders.service";
import { useAuth } from "../../contexts/auth/useAuth";
import { LoadingState } from "../../components/State";
import "./CartPage.css";

export function CartPage() {
  const { items, total, totalItems, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateOrderCart = async () => {
    if (!user || items.length === 0) return;

    setLoading(true);

    try {
      await OrderService.createOrderFromCartItems(user.uid, items, total);
      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("Error creando orden:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="cart-page">
      <LoadingState
        id="cart-order-loading"
        loading={loading}
        fallback={<p>Generando orden...</p>}
      >
        <>
          <h1>Mi carrito</h1>
          <Link to="/orders">Ir a mis compras</Link>
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
                      <p>{item.brand}</p>
                      <span>Precio: US${item.price.toFixed(2)}</span>
                      <span>Cantidad: {item.quantity}</span>
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
                <Button onClick={handleCreateOrderCart} className="cart-clear-btn">
                  Comprar
                </Button>
                <Button onClick={clearCart} className="cart-clear-btn">
                  Vaciar carrito
                </Button>
              </div>
            </>
          )}
        </>
      </LoadingState>
    </main>
  );
}

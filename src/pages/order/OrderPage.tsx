import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth/useAuth";
import { OrderService } from "../../services/orders/orders.service";
import type { Order } from "../../types/order.types";
import "./OrderPage.css"

export const OrderPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const formatOrderSummary = (items: Order["items"]) => {
    const distinctProducts = items.length;
    const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

    return `${distinctProducts} ${distinctProducts === 1 ? "producto" : "productos"} ${totalUnits} ${totalUnits === 1 ? "unidad" : "unidades"}`;
  };

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const userOrders = await OrderService.getUserOrders(user.uid);
        setOrders(userOrders);
      } catch (err) {
        console.error("Error cargando ordenes:", err);
        setError("No pudimos cargar tus compras en este momento.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const renderOrders = () => {
    if (!user) {
      return (
        <p className="orders-message">
          Debes iniciar sesión para ver tus compras.
        </p>
      );
    }

    if (orders.length === 0) {
      return (
        <p className="orders-message">No tienes ordenes registradas todavía.</p>
      );
    }

    return (
      <section className="orders-list">
        {orders.map((order) => (
          <article
            className="order-card order-card--clickable"
            key={order.id}
            onClick={() => navigate(`/orders/${order.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/orders/${order.id}`);
              }
            }}
          >
            <div className="order-header">
              <div className="order-title">
                <h3>Orden #{order.id}</h3>

                <span className={`order-status ${order.status}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-total">Total: US${order.total.toFixed(2)}</div>
            </div>

            <div className="order-summary">
              <strong>Resumen:</strong> {formatOrderSummary(order.items)}
            </div>

            <div className="order-products">
              <h3>Productos</h3>

              <div className="order-product-list">
                {order.items.map((item) => (
                  <div className="order-product" key={item.productId}>
                    <div className="order-product-info">
                      <span className="order-product-title">{item.title}</span>

                      <span className="order-product-quantity">
                        Cantidad: {item.quantity}
                      </span>
                    </div>

                    <span className="order-product-price">
                      US${item.priceAtPurchase.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    );
  };

  return (
    <main className="orders-page">
      <header>
        <h1>Mis compras</h1>

        <p>Historial de pedidos realizados.</p>
      </header>

      {loading && <p className="orders-message">Cargando compras...</p>}

      {error && <p className="orders-error">{error}</p>}

      {!loading && renderOrders()}
    </main>
  );
};

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth/useAuth";
import { OrderService } from "../../services/orders/orders.service";
import type { Order } from "../../types/order.types";
import { Button } from "../../UI/Button";
import "./OrderDetailPage.css";

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !user) return;

    setLoading(true);
    setError(null);

    OrderService.getOrderById(orderId)
      .then((data) => {
        if (!data) {
          setError("Orden no encontrada.");
          return;
        }
        if (data.userId !== user.uid && user.role !== "admin") {
          setError("No tenés acceso a esta orden.");
          return;
        }
        setOrder(data);
      })
      .catch(() => setError("No se pudo cargar la orden."))
      .finally(() => setLoading(false));
  }, [orderId, user]);

  if (loading) {
    return (
      <main className="order-detail-page">
        <p className="order-detail-message">Cargando orden...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="order-detail-page">
        <p className="order-detail-error">{error ?? "Orden no encontrada."}</p>
        <Button onClick={() => navigate("/orders")}>Volver a mis compras</Button>
      </main>
    );
  }

  return (
    <main className="order-detail-page">
      <Button className="order-detail-back" onClick={() => navigate(-1)}>
        ← Volver
      </Button>

      <article className="order-detail">
        <header className="order-detail-header">
          <h1>Orden #{order.id}</h1>
          <span className={`order-detail-status ${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </header>

        <div className="order-detail-meta">
          <span>Total: <strong>US${order.total.toFixed(2)}</strong></span>
        </div>

        <section className="order-detail-products">
          <h2>Productos</h2>

          <ul className="order-detail-list">
            {order.items.map((item) => (
              <li key={item.productId} className="order-detail-item">
                <img
                  src={item.image}
                  alt={item.title}
                  className="order-detail-item-img"
                />
                <div className="order-detail-item-info">
                  <span className="order-detail-item-title">{item.title}</span>
                  <span className="order-detail-item-qty">
                    Cantidad: {item.quantity}
                  </span>
                </div>
                <span className="order-detail-item-price">
                  US${(item.priceAtPurchase * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}

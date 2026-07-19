import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth/useAuth";
import { OrderService } from "../../services/orders/orders.service";
import type { Order } from "../../types/order.types";

export const OrderPage = () => {
  const { user } = useAuth();
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
      return <p>Debes iniciar sesión para ver tus compras.</p>;
    }

    if (orders.length === 0) {
      return <p>No tienes ordenes registradas todavía.</p>;
    }

    return (
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <article>
              <h2>Orden {order.id}</h2>
              <p>Estado: {order.status}</p>
              <p>Total: US${order.total.toFixed(2)}</p>
              <p>{formatOrderSummary(order.items)}</p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.title} x{item.quantity} - US${item.priceAtPurchase.toFixed(2)}
                  </li>
                ))}
              </ul>
            </article>
            <hr />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <main>
      <h1>Mis compras</h1>
      {loading ? <p>Cargando compras...</p> : null}
      {error ? <p>{error}</p> : null}
      {!loading ? renderOrders() : null}
    </main>
  );
};



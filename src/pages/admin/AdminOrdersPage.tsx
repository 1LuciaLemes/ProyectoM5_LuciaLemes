import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth/useAuth";
import { OrderService } from "../../services/orders/orders.service";
import type { Order } from "../../types/order.types";

export const AdminOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const formatOrderSummary = (items: Order["items"]) => {
    const distinctProducts = items.length;
    const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

    return `${distinctProducts} ${distinctProducts === 1 ? "producto" : "productos"} ${totalUnits} ${totalUnits === 1 ? "unidad" : "unidades"}`;
  };
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAdmin ) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const Orders = await OrderService.getOrders();
        setOrders(Orders);
      } catch (err) {
        console.error("Error cargando ordenes:", err);
        setError("No pudimos cargar las ordenes en este momento.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAdmin]);

  const renderOrders = () => {
    if (!isAdmin) {
      return <p>Debes iniciar sesión como administrador para ver este panel.</p>;
    }

    if (orders.length === 0) {
      return <p>No hay órdenes registradas.</p>;
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
                    {item.title} x{item.quantity} - US$
                    {item.priceAtPurchase.toFixed(2)}
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
      <Link to="/admin/products">Ver productos</Link>

      {loading ? <p>Cargando compras...</p> : null}
      {error ? <p>{error}</p> : null}
      {!loading ? renderOrders() : null}
    </main>
  );
};



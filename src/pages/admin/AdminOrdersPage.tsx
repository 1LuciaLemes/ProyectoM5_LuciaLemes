import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth/useAuth";
import { OrderService } from "../../services/orders/orders.service";
import type { Order, OrderStatus } from "../../types/order.types";
import "./AdminOrdersPage.css";
import "./AdminProductsPage.css";

export const AdminOrdersPage = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === "admin";


  const formatOrderSummary = (items: Order["items"]) => {
    const distinctProducts = items.length;
    const totalUnits = items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    return `${distinctProducts} ${
      distinctProducts === 1 ? "producto" : "productos"
    } ${totalUnits} ${
      totalUnits === 1 ? "unidad" : "unidades"
    }`;
  };


  const loadOrders = async () => {
    try {
      const data = await OrderService.getOrders();
      setOrders(data);

    } catch (err) {
      console.error("Error cargando ordenes:", err);
      setError("No pudimos cargar las ordenes en este momento.");

    } finally {
      setLoading(false);
    }
  };


 useEffect(() => {
  const loadOrders = async () => {
    try {
      const data = await OrderService.getOrders();
      setOrders(data);

    } catch (err) {
      console.error("Error cargando ordenes:", err);
      setError("No pudimos cargar las ordenes en este momento.");

    } finally {
      setLoading(false);
    }
  };


  if (isAdmin) {
    loadOrders();
  }

}, [isAdmin]);

  const handleChangeStatus = async (
    id: string,
    status: OrderStatus,
  ) => {

    try {
      await OrderService.updateOrderStatus(id, status);

      await loadOrders();

    } catch (err) {
      console.error("Error actualizando estado:", err);
      setError("No pudimos actualizar el estado de la orden.");
    }

  };


  return (
    <main className="admin-orders-page">

        <div>
          <h1 className="admin-page-title">Órdenes</h1>
        </div>


      {loading && (
        <p className="admin-orders-message">
          Cargando las órdenes...
        </p>
      )}


      {error && (
        <p className="admin-orders-error">
          {error}
        </p>
      )}


      {!loading && isAdmin && (

        <section className="admin-orders-list">

          {orders.map((order) => (

            <article
              className="order-card"
              key={order.id}
            >

              <div className="order-header">

                <div className="order-title">

                  <h3>
                    Orden #{order.id}
                  </h3>


                  <select
                    className={`order-status ${order.status.toLowerCase()}`}
                    value={order.status}
                    onChange={(e) =>
                      handleChangeStatus(
                        order.id,
                        e.target.value as OrderStatus,
                      )
                    }
                  >

                    <option value="pendiente">
                      Pendiente
                    </option>

                    <option value="procesando">
                      Procesando
                    </option>

                    <option value="completada">
                      Completada
                    </option>

                    <option value="cancelada">
                      Cancelada
                    </option>

                  </select>

                </div>


                <div className="order-total">
                  Valor total de compra:
                  {" "}
                  <strong>
                    US${order.total.toFixed(2)}
                  </strong>
                </div>

              </div>


              <div className="order-summary">
                <strong>
                  Resumen:
                </strong>
                {" "}
                {formatOrderSummary(order.items)}
              </div>


              <div className="order-products">

                <h3>
                  Productos
                </h3>


                <div className="order-product-list">

                  {order.items.map((item) => (

                    <div
                      className="order-product"
                      key={item.productId}
                    >

                      <div className="order-product-info">

                        <span className="order-product-title">
                          {item.title}
                        </span>


                        <span className="order-product-quantity">
                          Cantidad: {item.quantity}
                        </span>

                      </div>


                      <span className="order-product-price">
                        Valor del producto:
                        {" "}
                        US${item.priceAtPurchase.toFixed(2)}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </article>

          ))}

        </section>

      )}

    </main>
  );
};
import { useCart } from "../../contexts/Cart/useCart";
import { Button } from "../../UI/Button";
import "./CartPage.css";

export function CartPage() {
  const { items, total, totalItems, removeItem, clearCart } = useCart();

  return (
    <main className="cart-page">
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
            <Button onClick={clearCart} className="cart-clear-btn">
              Vaciar carrito
            </Button>
          </div>
        </>
      )}
    </main>
  );
}

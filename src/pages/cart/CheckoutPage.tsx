import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/Cart/useCart";
import { useAuth } from "../../contexts/auth/useAuth";
import { useToast } from "../../components/Toast/Toast";
import { OrderService } from "../../services/orders/orders.service";
import { Button } from "../../UI/Button";
import "./CheckoutPage.css";

export function CheckoutPage() {
  const { items, total, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user || items.length === 0) return;

    if (!cardName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
      setError("Por favor, completá todos los campos de pago.");
      return;
    }

    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.length < 16) {
      setError("El número de tarjeta debe tener 16 dígitos.");
      return;
    }

    if (cardCvv.length < 3) {
      setError("El CVV debe tener al menos 3 dígitos.");
      return;
    }

    setProcessing(true);

    try {
      await OrderService.createOrderFromCartItems(user.uid, items, total);
      clearCart();
      toast("¡Pago procesado exitosamente!", "success");
      navigate("/orders");
    } catch {
      setError("Hubo un error al procesar el pago. Intentá nuevamente.");
      toast("Error al procesar el pago", "error");
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <p className="checkout-empty">No hay productos en el carrito.</p>
        <Button onClick={() => navigate("/")}>Ver productos</Button>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <section className="checkout-summary">
          <h2>Resumen de compra</h2>

          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item.id} className="checkout-item">
                <img src={item.image} alt={item.title} className="checkout-item-img" />
                <div className="checkout-item-info">
                  <span className="checkout-item-title">{item.title}</span>
                  <span className="checkout-item-qty">x{item.quantity}</span>
                </div>
                <span className="checkout-item-price">
                  US${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="checkout-totals">
            <span>Artículos: {totalItems}</span>
            <span className="checkout-total">Total: US${total.toFixed(2)}</span>
          </div>
        </section>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Datos de pago (simulado)</h2>

          <label className="checkout-field">
            Nombre en la tarjeta
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Como aparece en la tarjeta"
              required
            />
          </label>

          <label className="checkout-field">
            Número de tarjeta
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              required
            />
          </label>

          <div className="checkout-field-row">
            <label className="checkout-field">
              Vencimiento
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                placeholder="MM/AA"
                maxLength={5}
                required
              />
            </label>

            <label className="checkout-field">
              CVV
              <input
                type="text"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                maxLength={4}
                required
              />
            </label>
          </div>

          {error && <p className="checkout-error">{error}</p>}

          <Button type="submit" disabled={processing} className="checkout-submit">
            {processing ? "Procesando pago..." : `Pagar US$${total.toFixed(2)}`}
          </Button>

          <p className="checkout-note">
            Esto es una simulación. No se procesa ningún pago real.
          </p>
        </form>
      </div>
    </main>
  );
}

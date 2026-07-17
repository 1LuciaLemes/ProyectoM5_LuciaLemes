import { Link } from "react-router-dom";

export const AdminOrdersPage = () => {
  return (
    <main>
      <header>
        <h1>Órdenes</h1>
        <p>Desde aquí puedes ver las órdenes recibidas.</p>
      </header>

      <section>
        <Link to="/admin/products">Ver productos</Link>
      </section>
    </main>
  );
};

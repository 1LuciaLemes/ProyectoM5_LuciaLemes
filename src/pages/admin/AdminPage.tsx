import { Link, Outlet } from "react-router-dom";

export const AdminPage = () => {
  return (
    <main>
      <header>
        <nav>
          <Link to="/admin/products">Productos</Link>
          <br />
          <Link to="/admin/orders">Órdenes</Link>
        </nav>
      </header>

      <section>
        <Outlet />
      </section>
    </main>
  );
};
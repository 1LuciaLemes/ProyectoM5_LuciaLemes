import { NavLink, Outlet } from "react-router-dom";

export const AdminPage = () => {
  return (
    <main>
      <header>
        <nav className="admin-nav">
          <NavLink to="/admin/products">Productos</NavLink>

          <NavLink to="/admin/orders">Órdenes</NavLink>
        </nav>
      </header>

      <section>
        <Outlet />
      </section>
    </main>
  );
};

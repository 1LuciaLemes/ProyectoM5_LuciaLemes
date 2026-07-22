import { Link } from "react-router-dom";
import { ThemeButton } from "./changeTheme";
import { useAuth } from "../contexts/auth/useAuth";
import { useCart } from "@/contexts/Cart/useCart";
import { ShoppingBag, Package, User, LogOut } from "lucide-react";
import { BrandTitle } from "./Brand/BrandTitle";

export const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  return (
    <header className="site-header">
      <div className="site-header__brand">
        <BrandTitle />
      </div>
      <nav className="site-header__nav">
        {/* <Link to="/">Inicio</Link> */}
        <Link to="/">Catálogo</Link>
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
      </nav>

      <div className="site-header__actions">
        {user && (
          <>
            <Link to="/cart" className="site-header__cart">
              <ShoppingBag size={20} />

              {totalItems > 0 && (
                <span className="site-header__cart-badge">{totalItems}</span>
              )}
            </Link>

            <Link to="/orders">
              <Package size={20} />
            </Link>
          </>
        )}

        {!user ? (
          <Link to="/signin">
            <User size={20} />
          </Link>
        ) : (
          <button type="button" onClick={logout}>
            <LogOut size={20} />
          </button>
        )}

        <ThemeButton />
      </div>
    </header>
  );
};

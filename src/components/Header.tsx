import { Link } from "react-router-dom"
import { ThemeButton } from "./changeTheme"
import { useAuth } from "../contexts/auth/useAuth";

export const Header = () => {
        const { user, logout } = useAuth();

        return (
                <header className="site-header">
                        <Link to="/">Inicio</Link>
                        <Link to="/products">Productos</Link>

                        {!user && (
                            <>
                                <Link to="/signin">Iniciar sesión</Link>
                                <Link to="/signup">Registarse</Link>
                            </>
                        )}

                        {user && (
                            <>
                                <Link to="/cart">Carrito</Link>
                                <Link to="/orders">Mis compras</Link>
                                <button type="button" onClick={logout}>
                                  Cerrar sesión
                                </button>
                            </>
                        )}

                        {user?.role === "admin" && (
                            <Link to="/admin">Admin</Link>
                        )}

                        <ThemeButton />
                </header>
        )
}
import { Link } from "react-router-dom"
import { ThemeButton } from "./changeTheme"

export const Header = () => {
    return (
        <header className="site-header">
            <Link to="/">Inicio</Link>
            <Link to="/products">Productos</Link>
            <Link to="/signin">Iniciar sesión</Link>
            <Link to="/signup">Registarse</Link>


            <Link to="/cart">Carrito</Link>
            <Link to="/orders">Mis compras</Link>
            
            <Link to="/admin">Admin</Link>
            
            <ThemeButton />
        </header>
    )
}
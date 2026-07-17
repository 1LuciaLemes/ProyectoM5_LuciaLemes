import { Route, Routes } from "react-router-dom";
import { CartPage } from "../pages/cart/CartPage";
import { ProductPage } from "../pages/products/ProductsPage";
import {HomePage} from "../pages/home/HomePage";
import {OrderPage} from "../pages/order/OrderPage";
import { SigninPage } from "../pages/signin/SigninPage";
import { SignupPage } from "../pages/signup/SignupPage";
import { AdminPage } from "../pages/admin/AdminPage";
import { ProtectedRoute } from "./ProtectedRoute";


export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/products" element={<ProductPage />}></Route>
            <Route path="/signin" element={<SigninPage />}></Route>
            <Route path="/signup" element={<SignupPage />}></Route>

            <Route element={<ProtectedRoute /> }>
                <Route path="/cart" element={<CartPage />}></Route>
                <Route path="/orders" element={<OrderPage />}></Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole={"admin"} /> }>
                <Route path="/admin" element={<AdminPage />}></Route>
                <Route path="/admin/products" element={<AdminPage />}></Route>
                <Route path="/admin/orders" element={<AdminPage />}></Route>
            </Route>
        </Routes>
    )
}
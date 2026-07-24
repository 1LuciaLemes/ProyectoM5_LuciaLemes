import { Route, Routes } from "react-router-dom";
import { CartPage } from "../pages/cart/CartPage";
import { CheckoutPage } from "../pages/cart/CheckoutPage";
import { ProductPage } from "../pages/products/ProductsPage";
import { ProductDetailPage } from "../pages/products/ProductDetailPage";
import {OrderPage} from "../pages/order/OrderPage";
import { OrderDetailPage } from "../pages/order/OrderDetailPage";
import { SigninPage } from "../pages/signin/SigninPage";
import { SignupPage } from "../pages/signup/SignupPage";
import { AdminPage } from "../pages/admin/AdminPage";
import { AdminProductsPage } from "../pages/admin/AdminProductsPage";
import { AdminFormPage } from "../pages/admin/AdminFormPage";
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage";
import { ProtectedRoute } from "./ProtectedRoute";


export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ProductPage />}></Route>
            <Route path="/products/:id" element={<ProductDetailPage />}></Route>
            <Route path="/signin" element={<SigninPage />}></Route>
            <Route path="/signup" element={<SignupPage />}></Route>

            <Route element={<ProtectedRoute /> }>
                <Route path="/cart" element={<CartPage />}></Route>
                <Route path="/checkout" element={<CheckoutPage />}></Route>
                <Route path="/orders" element={<OrderPage />}></Route>
                <Route path="/orders/:orderId" element={<OrderDetailPage />}></Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole={"admin"} /> }>
                <Route path="/admin" element={<AdminPage />}>
                    <Route index element={<AdminProductsPage />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="products/form" element={<AdminFormPage />} />
                    <Route path="products/form/:productId" element={<AdminFormPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                </Route>
            </Route>
        </Routes>
    )
}
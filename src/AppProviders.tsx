import type { ReactNode } from "react";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { ProductsProvider } from "./contexts/Products/ProductsProvider.tsx";
import { CartProvider } from "./contexts/Cart/CartProvider.tsx";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import { FavoritesProvider } from "./contexts/Favorites/FavoritesProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <StrictMode>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <FavoritesProvider>{children}</FavoritesProvider>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </StrictMode>
    </BrowserRouter>
  );
}

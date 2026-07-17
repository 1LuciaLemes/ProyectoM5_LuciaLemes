import type { ReactNode } from "react";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { ProductsProvider } from "./contexts/Products/ProductsProvider.tsx";
import { CartProvider } from "./contexts/Cart/CartProvider.tsx";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <StrictMode>
        <ProductsProvider>
          <CartProvider>{children}</CartProvider>
        </ProductsProvider>
      </StrictMode>
    </BrowserRouter>
  );
}

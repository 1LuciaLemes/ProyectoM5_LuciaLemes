import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { vi } from "vitest";
import { AuthContext, type AuthContextType } from "@/contexts/auth/AuthContext.type";
import { ProductsContext, type ProductsContextType } from "@/contexts/Products/ProductContext.type";
import { CartProvider } from "@/contexts/Cart/CartProvider";
import { customUserFixture, productFixture } from "./fixtures";

type RenderWithProviderOptions = {
  route?: string;
  user?: AuthContextType["user"];
  authLoading?: boolean;
  products?: ProductsContextType["products"];
  children?: ReactNode;
};

const defaultAuthValue: AuthContextType = {
  user: customUserFixture,
  loading: false,
  signin: vi.fn(),
  signup: vi.fn(),
  signinWhitGoogle: vi.fn(),
  logout: vi.fn(),
};

const defaultProductsValue: ProductsContextType = {
  products: [productFixture],
  setProducts: vi.fn(),
  loading: false,
  error: null,
  lastDoc: null,
  hasMore: false,
  loadingMore: false,
  loadFirstPage: vi.fn(),
  loadMore: vi.fn(),
  reset: vi.fn(),
};

export function renderWithProvider(
  ui: ReactElement,
  {
    route = "/",
    user = defaultAuthValue.user,
    authLoading = defaultAuthValue.loading,
    products = defaultProductsValue.products,
  }: RenderWithProviderOptions = {},
) {
  const authValue: AuthContextType = {
    ...defaultAuthValue,
    user,
    loading: authLoading,
  };

  const productsValue: ProductsContextType = {
    ...defaultProductsValue,
    products,
  };

  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider value={authValue}>
        <ProductsContext.Provider value={productsValue}>
          <CartProvider>{ui}</CartProvider>
        </ProductsContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

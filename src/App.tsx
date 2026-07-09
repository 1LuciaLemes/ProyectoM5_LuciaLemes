import type {JSX} from "react";
import { ThemeButton } from "./components/changeTheme";
import { ProductPage } from "./pages/products/ProductsPage";

function App(): JSX.Element {
  return (
    <div style={{padding: "2rm"}}>
      <ThemeButton />
      <ProductPage />
    </div>
  )
}

export default App
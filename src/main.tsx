import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./styles/global.css"
import "./styles/theme.css"
import App from './App.tsx'
import { CartProvider } from './contexts/Cart/CartProvider.tsx'
import { ProductsProvider } from './providers/ProductsProvider.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProductsProvider>
    <CartProvider>
    <App />
    </CartProvider>
    </ProductsProvider>
  </StrictMode>,
)

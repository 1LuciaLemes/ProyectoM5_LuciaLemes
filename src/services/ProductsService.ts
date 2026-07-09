// mocks de los productos

import type { Product } from "../contexts/Products/product.type";

export const productsMock: Product[] = [
  {
    id: "p1",
    title: "Zapatillas Runner Pro",
    description: "Zapatillas deportivas livianas ideales para running y entrenamiento.",
    price: 89990,
    imageUrl: "/images/runner-pro.jpg",
    stock: 15,
  },
  {
    id: "p2",
    title: "Mochila Ergonómica",
    description: "Mochila cómoda con soporte ergonómico para uso diario.",
    price: 45990,
    imageUrl: "/images/mochila-ergonomica.jpg",
    stock: 8,
  },
  {
    id: "p3",
    title: "Auriculares ANC",
    description: "Auriculares inalámbricos con cancelación activa de ruido.",
    price: 129990,
    imageUrl: "/images/auriculares-anc.jpg",
    stock: 12,
  },
];
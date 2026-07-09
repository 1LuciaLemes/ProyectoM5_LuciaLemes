// mocks de los productos

import type { Product } from "../contexts/Products/product.type";

export const productsMock: Product[] =  [
  {
    id: "1",
    title: "Ambre Nuit",
    description: "Perfume unisex - notas ambarinas y florales",
    image: "perfume1",
    price: 125,
    stock: 7,
  },
  {
    id: "2",
    title: "Rouge Trafalgar",
    description: "Perfume unisex - notas chipre y afrutadas",
    image: "perfume2",
    price: 135,
    stock: 12,
  },
  {
    id: "3",
    title: "Purple Oud",
    description: "Perfume unisex - notas especiadas y de oud",
    image: "perfume3",
    price: 129,
    stock: 10,
  },
];
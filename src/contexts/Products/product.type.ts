export type ProductImage =
  | "perfume1"
  | "perfume2"
  | "perfume3";

export type Product = {
  id: string;
  title: string;
  image: ProductImage;
  description: string;
  price: number;
  stock: number;
};
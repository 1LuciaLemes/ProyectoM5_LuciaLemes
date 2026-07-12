import type { Timestamp } from "firebase/firestore";

export type ProductImage =
  | "perfume1"
  | "perfume2"
  | "perfume3";

export type ProductGender =
  | "male"
  | "female"
  | "unisex";

export type ProductCategory =
  | "adult"
  | "child";

export type Product = {
  id: string;
  title: string;
  image: ProductImage;
  description: string;
  price: number;
  stock: number;

  gender: ProductGender;
  category: ProductCategory;

  createdAt: Timestamp;
};
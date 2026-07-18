import type { Timestamp } from "firebase/firestore";

export type ProductGender = "female" | "male" | "unisex";

export type ProductBrand =
  | "Dior"
  | "Giorgio Armani"
  | "Chanel"
  | "Yves Saint Laurent"
  | "Tom Ford"
  | "Creed"
  | "Maison Francis Kurkdjian";

export type Product = {
  id: string;

  title: string;
  brand: ProductBrand;

  image: string;
  description: string;

  price: number;
  stock: number;

  gender: ProductGender;

  createdAt: Timestamp;
};

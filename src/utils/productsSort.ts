import type { Product } from "../contexts/Products/product.type";

export const sortByLowestPrice = (
  products: Product[]
): Product[] => {
  return [...products].sort(
    (a, b) => a.price - b.price
  );
};

export const sortByHighestPrice = (
  products: Product[]
): Product[] => {
  return [...products].sort(
    (a, b) => b.price - a.price
  );
};

export const getNewestProduct = (
  products: Product[]
): Product | undefined => {
  return [...products]
    .sort(
      (a, b) =>
        b.createdAt.toMillis() - a.createdAt.toMillis()
    )[0];
};
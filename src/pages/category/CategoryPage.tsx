import type { ProductGender } from "../../contexts/Products/product.type";
import { ProductPage } from "../products/ProductsPage";

type CategoryPageProps = {
  gender: ProductGender;
};

export function CategoryPage({ gender }: CategoryPageProps) {
  return <ProductPage initialGender={gender} />;
}

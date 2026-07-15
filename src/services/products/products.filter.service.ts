import { db } from "../firebase/firebase";
import type { Product, ProductBrand } from "../../contexts/Products/product.type";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const productsRef = collection(db, "products");

export const getMaleProducts = async (): Promise<Product[]> => {
  try {
    const productRef = query(
      productsRef,
      where("gender", "in", ["male", "unisex"]),
    );

    const maleProdSnapshot = await getDocs(productRef);

    return maleProdSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Product,
    );
  } catch (error) {
    console.error("Error obteniendo perfumes masculinos:", error);
    throw error;
  }
};

export const getFemaleProducts = async (): Promise<Product[]> => {
  try {
    const productRef = query(
      productsRef,
      where("gender", "in", ["female", "unisex"]),
    );

    const femaleProdSnapshot = await getDocs(productRef);

    return femaleProdSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Product,
    );
  } catch (error) {
    console.error("Error obteniendo perfumes femeninos:", error);
    throw error;
  }
};

export const getUnisexProducts = async (): Promise<Product[]> => {
  try {
    const productRef = query(
      productsRef,
      where("gender", "==", "unisex")
    );

    const unisexProdSnapshot = await getDocs(productRef);

    return unisexProdSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Product,
    );
  } catch (error) {
    console.error("Error obteniendo perfumes unisex:", error);
    throw error;
  }
};

export const getProductsByBrand = async (
  brand: ProductBrand
): Promise<Product[]> => {
  try {
    const productRef = query(
      productsRef,
      where("brand", "==", brand)
    );

    const snapshot = await getDocs(productRef);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Product
    );
  } catch (error) {
    console.error(`Error obteniendo perfumes de ${brand}:`, error);
    throw error;
  }
};
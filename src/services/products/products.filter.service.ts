import { db } from "../firebase/firebase";
import type { Product } from "../../contexts/Products/product.type";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const productsRef = collection(db, "perfumes");
export const getMaleProducts = async (): Promise<Product[]> => {
  try {
    const productRef = query(
      productsRef,
      where("category", "==", "adult"),
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
      where("category", "==", "adult"),
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

export const getChildProducts = async (): Promise<Product[]> => {
  try {
    const productRef = query(productsRef, where("category", "==", "child"));

    const childProdSnapshot = await getDocs(productRef);

    return childProdSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Product,
    );
  } catch (error) {
    console.error("Error obteniendo perfumes infantiles:", error);
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

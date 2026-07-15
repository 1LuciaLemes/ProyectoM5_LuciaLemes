import { db } from "../firebase/firebase";
import type { Product } from "../../contexts/Products/product.type";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const productsRef = collection(db, "products");

export const getProducts = async (): Promise<Product[]> => {

  try {
    const querySnapshot = await getDocs(productsRef);

    return querySnapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Product)
    );
    

  } catch(error) {
    console.error("Error obteniendo productos:", error);
    throw error;
  }
};

export const getProductById = async (
  id: string
): Promise<Product | null> => {

  try {
    const productRef = doc(db, "perfumes", id);

    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
      return null;
    }

    return {
      id: productSnapshot.id,
      ...productSnapshot.data(),
    } as Product;

  } catch (error) {
    console.error("Error obteniendo producto:", error);
    throw error;
  }
};

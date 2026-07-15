import "dotenv/config";
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};
console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type ProductGender = "female" | "male" | "unisex";

type CatalogProduct = {
  title: string;
  brand: string;
  gender: ProductGender;
};

const CATALOG: CatalogProduct[] = [
  { title: "J'adore", brand: "Dior", gender: "female" },
  { title: "Miss Dior", brand: "Dior", gender: "female" },
  { title: "Poison Girl", brand: "Dior", gender: "female" },
  { title: "Joy", brand: "Dior", gender: "female" },
  { title: "Hypnotic Poison", brand: "Dior", gender: "female" },

  { title: "Coco Mademoiselle", brand: "Chanel", gender: "female" },
  { title: "Chance Eau Tendre", brand: "Chanel", gender: "female" },
  { title: "Chance", brand: "Chanel", gender: "female" },
  { title: "Gabrielle", brand: "Chanel", gender: "female" },
  { title: "N°5", brand: "Chanel", gender: "female" },

  { title: "Sí", brand: "Giorgio Armani", gender: "female" },
  { title: "My Way", brand: "Giorgio Armani", gender: "female" },
  { title: "Acqua di Gioia", brand: "Giorgio Armani", gender: "female" },
  { title: "Code Femme", brand: "Giorgio Armani", gender: "female" },
  { title: "Emporio Armani She", brand: "Giorgio Armani", gender: "female" },

  { title: "Libre", brand: "Yves Saint Laurent", gender: "female" },
  { title: "Black Opium", brand: "Yves Saint Laurent", gender: "female" },
  { title: "Mon Paris", brand: "Yves Saint Laurent", gender: "female" },
  { title: "Manifesto", brand: "Yves Saint Laurent", gender: "female" },
  { title: "Cinema", brand: "Yves Saint Laurent", gender: "female" },

  { title: "Rose Prick", brand: "Tom Ford", gender: "female" },
  { title: "Velvet Orchid", brand: "Tom Ford", gender: "female" },
  { title: "White Patchouli", brand: "Tom Ford", gender: "female" },
  { title: "Soleil Neige", brand: "Tom Ford", gender: "female" },
  { title: "Jasmin Rouge", brand: "Tom Ford", gender: "female" },

  { title: "Sauvage", brand: "Dior", gender: "male" },
  { title: "Dior Homme", brand: "Dior", gender: "male" },
  { title: "Fahrenheit", brand: "Dior", gender: "male" },
  { title: "Higher", brand: "Dior", gender: "male" },
  { title: "Eau Sauvage", brand: "Dior", gender: "male" },

  { title: "Acqua di Giò", brand: "Giorgio Armani", gender: "male" },
  { title: "Stronger With You", brand: "Giorgio Armani", gender: "male" },
  { title: "Armani Code", brand: "Giorgio Armani", gender: "male" },
  { title: "Emporio Armani He", brand: "Giorgio Armani", gender: "male" },
  { title: "Attitude", brand: "Giorgio Armani", gender: "male" },

  { title: "Y", brand: "Yves Saint Laurent", gender: "male" },
  { title: "La Nuit de L'Homme", brand: "Yves Saint Laurent", gender: "male" },
  { title: "L'Homme", brand: "Yves Saint Laurent", gender: "male" },
  { title: "Kouros", brand: "Yves Saint Laurent", gender: "male" },
  { title: "MYSLF", brand: "Yves Saint Laurent", gender: "male" },

  { title: "Noir Extreme", brand: "Tom Ford", gender: "male" },
  { title: "Oud Wood", brand: "Tom Ford", gender: "male" },
  { title: "Grey Vetiver", brand: "Tom Ford", gender: "male" },
  { title: "Beau de Jour", brand: "Tom Ford", gender: "male" },
  { title: "Ombré Leather", brand: "Tom Ford", gender: "male" },

  { title: "Aventus", brand: "Creed", gender: "male" },
  { title: "Green Irish Tweed", brand: "Creed", gender: "male" },
  { title: "Viking", brand: "Creed", gender: "male" },
  { title: "Silver Mountain Water", brand: "Creed", gender: "male" },
  { title: "Original Vetiver", brand: "Creed", gender: "male" },

  { title: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian", gender: "unisex" },
  { title: "Gentle Fluidity Gold", brand: "Maison Francis Kurkdjian", gender: "unisex" },
  { title: "Gentle Fluidity Silver", brand: "Maison Francis Kurkdjian", gender: "unisex" },
  { title: "Grand Soir", brand: "Maison Francis Kurkdjian", gender: "unisex" },
  { title: "Amyris", brand: "Maison Francis Kurkdjian", gender: "unisex" },

  { title: "Tobacco Vanille", brand: "Tom Ford", gender: "unisex" },
  { title: "Soleil Blanc", brand: "Tom Ford", gender: "unisex" },
  { title: "Neroli Portofino", brand: "Tom Ford", gender: "unisex" },

  { title: "Millesime Imperial", brand: "Creed", gender: "unisex" },
  { title: "Virgin Island Water", brand: "Creed", gender: "unisex" },
];

function randomPrice(): number {
  return Number((80 + Math.random() * 270).toFixed(2));
}

function randomStock(): number {
  return Math.floor(Math.random() * 46) + 5;
}

function createDescription(title: string, brand: string): string {
  return `${title} de ${brand} combina notas exquisitas que evolucionan armoniosamente desde la salida hasta el fondo. Una fragancia exclusiva diseñada para destacar con elegancia y dejar una impresión inolvidable en cualquier ocasión.`;
}

async function seed() {
  const products = CATALOG.map((product) => ({
    title: product.title,
    brand: product.brand,
    nameLower: product.title.toLowerCase(),
    image: `https://placehold.co/300x300?text=${encodeURIComponent(product.title)}`,
    description: createDescription(product.title, product.brand),
    price: randomPrice(),
    stock: randomStock(),
    gender: product.gender,
  }));

  console.log(`🌱 Sembrando ${products.length} productos...\n`);

  for (const product of products) {
    const ref = doc(collection(db, "products"));

    await setDoc(ref, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`✔ ${product.brand} ${product.title}`);
  }

  console.log(`\n✅ ${products.length} productos creados correctamente.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error al ejecutar el seeder:");
  console.error(error);
  process.exit(1);
});
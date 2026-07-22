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
  image: string;
};

const CATALOG: CatalogProduct[] = [
  { title: "J'adore", brand: "Dior", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/dior/jadore.jpg" },
  { title: "Miss Dior", brand: "Dior", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/dior/missdior.jpg" },
  { title: "Poison Girl", brand: "Dior", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/dior/pisongirl.jpg" },
  { title: "Joy", brand: "Dior", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/dior/joybydior.jpg" },
  { title: "Hypnotic Poison", brand: "Dior", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/dior/hypnoticPoison.jpg" },

  { title: "Coco Mademoiselle", brand: "Chanel", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/chanel/CocoMademoiselleEaudeParfum.jpg" },
  { title: "Chance Eau Tendre", brand: "Chanel", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/chanel/ChanceEauTendreEaudeParfum.jpg" },
  { title: "Chance", brand: "Chanel", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/chanel/ChanceEaudeParfum.jpg" },
  { title: "Gabrielle", brand: "Chanel", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/chanel/GabrielleChanelEaudeParfum.jpg" },
  { title: "N°5", brand: "Chanel", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/chanel/N%C2%B05EaudeParfum.jpg" },

  { title: "Sí", brand: "Giorgio Armani", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/giorgioarmani/si.jpg" },
  { title: "My Way", brand: "Giorgio Armani", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/giorgioarmani/myway.jpg" },
  { title: "Acqua di Gioia", brand: "Giorgio Armani", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/giorgioarmani/aqua.jpg" },
  { title: "Code Femme", brand: "Giorgio Armani", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/giorgioarmani/ArmaniCodeFemmeEaudeParfum.jpg" },
  { title: "Emporio Armani She", brand: "Giorgio Armani", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/giorgioarmani/EmporioArmaniSheEaudeParfum.jpg" },

  { title: "Libre", brand: "Yves Saint Laurent", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/ysl/LibreEaudeParfum.jpg" },
  { title: "Black Opium", brand: "Yves Saint Laurent", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/ysl/BlackOpiumEaudeParfum.jpg" },
  { title: "Mon Paris", brand: "Yves Saint Laurent", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/ysl/MonParisEaudeParfum.jpg" },
  { title: "Manifesto", brand: "Yves Saint Laurent", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/ysl/ManifestoEaudeParfum.jpg" },
  { title: "Cinema", brand: "Yves Saint Laurent", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/ysl/CinemaEaudeParfum.jpg" },

  { title: "Rose Prick", brand: "Tom Ford", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/tomford/RosePrickEaudeParfum.jpg" },
  { title: "Velvet Orchid", brand: "Tom Ford", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/tomford/VelvetOrchidEaudeParfum.jpg" },
  { title: "White Patchouli", brand: "Tom Ford", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/tomford/WhitePatchouliEaudeParfum.jpg" },
  { title: "Soleil Neige", brand: "Tom Ford", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/tomford/SoleilBlancEaudeParfum.jpg" },
  { title: "Jasmin Rouge", brand: "Tom Ford", gender: "female", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/tomford/JasminRougeEaudeParfum.jpg" },

  { title: "Sauvage", brand: "Dior", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/dior/SauvageEaudeToilette.jpg" },
  { title: "Dior Homme", brand: "Dior", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/dior/DiorHommeEaudeToilette.jpg" },
  { title: "Fahrenheit", brand: "Dior", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/dior/FahrenheitEaudeToilette.jpg" },
  { title: "Higher", brand: "Dior", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/dior/higherenergy.jpg" },
  { title: "Eau Sauvage", brand: "Dior", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/dior/EauSauvageEaudeToilette.jpg" },

  { title: "Acqua di Giò", brand: "Giorgio Armani", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/giorgioarmani/acqua.jpg" },
  { title: "Stronger With You", brand: "Giorgio Armani", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/giorgioarmani/StrongerWithYouEaudeToilette.jpg" },
  { title: "Armani Code", brand: "Giorgio Armani", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/giorgioarmani/ArmaniCodeEaude+oilette.jpg" },
  { title: "Emporio Armani He", brand: "Giorgio Armani", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/giorgioarmani/EmporioArmaniHeEaudeToilette.jpg" },
  { title: "Attitude", brand: "Giorgio Armani", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/giorgioarmani/EmporioArmaniAttitudeEaudeToilette.jpg" },

  { title: "Y", brand: "Yves Saint Laurent", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/ysl/YEaudeToilette.jpg" },
  { title: "La Nuit de L'Homme", brand: "Yves Saint Laurent", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/ysl/LaNuitdeL'HommeEaudeToilette.jpg" },
  { title: "L'Homme", brand: "Yves Saint Laurent", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/ysl/L'HommeEaudeToilette.jpg" },
  { title: "Kouros", brand: "Yves Saint Laurent", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/ysl/KourosEaudeToilette.jpg" },
  { title: "MYSLF", brand: "Yves Saint Laurent", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/ysl/MYSLFEaudeParfum.jpg" },

  { title: "Noir Extreme", brand: "Tom Ford", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/tomford/NoirExtremeEaudeParfum.jpg" },
  { title: "Oud Wood", brand: "Tom Ford", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/tomford/OudWoodEaudeParfum.jpg" },
  { title: "Grey Vetiver", brand: "Tom Ford", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/tomford/GreyVetiverEaudeParfum.jpg" },
  { title: "Beau de Jour", brand: "Tom Ford", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/ysl/YEaudeToilette.jpg" },
  { title: "Ombré Leather", brand: "Tom Ford", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/tomford/Ombr%C3%A9LeatherEaudeParfum.jpg" },

  { title: "Aventus", brand: "Creed", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/creed/AventusEaudeParfum.jpg" },
  { title: "Green Irish Tweed", brand: "Creed", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/creed/GreenIrishTweedEaudeParfum.jpg" },
  { title: "Viking", brand: "Creed", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/creed/VikingEaudeParfum.jpg" },
  { title: "Silver Mountain Water", brand: "Creed", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/creed/SilverMountainWaterEaudeParfum.jpg" },
  { title: "Original Vetiver", brand: "Creed", gender: "male", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/creed/Original+Vetiver+Eau+de+Parfum.jpg" },

  { title: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian", gender: "unisex", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/maisonFK/Baccarat+Rouge+540+Eau+de+Parfum.jpg" },
  { title: "Gentle Fluidity Gold", brand: "Maison Francis Kurkdjian", gender: "unisex", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/maisonFK/Gentle+Fluidity+Gold+Eau+de+Parfum.jpg" },
  { title: "Gentle Fluidity Silver", brand: "Maison Francis Kurkdjian", gender: "unisex", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/maisonFK/Gentle+Fluidity+Silver+Eau+de+Parfum.jpg" },
  { title: "Grand Soir", brand: "Maison Francis Kurkdjian", gender: "unisex", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/maisonFK/Grand+Soir+Eau+de+Parfum.jpg" },
  { title: "Amyris", brand: "Maison Francis Kurkdjian", gender: "unisex", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/maisonFK/Amyris+Eau+de+Parfum.jpg" },

  { title: "Tobacco Vanille", brand: "Tom Ford", gender: "unisex", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/tomford/TobaccoVanilleEaudeParfum.jpg" },
  { title: "Soleil Blanc", brand: "Tom Ford", gender: "unisex", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/tomford/SoleilBlancEaudeParfum.jpg" },
  { title: "Neroli Portofino", brand: "Tom Ford", gender: "unisex", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/tomford/NeroliPortofinoEaudeParfum.jpg" },

  { title: "Millesime Imperial", brand: "Creed", gender: "unisex", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/creed/Mill%C3%A9sime+Imp%C3%A9rial+Eau+de+Parfum.jpg" },
  { title: "Virgin Island Water", brand: "Creed", gender: "unisex", image: "https://henry-ecommerce-admin-panel.s3.us-east-2.amazonaws.com/bucket/creed/Virgin+Island+Water+Eau+de+Parfum.jpg" },
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
    image: product.image,
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
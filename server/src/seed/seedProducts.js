import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/products.js";

dotenv.config();

const createImage = (slug, url) => ({
  image: url,
  images: [
    {
      url,
      public_id: `seed/${slug}`,
    },
  ],
});

const products = [
  {
    name: "EchoX Aura Pro",
    description: "Auriculares inalambricos con cancelacion activa y audio espacial.",
    price: 129999,
    category: "auriculares",
    stock: 18,
    ...createImage(
      "echox-aura-pro",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
    ),
  },
  {
    name: "NovaCore K75",
    description: "Teclado mecanico compacto con switches tactiles e iluminacion RGB.",
    price: 89999,
    category: "teclados",
    stock: 24,
    ...createImage(
      "novacore-k75",
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=80"
    ),
  },
  {
    name: "TitanSync Blade 15",
    description: "Notebook premium para productividad, gaming y creacion de contenido.",
    price: 2199999,
    category: "notebooks",
    stock: 7,
    ...createImage(
      "titansync-blade-15",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"
    ),
  },
  {
    name: "PulseDrive M9",
    description: "Mouse gamer ultraliviano con sensor de alta precision y baja latencia.",
    price: 74999,
    category: "mouse gamer",
    stock: 31,
    ...createImage(
      "pulsedrive-m9",
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80"
    ),
  },
  {
    name: "NovaCore Vision 27Q",
    description: "Monitor QHD de 27 pulgadas con alta tasa de refresco y panel IPS.",
    price: 469999,
    category: "monitores",
    stock: 12,
    ...createImage(
      "novacore-vision-27q",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80"
    ),
  },
  {
    name: "EchoX Studio Dock",
    description: "Speakers de escritorio con sonido claro, graves firmes y diseno minimalista.",
    price: 159999,
    category: "speakers",
    stock: 16,
    ...createImage(
      "echox-studio-dock",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80"
    ),
  },
  {
    name: "TitanSync Cam 4K",
    description: "Webcam 4K con enfoque automatico y rendimiento profesional en baja luz.",
    price: 119999,
    category: "webcams",
    stock: 20,
    ...createImage(
      "titansync-cam-4k",
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1200&q=80"
    ),
  },
  {
    name: "PulseDrive Strata TKL",
    description: "Teclado tenkeyless de aluminio con respuesta rapida para setup competitivo.",
    price: 109999,
    category: "teclados",
    stock: 15,
    ...createImage(
      "pulsedrive-strata-tkl",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80"
    ),
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    const seedNames = products.map((product) => product.name);
    const existingProducts = await Product.find({ name: { $in: seedNames } }).select("name");
    const existingNames = new Set(existingProducts.map((product) => product.name));
    const productsToInsert = products.filter((product) => !existingNames.has(product.name));

    if (productsToInsert.length === 0) {
      console.log("No seed products inserted. All seed products already exist.");
      return;
    }

    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`Inserted ${insertedProducts.length} seed products.`);
  } catch (error) {
    console.error("Error seeding products:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts();

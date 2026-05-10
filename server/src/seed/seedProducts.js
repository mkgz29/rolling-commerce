import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/products.js";

dotenv.config();

const createImage = (slug, url) => ({
  image: url,
  imageUrl: url,
  publicId: `seed/build-pc/${slug}`,
  images: [
    {
      url,
      public_id: `seed/build-pc/${slug}`,
      publicId: `seed/build-pc/${slug}`,
    },
  ],
});

const products = [
  {
    name: "AMD Ryzen 5 7600X",
    description: "Procesador AM5 de 6 nucleos ideal para gaming y productividad.",
    price: 310000,
    category: "processors",
    brand: "AMD",
    stock: 10,
    specs: ["6 cores", "12 threads", "AM5", "5.3GHz boost"],
    isActive: true,
    ...createImage("amd-ryzen-5-7600x", "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "AMD Ryzen 7 7800X3D",
    description: "Procesador gamer con cache 3D V-Cache y alto rendimiento.",
    price: 520000,
    category: "processors",
    brand: "AMD",
    stock: 7,
    specs: ["8 cores", "16 threads", "AM5", "3D V-Cache"],
    isActive: true,
    ...createImage("amd-ryzen-7-7800x3d", "https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "Intel Core i7-14700K",
    description: "CPU Intel de alto rendimiento para gaming, streaming y trabajo pesado.",
    price: 545000,
    category: "processors",
    brand: "Intel",
    stock: 8,
    specs: ["20 cores", "28 threads", "LGA1700", "5.6GHz boost"],
    isActive: true,
    ...createImage("intel-core-i7-14700k", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "NVIDIA GeForce RTX 4060 Ti",
    description: "Placa de video eficiente para gaming 1080p y 1440p.",
    price: 610000,
    category: "graphics-cards",
    brand: "NVIDIA",
    stock: 9,
    specs: ["8GB GDDR6", "DLSS 3", "Ray tracing"],
    isActive: true,
    ...createImage("nvidia-rtx-4060-ti", "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "NVIDIA GeForce RTX 4070 Super",
    description: "GPU para gaming 1440p con excelente rendimiento por watt.",
    price: 970000,
    category: "graphics-cards",
    brand: "NVIDIA",
    stock: 5,
    specs: ["12GB GDDR6X", "DLSS 3", "PCIe 4.0"],
    isActive: true,
    ...createImage("nvidia-rtx-4070-super", "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "AMD Radeon RX 7800 XT",
    description: "Placa de video AMD con 16GB para juegos en alta resolucion.",
    price: 890000,
    category: "graphics-cards",
    brand: "AMD",
    stock: 6,
    specs: ["16GB GDDR6", "RDNA 3", "PCIe 4.0"],
    isActive: true,
    ...createImage("amd-radeon-rx-7800-xt", "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "Corsair Vengeance 16GB DDR5",
    description: "Kit de memoria DDR5 estable para plataformas modernas.",
    price: 95000,
    category: "ram",
    brand: "Corsair",
    stock: 20,
    specs: ["16GB", "DDR5", "5600MHz"],
    isActive: true,
    ...createImage("corsair-vengeance-16gb-ddr5", "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "Kingston Fury Beast 32GB DDR5",
    description: "Memoria RAM de alto rendimiento para gaming y multitarea.",
    price: 165000,
    category: "ram",
    brand: "Kingston",
    stock: 14,
    specs: ["32GB", "DDR5", "6000MHz"],
    isActive: true,
    ...createImage("kingston-fury-beast-32gb-ddr5", "https://images.unsplash.com/photo-1600348712270-5af9e3590f66?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "G.Skill Trident Z5 RGB 32GB",
    description: "Kit DDR5 RGB de baja latencia para builds premium.",
    price: 210000,
    category: "ram",
    brand: "G.Skill",
    stock: 9,
    specs: ["32GB", "DDR5", "RGB", "6400MHz"],
    isActive: true,
    ...createImage("gskill-trident-z5-rgb-32gb", "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "Samsung 980 Pro 1TB NVMe",
    description: "SSD NVMe Gen4 rapido para sistema operativo y juegos.",
    price: 145000,
    category: "storage",
    brand: "Samsung",
    stock: 18,
    specs: ["1TB", "NVMe", "PCIe 4.0"],
    isActive: true,
    ...createImage("samsung-980-pro-1tb", "https://images.unsplash.com/photo-1597138804456-e7dca7f59d45?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "WD Black SN850X 2TB",
    description: "Unidad NVMe de alto rendimiento para gaming y creacion.",
    price: 260000,
    category: "storage",
    brand: "Western Digital",
    stock: 11,
    specs: ["2TB", "NVMe", "PCIe 4.0"],
    isActive: true,
    ...createImage("wd-black-sn850x-2tb", "https://images.unsplash.com/photo-1601737487795-dab272f52420?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "Seagate Barracuda 4TB HDD",
    description: "Disco rigido de gran capacidad para almacenamiento masivo.",
    price: 135000,
    category: "storage",
    brand: "Seagate",
    stock: 15,
    specs: ["4TB", "HDD", "5400RPM"],
    isActive: true,
    ...createImage("seagate-barracuda-4tb", "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "Corsair RM750e 750W Gold",
    description: "Fuente modular certificada 80 Plus Gold para equipos exigentes.",
    price: 175000,
    category: "power-supplies",
    brand: "Corsair",
    stock: 12,
    specs: ["750W", "80 Plus Gold", "Modular"],
    isActive: true,
    ...createImage("corsair-rm750e", "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "Cooler Master MWE 650 Bronze",
    description: "Fuente confiable para configuraciones gamer de gama media.",
    price: 98000,
    category: "power-supplies",
    brand: "Cooler Master",
    stock: 16,
    specs: ["650W", "80 Plus Bronze"],
    isActive: true,
    ...createImage("cooler-master-mwe-650", "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "Seasonic Focus GX-850",
    description: "Fuente premium full modular para GPUs de alto consumo.",
    price: 235000,
    category: "power-supplies",
    brand: "Seasonic",
    stock: 8,
    specs: ["850W", "80 Plus Gold", "Full modular"],
    isActive: true,
    ...createImage("seasonic-focus-gx-850", "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "NZXT H5 Flow",
    description: "Gabinete compacto con gran flujo de aire y diseno limpio.",
    price: 155000,
    category: "cases",
    brand: "NZXT",
    stock: 10,
    specs: ["ATX", "Mesh front", "Tempered glass"],
    isActive: true,
    ...createImage("nzxt-h5-flow", "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "Corsair 4000D Airflow",
    description: "Gabinete ATX con excelente ventilacion y gestion de cables.",
    price: 170000,
    category: "cases",
    brand: "Corsair",
    stock: 13,
    specs: ["ATX", "Airflow", "Tempered glass"],
    isActive: true,
    ...createImage("corsair-4000d-airflow", "https://images.unsplash.com/photo-1591238372338-22d30c883a86?auto=format&fit=crop&w=1200&q=80"),
  },
  {
    name: "Lian Li Lancool 216",
    description: "Gabinete espacioso orientado a alto flujo de aire.",
    price: 190000,
    category: "cases",
    brand: "Lian Li",
    stock: 7,
    specs: ["ATX", "High airflow", "Dual 160mm fans"],
    isActive: true,
    ...createImage("lian-li-lancool-216", "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80"),
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
    console.log(`Inserted ${insertedProducts.length} build PC seed products.`);
  } catch (error) {
    console.error("Error seeding products:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts();

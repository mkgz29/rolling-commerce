import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import webhookRoutes from "./src/routes/webhookRoutes.js";
import { errorHandler, notFound } from "./src/middlewares/errorMiddlewares.js";
import { configureCloudinary, getMissingCloudinaryEnvVars } from "./src/config/cloudinary.js";
import { hasMercadoPagoAccessToken } from "./src/config/mercadoPago.js";

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

const missingEnvVars = [
  ...requiredEnvVars.filter((envVar) => !process.env[envVar]?.trim()),
  ...getMissingCloudinaryEnvVars(),
];

if (!hasMercadoPagoAccessToken()) {
  missingEnvVars.push("MERCADOPAGO_ACCESS_TOKEN");
}

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variable${missingEnvVars.length > 1 ? "s" : ""}: ${missingEnvVars.join(", ")}.`
  );
  process.exit(1);
}

configureCloudinary();

const app = express();

const splitOrigins = (value = "") =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://rolling-commerce.vercel.app",
  "https://rolling-commerce-git-main-mkgz29s-projects.vercel.app",
  ...splitOrigins(process.env.CLIENT_URL),
  ...splitOrigins(process.env.FRONTEND_URL),
];

const corsOptions = {
  origin(origin, callback) {
    const isLocalDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");

    if (!origin || isLocalDevOrigin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/webhooks", webhookRoutes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log("Allowed CORS origins:", allowedOrigins);
  });
});
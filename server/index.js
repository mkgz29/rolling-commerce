import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import { errorHandler, notFound } from "./src/middlewares/errorMiddlewares.js";

dotenv.config();

const app = express();

// middlewares
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// ruta base
app.get("/", (req, res) => {
  res.send("API is running");
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// --- RUTA TEMPORAL DE PRUEBA NODEMAILER ---
app.get("/test-email", async (req, res) => {
  try {
    await sendEmail(process.env.EMAIL_ADDRESS, "Prueba desde Node", "¡Funciona perfecto!");
    res.send("¡Correo de prueba enviado! Revisá tu bandeja en Mailtrap.");
  } catch (error) {
    res.status(500).send("Hubo un error al enviar el correo.");
  }
});
// ------------------------------------------

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});

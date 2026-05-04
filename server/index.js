import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import productRoutes from "./src/routes/productRoutes.js";
import { sendEmail } from "./src/utils/nodemailer.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// conexión base de datos
connectDB();

app.get("/", (req, res) => {
  res.send("API is running");
});

// routes
app.use("/api/products", productRoutes);

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

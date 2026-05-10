import express from "express";
import { createMercadoPagoPreferenceController } from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/mercadopago/preference", protect, createMercadoPagoPreferenceController);

export default router;

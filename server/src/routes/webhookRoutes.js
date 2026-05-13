import { Router } from "express";
import { mercadoPagoWebhook } from "../controllers/webhookController.js";

const router = Router();

router.post("/webhook", mercadoPagoWebhook);

export default router;
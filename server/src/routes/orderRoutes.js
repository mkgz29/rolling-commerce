// Todas las rutas requieren token JWT — header: Authorization: Bearer <token>
// protect  → verifica token y carga req.user
// admin    → verifica que req.user.role === "admin", siempre después de protect/
// Endpoints:
// POST   /api/orders               → crea orden desde el carrito
// GET    /api/orders               → lista órdenes del usuario logueado
// GET    /api/orders/:id           → detalle de una orden (usuario propio o admin)
// PUT    /api/orders/:id/status    → actualiza estado (solo admin)

import express from "express";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getAdminOrders,
  getAdminOrderById,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { getAdminStatsController } from "../controllers/adminController.js";
import { protect, admin } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/admin/stats", protect, admin, getAdminStatsController);

router.get("/admin", protect, admin, getAdminOrders);

router.get("/admin/:id", protect, admin, getAdminOrderById);

router.patch("/admin/:id/cancel", protect, admin, cancelOrder);

router.patch("/admin/:id/status", protect, admin, updateOrderStatus);

router.delete("/admin/:id", protect, admin, deleteOrder);

router.post("/", protect, createOrder);

router.get("/", protect, getOrders);

router.get("/:id", protect, getOrderById);

router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;

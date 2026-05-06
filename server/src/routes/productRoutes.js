import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.js";
import { protect, admin } from "../middlewares/authMiddlewares.js";

const router = express.Router();

//Rutas públicas
router.get("/", getProducts);
router.get("/:id", getProductById);

//Rutas privadas - requieren autenticación y rol admin
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;

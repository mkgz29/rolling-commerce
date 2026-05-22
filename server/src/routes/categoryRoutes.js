import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryControllers.js";
import { protect, admin } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Rutas públicas
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Rutas privadas - requieren autenticación y rol admin
router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
router.patch("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

export default router;

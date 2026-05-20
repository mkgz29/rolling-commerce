import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  permanentDeleteProduct,
} from "../controllers/productsController.js";
import { protect, admin } from "../middlewares/authMiddlewares.js";
import {
  productImageUpload,
  handleMulterError,
} from "../middlewares/upload.middleware.js";

const router = express.Router();

//Rutas públicas
router.get("/", getProducts);
router.get("/:id", getProductById);

//Rutas privadas - requieren autenticación y rol admin
router.post(
  "/",
  protect,
  admin,
  productImageUpload.single("image"),
  handleMulterError,
  createProduct
);
router.put(
  "/:id",
  protect,
  admin,
  productImageUpload.single("image"),
  handleMulterError,
  updateProduct
);
router.patch(
  "/:id",
  protect,
  admin,
  productImageUpload.single("image"),
  handleMulterError,
  updateProduct
);
router.delete("/:id", protect, admin, deleteProduct);
router.delete("/:id/permanent", protect, admin, permanentDeleteProduct);

export default router;

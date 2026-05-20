import express from "express";
import { getAdminStatsController } from "../controllers/adminController.js";
import { admin, protect } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/stats", protect, admin, getAdminStatsController);

export default router;

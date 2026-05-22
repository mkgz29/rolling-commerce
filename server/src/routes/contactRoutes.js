import express from "express";
import {
  createContactMessageController,
  deleteContactMessageController,
  getAdminContactMessagesController,
  updateContactMessageStatusController,
} from "../controllers/contactController.js";
import { admin, protect } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/", createContactMessageController);

router.get("/admin", protect, admin, getAdminContactMessagesController);
router.patch("/admin/:id/status", protect, admin, updateContactMessageStatusController);
router.delete("/admin/:id", protect, admin, deleteContactMessageController);

export default router;

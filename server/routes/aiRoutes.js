import express from "express";
import { describeImage } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/describe", protect, requireRole("admin"), describeImage);

export default router;

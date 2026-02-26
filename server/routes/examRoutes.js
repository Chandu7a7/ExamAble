import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { createExam, listExams, getExam, updateExam, deleteExam } from "../controllers/examController.js";

const router = express.Router();

router.get("/", protect, listExams);
router.get("/:id", protect, getExam);
router.post("/", protect, requireRole("admin"), createExam);
router.put("/:id", protect, requireRole("admin"), updateExam);
router.delete("/:id", protect, requireRole("admin"), deleteExam);

export default router;


import express from "express";
import {
    getQuestions,
    createQuestion,
    deleteQuestion,
    updateQuestion
} from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router
    .route("/")
    .get(protect, requireRole("admin"), getQuestions)
    .post(protect, requireRole("admin"), createQuestion);

router
    .route("/:id")
    .delete(protect, requireRole("admin"), deleteQuestion)
    .put(protect, requireRole("admin"), updateQuestion);

export default router;

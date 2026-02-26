import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { submitResult, getMyResults, getResultById } from "../controllers/resultController.js";

const router = express.Router();

router.post("/", protect, submitResult);
router.get("/me", protect, getMyResults);
router.get("/:id", protect, getResultById);

export default router;


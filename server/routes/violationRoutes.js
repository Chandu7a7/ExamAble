import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/violations
 * Logs a proctoring violation (tab switch, blur, copy attempt, etc.)
 * Silently accepted — stored for future analytics.
 */
router.post("/", protect, async (req, res) => {
    try {
        const { studentId, examId, type, timestamp } = req.body;
        // TODO: Persist to a Violation model when needed.
        // For now, just acknowledge so the client doesn't get a 404.
        console.log(`[VIOLATION] exam=${examId} student=${studentId} type=${type} at=${timestamp}`);
        res.status(200).json({ message: "Violation logged." });
    } catch (err) {
        res.status(500).json({ message: "Failed to log violation." });
    }
});

export default router;

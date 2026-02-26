import { generateImageDescription } from "../utils/aiUtils.js";

export const describeImage = async (req, res, next) => {
    try {
        const { imagePath } = req.body;
        if (!imagePath) {
            return res.status(400).json({ message: "Image path is required" });
        }

        const description = await generateImageDescription(imagePath);

        if (!description) {
            return res.status(500).json({ message: "AI Description failed" });
        }

        res.json({ description });
    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ message: "AI Description failed", error: err.message });
    }
};

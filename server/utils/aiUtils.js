import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateImageDescription = async (imagePath) => {
    try {
        if (!imagePath) return null;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Build path: imagePath is expected to be like "/uploads/xxx.png"
        // Since we are in /utils/, we need to go up two levels to reach the root uploads folder
        const cleanPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
        const fullPath = path.join(__dirname, "..", cleanPath);

        if (!fs.existsSync(fullPath)) {
            console.error("Image file not found for description:", fullPath);
            return "Image reference provided but file not found on server.";
        }

        const imageBuffer = fs.readFileSync(fullPath);
        const base64Image = imageBuffer.toString("base64");

        const prompt = `
You are an accessibility assistant for a visually impaired student taking an exam.
Your task is ONLY to describe the image clearly, objectively, and neutrally for someone who cannot see it.

STRICT RULES:
- Do NOT answer the question.
- Do NOT solve any problem (e.g., if it's a clock, do not say what time it is).
- Do NOT calculate values.
- Do NOT give hints or suggest the correct option.
- Only describe the visual elements present (shapes, positions, labels, text, colors).

Keep the explanation factual and neutral.
        `;

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg"
                }
            },
            prompt
        ]);

        return result.response.text();
    } catch (err) {
        console.error("Auto-generation Gemini Error:", err);
        return "Visual reference provided (description generation failed).";
    }
};

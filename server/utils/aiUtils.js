import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateImageDescription = async (imagePath) => {
    try {
        if (!imagePath) return null;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let base64Image;
        let mimeType = "image/jpeg";

        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
            // ☁️ Cloudinary URL — fetch via HTTP
            const response = await fetch(imagePath);
            if (!response.ok) {
                console.error("Failed to fetch image from URL:", imagePath);
                return "Image reference provided but could not be fetched.";
            }
            const contentType = response.headers.get("content-type") || "image/jpeg";
            mimeType = contentType.split(";")[0];
            const arrayBuffer = await response.arrayBuffer();
            base64Image = Buffer.from(arrayBuffer).toString("base64");
        } else {
            // Legacy: local file path (fallback, should not hit in production)
            const { default: fs } = await import("fs");
            const { default: path } = await import("path");
            const { fileURLToPath } = await import("url");
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const cleanPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
            const fullPath = path.join(__dirname, "..", cleanPath);
            if (!fs.existsSync(fullPath)) {
                return "Image reference provided but file not found on server.";
            }
            base64Image = fs.readFileSync(fullPath).toString("base64");
        }

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
                    mimeType
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

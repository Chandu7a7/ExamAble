import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import violationRoutes from "./routes/violationRoutes.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { protect } from "./middleware/authMiddleware.js";
import { requireRole } from "./middleware/roleMiddleware.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,          // Set this to your Vercel URL in Render dashboard
  "http://localhost:5173",
  "http://localhost:4173",
  "https://examable.onrender.com",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin (Postman, curl) or whitelisted origins or any vercel.app subdomain
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(express.json());

// ☁️ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer — memory storage (no disk, buffer goes straight to Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|jpg|png|webp)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Images only! (jpeg, jpg, png, webp)"));
    }
  },
});

// Helper: upload buffer to Cloudinary and return secure URL
const uploadToCloudinary = (buffer, mimetype) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "vi-exam-portal", resource_type: "image" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });

app.post("/api/upload", protect, requireRole("admin"), upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  try {
    const url = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    res.json({ message: "Image uploaded successfully", url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: "Image upload to Cloudinary failed" });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "VI-Exam Portal API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/violations", violationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


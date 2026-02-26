import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["MCQ", "Short Answer"], default: "MCQ" },
    text: { type: String, required: true },
    options: [{ type: String }],
    correctOption: { type: Number }, // index of options (0-based), optional for Short Answer
    keywords: { type: String }, // for Short Answer
    marks: { type: Number, default: 1 },
    image: { type: String }, // NEW: Image URL for question
    accessibilityText: { type: String }, // NEW: Alt text for voice assistant
  },
  { _id: false }
);

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true }, // in minutes
    questions: [questionSchema],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalMarks: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;


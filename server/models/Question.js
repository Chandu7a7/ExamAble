import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        subject: { type: String, required: true },
        difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
        options: [{ type: String, required: true }],
        correctOption: { type: Number, required: true }, // Index of options (0-indexed)
        image: { type: String }, // URL of image
        accessibilityText: { type: String, required: function () { return !!this.image; } },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    },
    { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;

import mongoose from "mongoose";

const accessibilityPreferencesSchema = new mongoose.Schema(
  {
    highContrast: { type: Boolean, default: false },
    largeFont: { type: Boolean, default: false },
    voiceAssist: { type: Boolean, default: true },
    screenReaderOptimized: { type: Boolean, default: true }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },
    accessibilityPreferences: {
      type: accessibilityPreferencesSchema,
      default: () => ({})
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;


import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    console.info("💡 Tip: Check if your IP is whitelisted in MongoDB Atlas (Network Access -> Add IP -> 0.0.0.0/0)");
    process.exit(1);
  }
};

export default connectDB;


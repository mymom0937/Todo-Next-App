import mongoose from "mongoose";
export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URL;
  if (!MONGODB_URI) {
    // console.error("❌ MONGODB_URI is not loaded from .env.local");
    throw new Error("MONGODB_URI is not defined in environment variables");
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    // console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    throw error;
  }
};
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Trims whitespace around the name
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Ensures email is stored in lowercase
      trim: true, // Trims whitespace around the email
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt
);

export default mongoose.models.User || mongoose.model("User", userSchema);

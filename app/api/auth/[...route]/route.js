import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/config/db";
import UserModel from "@/app/lib/models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request, { params }) {
  // console.log("🔍 MONGODB_URI in API route:", process.env.MONGODB_URL);
  // console.log("🔍 JWT_SECRET in API route:", process.env.JWT_SECRET);
  try {
    await connectDB();
    const { email, password, name } = await request.json(); // Extract name here

    if (!email || !password || (params.route[0] === "register" && !name)) {
      return NextResponse.json(
        { success: false, message: "Email, password, and name are required." },
        { status: 400 }
      );
    }

    if (params.route[0] === "register") {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "A user with this email already exists." },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          {
            success: false,
            message: "Password must be at least 6 characters long.",
          },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({ email, password: hashedPassword, name });
      await newUser.save();
      // console.log("Saved user:", newUser); // Log to check if name exists

      const token = jwt.sign(
        { id: newUser._id, name: newUser.name },
        process.env.JWT_SECRET,
        {
          // Optionally include name in the token
          expiresIn: "1hr",
        }
      );
      return NextResponse.json(
        { success: true, message: "User registered successfully!", token },
        { status: 201 }
      );
    }

    if (params.route[0] === "login") {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { success: false, message: "No account found with this email." },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: "Incorrect password." },
          { status: 400 }
        );
      }

      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {
          // Include name in the token
          expiresIn: "1d",
        }
      );
      return NextResponse.json(
        { success: true, message: "Logged in successfully!", token },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid request route." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected server error occurred.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

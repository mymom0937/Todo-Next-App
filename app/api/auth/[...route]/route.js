import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/config/db";
import UserModel from "@/app/lib/models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Define Zod schemas
const baseSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, {
      message: "Password must contain at least one letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

const loginSchema = baseSchema;

const registerSchema = baseSchema.extend({
  name: z.string().min(1, { message: "Name is required." }),
});

export async function POST(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const route = params.route[0];

    if (route === "register") {
      // Validate registration data
      const result = registerSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.error.errors[0].message },
          { status: 400 }
        );
      }
      const { email, password, name } = result.data;

      // Check for existing user
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "A user with this email already exists." },
          { status: 400 }
        );
      }

      // Hash password and save new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({ email, password: hashedPassword, name });
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, name: newUser.name },
        process.env.JWT_SECRET,
        { expiresIn: "1hr" }
      );
      return NextResponse.json(
        { success: true, message: "User registered successfully!", token },
        { status: 201 }
      );
    } else if (route === "login") {
      // Validate login data
      const result = loginSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.error.errors[0].message },
          { status: 400 }
        );
      }
      const { email, password } = result.data;

      // Find user and verify password
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

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return NextResponse.json(
        { success: true, message: "Logged in successfully!", token },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid request route." },
        { status: 400 }
      );
    }
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
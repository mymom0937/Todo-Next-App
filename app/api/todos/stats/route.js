import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/config/db";
import TodoModel from "@/app/lib/models/TodoModel";
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token
 * @param {Request} request - Incoming request
 * @returns {Object} - Decoded user object or error response
 */
async function verifyToken(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("No token provided");

    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: " + error.message },
      { status: 401 }
    );
  }
}

/**
 * GET: Fetch todo statistics for the authenticated user
 */
export async function GET(request) {
  try {
    await connectDB(); // Ensure database connection
    const user = await verifyToken(request);
    if (user instanceof NextResponse) return user; // If error, return response

    // Get total counts for different categories
    const totalTodos = await TodoModel.countDocuments({ userId: user.id });
    const completedTodos = await TodoModel.countDocuments({ userId: user.id, isCompleted: true });
    const pendingTodos = await TodoModel.countDocuments({ userId: user.id, isCompleted: false });
    const highPriorityTodos = await TodoModel.countDocuments({ userId: user.id, priority: "high" });
    
    return NextResponse.json({ 
      success: true,
      stats: {
        total: totalTodos,
        completed: completedTodos,
        pending: pendingTodos,
        highPriority: highPriorityTodos
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching todo stats:", error);
    return NextResponse.json(
      { success: false, message: "Server error: " + error.message },
      { status: 500 }
    );
  }
} 
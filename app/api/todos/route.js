import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/config/db";
import TodoModel from "@/app/lib/models/TodoModel";
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token
 * @param {Request} request - Incoming request
 * @returns {Object} - Decoded user object
 */
async function verifyToken(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("No token provided");

    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized: " + error.message },
      { status: 401 }
    );
  }
}

// Fetch all todos for the authenticated user
export async function GET(request) {
  try {
    await connectDB(); // Ensure database connection
    const user = await verifyToken(request);
    if (user instanceof NextResponse) return user; // If error, return response

    const todos = await TodoModel.find({ userId: user.id });
    return NextResponse.json({ todos }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

// Create new todos for the authenticated user
export async function POST(request) {
  try {
    await connectDB(); // Ensure database connection
    const user = await verifyToken(request);
    if (user instanceof NextResponse) return user;

    const todos = await request.json();

    // If the input is not an array, make it an array with a single item
    const todosArray = Array.isArray(todos) ? todos : [todos];

    // Validate each todo item
    for (const todo of todosArray) {
      const { title, description } = todo;
      if (!title || !description) {
        return NextResponse.json(
          { message: "Each todo must have a title and description." },
          { status: 400 }
        );
      }
    }

    // Create todos in bulk
    const createdTodos = await TodoModel.insertMany(
      todosArray.map((todo) => ({
        userId: user.id,
        title: todo.title,
        description: todo.description,
        isCompleted: false,
      }))
    );

    return NextResponse.json(
      { message: "Todos created successfully!", todos: createdTodos },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

// Mark a todo as completed/update
export async function PUT(request) {
  try {
    await connectDB();
    const user = await verifyToken(request);
    if (user instanceof NextResponse) return user;

    const mongoId = request.nextUrl.searchParams.get("mongoId");
    if (!mongoId)
      return NextResponse.json({ message: "No ID provided" }, { status: 400 });

    const updatedTodo = await TodoModel.findOneAndUpdate(
      { _id: mongoId, userId: user.id },
      { $set: { isCompleted: true } },
      { new: true }
    );

    if (!updatedTodo)
      return NextResponse.json(
        { message: "Todo not found or unauthorized" },
        { status: 404 }
      );

    return NextResponse.json({
      message: "Todo marked as completed successfully!",
      todo: updatedTodo,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove a todo
export async function DELETE(request) {
  try {
    await connectDB();
    const user = await verifyToken(request);
    if (user instanceof NextResponse) return user;

    const mongoId = request.nextUrl.searchParams.get("mongoId");
    if (!mongoId)
      return NextResponse.json({ message: "No ID provided" }, { status: 400 });

    const deletedTodo = await TodoModel.findOneAndDelete({
      _id: mongoId,
      userId: user.id,
    });

    if (!deletedTodo)
      return NextResponse.json(
        { message: "Todo not found or unauthorized" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Todo deleted successfully!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

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
 * GET: Fetch all todos or filter by query parameters
 */
export async function GET(request) {
  try {
    await connectDB(); // Ensure database connection
    const user = await verifyToken(request);
    if (user instanceof NextResponse) return user; // If error, return response

    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "completed", "pending", "all"
    const priority = searchParams.get("priority"); // "high", "medium", "low"
    const sort = searchParams.get("sort") || "-createdAt"; // Default: newest first
    const limit = parseInt(searchParams.get("limit") || "50"); // Default: 50 todos per page
    const page = parseInt(searchParams.get("page") || "1"); // Default: first page
    
    // Build query
    let query = { userId: user.id };
    
    // Filter by status
    if (status) {
      if (status === "completed") query.isCompleted = true;
      else if (status === "pending") query.isCompleted = false;
    }
    
    // Filter by priority
    if (priority) {
      query.priority = priority;
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    const todos = await TodoModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    // Get total count for pagination info
    const total = await TodoModel.countDocuments(query);
    
    return NextResponse.json({ 
      success: true,
      todos, 
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { success: false, message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST: Create new todos for the authenticated user
 */
export async function POST(request) {
  try {
    await connectDB(); // Ensure database connection
    const user = await verifyToken(request);
    if (user instanceof NextResponse) return user;

    const todoData = await request.json();

    // If the input is not an array, make it an array with a single item
    const todosArray = Array.isArray(todoData) ? todoData : [todoData];

    // Validate each todo item
    for (const todo of todosArray) {
      const { title, description } = todo;
      if (!title || !description) {
        return NextResponse.json(
          { success: false, message: "Each todo must have a title and description." },
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
        dueDate: todo.dueDate || null,
        priority: todo.priority || "medium",
        isCompleted: false,
        category: todo.category || "general",
        tags: todo.tags || []
      }))
    );

    return NextResponse.json(
      { 
        success: true, 
        message: todosArray.length > 1 
          ? `${todosArray.length} todos created successfully!` 
          : "Todo created successfully!", 
        todos: createdTodos 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating todos:", error);
    return NextResponse.json(
      { success: false, message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update a todo (mark as completed or update other fields)
 */
export async function PUT(request) {
  try {
    await connectDB();
    const user = await verifyToken(request);
    if (user instanceof NextResponse) return user;

    // Get todo ID from query param
    const mongoId = request.nextUrl.searchParams.get("mongoId");
    if (!mongoId)
      return NextResponse.json({ success: false, message: "No ID provided" }, { status: 400 });

    // Get update data from request body
    const updateData = await request.json();
    const updates = {};

    // Handle allowed field updates
    if ('title' in updateData) updates.title = updateData.title;
    if ('description' in updateData) updates.description = updateData.description;
    if ('dueDate' in updateData) updates.dueDate = updateData.dueDate;
    if ('priority' in updateData) updates.priority = updateData.priority;
    if ('category' in updateData) updates.category = updateData.category;
    if ('tags' in updateData) updates.tags = updateData.tags;
    
    // Special handling for isCompleted
    if ('isCompleted' in updateData) {
      updates.isCompleted = updateData.isCompleted;
      
      // If marking as completed, set completedAt date
      if (updateData.isCompleted) {
        updates.completedAt = new Date();
      } else {
        updates.completedAt = null;
      }
    }

    // If no update data provided, default to toggling completion status
    if (Object.keys(updates).length === 0) {
      const todo = await TodoModel.findOne({ _id: mongoId, userId: user.id });
      if (!todo) {
        return NextResponse.json(
          { success: false, message: "Todo not found or unauthorized" },
          { status: 404 }
        );
      }
      
      updates.isCompleted = !todo.isCompleted;
      updates.completedAt = updates.isCompleted ? new Date() : null;
    }

    const updatedTodo = await TodoModel.findOneAndUpdate(
      { _id: mongoId, userId: user.id },
      { $set: updates },
      { new: true }
    );

    if (!updatedTodo)
      return NextResponse.json(
        { success: false, message: "Todo not found or unauthorized" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: updates.isCompleted !== undefined
        ? updates.isCompleted 
          ? "Todo marked as completed successfully!"
          : "Todo marked as pending successfully!"
        : "Todo updated successfully!",
      todo: updatedTodo,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { success: false, message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove a todo
 */
export async function DELETE(request) {
  try {
    await connectDB();
    const user = await verifyToken(request);
    if (user instanceof NextResponse) return user;

    const mongoId = request.nextUrl.searchParams.get("mongoId");
    if (!mongoId)
      return NextResponse.json({ success: false, message: "No ID provided" }, { status: 400 });

    const deletedTodo = await TodoModel.findOneAndDelete({
      _id: mongoId,
      userId: user.id,
    });

    if (!deletedTodo)
      return NextResponse.json(
        { success: false, message: "Todo not found or unauthorized" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, message: "Todo deleted successfully!" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { success: false, message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

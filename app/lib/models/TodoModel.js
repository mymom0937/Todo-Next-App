const mongoose = require("mongoose");

// Define the schema for the Todo collection
const Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Add user association
    title: {
      type: String,
      required: true, // Title is required
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"]
    },
    description: {
      type: String,
      required: true, // Description is required
      trim: true
    },
    dueDate: {
      type: Date,
      default: null
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    isCompleted: {
      type: Boolean,
      default: false, // Defaults to false (task is not completed initially)
    },
    completedAt: {
      type: Date,
      default: null
    },
    category: {
      type: String,
      default: "general"
    },
    tags: [{
      type: String
    }]
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create indexes for better query performance
Schema.index({ userId: 1, isCompleted: 1 });
Schema.index({ userId: 1, dueDate: 1 });
Schema.index({ userId: 1, priority: 1 });

// Create the Todo model if it doesn't already exist
const TodoModel = mongoose.models.todo || mongoose.model("todo", Schema);

export default TodoModel;

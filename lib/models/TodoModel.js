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
    },
    description: {
      type: String,
      required: true, // Description is required
    },
    isCompleted: {
      type: Boolean,
      default: false, // Defaults to false (task is not completed initially)
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create the Todo model if it doesn't already exist
const TodoModel = mongoose.models.todo || mongoose.model("todo", Schema);

export default TodoModel;

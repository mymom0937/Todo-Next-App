import TodoForm from "@/app/Components/TodoForm.jsx";

export default function AddTodoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Add Todo
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Create a new task with title, description, due date, and priority level
        </p>
        <TodoForm />
      </div>
    </div>
  );
}

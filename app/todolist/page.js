import TodoList from "@/app/Components/TodoList";

export default function TodoListPage() {
  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex-grow w-full flex justify-center">
        <div className="w-full p-4">
          <h1 className="text-3xl font-bold text-center mb-4 mt-8 text-gray-800 dark:text-gray-100">
            Your Todos
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            Manage, filter, and organize your tasks in one place
          </p>
          <TodoList />
        </div>
      </div>
    </div>
  );
}

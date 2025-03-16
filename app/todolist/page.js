import TodoList from "@/app/Components/TodoList";

export default function TodoListPage() {
  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-800 min-h-screen mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24">
      <div className="flex-grow w-full flex justify-center">
        <div className="w-full p-4">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            Your Todos
          </h1>
          <TodoList />
        </div>
      </div>
    </div>
  );
}

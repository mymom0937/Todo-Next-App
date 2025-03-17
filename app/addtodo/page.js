import TodoForm from "@/app/Components/TodoForm.jsx";
export default function AddTodoPage() {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-2 mt-16 md:mt-20 lg:mt-24">
        Add Todo
      </h1>
      <TodoForm />
    </div>
  );
}

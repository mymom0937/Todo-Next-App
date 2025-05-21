"use client";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { TodoContext } from "@/app/context/TodoContext";
import { FaCalendarAlt, FaFlag } from "react-icons/fa";

export default function TodoForm() {
  const { token } = useContext(AuthContext);
  const { addTodo } = useContext(TodoContext);
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    dueDate: "",
    priority: "medium" 
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!token) {
      toast.error("Please log in", { toastId: "login-required" });
      router.push("/login");
      return;
    }

    try {
      if (isSubmitting) return;
      setIsSubmitting(true);
      
      const result = await addTodo(formData);

      if (result.success) {
        toast.success(result.message, { toastId: "todo-added-success" });
        setFormData({ title: "", description: "", dueDate: "", priority: "medium" });
        router.push("/todolist");
      } else {
        toast.error(result.message, { toastId: "todo-add-error" });
      }
    } catch (error) {
      toast.error("Failed to add todo", { toastId: "todo-add-error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
      <form onSubmit={onSubmitHandler} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-colors duration-200`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add details about your task"
            rows="4"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-colors duration-200`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <FaFlag className="text-red-500" />
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg shadow-md hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Adding...' : 'Add Todo'}
          </button>
        </div>
      </form>
    </div>
  );
}
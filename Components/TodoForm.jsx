
"use client";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";

export default function TodoForm({ fetchTodos }) {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please log in");
      router.push("/login");
      return;
    }

    try {
      if (isSubmitting) return;
      setIsSubmitting(true);
      const response = await axios.post("/api/todos", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(response.data.message);
      setFormData({ title: "", description: "" });

      router.push("/todolist");
      router.refresh();
      await fetchTodos();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col gap-4 w-full max-w-[1400px] mt-8 px-4 pt-8 mx-auto"
    >
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        type="text"
        placeholder="Enter Title"
        className="px-3 py-2 w-full border-2 text-slate-500 rounded focus:outline-none focus:border-orange-600"
        required
      />
      <textarea
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder="Enter Description"
        className="px-3 py-2 w-full h-32 border-2 text-slate-500 rounded focus:outline-none focus:border-orange-600"
        required
      />
      <button
        type="submit"
        className="px-6 py-3 bg-orange-600 text-white border-2 rounded w-full sm:w-auto hover:bg-orange-700"
      >
        Add Todo
      </button>
    </form>
  );
}
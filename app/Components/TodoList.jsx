"use client";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "@/app/context/AuthContext";
import Todo from "@/app/Components/Todo";
import { FaSearch } from "react-icons/fa";

export default function TodoList() {
  const { token, logout } = useContext(AuthContext);
  const [todoData, setTodoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage] = useState(5);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get("/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodoData(data.todos || []);
    } catch (error) {
      toast.error("Error fetching todos");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const response = await axios.delete("/api/todos", {
        params: { mongoId: id },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        fetchTodos();
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting todo");
    } finally {
      setIsDeleting(false);
    }
  };

  const completeTodo = async (id) => {
    if (isCompleting) return;
    setIsCompleting(true);
    try {
      const response = await axios.put(
        "/api/todos",
        {},
        {
          params: { mongoId: id },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.message);
      fetchTodos();
    } catch (error) {
      toast.error("Error completing todo");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSearchIconClick = () => {
    toast.info(`Searching for: "${searchQuery}"`);
  };

  // Pagination Logic
  const totalPages = Math.ceil(todoData.length / todosPerPage);
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;

  const currentTodos = todoData
    .filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(indexOfFirstTodo, indexOfLastTodo);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 pt-6 sm:pt-10 w-full flex flex-col flex-grow h-auto overflow-y-auto sm:max-h-none">
      {/* Search bar */}
      <div className="mb-4 sm:mb-6 flex justify-center w-[90%] sm:w-[70%] mx-auto max-w-[820px]">
        <div className="relative w-[90%] max-w-[820px]">
          <input
            type="text"
            placeholder="Search by Title or Description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 sm:px-4 py-1 sm:py-2 w-full border-2 text-slate-500 rounded text-sm sm:text-base"
          />
          <FaSearch
            onClick={handleSearchIconClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : currentTodos.length === 0 ? (
        <p className="text-center text-gray-500">No todos found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm md:text-base text-left border-collapse min-w-[100%]">
            <thead className="bg-[#1F2937] text-white uppercase hidden lg:flex lg:flex-nowrap">
              <tr className="lg:flex lg:flex-nowrap w-full">
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 border-b border-gray-300 lg:flex lg:items-center lg:w-[5%] lg:min-w-[60px]">
                  Id
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 border-b border-gray-300 lg:flex lg:items-center lg:w-[20%] lg:min-w-[150px]">
                  Title
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 border-b border-gray-300 whitespace-nowrap lg:flex lg:items-center lg:w-[45%] lg:min-w-[300px]">
                  Description
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 border-b border-gray-300 lg:flex lg:items-center lg:w-[10%] lg:min-w-[100px]">
                  Status
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 border-b border-gray-300 lg:flex lg:items-center lg:w-[20%] lg:min-w-[180px]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {currentTodos.map((todo, index) => (
                <Todo
                  key={todo._id}
                  id={index + 1 + indexOfFirstTodo}
                  title={todo.title}
                  description={todo.description}
                  complete={todo.isCompleted}
                  mongoId={todo._id}
                  deleteTodo={() => deleteTodo(todo._id)}
                  completeTodo={() => completeTodo(todo._id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 sm:mt-6">
        {/* Previous Page Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 sm:px-3 md:px-4 py-1 text-xs sm:text-sm md:text-base mx-1 sm:mx-2 border-2 rounded bg-gray-200 hover:bg-gray-300 transition duration-200"
        >
          «
        </button>

        {/* Page Number Buttons */}
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-2 sm:px-3 md:px-4 py-1 text-xs sm:text-sm md:text-base mx-1 sm:mx-2 border-2 rounded ${
                currentPage === pageNumber
                  ? "bg-orange-600 text-white font-bold"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition duration-200`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next Page Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 sm:px-3 md:px-4 py-1 text-xs sm:text-sm md:text-base mx-1 sm:mx-2 border-2 rounded bg-gray-200 hover:bg-gray-300 transition duration-200"
        >
          »
        </button>
      </div>
    </div>
  );
}

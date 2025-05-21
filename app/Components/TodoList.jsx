"use client";
import { useState, useEffect, useContext, useCallback, memo, useMemo } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/app/context/AuthContext";
import { TodoContext } from "@/app/context/TodoContext";
import Todo from "@/app/Components/Todo";
import Pagination from "@/app/Components/Pagination";
import { FaSearch, FaFilter, FaSort, FaTimes, FaCalendarAlt, FaFlag } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

// Memoize individual todo item to prevent unnecessary re-renders
const MemoizedTodo = memo(Todo);

export default function TodoList() {
  const { token, logout } = useContext(AuthContext);
  const { todoData, isLoading, totalTodos, totalPages, fetchTodos, deleteTodo: contextDeleteTodo, toggleTodoStatus } = useContext(TodoContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage] = useState(5);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null);
  
  // Get URL search params
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get("priority") || "all");
  const [sortBy, setSortBy] = useState("-createdAt");

  // Update filters when URL params change
  useEffect(() => {
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    
    if (status) {
      setStatusFilter(status);
    }
    
    if (priority) {
      setPriorityFilter(priority);
    }
  }, [searchParams]);

  // Build query parameters string - memoized to prevent unnecessary rebuilds
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (statusFilter !== "all") {
      params.append("status", statusFilter);
    }
    
    if (priorityFilter !== "all") {
      params.append("priority", priorityFilter);
    }
    
    params.append("sort", sortBy);
    params.append("page", currentPage);
    params.append("limit", todosPerPage);
    
    return params.toString();
  }, [statusFilter, priorityFilter, sortBy, currentPage, todosPerPage]);

  // Fetch todos when dependencies change
  useEffect(() => {
    if (token) {
      const queryParams = buildQueryParams();
      fetchTodos(queryParams);
    }
  }, [token, statusFilter, priorityFilter, sortBy, currentPage, fetchTodos, buildQueryParams]);

  // Local filtering for search query - memoized to prevent recalculation on every render
  const filteredTodos = useMemo(() => {
    return todoData.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [todoData, searchQuery]);

  const deleteTodo = useCallback(async (id) => {
    if (isDeleting || actionInProgress) return;
    
    if (!confirm("Are you sure you want to delete this todo?")) {
      return;
    }
    
    setIsDeleting(true);
    setActionInProgress(id);
    try {
      const result = await contextDeleteTodo(id);

      if (result.success) {
        toast.success(result.message, { toastId: `delete-todo-${id}` });
        // Refresh the list after deletion
        const queryParams = buildQueryParams();
        fetchTodos(queryParams);
      } else {
        throw new Error(result.message || "Unexpected response from server");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting todo", { toastId: "delete-todo-error" });
    } finally {
      setIsDeleting(false);
      setActionInProgress(null);
    }
  }, [isDeleting, actionInProgress, contextDeleteTodo, buildQueryParams, fetchTodos]);

  const completeTodo = useCallback(async (id) => {
    if (isUpdating || actionInProgress) return;
    
    setIsUpdating(true);
    setActionInProgress(id);
    try {
      const result = await toggleTodoStatus(id);
      
      if (result.success) {
        toast.success(result.message, { toastId: `complete-todo-${id}` });
        // Refresh the list after status change
        const queryParams = buildQueryParams();
        fetchTodos(queryParams);
      } else {
        throw new Error(result.message || "Unexpected response from server");
      }
    } catch (error) {
      toast.error(error.message || "Error updating todo status", { toastId: "update-todo-error" });
    } finally {
      setIsUpdating(false);
      setActionInProgress(null);
    }
  }, [isUpdating, actionInProgress, toggleTodoStatus, buildQueryParams, fetchTodos]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const queryParams = buildQueryParams();
    fetchTodos(queryParams);
    if (searchQuery.trim()) {
      toast.info(`Searching for: "${searchQuery}"`, { toastId: `search-todos-${searchQuery}` });
    }
  }, [searchQuery, buildQueryParams, fetchTodos]);

  const resetFilters = useCallback(() => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("-createdAt");
    setCurrentPage(1);
    setSearchQuery("");
    setShowFilters(false);
    
    // Update URL to remove filter params
    router.push("/todolist");
    // Fetch with reset parameters
    fetchTodos("");
  }, [router, fetchTodos]);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Memoize the TodoList component to prevent unnecessary re-renders
  const todoListContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      );
    } 
    
    if (filteredTodos.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
          <div className="max-w-md mx-auto space-y-4">
            <p className="text-xl text-gray-500 dark:text-gray-400">No todos found</p>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : "Try adding a new todo or adjusting your filters"}
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow bg-white dark:bg-gray-800">
        <table className="w-full text-xs sm:text-sm md:text-base text-left border-collapse min-w-[100%] table-fixed lg:table-auto">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hidden lg:table-header-group">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm tracking-wider uppercase border-b-2 border-gray-300 dark:border-gray-600 w-[5%] min-w-[60px]">ID</th>
              <th className="px-6 py-4 font-semibold text-sm tracking-wider uppercase border-b-2 border-gray-300 dark:border-gray-600 w-[15%] min-w-[150px]">Title</th>
              <th className="px-6 py-4 font-semibold text-sm tracking-wider uppercase border-b-2 border-gray-300 dark:border-gray-600 w-[30%] min-w-[300px]">Description</th>
              <th className="px-6 py-4 font-semibold text-sm tracking-wider uppercase border-b-2 border-gray-300 dark:border-gray-600 w-[12%] min-w-[120px]">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-500" />
                  <span>Due Date</span>
                </div>
              </th>
              <th className="px-6 py-4 font-semibold text-sm tracking-wider uppercase border-b-2 border-gray-300 dark:border-gray-600 w-[10%] min-w-[100px]">
                <div className="flex items-center gap-2">
                  <FaFlag className="text-red-500" />
                  <span>Priority</span>
                </div>
              </th>
              <th className="px-6 py-4 font-semibold text-sm tracking-wider uppercase border-b-2 border-gray-300 dark:border-gray-600 w-[8%] min-w-[80px]">Status</th>
              <th className="px-6 py-4 font-semibold text-sm tracking-wider uppercase border-b-2 border-gray-300 dark:border-gray-600 w-[15%] min-w-[180px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTodos.map((todo, index) => (
              <MemoizedTodo
                key={todo._id}
                id={index + 1 + ((currentPage - 1) * todosPerPage)}
                title={todo.title}
                description={todo.description}
                dueDate={todo.dueDate}
                priority={todo.priority}
                complete={todo.isCompleted}
                mongoId={todo._id}
                deleteTodo={deleteTodo}
                completeTodo={completeTodo}
                isDisabled={actionInProgress === todo._id}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [isLoading, filteredTodos, currentPage, todosPerPage, actionInProgress, deleteTodo, completeTodo, searchQuery]);
  
  // Memoize the pagination component to prevent unnecessary re-renders
  const paginationComponent = useMemo(() => (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      itemsPerPage={todosPerPage}
      totalItems={totalTodos}
      className="px-2"
    />
  ), [currentPage, totalPages, handlePageChange, todosPerPage, totalTodos]);
  
  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 pt-6 sm:pt-10 w-full flex flex-col flex-grow h-auto overflow-y-auto sm:max-h-none">
      {/* Search and Filter Bar */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-4 w-full mx-auto">
        <div className="flex flex-wrap md:flex-nowrap gap-2 items-center justify-between">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px] max-w-[500px]">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search todos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg text-gray-600 dark:text-gray-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </form>
          
          {/* Filter Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200 text-gray-700 dark:text-gray-200"
            >
              <FaFilter />
              <span className="hidden sm:inline">Filters</span>
            </button>
            
            {(statusFilter !== "all" || priorityFilter !== "all" || sortBy !== "-createdAt") && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition duration-200 text-red-700 dark:text-red-400"
                title="Reset all filters"
              >
                <FaTimes />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setStatusFilter(newStatus);
                    
                    // Update URL with new status filter
                    if (newStatus === "all") {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete("status");
                      router.push(`/todolist?${newParams.toString()}`);
                    } else {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set("status", newStatus);
                      router.push(`/todolist?${newParams.toString()}`);
                    }
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              {/* Priority Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaFlag className="text-red-500" />
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => {
                    const newPriority = e.target.value;
                    setPriorityFilter(newPriority);
                    
                    // Update URL with new priority filter
                    if (newPriority === "all") {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete("priority");
                      router.push(`/todolist?${newParams.toString()}`);
                    } else {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set("priority", newPriority);
                      router.push(`/todolist?${newParams.toString()}`);
                    }
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              {/* Sort By */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaSort />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="dueDate">Due Date</option>
                  <option value="-priority">Priority (High to Low)</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {todoListContent}

      {/* Professional Pagination Component */}
      {filteredTodos.length > 0 && paginationComponent}
    </div>
  );
}

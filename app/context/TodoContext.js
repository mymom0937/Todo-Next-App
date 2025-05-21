"use client";
import { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const TodoContext = createContext(null);

export function TodoProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    highPriority: 0
  });
  const [todoData, setTodoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalTodos, setTotalTodos] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [lastQueryParams, setLastQueryParams] = useState("");
  const [cachedTodos, setCachedTodos] = useState({});
  const DEFAULT_PAGE_SIZE = 5; // Set default page size to 5 todos per page

  // Mark component as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Clear todo data when token changes (including when it becomes null during logout)
  useEffect(() => {
    if (isMounted) {
      if (!token) {
        // Clear all todo data when user logs out
        setTodoData([]);
        setStats({
          pending: 0,
          completed: 0,
          highPriority: 0
        });
        setTotalTodos(0);
        setTotalPages(1);
        setCachedTodos({});
        setLastQueryParams("");
      }
    }
  }, [token, isMounted]);

  // Fetch todo statistics - memoized to prevent unnecessary re-renders
  const fetchStats = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await axios.get('/api/todos/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStats(prevStats => {
          // Only update if values actually changed
          const newStats = {
            pending: response.data.stats.pending,
            completed: response.data.stats.completed,
            highPriority: response.data.stats.highPriority
          };
          
          if (
            prevStats.pending === newStats.pending &&
            prevStats.completed === newStats.completed &&
            prevStats.highPriority === newStats.highPriority
          ) {
            return prevStats; // No change, return the same object reference
          }
          
          return newStats;
        });
      }
    } catch (error) {
      console.error('Error fetching todo stats:', error);
    }
  }, [token]);

  // Update stats locally based on todos
  const updateStatsLocally = useCallback((todoToUpdate, action) => {
    setStats(prevStats => {
      const newStats = { ...prevStats };
      
      if (action === 'add') {
        newStats.pending += 1;
        if (todoToUpdate.priority === 'high') {
          newStats.highPriority += 1;
        }
      } else if (action === 'delete') {
        if (!todoToUpdate.isCompleted) {
          newStats.pending = Math.max(0, newStats.pending - 1);
        } else {
          newStats.completed = Math.max(0, newStats.completed - 1);
        }
        
        if (todoToUpdate.priority === 'high') {
          newStats.highPriority = Math.max(0, newStats.highPriority - 1);
        }
      } else if (action === 'toggle') {
        if (todoToUpdate.isCompleted) {
          // Was completed, now pending
          newStats.completed = Math.max(0, newStats.completed - 1);
          newStats.pending += 1;
        } else {
          // Was pending, now completed
          newStats.pending = Math.max(0, newStats.pending - 1);
          newStats.completed += 1;
        }
      }
      
      return newStats;
    });
  }, []);

  // Fetch todos with query parameters - memoized to prevent unnecessary re-renders
  const fetchTodos = useCallback(async (queryParams = "") => {
    if (!token) return;
    
    // Skip if the query params are the same as the last request and data exists
    if (queryParams === lastQueryParams && todoData.length > 0) {
      return;
    }
    
    // Check if we have this query cached
    if (cachedTodos[queryParams]) {
      const cachedData = cachedTodos[queryParams];
      setTodoData(cachedData.todos);
      setTotalTodos(cachedData.pagination?.total || 0);
      setTotalPages(cachedData.pagination?.pages || 1);
      return;
    }
    
    try {
      setIsLoading(true);
      setLastQueryParams(queryParams);
      
      // If no page size is specified in the query, add the default page size
      let finalQueryParams = queryParams;
      if (!finalQueryParams.includes('limit=')) {
        const separator = finalQueryParams ? '&' : '';
        finalQueryParams += `${separator}limit=${DEFAULT_PAGE_SIZE}`;
      }
      
      const { data } = await axios.get(`/api/todos?${finalQueryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (data.success) {
        setTodoData(data.todos || []);
        setTotalTodos(data.pagination?.total || 0);
        setTotalPages(data.pagination?.pages || 1);
        
        // Cache this result
        setCachedTodos(prev => ({
          ...prev,
          [queryParams]: {
            todos: data.todos || [],
            pagination: data.pagination
          }
        }));
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, lastQueryParams, todoData.length, DEFAULT_PAGE_SIZE, cachedTodos]);

  // Clear cache when adding, updating or deleting todos
  const clearCache = useCallback(() => {
    setCachedTodos({});
  }, []);

  // Add a new todo
  const addTodo = useCallback(async (todoData) => {
    if (!token) return { success: false, message: "Authentication required" };
    
    try {
      // Optimistic update for stats
      const optimisticTodo = {
        ...todoData,
        isCompleted: false
      };
      updateStatsLocally(optimisticTodo, 'add');
      
      const response = await axios.post("/api/todos", todoData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.success) {
        // Clear cache to force refresh
        clearCache();
        
        // Refresh stats to ensure accuracy
        await fetchStats();
        return { success: true, message: response.data.message };
      } else {
        // Revert optimistic update
        updateStatsLocally(optimisticTodo, 'delete');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Failed to add todo" 
      };
    }
  }, [token, fetchStats, updateStatsLocally, clearCache]);

  // Delete a todo
  const deleteTodo = useCallback(async (id) => {
    if (!token) return { success: false, message: "Authentication required" };
    
    // Find the todo to be deleted for optimistic updates
    const todoToDelete = todoData.find(todo => todo._id === id);
    
    if (todoToDelete) {
      // Optimistic update
      setTodoData(prev => prev.filter(todo => todo._id !== id));
      updateStatsLocally(todoToDelete, 'delete');
    }
    
    try {
      const response = await axios.delete("/api/todos", {
        params: { mongoId: id },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        // Clear cache to force refresh on next fetch
        clearCache();
        
        // Refresh stats to ensure accuracy
        await fetchStats();
        return { success: true, message: response.data.message };
      } else {
        // Revert optimistic update if server fails
        if (todoToDelete) {
          fetchTodos(lastQueryParams); // Revert by refetching
        }
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      // Revert optimistic update
      if (todoToDelete) {
        fetchTodos(lastQueryParams); // Revert by refetching
      }
      return { 
        success: false, 
        message: error.response?.data?.message || "Error deleting todo" 
      };
    }
  }, [token, todoData, fetchStats, updateStatsLocally, fetchTodos, lastQueryParams, clearCache]);

  // Toggle todo completion status
  const toggleTodoStatus = useCallback(async (id) => {
    if (!token) return { success: false, message: "Authentication required" };
    
    // Find the todo to be toggled for optimistic updates
    const todoToToggle = todoData.find(todo => todo._id === id);
    
    if (todoToToggle) {
      // Optimistic update
      const updatedTodos = todoData.map(todo => 
        todo._id === id 
          ? { ...todo, isCompleted: !todo.isCompleted } 
          : todo
      );
      setTodoData(updatedTodos);
      updateStatsLocally(todoToToggle, 'toggle');
    }
    
    try {
      const response = await axios.put(
        "/api/todos",
        {},
        {
          params: { mongoId: id },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.success) {
        // Clear cache to force refresh on next fetch
        clearCache();
        
        // Refresh stats to ensure accuracy
        await fetchStats();
        return { success: true, message: response.data.message };
      } else {
        // Revert optimistic update if server fails
        if (todoToToggle) {
          fetchTodos(lastQueryParams); // Revert by refetching
        }
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Error updating todo status:", error);
      // Revert optimistic update
      if (todoToToggle) {
        fetchTodos(lastQueryParams); // Revert by refetching
      }
      return { 
        success: false, 
        message: error.response?.data?.message || "Error updating todo status" 
      };
    }
  }, [token, todoData, fetchStats, updateStatsLocally, fetchTodos, lastQueryParams, clearCache]);

  // Fetch initial data when mounted and token changes
  useEffect(() => {
    if (isMounted && token) {
      fetchStats();
      // Initial fetch with default page size
      fetchTodos(`limit=${DEFAULT_PAGE_SIZE}`);
    }
  }, [token, isMounted, fetchStats, fetchTodos, DEFAULT_PAGE_SIZE]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    stats,
    todoData,
    isLoading,
    totalTodos,
    totalPages,
    fetchStats,
    fetchTodos,
    addTodo,
    deleteTodo,
    toggleTodoStatus,
    DEFAULT_PAGE_SIZE
  }), [
    stats,
    todoData,
    isLoading,
    totalTodos,
    totalPages,
    fetchStats,
    fetchTodos,
    addTodo,
    deleteTodo,
    toggleTodoStatus,
    DEFAULT_PAGE_SIZE
  ]);

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
} 
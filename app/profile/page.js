"use client";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext.js";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaCheckCircle, FaList } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "" });
  
  const { token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetchUserData();
    fetchUserStats();
  }, [token, router]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { name, email } = response.data;
      setUser({ name, email });
      setFormData({ name, email });
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await axios.get("/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.success) {
        const todos = response.data.todos || [];
        const total = todos.length;
        const completed = todos.filter(todo => todo.isCompleted).length;
        const pending = total - completed;
        
        setStats({ total, completed, pending });
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // For demonstration - in a real app, this would update the user profile
      // await axios.put("/api/user/profile", formData, { headers: { Authorization: `Bearer ${token}` } });
      setUser(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-blue-600 dark:text-blue-400 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header section with cover image */}
        <div className="relative h-32 sm:h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute -bottom-16 left-4 sm:left-8">
            <div className="w-32 h-32 bg-white dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-700 flex items-center justify-center">
              <FaUser className="text-5xl text-gray-400 dark:text-gray-300" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="pt-16 pb-8 px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mb-4 sm:mb-0"
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                <FaEnvelope className="mr-2" />
                {user.email}
              </p>
            </motion.div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition"
            >
              <FaEdit className="mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex flex-col items-center"
            >
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
              <div className="text-gray-600 dark:text-gray-400 flex items-center">
                <FaList className="mr-2" />
                Total Tasks
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex flex-col items-center"
            >
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
              <div className="text-gray-600 dark:text-gray-400 flex items-center">
                <FaCheckCircle className="mr-2" />
                Completed
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 flex flex-col items-center"
            >
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
              <div className="text-gray-600 dark:text-gray-400 flex items-center">
                <FaCalendarAlt className="mr-2" />
                Pending
              </div>
            </motion.div>
          </div>

          {/* Edit form */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6"
            >
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Edit Profile Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Account information */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Account Information
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Member Since
                </div>
                <div className="text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Account Type
                </div>
                <div className="text-gray-900 dark:text-white">
                  Basic
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last Login
                </div>
                <div className="text-gray-900 dark:text-white">
                  {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
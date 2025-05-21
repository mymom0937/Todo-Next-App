"use client";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { z } from "zod"; 
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import AuthSchema from "../Schemas/AuthSchema.jsx";

export default function AuthForm({ defaultIsLogin = true, callbackUrl = "/todolist" }) {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Update isLogin when defaultIsLogin prop changes
  useEffect(() => {
    setIsLogin(defaultIsLogin);
  }, [defaultIsLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation with Zod
    const validationData = { email, password, ...(isLogin ? {} : { name }) };
    try {
      if (isLogin) {
        AuthSchema.omit({ name: true }).parse({ email, password });
      } else {
        AuthSchema.parse(validationData);
      }
    } catch (validationError) {
      // Handle Zod validation errors
      if (validationError instanceof z.ZodError) {
        const errorMessages = validationError.errors
          .map((err) => err.message)
          .join(", ");
        toast.error(errorMessages, { autoClose: 3000 });
      } else {
        toast.error("An unexpected validation error occurred.", {
          autoClose: 3000,
        });
        console.error("Validation Error:", validationError);
      }
      return;
    }

    setLoading(true);

    try {
      // Dismiss any existing toasts to prevent duplicates
      toast.dismiss();
      
      const ApiEndPoint = `/api/auth/${isLogin ? "login" : "register"}`;
      const data = { email, password, ...(isLogin ? {} : { name }) };
      const response = await axios.post(ApiEndPoint, data);

      // Check if response has token and is successful
      if (response?.data?.success && response?.data?.token) {
        // Update authentication state first without showing toast
        try {
          login(response.data.token);
          
          // Reset form fields
          setEmail("");
          setPassword("");
          setName("");
          
          // Show only one success message with a unique ID
          const actionType = isLogin ? "login" : "register";
          toast.success(
            response.data.message ||
              `${isLogin ? "Login" : "Registration"} successful!`,
            { 
              autoClose: 3000,
              toastId: `auth-${actionType}-success`,
              // Prevent duplicate toasts
              onOpen: () => {
                // When this toast opens, dismiss any "already logged in" toasts
                toast.dismiss("already-logged-in");
              }
            }
          );
          
          // Redirect after a short delay
          setTimeout(() => router.push("/todolist"), 800);
        } catch (loginError) {
          console.error("Login function error:", loginError);
          toast.error("Failed to update authentication state.", { 
            autoClose: 3000,
            toastId: 'auth-state-error' // Prevent duplicate toasts
          });
        }
      } else {
        // Handle unexpected response format
        console.error("Unexpected API response:", response.data);
        toast.error(response?.data?.message || "Unexpected error occurred.", {
          autoClose: 3000,
          toastId: 'unexpected-response-error' // Prevent duplicate toasts
        });
      }
    } catch (err) {
      // Handle API errors
      console.error("Auth Error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        "An error occurred, please try again.";
      toast.error(errorMessage, { 
        autoClose: 3000,
        toastId: 'api-error' // Prevent duplicate toasts
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AiOutlineUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AiOutlineMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AiOutlineLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "Your password" : "Create a strong password"}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <AiOutlineEye className="h-5 w-5" />
              ) : (
                <AiOutlineEyeInvisible className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {!isLogin && "Password must be at least 8 characters with a number and special character"}
            {isLogin && (
              <div className="text-right">
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthForm from "@/app/Components/AuthForm.jsx";
import { AuthContext } from "../context/AuthContext.js";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const { token } = useContext(AuthContext);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultIsLogin = searchParams.get("register") !== "true";
  const callbackUrl = searchParams.get("callbackUrl") || "/todolist";
  
  // Use a ref to track if we've already shown the toast
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (token) {
      // Only show the toast once and use a unique toastId
      if (!hasShownToast) {
        // Dismiss any existing auth-related toasts first
        toast.dismiss("auth-login-success");
        toast.dismiss("auth-register-success");
        
        // Then show the "already logged in" toast
        toast.info("You are already logged in!", { 
          toastId: "already-logged-in",
          autoClose: 2000
        });
        setHasShownToast(true);
      }
      
      // Redirect after a short delay
      const redirectTimer = setTimeout(() => {
        router.push(callbackUrl || "/todolist");
      }, 500);
      
      // Clean up the timer if component unmounts
      return () => clearTimeout(redirectTimer);
    } else {
      setCheckingAuth(false);
    }
  }, [token, router, hasShownToast, callbackUrl]);

  // Handle OAuth error
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(`Authentication error: ${error}`, {
        toastId: "auth-error",
        autoClose: 5000
      });
    }
  }, [searchParams]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-blue-600 dark:text-blue-400 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900">
      {/* Left Section - Form */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full md:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-8 order-2 md:order-1"
      >
        <div className="mx-auto w-full max-w-md">
          <Link href="/">
            <div className="flex justify-center mb-10">
              <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                Todo App
              </h1>
            </div>
          </Link>
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {defaultIsLogin ? "Welcome back!" : "Create your account"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {defaultIsLogin 
                ? "Sign in to access your tasks and stay productive" 
                : "Get started with a free account and organize your tasks"}
            </p>
          </div>
          
          {/* Email/Password Form */}
          <AuthForm defaultIsLogin={defaultIsLogin} callbackUrl={callbackUrl} />
        </div>
      </motion.div>

      {/* Right Section - Banner */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden md:block md:w-1/2 bg-gradient-to-tr from-blue-600 to-purple-600 p-12 order-1 md:order-2"
      >
        <div className="h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl font-bold mb-6">
            {defaultIsLogin 
              ? "Welcome Back to Task Management" 
              : "Get Started with Smart Task Management"}
          </h1>
          <p className="text-lg mb-8 text-blue-100">
            Organize your tasks, set priorities, and never miss a deadline again.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p>Intuitive task management interface</p>
            </div>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p>Customize with priorities and due dates</p>
            </div>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p>Fast, responsive, and intuitive design</p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

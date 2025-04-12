"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthForm from "@/app/Components/AuthForm.jsx";
import { AuthContext } from "../context/AuthContext.js";

export default function Login() {
  const { token, login } = useContext(AuthContext);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      setTimeout(() => router.push("/addtodo"), 1000);
    } else {
      setCheckingAuth(false);
    }
  }, [token, router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Verifying authentication...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome Back to the Todo App
          </h1>
          <p className="text-gray-600">
            Log in or sign up to get started
          </p>
          <p className="text-sm text-gray-500">
            Manage your tasks efficiently by staying organized and focused
          </p>
        </div>
        <AuthForm login={login} />
      </div>
    </main>
  );
}

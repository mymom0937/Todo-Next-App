"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthForm from "@/components/AuthForm";
import { AuthContext } from "../context/AuthContext.js";

export default function Login() {
  const { token, login } = useContext(AuthContext);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      // setTimeout(() => router.push("/todos"), 3000);
      setTimeout(() => router.push("/addtodo"), 3000);
    } else {
      setCheckingAuth(false);
    }
  }, [token, router]);

  if (checkingAuth) {
    return (
      <div className="h-auto bg-gray-100 flex items-center justify-center p-4">
        <div className="text-gray-600">Checking authentication...</div>
      </div>
    );
  }
  // min-h-screen h-full 
  return (
    <main className=" bg-gray-100 flex items-center justify-center px-4 pt-20 md:pt-32 w-full">
      <div className="max-w-lg bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          Welcome Back to the Todo App
        </h1>
        <h2 className="text-xl text-gray-500 mb-4">
          Log in or sign up to get started.
        </h2>
        <h5 className="text-lg text-gray-600 mb-0">
          Manage your tasks efficiently by staying organized and focused.
        </h5>
        <AuthForm login={login} />
      </div>
    </main>
  );
}

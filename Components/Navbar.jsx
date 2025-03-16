
"use client";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { AuthContext } from "../app/context/AuthContext.js";

export default function Navbar() {
  const router = useRouter();
  const { token, logout } = useContext(AuthContext) || {};
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  }, []);

  const toggleDarkMode = () => {
    try {
      const newTheme = darkMode ? "light" : "dark";
      setDarkMode(!darkMode);
      localStorage.setItem("theme", newTheme);
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      console.error("Error toggling theme:", error);
    }
  };

  const handleLogout = () => {
    try {
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-neutral-200 dark:bg-gray-800 text-gray-900 dark:text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center font-semibold fixed top-0 left-0 w-full z-50 shadow-md">
      <Link href="/" className="text-lg sm:text-xl font-bold pl-6 sm:pl-10">
        Todo App
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="hover:text-gray-500">
          Home
        </Link>
        <Link href="/todolist" className="hover:text-gray-500">
          Todos
        </Link>
        {token && (
          <Link href="/profile" className="hover:text-gray-500">
            Profile
          </Link>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button onClick={toggleDarkMode} className="text-lg sm:text-xl">
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-red-600 text-sm sm:text-base"
          >
            Log Out
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-blue-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
          >
            Login
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-xl sm:text-2xl"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-[3.5rem] sm:top-14 left-0 w-full bg-gray-800 text-white flex flex-col items-center py-4 space-y-4 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <Link
          href="/"
          className="hover:text-gray-400"
          onClick={() => setIsOpen(false)}
        >
          Home
        </Link>
        <Link
          href="/todolist"
          className="hover:text-gray-400"
          onClick={() => setIsOpen(false)}
        >
          Todos
        </Link>
        {token && (
          <Link
            href="/profile"
            className="hover:text-gray-400"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
        )}
      </div>
    </nav>
  );
}
"use client";
import { useState } from "react";
import Link from "next/link";
import { FaList, FaPlus, FaBars, FaTimes } from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white transition-transform transform md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:w-64 w-[50%] sm:w-[40%] max-w-[12rem] p-2 mt-2 z-50`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/addtodo"
                className="flex items-center gap-3 p-3 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition rounded"
              >
                <FaPlus className="text-gray-700 dark:text-gray-300" />
                Add Todo
              </Link>
            </li>
            <li>
              <Link
                href="/todolist"
                className="flex items-center gap-3 p-3 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition rounded"
              >
                <FaList className="text-gray-700 dark:text-gray-300" />
                Todo List
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay (when sidebar is open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900 p-2 rounded-full z-50"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
    </div>
  );
}

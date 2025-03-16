
"use client";
import { Button } from "../Components/ui/page.js";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-5.5rem)] sm:min-h-[calc(100vh-7rem)] bg-gray-100 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
      <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 max-w-3xl text-center">
        {/* Welcome Message */}
        <h1 className="text-base sm:text-lg md:text-xl font-medium text-gray-700 mb-2 sm:mb-3 md:mb-4">
          Welcome to the Todo App!
        </h1>

        {/* Main Heading */}
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
          Simplify Your Tasks
        </h2>

        {/* Description */}
        <p className="mt-1 sm:mt-2 md:mt-3 text-xs sm:text-sm md:text-base text-gray-600">
          A fast, secure, and intuitive Todo App to help you stay organized and
          productive.
        </p>

        {/* Button */}
        <div className="mt-3 sm:mt-4 md:mt-6">
          <Link href="/login">
            <Button className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 text-xs sm:text-sm md:text-lg w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
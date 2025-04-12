"use client";
// import { Button } from "./Components/ui/ui-components.jsx";
import Button from "./Components/ui/ui-components.jsx";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-5.5rem)] sm:min-h-[calc(100vh-7rem)] bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
      <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 max-w-3xl text-center mx-auto mt-16 sm:mt-8 sm:my-12 md:my-16 px-4 sm:px-6 md:px-8 ">
        {/* Welcome Message */}
        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-5">
          Welcome to Todo-list App
        </h1>

        {/* Main Heading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-600 mb-4 sm:mb-5 md:mb-6">
          Organize Your Life, <br className="hidden sm:block" /> One Task at a Time
        </h2>

        {/* Description */}
        <div className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            Your simple, powerful task manager. Stay organized and productive with an intuitive interface that works for you.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            Sync your tasks across devices and never miss a deadline.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 sm:mt-8 mb-6 sm:mb-8">
          <div className="p-4 bg-white rounded-lg shadow-black hover:-translate-y-1 duration-500">
            <h3 className="font-semibold text-gray-800 mb-2">Smart Tasks</h3>
            <p className="text-sm text-gray-600">Organize and prioritize with ease</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-black hover:-translate-y-1 duration-500">
            <h3 className="font-semibold text-gray-800 mb-2">Stay in Sync</h3>
            <p className="text-sm text-gray-600">Access your tasks anywhere</p>
          </div>
        </div>

        {/* Button */}
        <div className="mt-6 sm:mt-8">
          <Link href="/login">
            <Button className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base md:text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

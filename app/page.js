"use client";
// import { Button } from "./Components/ui/ui-components.jsx";
import Button from "./Components/ui/ui-components.jsx";
import Link from "next/link";
import { FaCheckCircle, FaCalendarCheck, FaBell, FaMobileAlt, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: <FaCheckCircle className="text-blue-500 text-2xl" />,
      title: "Task Management",
      description: "Create, organize, and prioritize your tasks with ease"
    },
    {
      icon: <FaCalendarCheck className="text-green-500 text-2xl" />,
      title: "Due Dates & Reminders",
      description: "Never miss a deadline with custom due dates"
    },
    {
      icon: <FaMobileAlt className="text-purple-500 text-2xl" />,
      title: "Responsive Design",
      description: "Access your tasks from any device, anywhere, anytime"
    },
    {
      icon: <FaLock className="text-red-500 text-2xl" />,
      title: "Secure & Private",
      description: "Your data is encrypted and only accessible to you"
    }
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 md:px-8 py-6 overflow-hidden">
      {/* Hero Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-6xl mx-auto pt-16 md:pt-20 pb-8 md:pb-16 text-center"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
          Organize Your Life,{" "}
          <span className="text-blue-600 dark:text-blue-400">One Task at a Time</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
          Your simple yet powerful task manager. Stay organized and productive with an
          intuitive interface designed to help you accomplish more.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button 
              variant="primary" 
              size="xl" 
              className="w-full sm:w-auto font-semibold"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/login?register=true">
            <Button 
              variant="outline" 
              size="xl" 
              className="w-full sm:w-auto font-semibold"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="w-full max-w-6xl mx-auto py-16"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose Our Todo App?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-6xl mx-auto py-16 px-4 text-center"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl px-6 py-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to boost your productivity?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their daily routine with our Todo app.
          </p>
          <Link href="/login">
            <Button 
              variant="secondary" 
              size="lg"
              className="font-semibold"
            >
              Start For Free
            </Button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

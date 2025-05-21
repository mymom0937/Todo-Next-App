"use client";
import { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FiSun, FiMoon, FiUser, FiLogOut, FiMenu, FiX, FiChevronDown, FiSettings, FiPlus, FiList } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext.js";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, logout } = useContext(AuthContext) || {};
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const userMenuRef = useRef(null);

  // Mark component as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get user name from token
  useEffect(() => {
    if (isMounted && token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken && decodedToken.name) {
          // Get first name only
          const firstName = decodedToken.name.split(' ')[0];
          setUserName(firstName);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token, isMounted]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isMounted) return;
    
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMounted]);

  // Set theme with dark mode as default
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      const storedTheme = localStorage.getItem("theme");
      // If theme is not set in localStorage, default to dark
      if (storedTheme === "light") {
        setDarkMode(false);
        document.documentElement.classList.remove("dark");
      } else {
        // Default to dark mode
        setDarkMode(true);
        document.documentElement.classList.add("dark");
        // Save the dark theme preference if not already set
        if (!storedTheme) {
          localStorage.setItem("theme", "dark");
        }
      }
    } catch (error) {
      console.error("Error loading theme:", error);
      // If error, still default to dark mode
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, [isMounted]);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMounted) {
      setIsOpen(false);
    }
  }, [pathname, isMounted]);

  const toggleDarkMode = () => {
    if (!isMounted) return;
    
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

  const handleLogout = async () => {
    try {
      // First navigate away from the todolist page to avoid stale data being visible
      router.push("/login");
      
      // Then perform logout which will clear the token
      await logout();
      
      // Show success message
      toast.success("Logged out successfully", { toastId: "logout-success" });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout", { toastId: "logout-error" });
    }
  };

  // Check if current route is active
  const isActiveRoute = (route) => {
    if (route === '/' && pathname === '/') return true;
    if (route !== '/' && pathname?.startsWith(route)) return true;
    return false;
  };

  // Don't render full content until client-side hydration is complete
  if (!isMounted) {
    return (
      <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 sm:px-6 py-4 flex items-center justify-between font-medium fixed top-0 left-0 w-full z-50 shadow-xl border-b-2 border-gray-200 dark:border-gray-800 h-16">
        <div className="flex items-center">
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Todo App
          </span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 sm:px-6 py-4 flex items-center justify-between font-medium fixed top-0 left-0 w-full z-50 shadow-xl border-b-2 border-gray-200 dark:border-gray-800 h-16">
      {/* Logo - Left */}
      <div className="flex items-center">
        <Link
          href="/"
          className="flex items-center text-lg sm:text-xl font-bold"
        >
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Todo App
          </span>
        </Link>
      </div>

      {/* Navigation - Center */}
      <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-8">
          <NavLink href="/" isActive={isActiveRoute('/')}>
            Home
          </NavLink>
          <NavLink href="/todolist" isActive={isActiveRoute('/todolist')}>
            My Tasks
          </NavLink>
          {token && (
            <NavLink href="/addtodo" isActive={isActiveRoute('/addtodo')}>
              Add Task
            </NavLink>
          )}
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode} 
          className={`p-2 rounded-full transition-colors ${
            darkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
              : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
          }`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <FiSun className="text-lg" />
          ) : (
            <FiMoon className="text-lg" />
          )}
        </button>

        {/* User Menu (when logged in) */}
        {token ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-1 sm:mr-0">
                <FiUser className="text-sm" />
              </div>
              <span className="hidden sm:inline text-sm font-medium">
                {userName || "Profile"}
              </span>
              <FiChevronDown className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''} text-gray-500 dark:text-gray-400`} />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userName ? `Hi, ${userName}` : "User Account"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FiUser className="mr-2 text-blue-600 dark:text-blue-400" />
                    Profile
                  </Link>
                  <Link
                    href="/todolist"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FiList className="mr-2 text-green-600 dark:text-green-400" />
                    My Tasks
                  </Link>
                  <Link
                    href="/addtodo"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FiPlus className="mr-2 text-purple-600 dark:text-purple-400" />
                    Add Task
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FiSettings className="mr-2 text-gray-600 dark:text-gray-400" />
                    Settings
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiLogOut className="mr-2" />
                    Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            href="/login"
            className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            Sign In
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-lg md:hidden transition-colors ${
            darkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700 flex flex-col md:hidden z-40"
          >
            <Link
              href="/"
              className={`px-4 py-3 border-l-4 ${
                isActiveRoute('/') 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Home
            </Link>
            <Link
              href="/todolist"
              className={`px-4 py-3 border-l-4 ${
                isActiveRoute('/todolist') 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              My Tasks
            </Link>
            {token && (
              <>
                <Link
                  href="/addtodo"
                  className={`px-4 py-3 border-l-4 ${
                    isActiveRoute('/addtodo') 
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  Add Task
                </Link>
                <Link
                  href="/profile"
                  className={`px-4 py-3 border-l-4 ${
                    isActiveRoute('/profile') 
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  Profile
                </Link>
                <div className="px-4 py-3 border-l-4 border-transparent text-gray-600 dark:text-gray-400">
                  <div className="text-sm font-medium">
                    {userName ? `Hi, ${userName}` : "User Account"}
                  </div>
                  <div className="text-xs">{new Date().toLocaleDateString()}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 border-l-4 border-transparent text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
                >
                  Log Out
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Component for nav links with active state
function NavLink({ href, children, isActive }) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 text-base font-medium transition-colors ${
        isActive
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
      }`}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
}

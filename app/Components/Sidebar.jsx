// Cache-busting comment - updated on: ${new Date().toISOString()}
"use client";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { TodoContext } from "@/app/context/TodoContext";
import { 
  FaList, 
  FaPlus, 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaCalendarAlt, 
  FaCheckCircle,
  FaClock,
  FaFilter,
  FaTasks,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useContext(AuthContext);
  const { stats } = useContext(TodoContext);
  
  // Mark component as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      setIsOpen(false);
    }
  }, [pathname, isMounted]);

  // Check if current route is active with search params
  const isActiveRoute = (route, requiredParams = {}) => {
    // Check if the base path matches
    if (!pathname?.startsWith(route)) return false;
    
    // If no required params, check if it's the "All Tasks" option
    if (Object.keys(requiredParams).length === 0) {
      // For the "All Tasks" option, it's active when there are no status or priority params
      if (route === '/todolist') {
        return !searchParams.has('status') && !searchParams.has('priority');
      }
      // For other routes without params, just check the path
      return route === '/' ? pathname === '/' : true;
    }
    
    // Check if all required search params match
    for (const [key, value] of Object.entries(requiredParams)) {
      if (searchParams.get(key) !== value) {
        return false;
      }
    }
    
    return true;
  };

  // Sidebar links configuration
  const mainLinks = [
    { href: "/", icon: <FaHome />, title: "Home" },
    { href: "/todolist", icon: <FaList />, title: "My Tasks" },
    { href: "/addtodo", icon: <FaPlus />, title: "Add Task" },
  ];

  const statusLinks = [
    { 
      href: "/todolist?status=pending", 
      icon: <FaClock />, 
      title: "Pending",
      params: { status: "pending" }
    },
    { 
      href: "/todolist?status=completed", 
      icon: <FaCheckCircle />, 
      title: "Completed",
      params: { status: "completed" }
    }
  ];
  
  const priorityLinks = [
    { 
      href: "/todolist?priority=high", 
      icon: <FaFilter className="text-red-500" />, 
      title: "High Priority",
      params: { priority: "high" }
    },
    { 
      href: "/todolist?priority=medium", 
      icon: <FaFilter className="text-yellow-500" />, 
      title: "Medium Priority",
      params: { priority: "medium" }
    },
    { 
      href: "/todolist?priority=low", 
      icon: <FaFilter className="text-green-500" />, 
      title: "Low Priority",
      params: { priority: "low" }
    }
  ];

  // Don't render anything until client-side hydration is complete
  if (!isMounted) return null;

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 md:hidden flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: isOpen || typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : -280 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-16 left-0 h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-800 w-64 p-6 pt-8 overflow-y-auto z-30 shadow-xl md:shadow-md"
        >
          <div className="space-y-8">
            {/* Main Navigation */}
            <div>
              <h3 className="px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                Main
              </h3>
              <ul className="space-y-2">
                {mainLinks.map((link) => (
                  <SidebarLink 
                    key={link.href} 
                    href={link.href} 
                    icon={link.icon} 
                    title={link.title} 
                    isActive={isActiveRoute(link.href)} 
                  />
                ))}
              </ul>
            </div>

            {/* Filters */}
            <div>
              <h3 className="px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                Filters
              </h3>
              
              {/* Status Filters */}
              <ul className="space-y-2 mb-3">
                {statusLinks.map((link) => (
                  <SidebarLink 
                    key={link.href} 
                    href={link.href} 
                    icon={link.icon} 
                    title={link.title} 
                    isActive={isActiveRoute('/todolist', link.params)} 
                  />
                ))}
              </ul>
              
              {/* Priority Filter Dropdown */}
              <div className="mb-2">
                <button 
                  onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-gray-600 dark:text-gray-400">
                      <FaFilter />
                    </span>
                    <span>Priority Filters</span>
                  </div>
                  {isPriorityOpen ? (
                    <FaChevronUp className="text-gray-600 dark:text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-600 dark:text-gray-400" />
                  )}
                </button>
                
                <AnimatePresence>
                  {isPriorityOpen && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-8 space-y-2 mt-1 overflow-hidden"
                    >
                      {priorityLinks.map((link) => (
                        <SidebarLink 
                          key={link.href} 
                          href={link.href} 
                          icon={link.icon} 
                          title={link.title} 
                          isActive={isActiveRoute('/todolist', link.params)} 
                        />
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-auto shadow-md">
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                DASHBOARD STATS
              </h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center shadow-sm">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.pending}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center shadow-sm">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center shadow-sm">
                <div className="text-xl font-bold text-red-600 dark:text-red-400">{stats.highPriority}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">High Priority</div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// Sidebar link component
function SidebarLink({ href, icon, title, isActive }) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
        }`}
      >
        <span className={`text-lg ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>
          {icon}
        </span>
        {title}
        {isActive && (
          <motion.div
            layoutId="sidebar-indicator"
            className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>
    </li>
  );
}

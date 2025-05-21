"use client";
import localFont from "next/font/local";
import "./styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Head from "./head.jsx";

// Dynamic imports with loading fallbacks
const Navbar = dynamic(() => import("@/app/Components/Navbar.jsx"), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 shadow"></div>
});

const AuthProvider = dynamic(() => import("./context/AuthContext.js").then(mod => mod.AuthProvider), {
  ssr: false
});

const TodoProvider = dynamic(() => import("./context/TodoContext.js").then(mod => mod.TodoProvider), {
  ssr: false
});

const Sidebar = dynamic(() => import("@/app/Components/Sidebar.jsx"), {
  ssr: false,
  loading: () => <div className="hidden md:block w-64 bg-gray-100 dark:bg-gray-900"></div>
});

const Footer = dynamic(() => import("@/app/Components/Footer.jsx"), {
  ssr: false,
  loading: () => <div className="h-12 bg-white dark:bg-gray-900"></div>
});

const ToastContainer = dynamic(() => import("react-toastify").then(mod => mod.ToastContainer), {
  ssr: false
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-[70vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
  </div>
);

// Metadata needs to be moved to a separate file when using client components
export default function RootLayout({ children }) {
  const [isClient, setIsClient] = useState(false);

  // This ensures hydration completes before rendering the full content
  useEffect(() => {
    setIsClient(true);
    
    // Preload critical chunks
    const preloadChunks = async () => {
      // Preload important components
      await Promise.all([
        import("@/app/Components/Navbar.jsx"),
        import("@/app/Components/Sidebar.jsx")
      ]);
    };
    
    preloadChunks();
  }, []);

  return (
    <html lang="en">
      <head>
        <Head />
      </head>
      <body className={`antialiased overflow-x-hidden flex flex-col min-h-screen ${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={<LoadingSpinner />}>
          <AuthProvider>
            <TodoProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex flex-1 pt-16">
                  {isClient && <Sidebar className="hidden md:block w-64 flex-shrink-0" />}
                  <main className="flex-1 w-full ml-0 md:ml-64 p-6 pt-8">
                    {isClient ? children : <LoadingSpinner />}
                  </main>
                </div>
                <Footer />
              </div>
              <ToastContainer 
                theme="dark" 
                position="top-right" 
                autoClose={3000}
                limit={2}
                newestOnTop={true}
                closeOnClick
                pauseOnHover
                draggable
                pauseOnFocusLoss={false}
                preventDuplicates={true}
              />
            </TodoProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}

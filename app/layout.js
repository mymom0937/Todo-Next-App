import localFont from "next/font/local";
import "./styles/globals.css";
import Navbar from "@/app/Components/Navbar.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext.js";
import Sidebar from "@/app/Components/Sidebar.jsx";
import Footer from "@/app/Components/Footer.jsx";

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

export const metadata = {
  title: "Todo App",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden flex flex-col min-h-screen">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1">
              <Sidebar className="hidden md:block w-64 flex-shrink-0" />
              <main className="flex-1 w-full ml-0 md:ml-64 p-4">
                {children}
              </main>
            </div>
            <Footer />
          </div>
          <ToastContainer theme="dark" position="top-right" autoClose={5000} />
        </AuthProvider>
      </body>
    </html>
  );
}

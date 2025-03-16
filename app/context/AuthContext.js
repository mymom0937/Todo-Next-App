
"use client";
import { createContext, useState, useEffect } from "react";

// Create context with null as the default value
export const AuthContext = createContext(null);

// AuthProvider Component
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  // Load token from localStorage on client-side
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error loading token from localStorage:", error);
    }
  }, []);

  const login = (newToken) => {
    try {
      if (!newToken || typeof newToken !== "string") {
        throw new Error("Invalid token provided.");
      }
      localStorage.setItem("token", newToken);
      setToken(newToken);
    } catch (error) {
      console.error("Error in login:", error);
      throw error; // Re-throw to be caught by the caller (e.g., AuthForm)
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      setToken(null);
    } catch (error) {
      console.error("Error in logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
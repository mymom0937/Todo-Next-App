"use client";
import { useState, useEffect } from "react";
import { Children, isValidElement, cloneElement } from "react";
import Navbar from "./Navbar";

export default function ClientLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  }, []);

  const toggleDarkMode = () => {
    try {
      const newTheme = isDarkMode ? "light" : "dark";
      setIsDarkMode(!isDarkMode);
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

  const enhanceChildren = (child) => {
    if (isValidElement(child)) {
      if (child.type === Navbar) {
        return cloneElement(child, { toggleDarkMode, isDarkMode });
      }
      if (child.props.children) {
        return cloneElement(child, {
          children: Children.map(child.props.children, enhanceChildren),
        });
      }
    }
    return child;
  };

  return <>{Children.map(children, enhanceChildren)}</>;
}

import React from "react";

const Button = React.forwardRef(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    // Base classes for all buttons
    const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg";
    
    // Variant classes
    const variantClasses = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-md hover:shadow-lg",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700",
      success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-md hover:shadow-lg",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md hover:shadow-lg",
      warning: "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 shadow-md hover:shadow-lg",
      ghost: "hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-200",
    };
    
    // Size classes
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      default: "px-4 py-2.5 text-base",
      lg: "px-6 py-3 text-lg",
      xl: "px-8 py-4 text-xl",
    };
    
    // Combine all classes
    const buttonClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.default} ${className || ""}`;
    
    return (
      <button className={buttonClasses} ref={ref} {...props} />
    );
  }
);

Button.displayName = "Button";

export default Button;
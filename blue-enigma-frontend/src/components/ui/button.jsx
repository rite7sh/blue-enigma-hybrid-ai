import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all duration-300 shadow-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

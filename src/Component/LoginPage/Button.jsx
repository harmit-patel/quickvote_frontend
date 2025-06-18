import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const Button = ({ onClick, disabled, isLoading, text }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-12 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] ${
        disabled 
        ? 'bg-gray-400 cursor-not-allowed' 
        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg'
      }`}
    >
      {isLoading ? (
        <>
          <LoadingSpinner />
          Sending...
        </>
      ) : (
        <>
          {text}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </>
      )}
    </button>
  );
};

export default Button;
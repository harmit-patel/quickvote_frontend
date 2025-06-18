import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ onClick, className = "" }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior is to go back to previous page
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 shadow-sm ${className}`}
      aria-label="Go back"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4 mr-1" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
      <span className="text-sm font-medium">Back</span>
    </button>
  );
};

export default BackButton;
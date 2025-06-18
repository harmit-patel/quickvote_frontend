import React from "react";

const OptionComponent = ({ option, onOptionChange, onRemoveOption }) => {
  return (
    <div className="flex items-center gap-3 group p-2 rounded-lg transition-all duration-300 hover:bg-indigo-50 hover:shadow-md">
      {/* Option Icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      {/* Input Field with enhanced styling */}
      <input
        type="text"
        placeholder="Enter option"
        value={option}
        onChange={onOptionChange}
        className="flex-1 px-4 py-3 border-2 border-indigo-100 rounded-lg 
                  shadow-sm focus:shadow-md focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 focus:border-transparent
                  bg-white transition-all duration-200
                  text-gray-700 placeholder-indigo-200"
      />
      
      {/* Remove Button with enhanced styling and animation */}
      <button
        onClick={onRemoveOption}
        className="px-4 py-3 rounded-lg font-medium text-sm
                  bg-gradient-to-r from-pink-500 to-rose-500 text-white
                  hover:from-rose-500 hover:to-pink-600
                  shadow-sm hover:shadow-md
                  transform transition-all duration-200
                  hover:-translate-y-1 active:translate-y-0
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400"
      >
        <div className="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Remove</span>
        </div>
      </button>
    </div>
  );
};

export default OptionComponent;
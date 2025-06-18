import React from "react";
import OptionComponent from "./OptionComponent";

const QuestionComponent = ({
  question,
  onQuestionChange,
  onAddOption,
  onRemoveQuestion,
  onOptionChange,
  onRemoveOption,
  onAddQuestion,
  removeQuestionLabel = "Remove Question",
  addOptionLabel = "Add Option",
  addQuestionLabel = "Add Question",
  showRemoveQuestion = true,
  showAddQuestion = true,
}) => {
  return (
    <div className="mb-8 p-6 bg-white border-2 border-indigo-100 rounded-xl shadow-lg 
                   hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* Decorative gradient bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-400 via-indigo-500 to-pink-500"></div>
      
      {/* Question header with better spacing and styling */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-indigo-100">
        <div className="flex items-center flex-1 min-w-[300px] gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            Q
          </div>
          <input
            type="text"
            placeholder="Enter your question here..."
            value={question.text}
            onChange={onQuestionChange}
            className="flex-1 px-4 py-3 border-2 border-indigo-100 rounded-lg 
                       shadow-sm focus:shadow-md focus:outline-none focus:ring-2 
                       focus:ring-indigo-400 focus:border-transparent
                       bg-white transition-all duration-200
                       text-gray-800 placeholder-indigo-200 font-medium"
          />
        </div>
        
        {showRemoveQuestion && (
          <button
            onClick={onRemoveQuestion}
            className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm
                      rounded-lg font-medium shadow-sm hover:shadow-md 
                      transform transition-all duration-200 hover:-translate-y-1 
                      active:translate-y-0 focus:outline-none 
                      focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 group"
          >
            <div className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>{removeQuestionLabel}</span>
            </div>
          </button>
        )}
      </div>
      
      {/* Options section with improved spacing and style */}
      <div className="space-y-4 mb-6 pl-4 border-l-2 border-indigo-100">
        <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">Options</h4>
        {question.options.map((option, index) => (
          <OptionComponent
            key={index}
            option={option}
            onOptionChange={(e) => onOptionChange(index, e.target.value)}
            onRemoveOption={() => onRemoveOption(index)}
          />
        ))}
      </div>
      
      {/* Action buttons with improved styling */}
      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-indigo-100">
        <button
          onClick={onAddOption}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white
                    rounded-lg font-medium shadow-sm hover:shadow-md 
                    transform transition-all duration-200 hover:-translate-y-1 
                    active:translate-y-0 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
        >
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{addOptionLabel}</span>
          </div>
        </button>
        
        {showAddQuestion && (
          <button
            onClick={onAddQuestion}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-600 text-white
                      rounded-lg font-medium shadow-sm hover:shadow-md 
                      transform transition-all duration-200 hover:-translate-y-1 
                      active:translate-y-0 focus:outline-none 
                      focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
          >
            <div className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{addQuestionLabel}</span>
            </div>
          </button>
        )}
      </div>
      
      
    </div>
  );
};

export default QuestionComponent;
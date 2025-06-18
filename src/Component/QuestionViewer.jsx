import React from "react";

const QuestionViewer = ({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  handleOptionChange,
  setCurrentQuestionIndex,
  handleSubmit,
}) => {
  return (
    <div className="question-container">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-blue-600">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-purple-600">
            {Math.round(((questionIndex + 1) / totalQuestions) * 100)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
        
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
          {question.text}
        </h3>
      </div>

      <div className="space-y-3 mb-8">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
              ${selectedOption === option.id 
                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md transform scale-[1.02]' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'}
            `}
            onClick={() => handleOptionChange(option.id)}
          >
            <div className="flex items-center">
              <div className={`
                w-5 h-5 rounded-full flex-shrink-0 mr-3 transition-all duration-300
                ${selectedOption === option.id 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-0 ring-2 ring-blue-200' 
                  : 'border-2 border-gray-300 bg-white'}
              `}>
              </div>
              <label className="text-gray-700 text-lg cursor-pointer w-full">
                {option.optionText}
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={() => setCurrentQuestionIndex(questionIndex - 1)}
          disabled={questionIndex === 0}
          className={`
            px-6 py-2.5 rounded-lg font-medium transition-all duration-300
            ${questionIndex > 0 
              ? 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-md border border-blue-300' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}
          `}
        >
          Previous
        </button>
        
        {questionIndex < totalQuestions - 1 ? (
          <button
            onClick={() => {
              if (selectedOption) {
                setCurrentQuestionIndex(questionIndex + 1);
              }
            }}
            disabled={!selectedOption}
            className={`
              px-6 py-2.5 rounded-lg font-medium transition-all duration-300
              ${selectedOption 
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transform hover:translate-x-1' 
                : 'bg-blue-300 text-white cursor-not-allowed'}
            `}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`
              px-8 py-2.5 rounded-lg font-medium transition-all duration-300
              ${selectedOption 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-105' 
                : 'bg-gray-300 text-white cursor-not-allowed'}
            `}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionViewer;
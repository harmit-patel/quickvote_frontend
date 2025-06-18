import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchQuestionsAPI, submitResponseAPI } from "../APIs/QuestionPageAPI"; // Import both API functions
import QuestionViewer from "../Component/QuestionViewer";

const QuestionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { surveyId, title } = location.state || {};

  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await fetchQuestionsAPI(surveyId); // Use the imported API function
        setQuestionsData(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (surveyId) fetchQuestions();
  }, [surveyId]);

  const handleOptionChange = (optionId) => {
    setResponses({
      ...responses,
      [questionsData[currentQuestionIndex]?.id]: optionId,
    });
  };

  const handleSubmit = async () => {
    try {
      await submitResponseAPI(surveyId, responses, navigate); // Use the imported API function
      // The navigate function is now passed to the API function
    } catch (error) {
      console.error("Error submitting response:", error);
      setError(error.message);
      // Optionally, display an error message to the user
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-blue-700 font-medium">Loading questions...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full border-l-4 border-red-500">
        <h3 className="text-xl font-bold text-red-700 mb-2">Error</h3>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full min-h-screen py-12 bg-gradient-to-r from-blue-100 to-purple-100 overflow-hidden">
      {/* Animated Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-400 opacity-20 blur-3xl animate-pulse rounded-full top-0 left-0"></div>
        <div className="absolute w-full h-full bg-purple-400 opacity-30 blur-3xl animate-pulse rounded-full bottom-0 right-0"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <div className="mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-50 transform -skew-y-3"></div>
            <div className="relative py-6">
              <h2 className="text-3xl font-bold text-center text-blue-800">
                {title || "Survey"}
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
            </div>
          </div>
          {questionsData.length > 0 ? (
            <QuestionViewer
              question={questionsData[currentQuestionIndex]}
              questionIndex={currentQuestionIndex}
              totalQuestions={questionsData.length}
              selectedOption={responses[questionsData[currentQuestionIndex]?.id] || ""}
              handleOptionChange={handleOptionChange}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              handleSubmit={handleSubmit}
            />
          ) : (
            <div className="text-center py-10">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-xl text-gray-600">No questions available.</p>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        {questionsData.length > 0 && (
          <div className="flex justify-center">
            <div className="bg-white bg-opacity-60 px-4 py-2 rounded-full">
              <div className="flex space-x-1">
                {questionsData.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600'
                        : index < currentQuestionIndex
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
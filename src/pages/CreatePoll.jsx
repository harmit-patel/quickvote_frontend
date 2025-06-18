import React, { useState, useEffect } from "react";
import OptionComponent from "../Component/OptionComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { createSurveyAPI, fetchFixedDomainAPI } from "../APIs/createSurveyAPI";
import { validatePoll } from "../utils/validationPollUtils";

const CreatePoll = () => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState({ text: "", options: ["", ""] });
  const [errorMessage, setErrorMessage] = useState("");
  const [endTime, setEndTime] = useState("");
  const [emailPrefix, setEmailPrefix] = useState("");
  const [emailRestrictionMode, setEmailRestrictionMode] = useState("custom"); // 'anyone' or 'custom'
  const [fixedDomain, setFixedDomain] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultShow, setresultShow] = useState(false);
  const [participationNo , setparticipationNo ] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const adminEmail = location.state?.adminEmail || "";

  // Fetch fixed domain from API on component mount
  useEffect(() => {
    const fetchDomain = async () => {
      try {
        setIsLoading(true);
        const domain = await fetchFixedDomainAPI(adminEmail);
        setFixedDomain(domain);
      } catch (error) {
        setErrorMessage(`Failed to fetch domain: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (adminEmail) {
      fetchDomain();
    }
  }, [adminEmail]);

  const addOption = () => {
    setQuestion({ ...question, options: [...question.options, ""] });
  };

  const updateOption = (optionIndex, text) => {
    const updatedOptions = [...question.options];
    updatedOptions[optionIndex] = text;
    setQuestion({ ...question, options: updatedOptions });
  };

  const removeOption = (optionIndex) => {
    if (question.options.length > 2) {
      const updatedOptions = [...question.options];
      updatedOptions.splice(optionIndex, 1);
      setQuestion({ ...question, options: updatedOptions });
      setErrorMessage("");
    } else {
      setErrorMessage("Each poll must have at least two options.");
    }
  };

  const createPoll = async () => {
    const validationError = validatePoll(title, question, endTime);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    const pollData = {
      adminEmail,
      emailRestriction: emailRestrictionMode === "anyone"
        ? "all" + fixedDomain
        : emailPrefix + fixedDomain,
      endTime,
      title,
      resultShow,
      participationNo,
      questions: [{ text: question.text, options: question.options }],
    };

    try {
      await createSurveyAPI(pollData);
      setSuccessMessage("Poll created successfully!");
      setTimeout(() => {
        navigate('/admindashboard');
      }, 2000);
    } catch (error) {
      console.error("Error creating poll:", error);
      setErrorMessage(`An error occurred while creating the poll: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full py-12 bg-gradient-to-r from-indigo-100 to-purple-100 overflow-hidden">
      {/* Animated Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-400 opacity-20 blur-3xl animate-pulse rounded-full top-0 left-0"></div>
        <div className="absolute w-full h-full bg-purple-400 opacity-30 blur-3xl animate-pulse rounded-full bottom-0 right-0"></div>
      </div>

      <div className="max-w-4xl mx-auto my-8 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl relative z-10">
        {/* Decorative header background */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600 opacity-90 rounded-t-2xl"></div>
        
        {/* Page title */}
        <div className="relative mb-12 pt-4">
          <h2 className="text-3xl font-bold text-center text-white mb-1">
            Create a Poll
          </h2>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-1 bg-white rounded-full opacity-70"></div>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-indigo-600">Loading...</span>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 mb-6 bg-sky-50 border-l-4 border-sky-500 rounded-lg flex items-center animate-fadeIn">
            <div className="mr-3 text-sky-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sky-700">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 mb-6 bg-rose-50 border-l-4 border-rose-500 rounded-lg flex items-center animate-pulse">
            <div className="mr-3 text-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="text-rose-700">{errorMessage}</span>
          </div>
        )}

        {/* Questions Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-extrabold relative px-6 py-3">
              <span className="bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                Poll Question
              </span>
              <span className="absolute bottom-0 left-2 right-2 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></span>
            </h2>
          </div>

          <div className="mb-8 p-6 bg-white border-2 border-indigo-100 rounded-xl shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-indigo-100">
              <div className="flex items-center flex-1 min-w-[300px] gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                  Q
                </div>
                <input
                  type="text"
                  placeholder="Enter your poll question here..."
                  value={question.text}
                  onChange={(e) => setQuestion({ ...question, text: e.target.value })}
                  className="flex-1 px-4 py-3 border-2 border-indigo-100 rounded-lg 
                            shadow-sm focus:shadow-md focus:outline-none focus:ring-2 
                            focus:ring-indigo-400 focus:border-transparent
                            bg-white transition-all duration-200
                            text-gray-800 placeholder-indigo-200 font-medium"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {/* Options section */}
            <div className="space-y-4 mb-6 pl-4 border-l-2 border-indigo-100">
              <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">Options</h4>
              {question.options.map((option, index) => (
                <OptionComponent
                  key={index}
                  option={option}
                  onOptionChange={(e) => updateOption(index, e.target.value)}
                  onRemoveOption={() => removeOption(index)}
                  disabled={isLoading}
                />
              ))}
            </div>
            
            {/* Add Option Button */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-indigo-100">
              <button
                onClick={addOption}
                disabled={isLoading}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-400 to-purple-600 text-white
                          rounded-lg font-medium shadow-sm hover:shadow-md 
                          transform transition-all duration-200 hover:-translate-y-1 
                          active:translate-y-0 focus:outline-none 
                          focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 flex items-center
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Option
              </button>
            </div>
          </div>
        </div>

        {/* Poll Settings */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-6 pb-2 border-b border-indigo-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900">Poll Settings</h3>
          </div>

          {/* Poll Title */}
          <div className="mb-6 relative">
            <label className="block font-semibold mb-2 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Poll Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title for your poll"
              className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        bg-white shadow-sm transition-all duration-200
                        text-gray-800 placeholder-gray-400"
              disabled={isLoading}
            />
          </div>

          {/* Email Restriction */}
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              Allowed Email Domain:
            </label>

            <div className="flex flex-col mt-2 space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="custom"
                  checked={emailRestrictionMode === "custom"}
                  onChange={() => setEmailRestrictionMode("custom")}
                  disabled={isLoading}
                />
                <span className="text-gray-700">Custom Email Prefix</span>
              </label>

              {emailRestrictionMode === "custom" && (
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter email prefix like 22ituos***"
                    value={emailPrefix}
                    onChange={(e) => setEmailPrefix(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-l-lg 
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              bg-white shadow-sm transition-all duration-200
                              text-gray-800 placeholder-gray-400"
                    disabled={isLoading}
                  />
                  <span className="bg-blue-700 text-white px-4 py-3 text-center rounded-r-lg border-2 border-blue-700 font-medium min-w-[120px]">
                    {fixedDomain || "..."}
                  </span>
                </div>
              )}

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="anyone"
                  checked={emailRestrictionMode === "anyone"}
                  onChange={() => setEmailRestrictionMode("anyone")}
                  disabled={isLoading}
                />
                <span className="text-gray-700">Anyone with domain <strong className="text-blue-700">{fixedDomain || "..."}</strong></span>
              </label>
            </div>

            <p className="mt-3 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-purple-700 font-medium">Your email restriction is:</span>
              <strong className="ml-2 text-blue-700 font-medium border-b border-dotted border-blue-500 pb-0.5">
                {emailRestrictionMode === "anyone" ? "all" : emailPrefix || "emailprefix"}{fixedDomain || "..."}
              </strong>
            </p>
          </div>

           {/* NEW FIELD: Show Results to Participants */}
          <div className="mb-6">
            <label className="block font-semibold mb-3 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Show Results to Participants:
            </label>
            
            <div className="flex items-center">
              <div 
                onClick={() => setresultShow(!resultShow)}
                className={`relative w-20 h-10 flex items-center ${resultShow ? 'justify-end bg-gradient-to-r from-blue-500 to-purple-600' : 'justify-start bg-gray-300'} rounded-full p-1 cursor-pointer transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0`}
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300">
                  {resultShow ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
              <span className={`ml-3 font-medium ${ resultShow ? 'text-blue-700' : 'text-gray-700'}`}>
                {resultShow ? 'Results will be shared with participants' : 'Results will be private'}
              </span>
            </div>
            
            <p className="mt-2 text-sm text-gray-600 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                When enabled, participants can view survey statistics after submitting their responses.
              </span>
            </p>
          </div>

          {/* NEW FIELD: Expected Participation Number */}
          <div className="mb-6 relative">
            <label className="block font-semibold mb-2 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Expected Participation Number:
            </label>
            <div className="flex">
              <div className="relative w-full">
                <input
                  type="number"
                  value={participationNo || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty field or valid numbers
                    if (value === '') {
                      setparticipationNo('');
                    } else {
                      const numValue = parseInt(value);
                      if (!isNaN(numValue)) {
                        setparticipationNo(numValue);
                      }
                    }
                  }}
                  placeholder="Enter expected number of participants"
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          bg-white shadow-sm transition-all duration-200
                          text-gray-800 placeholder-gray-400"
                />
                {participationNo !== '' && participationNo !== 0 && (
                  <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex space-x-1">
                    <button 
                      onClick={() => setparticipationNo(Math.max(0, parseInt(participationNo) - 1))}
                      className="p-1 bg-gray-200 hover:bg-gray-300 rounded-l text-gray-800 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => setparticipationNo(parseInt(participationNo) + 1)}
                      className="p-1 bg-gray-200 hover:bg-gray-300 rounded-r text-gray-800 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                This helps us optimize survey resources and prepare for the expected traffic.
              </span>
            </p>
          </div>

          {/* End Time */}
          <div className="mb-8 relative">
            <label className="block font-semibold mb-2 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              End Time:
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        bg-white shadow-sm transition-all duration-200
                        text-gray-800"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button 
            onClick={createPoll} 
            disabled={isLoading}
            className="w-full p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 text-white rounded-xl 
                      font-bold text-lg shadow-lg hover:shadow-xl 
                      transform transition-all duration-300 hover:-translate-y-1 
                      active:translate-y-0 focus:outline-none 
                      focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                      flex items-center justify-center
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Create Poll
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
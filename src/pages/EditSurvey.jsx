import React, { useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import QuestionComponent from "../Component/QuestionComponent";
import { parseExcelFile } from "../utils/excelUtils";
import { fetchSurveyAPI, updateSurveyAPI, fetchFixedDomainAPI } from "../APIs/EditSurveyAPI"; // Import your API functions

const SurveyComponent = () => {
  const location = useLocation();
    const navigate = useNavigate();

  const adminEmail = location.state?.adminEmail || "";
  const surveyId = location.state?.surveyId || "";

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ text: "", options: ["", ""] }]);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailPrefix, setEmailPrefix] = useState("");
  const [emailRestrictionMode, setEmailRestrictionMode] = useState("custom");

  const [endTime, setEndTime] = useState("");
  const [fileName, setFileName] = useState("");

  const [fixedDomain, setFixedDomain] = useState(location.state?.fixedDomain || "");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultShow, setresultShow] = useState(false);
  const [participationNo , setparticipationNo ] = useState(0);

  useEffect(() => {
    if (surveyId) {
      setIsLoading(true);
      fetchSurveyAPI(surveyId)
        .then((data) => {
          setTitle(data.title || "");
          setQuestions(data.questions || [{ text: "", options: ["", ""] }]);
          setEndTime(data.endTime || "");
          setresultShow(data.resultShow || "");
          setparticipationNo(data.participationNo || "");

          const restriction = data.emailRestriction;
          if (restriction) {
            const [prefix, domain] = restriction.split("@");
            if (prefix === "all") {
              setEmailRestrictionMode("anyone");
              setEmailPrefix("");
            } else {
              setEmailRestrictionMode("custom");
              setEmailPrefix(prefix);
            }

            if (domain) {
              setFixedDomain("@" + domain); // ✅ Ensure @ is prefixed
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching survey data:", error);
          setErrorMessage("Failed to load survey data.");
        })
        .finally(() => {
          setIsLoading(false);
        });

      // Always fetch latest fixed domain
      if (adminEmail) {
        fetchFixedDomainAPI(adminEmail)
          .then((domain) => {
            const safeDomain = domain.startsWith("@") ? domain : "@" + domain; // ✅ Safe check
            setFixedDomain(safeDomain);
          })
          .catch((error) =>
            console.error("Error fetching fixed domain:", error)
          );
      }
    } else {
      if (adminEmail) {
        fetchFixedDomainAPI(adminEmail)
          .then((domain) => {
            const safeDomain = domain.startsWith("@") ? domain : "@" + domain;
            setFixedDomain(safeDomain);
          })
          .catch((error) =>
            console.error("Error fetching fixed domain:", error)
          );
      }
    }
  }, [surveyId, adminEmail]);

  const updateQuestion = (index, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = text;
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
      setErrorMessage("");
    } else {
      setErrorMessage("At least one question must be present.");
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", ""] }]);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = text;
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setQuestions(updatedQuestions);
      setErrorMessage("");
    } else {
      setErrorMessage("Each question must have at least two options.");
    }
  };

  const validateSurvey = () => {
    if (!title.trim()) return "Survey title is required.";
    if (!adminEmail.trim()) return "Admin email is required.";
    for (const question of questions) {
      if (!question.text.trim()) return "All questions must have text.";
      if (question.options.length < 2)
        return "Each question must have at least two options.";
      if (question.options.some((option) => !option.trim()))
        return "No option can be empty.";
    }
    if (!endTime.trim()) return "End time is required.";
    return null;
  };

  const updateSurvey = async () => {
    if (!surveyId) {
      alert("Survey ID is required for updating.");
      return;
    }

    const validationError = validateSurvey();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");

    const formattedQuestions = questions.map((question) => ({
      text: question.text,
      options: question.options,
    }));

    const safeFixedDomain = fixedDomain.startsWith("@")
      ? fixedDomain
      : "@" + fixedDomain; // ✅ Defensive check

    const surveyData = {
      adminEmail,
      emailRestriction:
        emailRestrictionMode === "anyone"
          ? "all" + safeFixedDomain
          : emailPrefix + safeFixedDomain,
      endTime,
      title,
      resultShow,
      participationNo,
      questions: formattedQuestions,
    };

    try {
      const result = await updateSurveyAPI(surveyId, surveyData);
      console.log("Survey successfully updated:", result);
      setSuccessMessage("Survey updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate('/admindashboard');
      }, 2000);
    } catch (error) {
      console.error("Error updating survey:", error);
       alert(`Failed to update survey Because It is attempted: ${error.message}`);
      setErrorMessage(`Failed to update survey: ${error.message}`);
      setTimeout(() => {
        setSuccessMessage("");
        navigate('/admindashboard');
      }, 2000);
    }}
  
  const handleExcelUpload = (event) => {
    parseExcelFile(event.target.files[0], setQuestions, setFileName);
    event.target.value = "";
  };

  // Function to generate and download demo Excel template
  const downloadDemoExcel = () => {
    // Create worksheet with headers and sample data
    const ws = XLSX.utils.aoa_to_sheet([
      ['Question No', 'Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4'],
      [1, 'What is your favorite color?', 'Red', 'Blue', 'Green', 'Yellow'],
      [2, 'How satisfied are you with our service?', 'Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
      [3, 'Which feature would you like to see next?', 'Dark Mode', 'Mobile App', 'More Templates', 'Integration Options']
    ]);

    // Set column widths
    const wscols = [
      { wch: 12 }, // Question No
      { wch: 40 }, // Question
      { wch: 25 }, // Option 1
      { wch: 25 }, // Option 2
      { wch: 25 }, // Option 3
      { wch: 25 }  // Option 4
    ];
    ws['!cols'] = wscols;

    // Create workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Survey Questions");

    // Generate and download the file
    XLSX.writeFile(wb, "survey_questions_template.xlsx");
  };

    return (
      <div className="relative w-full py-12 bg-gradient-to-r from-blue-100 to-purple-100 overflow-hidden">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-400 opacity-20 blur-3xl animate-pulse rounded-full top-0 left-0"></div>
        <div className="absolute w-full h-full bg-purple-400 opacity-30 blur-3xl animate-pulse rounded-full bottom-0 right-0"></div>
      </div>
       
      <div className="max-w-4xl mx-auto my-8 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl relative z-10">
        {/* Decorative header background */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 opacity-90 rounded-t-2xl"></div>
        
        {/* Page title */}
        <div className="relative mb-12 pt-4">
          <h2 className="text-3xl font-bold text-center text-white mb-1">

          {questions.length === 1 ? "Edit Poll" : "Edit Survey"}

          </h2>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-1 bg-white rounded-full opacity-70"></div>
          </div>
        </div>
   {/* Success Message
   {successMessage && (
          <div className="p-4 mb-6 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg flex items-center animate-fadeIn">
            <div className="mr-3 text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-emerald-700">{successMessage}</span>
          </div>
        )} */}
       
       {questions.length > 1 && (
       <div className="bg-blue-50 p-6 rounded-xl mb-8 shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100">
          <div className="flex flex-col gap-4">
            {/* Demo Download Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-blue-200">
              <div className="flex items-center text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L9 5l4 2V3l4 2-4 2v3z" />
                </svg>
                <span className="font-semibold">Need a template?</span>
              </div>
              <button 
                onClick={downloadDemoExcel}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 cursor-pointer transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Demo Excel
              </button>
            </div>
            
            {/* File Upload Section */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <label className="font-semibold">Upload Questions via Excel:</label>
              </div>
              <div className="relative flex items-center flex-1">
                <label
                  htmlFor="file-upload"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 cursor-pointer transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choose File
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleExcelUpload}
                  className="hidden"
                />
                <div className="ml-3 px-4 py-2 bg-white border border-blue-200 rounded-lg flex-1 text-gray-700 truncate">
                  <span className={fileName ? "text-blue-800 font-medium" : "text-blue-300 italic"}>
                    {fileName || "No file chosen"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Help text */}
            <div className="mt-2 text-sm text-gray-600 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Excel should contain columns for <strong>Question No</strong>, <strong>Question</strong>, and
                multiple <strong>Option</strong> columns. Download the demo to see the expected format.
              </span>
            </div>
          </div>
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
              <span className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Questions
              </span>
              <span className="absolute bottom-0 left-2 right-2 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
            </h2>
          </div>
          {questions.map((question, index) => (
            <QuestionComponent
              key={index}
              question={question}
              onQuestionChange={(e) => updateQuestion(index, e.target.value)}
              onAddOption={() => addOption(index)}
              onRemoveQuestion={() => removeQuestion(index)}
              onOptionChange={(optionIndex, text) => updateOption(index, optionIndex, text)}
              onRemoveOption={(optionIndex) => removeOption(index, optionIndex)}
              onAddQuestion={addQuestion}
            />
          ))}
        </div>

        {/* Survey Settings */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-6 pb-2 border-b border-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900">Survey Settings</h3>
          </div>

          {/* Survey Title */}
          <div className="mb-6 relative">
            <label className="block font-semibold mb-2 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Survey Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title for your survey"
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        bg-white shadow-sm transition-all duration-200
                        text-gray-800 placeholder-gray-400"
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
        />
        <span className="bg-blue-700 text-white px-4 py-3 text-center rounded-r-lg border-2 border-blue-700 font-medium min-w-[120px]">
          {fixedDomain}
        </span>
      </div>
    )}

    <label className="flex items-center space-x-2">
      <input
        type="radio"
        value="anyone"
        checked={emailRestrictionMode === "anyone"}
        onChange={() => setEmailRestrictionMode("anyone")}
      />
      <span className="text-gray-700">Anyone with domain <strong className="text-blue-700">{fixedDomain}</strong></span>
    </label>
  </div>

  <p className="mt-3 text-sm flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span className="text-purple-700 font-medium">Your email restriction is:</span>
    <strong className="ml-2 text-blue-700 font-medium border-b border-dotted border-blue-500 pb-0.5">
      {emailRestrictionMode === "anyone" ? "all" : emailPrefix || "emailprefix"}{fixedDomain}
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              End Time:
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        bg-white shadow-sm transition-all duration-200
                        text-gray-800"
            />
          </div>

          {/* Submit Button */}
          <button 
            onClick={updateSurvey} 
            className="w-full p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white rounded-xl 
                      font-bold text-lg shadow-lg hover:shadow-xl 
                      transform transition-all duration-300 hover:-translate-y-1 
                      active:translate-y-0 focus:outline-none 
                      focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Create Survey
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyComponent;
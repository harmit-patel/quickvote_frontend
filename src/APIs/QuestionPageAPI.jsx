// src/APIs/QuestionPageAPI.jsx
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Helper function to get and decode JWT token
const getDecodedToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// API to fetch questions for a specific survey
export const fetchQuestionsAPI = async (surveyId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("JWT token not found in localStorage.");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/surveys/${surveyId}/questions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

// API to submit survey responses
export const submitResponseAPI = async (surveyId, responses, navigate) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("JWT token not found in localStorage.");
    alert("Authentication token is missing. Please log in again.");
    return;
  }

  const decodedToken = getDecodedToken();
  const email = decodedToken?.sub; // Get email from the 'sub' claim
  if (!email) {
    console.error("Email not found in JWT token.");
    alert("User email not found in authentication token. Please log in again.");
    return;
  }

  const surveySubmissionData = {
    email: email,
    responses: Object.entries(responses).map(([questionId, optionId]) => ({
      questionId: parseInt(questionId, 10),
      optionId: parseInt(optionId, 10),
    })),
  };

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/surveys/${surveyId}/responses`,
      { ...surveySubmissionData }, // Send the submission data
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      navigate("/dashboard");
      return response.data; // Optionally return data on success
    } else {
      // Axios throws an error for non-2xx status codes by default
      // This part might not be reached directly for server errors
      const errorData = response.data || "Submission failed";
      throw new Error(`Failed to submit responses: ${JSON.stringify(errorData)}`);
    }

  } catch (error) {
    console.error("Error submitting survey:", error);
    let errorMessage = "Failed to submit survey. Please try again.";
    if (error.response && error.response.data) {
      errorMessage += ` Error: ${JSON.stringify(error.response.data)}`;
    } else if (error.message) {
      errorMessage += ` Error: ${error.message}`;
    }
    alert(errorMessage);
    throw error; // Re-throw the error to be caught in the component
  }
};
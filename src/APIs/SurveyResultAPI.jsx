// src/APIs/SurveyResultAPI.jsx
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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

// API to fetch survey data by survey ID
export const fetchSurveyResultsAPI = async (surveyId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("JWT token not found in localStorage.");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/survey-results/results`,
      { surveyId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching survey data:", error);
    throw error;
  }
};

// API to fetch user responses for a specific survey
export const fetchUserResponsesAPI = async (surveyId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("JWT token not found in localStorage.");
    throw new Error("Authentication token is missing.");
  }

  const decodedToken = getDecodedToken();
  const email = decodedToken?.sub; // Get email from the 'sub' claim
  if (!email) {
    console.error("Email not found in JWT token.");
    throw new Error("User email not found in authentication token.");
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/responses/fetch`,
      { surveyId, email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.responses || [];
  } catch (error) {
    console.error("Error fetching user responses:", error);
    throw error;
  }
};
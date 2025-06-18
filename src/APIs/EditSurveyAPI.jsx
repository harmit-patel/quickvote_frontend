// src/APIs/EditSurveyAPI.jsx
import { jwtDecode } from "jwt-decode";

// Helper function to get and decode JWT token
export const getDecodedToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// API to fetch survey by ID
export const fetchSurveyAPI = async (surveyId) => {
  const token = localStorage.getItem("token");
  
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/surveys/${surveyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(errorResponse || "Failed to fetch survey");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching survey:", error);
    throw error;
  }
};

// API to update survey
export const updateSurveyAPI = async (surveyId, surveyData) => {
  const token = localStorage.getItem("token");
  
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/surveys/${surveyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(surveyData)
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(errorResponse || "Failed to update survey");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating survey:", error);
    throw error;
  }
};

// API to fetch the fixed domain for an admin
export const fetchFixedDomainAPI = async () => {
  const token = localStorage.getItem("token");
  const decodedToken = getDecodedToken();
  
  if (!decodedToken || !decodedToken.sub) {
    throw new Error("Invalid token or missing email");
  }
  
  try {
    const response = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/admins/getFixedDomain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ email: decodedToken.sub })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch fixed domain");
    }

    const data = await response.json();
    return data.fixedDomain;
  } catch (error) {
    console.error("Error fetching fixed domain:", error);
    throw error;
  }
};
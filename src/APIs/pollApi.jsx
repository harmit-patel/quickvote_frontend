// src/APIs/pollApi.js
export const createSurveyAPI = async (surveyData) => {
  const token = localStorage.getItem("token"); // Get JWT token from localStorage
  
  try {
    const response = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/surveys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(surveyData),
    });
    
    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(errorResponse || "Failed to create survey");
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
};

// API to fetch the fixed domain for an admin
export const fetchFixedDomainAPI = async (adminEmail) => {
  const token = localStorage.getItem("token");
  
  try {
    const response = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/admins/getFixedDomain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ email: adminEmail }),
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
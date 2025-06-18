import axios from "axios";

// Helper function to get JWT token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

export const fetchSurveysByEmail = async (email) => {
  const token = getToken();
  const institutionName = localStorage.getItem("InstituteName"); // 👈 Get institute name from localStorage

  if (!token) {
    console.error("JWT token not found in localStorage.");
    return [];
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/surveys/filter-by-email`,
      { email, institutionName }, // 👈 Include both email and institutionName in payload
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return [];
  }
};

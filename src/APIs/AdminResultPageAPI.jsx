import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "${import.meta.env.VITE_BACKEND_URL}/api";

// Create axios instance with default configs
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get user info from JWT token
export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return {
      email: decoded.sub,
      role: decoded.role,
      exp: decoded.exp,
      iat: decoded.iat
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = () => {
  const user = getUserFromToken();
  if (!user) return true;
  const currentTime = Date.now() / 1000;
  return user.exp < currentTime;
};

// Survey related API calls
export const getSurveyData = async (surveyId) => {
  try {
    const response = await apiClient.post("/survey-results/results", {
      surveyId,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching survey data:", error);
    throw error;
  }
};

export default {
  getSurveyData,
  getUserFromToken,
  isTokenExpired
};
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Base URL for API calls
const API_BASE_URL = "${import.meta.env.VITE_BACKEND_URL}/api";

// Function to get JWT token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Function to decode JWT token
export const decodeToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Get super admin data from token
export const getSuperAdminData = () => {
  const decodedToken = decodeToken();
  if (!decodedToken) return null;
  
  return {
    email: decodedToken.sub, // Email is stored in 'sub' claim of JWT
    role: decodedToken.role
  };
};

// API to fetch pending admin requests
export const fetchPendingAdmins = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/admins/pending`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pending admins:", error);
    throw error;
  }
};

// API to fetch approved admins
export const fetchApprovedAdmins = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/admins/approved`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching approved admins:", error);
    throw error;
  }
};

// API to process admin approval/rejection
export const processAdminRequest = async (email, status) => {
  try {
    const token = getToken();
    await axios.post(`${API_BASE_URL}/admins/process`, 
      { email, status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return true;
  } catch (error) {
    console.error(`Error ${status} admin:`, error);
    throw error;
  }
};

// Verify if user is authenticated and has super admin role
export const verifySuperAdmin = () => {
  const decodedToken = decodeToken();
  
  if (!decodedToken) {
    return false;
  }
  
  // Check if the role is superadmin
  return decodedToken.role === "superAdmin";
};
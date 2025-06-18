// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem('token'); // Optional: clear invalid token
      return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(decoded.role)) {
      return <Navigate to="/unauthorized" />;
    }

    return children;

  } catch (error) {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;

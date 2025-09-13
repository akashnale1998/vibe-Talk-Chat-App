import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check token in localStorage

  if (!token) {
    return <Navigate to="/login" replace />; // Redirect if no token
  }

  return children; // Allow access if token exists
};

export default ProtectedRoute;

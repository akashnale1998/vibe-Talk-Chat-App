import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    // Redirect logged-in users away from login/register
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;

import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem("jwtToken"); // Check login status

  return isLoggedIn ? element : <Navigate to="/login" />; // Redirect if not logged in
};

export default PrivateRoute;

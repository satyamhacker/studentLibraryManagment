import React from "react";
import { Navigate } from "react-router-dom";
import { localStorageToken } from "../url/urlConfig.url.js";

const PrivateRoute = ({ element }) => {
  const isLoggedIn = localStorageToken // Check login status

  return isLoggedIn ? element : <Navigate to="/login" />; // Redirect if not logged in
};

export default PrivateRoute;

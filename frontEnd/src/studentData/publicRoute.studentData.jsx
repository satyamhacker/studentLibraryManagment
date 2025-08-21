import React from "react";
import { Navigate } from "react-router-dom";
import { localStorageToken } from "../url/index.url.js";

const PublicRoute = ({ element }) => {
  const isLoggedIn = localStorageToken; // Check login status

  return isLoggedIn ? <Navigate to="/homePage" /> : element;
};

export default PublicRoute;

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HomeButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on auth pages or home page itself
  if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/forgotPassword" || location.pathname === "/homePage") {
    return null;
  }

  return (
    <button
      onClick={() => navigate("/homePage")}
      className="fixed top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      title="Go to Home"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    </button>
  );
};

export default HomeButton;
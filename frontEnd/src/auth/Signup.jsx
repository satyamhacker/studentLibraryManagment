import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postRequest } from "../utils/api"; // Import the postRequest function
import BeatLoader from "react-spinners/BeatLoader"; // For loading spinner; install: npm install react-spinners

const Signup = () => {
  const page = "Library Signup Page";
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if the user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    // Basic validation
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setErrorMessage("Please enter a valid email.");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await postRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/signup`,
        formData,
        navigate
      );

      // Check if the response indicates success
      if (response === "User created") {
        alert("User created. Now you can login."); // Consider replacing with a toast for better UX
        navigate("/login");
      } else if (response.error === "User already exists") {
        setErrorMessage("User already exists. Please use a different email.");
      } else {
        setErrorMessage("There was an error creating the user. Please try again.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMessage("There is some network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage(""); // Clear error on input change
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg md:w-1/3">
        <h2 className="text-2xl font-bold text-center text-blue-600">{page}</h2>
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? <BeatLoader color="#ffffff" size={8} /> : "Signup"}
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600 hover:underline">
            Go to login page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postRequest } from "../utils/api"; // Import the postRequest function

const Signup = () => {
  const page = " Library Signup Page";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // State to handle error messages
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Redirect to home if the user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error message

    try {
      const response = await postRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/signup`,
        formData,
        navigate
      );

      // Check if the response indicates success
      if (response === "User created") {
        alert("User created. Now you can login.");
        navigate("/login"); // Navigate to login page
      } else if (response.error === "User already exists") {
        setErrorMessage("User already exists. Please use a different email."); // Handle conflict error
      } else {
        setErrorMessage(
          "There was an error creating the user. Please try again."
        ); // Handle unexpected error
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMessage("There is some network error. Please try again later."); // Handle network errors
    }
  };

  // Update state when input values change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div className="signup-container">
        <h2 className="bg-blue-500 text-white p-2">{page}</h2>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        {/* Signup form using standard HTML */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="bg-white-1000 text-black p-2 text-lg font-bold block">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control block w-full p-2 border rounded"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="bg-white-900 text-black p-2 text-lg font-bold block">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control block w-full p-2 border rounded"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button className="bg-blue-700 text-white p-2 rounded w-full hover:bg-blue-800 transition" type="submit">
            Signup
          </button>
        </form>
        <div className="mt-4 active:bg-green-600 underline">
          <Link to="/login" className="font-bold bg-white">
            Go to login page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

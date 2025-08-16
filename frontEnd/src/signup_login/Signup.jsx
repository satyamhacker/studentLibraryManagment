import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
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
        {errorMessage && <p className="text-danger">{errorMessage}</p>}{" "}
        {/* Display error message */}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className="bg-white-1000 text-black p-2 text-lg font-bold">
              Email address
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label className="bg-white-900 text-black p-2 text-lg font-bold">
              Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Button className="bg-blue-700" type="submit">
            Signup
          </Button>
        </Form>
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

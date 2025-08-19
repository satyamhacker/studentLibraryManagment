import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader"; // For loading spinner; install: npm install react-spinners

// Assuming you have a postRequest utility function like this (define it if not):
// const postRequest = async (url, data, navigate) => {
//   try {
//     const res = await fetch(url, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
//     return res.json();
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await postRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/login`,
        formData,
        navigate
      );

      if (response && response.length > 0) {
        const userData = response[0];
        alert("Login successful"); // Consider replacing with a toast library like react-toastify for better UX



        // Note: Storing JWT in localStorage is common but not the most secure. Consider httpOnly cookies.
        localStorage.setItem("jwtToken", response);
        localStorage.setItem("isLoggedIn", "true");

        navigate("/home");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error on input change
  };

  // Optional: Auto-logout on unmount (but better to handle via a logout button)
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg md:w-1/3">
        <h2 className="text-2xl font-bold text-center text-blue-600">Library Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-4">
            <Form.Label className="block text-sm font-medium text-gray-700">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mb-6">
            <Form.Label className="block text-sm font-medium text-gray-700">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Group>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? <BeatLoader color="#ffffff" size={8} /> : "Login"}
          </Button>
        </Form>
        <div className="flex justify-between mt-4 text-sm">
          <Link to="/" className="text-blue-600 hover:underline">Go to Signup</Link>
          <Link to="/forgotPassword" className="text-blue-600 hover:underline">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

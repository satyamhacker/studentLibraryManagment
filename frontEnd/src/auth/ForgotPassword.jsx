import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate added for potential redirects; already in your deps
import { postRequest } from "../utils/api";
import BeatLoader from "react-spinners/BeatLoader"; // Already in your package.json

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // To style messages as error (red) or success (green)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Optional: For redirects if needed

  const handleSendOtp = async () => {
    setMessage("");
    setIsError(false);
    setLoading(true);

    // Basic validation
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setMessage("Please enter a valid email.");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await postRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/sendOtp`,
        { email }
      );
      if (response.success) {
        setMessage("OTP sent to your email.");
        setStep(2);
      } else {
        setMessage("Failed to send OTP. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Error sending OTP. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setMessage("");
    setIsError(false);
    setLoading(true);

    // Basic validation
    if (otp.length !== 6) { // Assuming OTP is 6 digits; adjust as needed
      setMessage("OTP should be 6 digits.");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await postRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/verifyOtp`,
        { email, otp }
      );
      if (response.success) {
        setMessage("OTP verified successfully.");
        setStep(3);
      } else {
        setMessage("Invalid OTP. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Error verifying OTP. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setMessage("");
    setIsError(false);
    setLoading(true);

    // Basic validation
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setIsError(true);
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await postRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/resetPassword`,
        { email, newPassword }
      );
      if (response.success) {
        setMessage("Password reset successfully. You can now log in.");
        setStep(4);
      } else {
        setMessage("Failed to reset password. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Error resetting password. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg md:w-1/3">
        <h2 className="text-2xl font-bold text-center text-blue-600">Forgot Password</h2>
        {message && (
          <p className={`text-center ${isError ? "text-red-500" : "text-green-500"}`}>
            {message}
          </p>
        )}
        {step === 1 && (
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Enter your email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? <BeatLoader color="#ffffff" size={8} /> : "Send OTP"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter the OTP sent to your email
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? <BeatLoader color="#ffffff" size={8} /> : "Verify OTP"}
            </button>
          </form>
        )}
        {step === 3 && (
          <form className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? <BeatLoader color="#ffffff" size={8} /> : "Reset Password"}
            </button>
          </form>
        )}
        {step === 4 && (
          <div className="text-center space-y-4">
            <p className="text-green-500">Password reset successfully. You can now log in.</p>
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Go to Login Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

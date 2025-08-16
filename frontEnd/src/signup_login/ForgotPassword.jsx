import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { postRequest } from "../utils/api"; // Import the postRequest function

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
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
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Error sending OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
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
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Error verifying OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
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
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Error resetting password. Please try again.");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div className="forgot-password-container">
        <h2 className="bg-blue-500 text-white p-2">Forgot Password</h2>
        {message && <p className="text-green-500">{message}</p>}
        {step === 1 && (
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className="bg-white-1000 text-black p-2 text-lg font-bold">
                Enter your email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button className="bg-blue-800 mt-3" onClick={handleSendOtp}>
              Send OTP
            </Button>
          </Form>
        )}
        {step === 2 && (
          <Form>
            <Form.Group controlId="formBasicOtp">
              <Form.Label className="bg-white-1000 text-black p-2 text-lg font-bold">
                Enter the OTP sent to your email
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </Form.Group>
            <Button className="bg-blue-800 mt-3" onClick={handleVerifyOtp}>
              Verify OTP
            </Button>
          </Form>
        )}
        {step === 3 && (
          <Form>
            <Form.Group controlId="formBasicNewPassword">
              <Form.Label className="bg-white-1000 text-black p-2 text-lg font-bold">
                New Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicConfirmPassword">
              <Form.Label className="bg-white-1000 text-black p-2 text-lg font-bold">
                Confirm New Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button className="bg-blue-800 mt-3" onClick={handleResetPassword}>
              Reset Password
            </Button>
          </Form>
        )}
        {step === 4 && (
          <div>
            <p>Password reset successfully. You can now log in.</p>
            <Link to="/login" className="font-bold bg-white">
              Go to Login Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

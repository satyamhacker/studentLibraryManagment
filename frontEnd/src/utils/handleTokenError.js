const handleTokenError = (error, navigate) => {
  console.error("Error:", error);
  if (error.response && (error.response.status === 401 || error.response.status === 400)) {
    localStorage.removeItem("jwtToken");
    alert("Session expired or invalid token. Please log in again.");
    navigate("/login");
  }
};

export default handleTokenError;

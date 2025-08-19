import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "../styles/neonButton.css"; // Kept your custom neon CSS

const HomePage = () => {
  const navigate = useNavigate();

  // Button data structured as two columns
  const buttons = [
    // Left column
    [
      {
        text: "Add Student Details",
        route: "/addStudent",
        highlight: "yellow",
      },
      {
        text: "Show All Student Details",
        route: "/showStudentsData",
        highlight: "red",
      },
      {
        text: "Students with Unallocated Seats",
        route: "/unallocatedStudentsSeats",
        highlight: "yellow",
      },
      {
        text: "Students with Fees Dues",
        route: "/studentsWithDues",
        highlight: "yellow",
      },
    ],
    // Right column
    [
      {
        text: "Show Vacant Seats",
        route: "/StudentsWithoutAllocatedSeats",
        highlight: "yellow",
      },
      {
        text: "Students with Locker",
        route: "/studentsWithLocker",
        highlight: "red",
      },
      {
        text: "Students with Ending Subscriptions This Month",
        route: "/studentsWithEndedMonth",
        highlight: "yellow",
      },
      {
        text: "Filter Students Data",
        route: "/filterStudentData",
        highlight: "red",
      },
    ],
  ];

  // Handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage data
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto w-full bg-white shadow-lg rounded-lg p-8">
        {/* Header with Logout Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-blue-600">Home Page</h1>
            <p className="text-gray-500 mt-1">Welcome to Library Management</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 neon-button neon-red py-2 px-4 rounded-lg text-white font-medium hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>

        {/* Two-column responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {buttons[0].map((btn, idx) => (
              <button
                key={idx}
                onClick={() => navigate(btn.route)}
                className={`neon-button w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${btn.highlight === "red" ? "neon-red bg-red-600" : "neon-yellow bg-yellow-600"
                  }`}
              >
                <FontAwesomeIcon
                  icon={btn.highlight === "red" ? faPause : faPlay}
                  className="text-lg"
                />
                {btn.text}
              </button>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => navigate(btn.route)}
                className={`neon-button w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${btn.highlight === "red" ? "neon-red bg-red-600" : "neon-yellow bg-yellow-600"
                  }`}
              >
                <FontAwesomeIcon
                  icon={btn.highlight === "red" ? faPause : faPlay}
                  className="text-lg"
                />
                {btn.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

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
    window.location.reload()
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex items-center justify-center p-2 sm:p-6">
      <div className="max-w-4xl mx-auto w-full bg-white/80 backdrop-blur shadow-2xl rounded-2xl p-0 sm:p-10 border border-gray-100">
        {/* Header with Logout Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-7 px-0 py-6 sm:px-6 bg-white border-b border-blue-100 rounded-t-2xl gap-2">
          <div className="flex items-center gap-5 text-center sm:text-left">
            <span className="hidden sm:inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full border border-blue-200 shadow-sm">
              <FontAwesomeIcon icon={faPlay} className="text-3xl text-blue-500" />
            </span>
            <div>
              <h1 className="uppercase text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-blue-800">Student Library</h1>
              <p className="text-gray-500 text-base mt-1">A modern platform for efficient student management</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 py-2.5 px-7 rounded-lg text-blue-700 border border-blue-500 font-semibold tracking-wide bg-white shadow-lg hover:bg-blue-50 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            style={{ letterSpacing: 1 }}
          >
            Logout
          </button>
        </div>
        {/* Section Helper */}
        <div className="mb-8 px-1 sm:px-6">
          <div className="text-base sm:text-lg text-gray-700 font-light mb-0.5">Quick Actions</div>
          <div className="text-xs sm:text-sm text-gray-400 ">Use the navigation below to manage students, seats, dues, lockers, and more.</div>
        </div>
        {/* Two-column responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-1 sm:px-6 pb-5">
          {/* Left Column */}
          <div className="space-y-4">
            {buttons[0].map((btn, idx) => (
              <button
                key={idx}
                onClick={() => navigate(btn.route)}
                className={`group w-full py-3 pl-5 pr-4 rounded-lg border shadow-sm flex items-center gap-4 bg-white/90 hover:shadow-lg hover:border-blue-300 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 ${btn.highlight === "red" ? "border-red-200 hover:bg-red-50" : "border-blue-100 hover:bg-blue-50"}`}
              >
                <FontAwesomeIcon
                  icon={btn.highlight === "red" ? faPause : faPlay}
                  className={`text-xl ${btn.highlight === "red" ? "text-red-400" : "text-blue-400"} group-hover:scale-110 transition-transform`}
                />
                <span className={`text-base font-medium tracking-wide text-gray-700 group-hover:text-blue-700 ${btn.highlight === "red" ? "group-hover:text-red-500" : ""}`}>{btn.text}</span>
              </button>
            ))}
          </div>
          {/* Right Column */}
          <div className="space-y-4">
            {buttons[1].map((btn, idx) => (
              <button
                key={idx}
                onClick={() => navigate(btn.route)}
                className={`group w-full py-3 pl-5 pr-4 rounded-lg border shadow-sm flex items-center gap-4 bg-white/90 hover:shadow-lg hover:border-blue-300 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 ${btn.highlight === "red" ? "border-red-200 hover:bg-red-50" : "border-blue-100 hover:bg-blue-50"}`}
              >
                <FontAwesomeIcon
                  icon={btn.highlight === "red" ? faPause : faPlay}
                  className={`text-xl ${btn.highlight === "red" ? "text-red-400" : "text-blue-400"} group-hover:scale-110 transition-transform`}
                />
                <span className={`text-base font-medium tracking-wide text-gray-700 group-hover:text-blue-700 ${btn.highlight === "red" ? "group-hover:text-red-500" : ""}`}>{btn.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

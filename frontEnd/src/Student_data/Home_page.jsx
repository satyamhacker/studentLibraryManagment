import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "../styles/neonButton.css";

const HomePage = () => {
  const navigate = useNavigate();

  // Button data structured as two columns to match the screenshot
  const buttons = [
    // Left column
    [
      {
        text: "ADD STUDENT DETAILS",
        route: "/addStudent",
        highlight: "yellow",
      },
      {
        text: "SHOW ALL STUDENT DETAILS",
        route: "/showStudentsData",
        highlight: "red",
      },
      {
        text: "SHOW STUDENTS WITH UNALLOCATED SEATS",
        route: "/unallocatedStudentsSeats",
        highlight: "yellow",
      },
      {
        text: "SHOW STUDENTS WITH FEES DUES",
        route: "/studentsWithDues",
        highlight: "yellow",
      },
    ],
    // Right column
    [
      {
        text: "SHOW VACCANT SEATS",
        route: "/StudentsWithoutAllocatedSeats",
        highlight: "yellow",
      },
      {
        text: "SHOW STUDENTS WITH LOCKER",
        route: "/studentsWithLocker",
        highlight: "red",
      },
      {
        text: "SHOW STUDENTS Who's Subscription Ends This Month",
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
    <Container className="text-center mt-5" style={{ maxWidth: "600px" }}>
      {/* Header with Logout Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="neon-header">HOME PAGE</div>
        <Button className="neon-button neon-red" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="button-grid">
        {/* Left Column */}
        <div className="button-column">
          {buttons[0].map((btn, idx) => (
            <Button
              key={idx}
              className={`neon-button ${
                btn.highlight === "red" ? "neon-red" : "neon-yellow"
              }`}
              onClick={() => navigate(btn.route)}
            >
              <FontAwesomeIcon
                icon={btn.highlight === "red" ? faPause : faPlay}
                className="button-icon"
              />
              {btn.text}
            </Button>
          ))}
        </div>

        {/* Right Column */}
        <div className="button-column">
          {buttons[1].map((btn, idx) => (
            <Button
              key={idx}
              className={`neon-button ${
                btn.highlight === "red" ? "neon-red" : "neon-yellow"
              }`}
              onClick={() => navigate(btn.route)}
            >
              <FontAwesomeIcon
                icon={btn.highlight === "red" ? faPause : faPlay}
                className="button-icon"
              />
              {btn.text}
            </Button>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default HomePage;

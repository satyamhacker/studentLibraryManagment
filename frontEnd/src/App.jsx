import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicRoute, PrivateRoute } from "./studentData/index.studentData.js"
import "./styles/darkMode.css"; // Import dark mode styles

import { Login, Signup, ForgotPassword } from "./auth/index.auth.js"
import { HomePage, AddStudentData, ShowVacantSeats, ShowStudentData, ShowLockers, UnallocatedStudentsSeat } from "./studentData/index.studentData.js"


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const confirmationMessage =
        "Are you sure you want to leave? Your session will end.";
      event.returnValue = confirmationMessage; // This triggers the default confirmation dialog
      return confirmationMessage; // For some browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
  };

  return (
    <BrowserRouter>
      <div className={isDarkMode ? "dark-mode" : ""}>
        <button onClick={toggleDarkMode} className="toggle-dark-mode">
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <Routes>
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/" element={<PublicRoute element={<Signup />} />} />
          <Route
            path="/forgotPassword"
            element={<PublicRoute element={<ForgotPassword />} />}
          />

          <Route
            path="/homePage"
            element={<PrivateRoute element={<HomePage />} />}
          />

          <Route
            path="/StudentsWithoutAllocatedSeats"
            element={<PrivateRoute element={<ShowVacantSeats />} />}
          />

          <Route
            path="/addStudent"
            element={<PrivateRoute element={<AddStudentData />} />}
          />

          <Route
            path="/showStudentsData"
            element={<PrivateRoute element={<ShowStudentData />} />}
          />

          <Route
            path="/studentsWithLocker"
            element={<PrivateRoute element={<ShowLockers />} />}
          />

          <Route
            path="/unallocatedStudentsSeats"
            element={<PrivateRoute element={<UnallocatedStudentsSeat />} />}
          />

          {/* Private Routes */}
          {/*
          
          <Route
            path="/studentsWithDues"
            element={<PrivateRoute element={<StudentWithDues />} />}
          />
          
          
          <Route
            path="/studentsWithEndedMonth"
            element={<PrivateRoute element={<ShowStudentsWithEndedMonth />} />}
          />

          <Route
            path="/filterStudentData"
            element={<PrivateRoute element={<FilterStudentData />} />}
          /> */}

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

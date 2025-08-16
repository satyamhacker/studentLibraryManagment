import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./signup_login/Login";
import Signup from "./signup_login/Signup";
import AddStudent from "./Student_data/Add_student_data";
import ShowStudentData from "./Student_data/Show_student_data";
import HomePage from "./Student_data/Home_page";
import UnallocatedStudentsSeat from "./Student_data/Unallocated_students_seat";
import StudentWithDues from "./Student_data/Student_with_dues";
import StudentsWithLocker from "./Student_data/Show_students_haveLocker";
import ShowVacantSeats from "./Student_data/Show_studentsName_seatsUnallocated";
import ShowStudentsWithEndedMonth from "./Student_data/Students_subscription_ends";
import PublicRoute from "./Student_data/PublicRoute"; // Import the PublicRoute component
import PrivateRoute from "./Student_data/PrivateRoute"; // Import the PrivateRoute component
import ForgotPassword from "./signup_login/ForgotPassword";
import FilterStudentData from "./Student_data/Filter_student_data";
import "./styles/darkMode.css"; // Import dark mode styles

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

          {/* Private Routes */}
          <Route
            path="/addStudent"
            element={<PrivateRoute element={<AddStudent />} />}
          />
          <Route
            path="/showStudentsData"
            element={<PrivateRoute element={<ShowStudentData />} />}
          />
          <Route
            path="/unallocatedStudentsSeats"
            element={<PrivateRoute element={<UnallocatedStudentsSeat />} />}
          />
          <Route
            path="/studentsWithDues"
            element={<PrivateRoute element={<StudentWithDues />} />}
          />
          <Route
            path="/studentsWithLocker"
            element={<PrivateRoute element={<StudentsWithLocker />} />}
          />
          <Route
            path="/StudentsWithoutAllocatedSeats"
            element={<PrivateRoute element={<ShowVacantSeats />} />}
          />
          <Route
            path="/studentsWithEndedMonth"
            element={<PrivateRoute element={<ShowStudentsWithEndedMonth />} />}
          />

          <Route
            path="/filterStudentData"
            element={<PrivateRoute element={<FilterStudentData />} />}
          />

          <Route
            path="/home"
            element={<PrivateRoute element={<HomePage />} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

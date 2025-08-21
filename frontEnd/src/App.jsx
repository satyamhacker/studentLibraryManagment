import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicRoute, PrivateRoute } from "./studentData/index.studentData.js"

import { Login, Signup, ForgotPassword } from "./auth/index.auth.js"
import { HomePage, AddStudentData, ShowVacantSeats, ShowStudentData, ShowLockers, UnallocatedStudentsSeat, ShowStudentsWithEndedMonth, StudentWithDues, FilterStudentData } from "./studentData/index.studentData.js"


function App() {
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

  return (
    <BrowserRouter>
      <div>
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

          <Route
            path="/studentsWithEndedMonth"
            element={<PrivateRoute element={<ShowStudentsWithEndedMonth />} />}
          />

          <Route
            path="/studentsWithDues"
            element={<PrivateRoute element={<StudentWithDues />} />}
          />

          <Route
            path="/filterStudentData"
            element={<PrivateRoute element={<FilterStudentData />} />}
          />



        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

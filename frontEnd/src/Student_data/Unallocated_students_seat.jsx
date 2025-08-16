import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/neonUnallocated.css"; // Custom CSS file for neon effects
import { getRequest } from "../utils/api"; // Import the utility functions

const UnallocatedStudentsSeat = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate(); // Define navigate

  // Fetch student data from backend
  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const data = await getRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/getStudents`,
        navigate
      );
      console.log("Response data:", data);
      const unallocatedStudents = data.filter(
        (student) => student.SeatNumber === "0" // Filter for SeatNumber "0"
      );

      if (unallocatedStudents.length === 0) {
        alert("All students have been allocated seats");
      }

      setStudents(unallocatedStudents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    Object.values(student).some((value) =>
      value
        ? value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        : false
    )
  );

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US");
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <h1 className="neon-header text-center">
            Students Without Seat Allocation
          </h1>
        </Col>
      </Row>

      {/* Search Box */}
      <Row className="mb-4">
        <Col>
          <Form>
            <Form.Control
              type="text"
              placeholder="Search by any field..."
              value={searchTerm}
              onChange={handleSearch}
              className="neon-input w-100"
            />
          </Form>
        </Col>
      </Row>

      {loading ? (
        <p className="neon-loading text-center">Loading...</p>
      ) : filteredStudents.length === 0 ? (
        <p className="text-center">
          No students are currently unallocated (Seat Number: 0).
        </p>
      ) : (
        <div className="neon-table-container">
          <Table striped bordered hover responsive className="neon-table">
            <thead>
              <tr>
                <th>Registration Number</th>
                <th>Admission Date</th>
                <th>Fees Paid Till</th>
                <th>Student Name</th>
                <th>Father's Name</th>
                <th>Address</th>
                <th>Contact Number</th>
                <th>Time Slots</th>
                <th>Shift</th>
                <th>Seat Number</th>
                <th>Payment Mode</th>
                <th>Admission Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.RegistrationNumber}</td>
                  <td>{formatDate(student.AdmissionDate)}</td>
                  <td>{formatDate(student.FeesPaidTillDate)}</td>
                  <td>{student.StudentName}</td>
                  <td>{student.FatherName}</td>
                  <td>{student.Address}</td>
                  <td>{student.ContactNumber}</td>
                  <td>{student.TimeSlots.join(", ")}</td>
                  <td>{student.Shift}</td>
                  <td>{student.SeatNumber}</td>
                  <td>{student.PaymentMode}</td>
                  <td>{student.AdmissionAmount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default UnallocatedStudentsSeat;

import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col, Form } from "react-bootstrap";
import { getRequest } from "../utils/api"; // Import the utility functions
import "../styles/neonDues.css"; // Custom CSS file for neon effects
import { useNavigate } from "react-router-dom"; // Import useNavigate

const StudentWithDues = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
      setStudents(data);
      console.log("response from server", data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter students with unpaid fees (including "₹0" and "₹" as unpaid)
  const studentsWithDues = students.filter((student) => student.AmountDue > 0);

  // Filter based on search term
  const filteredStudents = studentsWithDues.filter((student) =>
    Object.values(student).some(
      (value) =>
        value != null &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()) // Check if value is not null
    )
  );

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col md={8}>
          <h2 className="neon-header text-center">Unpaid Fees Students</h2>
        </Col>
        <Col md={4}>
          <Form inline="true">
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

      {studentsWithDues.length === 0 ? (
        <p className="text-center">No students with unpaid fees found.</p>
      ) : (
        <div className="neon-table-container">
          <Table striped bordered hover responsive className="neon-table">
            <thead>
              <tr>
                <th>Admission Number</th>
                <th>Admission Date</th>
                <th>Student Name</th>
                <th>Address</th>
                <th>Contact Number</th>
                <th>Time</th>
                <th>Shift</th>
                <th>Seat Number</th>
                <th>Amount Paid</th>
                <th>Amount Due</th>
                <th>Locker Number</th>
                <th>Fees Paid Till</th>
                <th>Payment Mode</th>
                <th>Admission Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.RegistrationNumber}</td>
                  <td>
                    {new Date(student.AdmissionDate).toLocaleDateString()}
                  </td>
                  <td>{student.StudentName}</td>
                  <td>{student.Address}</td>
                  <td>{student.ContactNumber}</td>
                  <td>{student.Time}</td>
                  <td>{student.Shift}</td>
                  <td>{student.SeatNumber}</td>
                  <td>{"₹" + student.AmountPaid}</td>
                  <td>{"₹" + student.AmountDue}</td>
                  <td>{student.LockerNumber}</td>
                  <td>
                    {new Date(student.FeesPaidTillDate).toLocaleDateString(
                      "en-US"
                    )}
                  </td>
                  <td>{student.PaymentMode}</td>
                  <td>{"₹" + student.AdmissionAmount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default StudentWithDues;

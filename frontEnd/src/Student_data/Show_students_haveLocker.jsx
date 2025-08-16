import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "../styles/neonLockers.css"; // Custom CSS file for neon effects
import { getRequest } from "../utils/api"; // Import the utility functions

const ShowLockers = () => {
  const [occupiedLockers, setOccupiedLockers] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate(); // Define navigate

  // Fetch occupied locker data from backend
  useEffect(() => {
    fetchOccupiedLockers();
  }, []);

  const fetchOccupiedLockers = async () => {
    try {
      const data = await getRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/getStudents`,
        navigate
      );
      setStudents(data);

      const lockerNumbers = data
        .map((student) => student.LockerNumber)
        .filter((locker) => locker !== null && locker !== undefined)
        .map((locker) => locker.toString());

      setOccupiedLockers(lockerNumbers);
      // console.log("Occupied lockers from server:", lockerNumbers);
    } catch (error) {
      console.error("Error fetching occupied lockers:", error);
    }
  };

  // Create an array of locker numbers from 1 to 100
  const totalLockers = 100;
  const lockers = Array.from({ length: totalLockers }, (_, index) => index + 1);

  // Handle locker click to show modal
  const handleLockerClick = (lockerNumber) => {
    const student = students.find(
      (s) => s.LockerNumber === lockerNumber.toString()
    );
    if (student) {
      setSelectedStudent(student);
      setShowModal(true);
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US");
  };

  return (
    <Container className="mt-5">
      <h2 className="neon-header text-center mb-4">Locker Allocation</h2>
      <div className="neon-locker-container">
        <Row>
          {lockers.map((lockerNumber) => (
            <Col
              key={lockerNumber}
              xs={3}
              sm={2}
              md={1}
              className="d-flex justify-content-center align-items-center mb-3"
            >
              <div
                onClick={() =>
                  occupiedLockers.includes(lockerNumber.toString()) &&
                  handleLockerClick(lockerNumber)
                }
                className={`neon-locker ${
                  occupiedLockers.includes(lockerNumber.toString())
                    ? "occupied"
                    : "unoccupied"
                }`}
              >
                {lockerNumber}
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Modal for displaying student details */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="neon-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="neon-modal-title">
            Student Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="neon-modal-body">
          {selectedStudent && (
            <div>
              <p>
                <strong>Name:</strong> {selectedStudent.StudentName}
              </p>
              <p>
                <strong>Date Of Admission:</strong>{" "}
                {formatDate(selectedStudent.AdmissionDate)}
              </p>
              <p>
                <strong>Registration Number:</strong>{" "}
                {selectedStudent.RegistrationNumber}
              </p>
              <p>
                <strong>Father's Name:</strong> {selectedStudent.FatherName}
              </p>
              <p>
                <strong>Address:</strong> {selectedStudent.Address}
              </p>
              <p>
                <strong>Contact Number:</strong> {selectedStudent.ContactNumber}
              </p>
              <p>
                <strong>Time Slots:</strong>{" "}
                {selectedStudent.TimeSlots.join(", ")}
              </p>
              <p>
                <strong>Shift:</strong> {selectedStudent.Shift}
              </p>
              <p>
                <strong>Seat Number:</strong> {selectedStudent.SeatNumber}
              </p>
              <p>
                <strong>Locker Number:</strong> {selectedStudent.LockerNumber}
              </p>
              <p>
                <strong>Amount Paid:</strong> ₹{selectedStudent.AmountPaid}
              </p>
              <p>
                <strong>Amount Due:</strong> ₹{selectedStudent.AmountDue || "0"}
              </p>
              <p>
                <strong>Fees Paid Till:</strong>{" "}
                {formatDate(selectedStudent.FeesPaidTillDate)}
              </p>
              <p>
                <strong>Payment Mode:</strong> {selectedStudent.PaymentMode}
              </p>
              <p>
                <strong>Admission Amount:</strong> ₹
                {selectedStudent.AdmissionAmount}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="neon-button bg-black text-white"
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ShowLockers;

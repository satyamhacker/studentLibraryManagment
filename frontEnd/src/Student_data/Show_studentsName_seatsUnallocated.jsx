import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/neonSeats.css"; // Custom CSS file for neon effects
import { getRequest } from "../utils/api"; // Import the utility functions

const ShowVacantSeats = () => {
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const navigate = useNavigate(); // Define navigate

  // Fetch occupied seat data from backend
  useEffect(() => {
    fetchOccupiedSeats();
  }, []);

  const fetchOccupiedSeats = async () => {
    try {
      const data = await getRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/getStudents`,
        navigate
      );
      setStudents(data);
      // console.log("Students data:", data);

      // Ensure that SeatNumber is treated as a string
      const seatNumbers = data
        .map((student) => student.SeatNumber)
        .filter((seat) => seat !== null && seat !== undefined)
        .map((seat) => seat.toString());

      setOccupiedSeats(seatNumbers);
      // console.log("Occupied seats from server:", seatNumbers);
    } catch (error) {
      console.error("Error fetching occupied seats:", error);
    }
  };

  // Create an array of seat numbers from 1 to 100
  const totalSeats = 136;
  const seats = Array.from({ length: totalSeats }, (_, index) => index + 1);

  // Handle seat click to show modal
  const handleSeatClick = (seatNumber) => {
    // console.log("Seat clicked:", students);
    const selectedStudents = students.filter(
      (s) => s.SeatNumber === seatNumber.toString()
    );
    if (selectedStudents.length > 0) {
      // console.log("Selected students:", selectedStudents);
      setSelectedStudents(selectedStudents);
      setShowModal(true);
    } else {
      console.log(`No student found for seat number: ${seatNumber}`);
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudents([]);
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
      <h2 className="neon-header text-center mb-4">Seat Allocation List</h2>
      <div className="neon-seat-container">
        <Row>
          {seats.map((seatNumber) => (
            <Col
              key={seatNumber}
              xs={3}
              sm={2}
              md={1}
              className="d-flex justify-content-center align-items-center mb-3"
            >
              <div
                onClick={() => {
                  if (occupiedSeats.includes(seatNumber.toString())) {
                    handleSeatClick(seatNumber);
                  }
                }}
                className={`neon-seat ${
                  occupiedSeats.includes(seatNumber.toString())
                    ? "occupied"
                    : "vacant"
                }`}
              >
                {seatNumber}
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
          {selectedStudents.map((student, index) => (
            <Card key={index} className="neon-card mb-3">
              <Card.Body>
                <Card.Title className="neon-card-title">
                  {student.StudentName}
                </Card.Title>
                <Card.Text className="neon-card-text">
                  <p>
                    <strong>Registration Number:</strong>{" "}
                    {student.RegistrationNumber}
                  </p>
                  <p>
                    <strong>Date Of Admission:</strong>{" "}
                    {formatDate(student.AdmissionDate)}
                  </p>
                  <p>
                    <strong>Father's Name:</strong> {student.FatherName}
                  </p>
                  <p>
                    <strong>Address:</strong> {student.Address}
                  </p>
                  <p>
                    <strong>Contact Number:</strong> {student.ContactNumber}
                  </p>
                  <p>
                    <strong>Time Slots:</strong> {student.TimeSlots.join(", ")}
                  </p>
                  <p>
                    <strong>Shift:</strong> {student.Shift}
                  </p>
                  <p>
                    <strong>Seat Number:</strong> {student.SeatNumber}
                  </p>
                  <p>
                    <strong>Amount Paid:</strong> ₹{student.AmountPaid}
                  </p>
                  <p>
                    <strong>Amount Due:</strong> ₹{student.AmountDue || "0"}
                  </p>
                  <p>
                    <strong>Locker Number:</strong> {student.LockerNumber}
                  </p>
                  <p>
                    <strong>Fees Paid Till Date:</strong>{" "}
                    {formatDate(student.FeesPaidTillDate)}
                  </p>
                  <p>
                    <strong>Payment Mode:</strong> {student.PaymentMode}
                  </p>
                  <p>
                    <strong>Admission Amount:</strong> ₹
                    {student.AdmissionAmount}
                  </p>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
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

export default ShowVacantSeats;

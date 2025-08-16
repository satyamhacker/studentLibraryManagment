import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { IconButton, TextField, MenuItem, InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/neonTable.css"; // Custom CSS file for neon effects
import handleTokenError from "../utils/handleTokenError"; // Import the utility function
import { getRequest, deleteRequest, updateRequest } from "../utils/api"; // Import the utility functions

const paymentModeOptions = [
  { label: "Online", value: "online" },
  { label: "Cash", value: "cash" },
];

const ShowStudentData = () => {
  const [students, setStudents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const timeOptions = [
    { label: "06:00 - 10:00", value: "06:00-10:00" },
    { label: "10:00 - 14:00", value: "10:00-14:00" },
    { label: "14:00 - 18:00", value: "14:00-18:00" },
    { label: "18:00 - 22:00", value: "18:00-22:00" },
    { label: "22:00 - 06:00", value: "22:00-06:00" },
    { label: "Reserved", value: "reserved" },
  ];

  const fetchStudentData = async () => {
    try {
      const data = await getRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/getStudents`,
        navigate
      );
      // console.log("response.data: ", data);

      if (data.length === 0) {
        alert("Please add Student data.");
        navigate("/addStudent");
      } else {
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await deleteRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/deleteStudent/${id}`,
        navigate
      );
      fetchStudentData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const showEditModalForStudent = (student) => {
    setCurrentStudent(student);
    setErrors({});
    setShowEditModal(true);
  };

  const confirmDeleteStudent = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleUpdateStudent = async () => {
    try {
      if (!currentStudent?.TimeSlots || currentStudent.TimeSlots.length === 0) {
        setErrors({ TimeSlots: "At least one time slot is required" });
        return;
      }

      await updateRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/updateStudent/${
          currentStudent.id
        }`,
        currentStudent,
        navigate
      );
      setShowEditModal(false);
      fetchStudentData();
    } catch (error) {
      console.error("Error updating student:", error);
      if (error.response?.data?.error === "Validation failed") {
        setErrors({ ...errors, api: error.response.data.details.join(", ") });
      } else if (error.response?.status === 409) {
        const {
          error: errorMessage,
          freeTimeSlots,
          occupiedBy,
        } = error.response.data;
        alert(
          `${errorMessage} Occupied by: ${occupiedBy}. Free time slots: ${freeTimeSlots.join(
            ", "
          )}`
        );
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePaymentModeChange = (e) => {
    const { value } = e.target;
    setCurrentStudent((prev) => ({
      ...prev,
      PaymentMode: value,
    }));
    setErrors((prev) => ({
      ...prev,
      PaymentMode: "",
    }));
  };

  const filteredStudents = students.filter((student) =>
    Object.values(student).some((value) =>
      value
        ? value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        : false
    )
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const handleTimeChange = (e) => {
    const selectedTimes = e.target.value;
    setCurrentStudent((prev) => ({
      ...prev,
      TimeSlots: selectedTimes,
    }));
    setErrors((prev) => ({
      ...prev,
      TimeSlots:
        selectedTimes.length > 0 ? "" : "At least one time slot is required",
    }));
  };

  const exportStudentDataToExcel = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/exportStudents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students_data.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting student data:", error);
      alert("Error exporting student data");
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="neon-header text-center mb-4">All Students Data</h1>
      <Row className="mb-3">
        <Col md={8}>
          <div className="neon-search-container">
            <TextField
              variant="outlined"
              placeholder="Search by any field..."
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="neon-icon" />
                  </InputAdornment>
                ),
              }}
              className="neon-input"
            />
          </div>
        </Col>
        <Col md={4} className="text-right">
          <Button
            className="neon-button bg-pink-500 text-white"
            onClick={exportStudentDataToExcel}
          >
            Export Student Data to Excel
          </Button>
        </Col>
      </Row>

      {students.length === 0 ? (
        <p className="text-center">No student data available.</p>
      ) : (
        <div className="neon-table-container">
          <Table striped bordered hover responsive className="neon-table">
            <thead>
              <tr>
                <th>Registration Number</th>
                <th>Admission Date</th>
                <th>Student Name</th>
                <th>Father's Name</th>
                <th>Address</th>
                <th>Contact Number</th>
                <th>Time Slots</th>
                <th>Shift</th>
                <th>Seat Number</th>
                <th>Amount Paid</th>
                <th>Amount Due</th>
                <th>Locker Number</th>
                <th>Fees Paid Till Date</th>
                <th>Payment Mode</th>
                <th>Admission Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.RegistrationNumber}</td>
                  <td>{formatDate(student.AdmissionDate)}</td>
                  <td>{student.StudentName}</td>
                  <td>{student.FatherName}</td>
                  <td>{student.Address}</td>
                  <td>{student.ContactNumber}</td>
                  <td>{student.TimeSlots.join(", ")}</td>
                  <td>{student.Shift}</td>
                  <td>{student.SeatNumber}</td>
                  <td>{"₹" + student.AmountPaid}</td>
                  <td>{"₹" + (student.AmountDue || "0")}</td>
                  <td>{student.LockerNumber}</td>
                  <td>{formatDate(student.FeesPaidTillDate)}</td>
                  <td>{student.PaymentMode}</td>
                  <td>{"₹" + student.AdmissionAmount}</td>
                  <td>
                    <IconButton
                      onClick={() => showEditModalForStudent(student)}
                      className="neon-icon-button"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => confirmDeleteStudent(student)}
                      className="neon-icon-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Edit Student Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        dialogClassName="neon-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="neon-modal-title">
            Edit Student Data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="RegistrationNumber" className="mb-3">
              <Form.Label>Registration Number</Form.Label>
              <Form.Control
                type="text"
                value={currentStudent?.RegistrationNumber || ""}
                onChange={(e) =>
                  setCurrentStudent((prev) => ({
                    ...prev,
                    RegistrationNumber: e.target.value,
                  }))
                }
                className="neon-input"
              />
            </Form.Group>

            <Form.Group controlId="AdmissionDate" className="mb-3">
              <Form.Label>Admission Date</Form.Label>
              <Form.Control
                type="date"
                value={
                  currentStudent?.AdmissionDate
                    ? formatDateForInput(currentStudent.AdmissionDate)
                    : ""
                }
                onChange={(e) =>
                  setCurrentStudent((prev) => ({
                    ...prev,
                    AdmissionDate: e.target.value,
                  }))
                }
                className="neon-input"
              />
            </Form.Group>

            <Form.Group controlId="StudentName" className="mb-3">
              <Form.Label>Student Name</Form.Label>
              <Form.Control
                type="text"
                value={currentStudent?.StudentName || ""}
                onChange={(e) =>
                  setCurrentStudent((prev) => ({
                    ...prev,
                    StudentName: e.target.value,
                  }))
                }
                className="neon-input"
              />
            </Form.Group>

            <Form.Group controlId="FatherName" className="mb-3">
              <Form.Label>Father's Name</Form.Label>
              <Form.Control
                type="text"
                value={currentStudent?.FatherName || ""}
                onChange={(e) =>
                  setCurrentStudent((prev) => ({
                    ...prev,
                    FatherName: e.target.value,
                  }))
                }
                className="neon-input"
              />
            </Form.Group>

            <Form.Group controlId="Address" className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={currentStudent?.Address || ""}
                onChange={(e) =>
                  setCurrentStudent((prev) => ({
                    ...prev,
                    Address: e.target.value,
                  }))
                }
                className="neon-input"
              />
            </Form.Group>

            <Form.Group controlId="ContactNumber" className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                value={currentStudent?.ContactNumber || ""}
                onChange={(e) =>
                  setCurrentStudent((prev) => ({
                    ...prev,
                    ContactNumber: e.target.value,
                  }))
                }
                className="neon-input"
              />
            </Form.Group>

            <Form.Group controlId="TimeSlots" className="mb-3">
              <Form.Label>Time Slots</Form.Label>
              <TextField
                select
                variant="outlined"
                name="TimeSlots"
                value={currentStudent?.TimeSlots || []}
                onChange={handleTimeChange}
                fullWidth
                required
                SelectProps={{ multiple: true }}
                error={!!errors.TimeSlots}
                helperText={errors.TimeSlots}
                className="neon-input"
              >
                {timeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Form.Group>

            <Form.Group controlId="Shift" className="mb-3">
              <Form.Label>Shift</Form.Label>
              <Form.Control
                type="text"
                value={currentStudent?.Shift || ""}
                onChange={(e) =>
                  setCurrentStudent((prev) => ({
                    ...prev,
                    Shift: e.target.value,
                  }))
                }
                className="neon-input"
              />
            </Form.Group>

            <Form.Group controlId="SeatNumber" className="mb-3">
              <Form.Label>Seat Number</Form.Label>
              <Form.Control
                type="text"
                value={currentStudent?.SeatNumber || ""}
                onChange={(e) =>
                  setCurrentStudent((prev) => ({
                    ...prev,
                    SeatNumber: e.target.value,
                  }))
                }
                className="neon-input"
              />
            </Form.Group>

            <Form.Group controlId="AmountPaid" className="mb-3">
              <Form.Label>Amount Paid</Form.Label>
              <Form.Control
                type="number"
                value={currentStudent?.AmountPaid || ""}
                onChange={(e) =>
                  setCurrentStudent((prev) => ({
                    ...prev,
                    AmountPaid: e.target.value,
                  }))
                }
                className="neon-input"
              />
            </Form.Group>

            <Form.Group controlId="AmountDue" className="mb-3">
              <Form.Label>Amount Due</Form.Label>
              <Form.Control
                type="number"
                value={currentStudent?.AmountDue || ""}
                onChange={(e) =>
                  setCurrentStudent((prev) => ({
                    ...prev,
                    AmountDue: e.target.value,
                  }))
                }
                className="neon-input"
              />
            </Form.Group>

            <Form.Group controlId="LockerNumber" className="mb-3">
              <Form.Label>Locker Number</Form.Label>
              <Form.Control
                type="text"
                value={currentStudent?.LockerNumber || ""}
                onChange={(e) =>
                  setCurrentStudent((prev) => ({
                    ...prev,
                    LockerNumber: e.target.value,
                  }))
                }
                className="neon-input"
              />
            </Form.Group>

            <Form.Group controlId="FeesPaidTillDate" className="mb-3">
              <Form.Label>Fees Paid Till Date</Form.Label>
              <Form.Control
                type="date"
                value={
                  currentStudent?.FeesPaidTillDate
                    ? formatDateForInput(currentStudent.FeesPaidTillDate)
                    : ""
                }
                onChange={(e) =>
                  setCurrentStudent((prev) => ({
                    ...prev,
                    FeesPaidTillDate: e.target.value,
                  }))
                }
                className="neon-input"
              />
            </Form.Group>

            <Form.Group controlId="PaymentMode" className="mb-3">
              <Form.Label>Payment Mode</Form.Label>
              <TextField
                select
                variant="outlined"
                name="PaymentMode"
                value={currentStudent?.PaymentMode || ""}
                onChange={handlePaymentModeChange}
                fullWidth
                required
                error={!!errors.PaymentMode}
                helperText={errors.PaymentMode}
                className="neon-input"
              >
                {paymentModeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Form.Group>
            <Form.Group controlId="AdmissionAmount" className="mb-3">
              <Form.Label>Admission Amount</Form.Label>
              <Form.Control
                type="number"
                value={currentStudent?.AdmissionAmount || ""}
                onChange={(e) =>
                  setCurrentStudent((prev) => ({
                    ...prev,
                    AdmissionAmount: e.target.value,
                  }))
                }
                className="neon-input"
              />
            </Form.Group>
          </Form>
          {errors.api && <p className="text-danger">{errors.api}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="neon-button bg-black text-white"
            onClick={() => setShowEditModal(false)}
          >
            Close
          </Button>
          <Button
            className="neon-button bg-blue-800 text-white"
            onClick={handleUpdateStudent}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        dialogClassName="neon-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="neon-modal-title">
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="neon-modal-body">
          Are you sure you want to delete the student{" "}
          {studentToDelete?.StudentName}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="neon-button bg-black text-white"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="neon-button bg-red-700 text-white"
            onClick={() => deleteStudent(studentToDelete?.id)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ShowStudentData;

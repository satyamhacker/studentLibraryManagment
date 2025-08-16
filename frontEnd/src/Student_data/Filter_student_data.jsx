import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Table,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/filterStudentData.css"; // Import custom styles
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { postRequest } from "../utils/api"; // Import the utility functions

const FilterStudentData = () => {
  const [showModal, setShowModal] = useState(true); // Show modal by default
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentMode, setPaymentMode] = useState(""); // Add state for Payment Mode
  const [filteredData, setFilteredData] = useState([]); // State to store filtered data
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [totalAmountPaid, setTotalAmountPaid] = useState(0); // State for total amount paid
  const [totalAmountDue, setTotalAmountDue] = useState(0); // State for total amount due
  const [totalAdmissionAmount, setTotalAdmissionAmount] = useState(0); // State for total admission amount

  const navigate = useNavigate(); // Define navigate

  const handleFilterClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleApplyFilter = async () => {
    let filterMessage = {
      year: selectedYear,
      month: selectedMonth,
      dateRange:
        startDate && endDate
          ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
          : null,
      paymentMode, // Add Payment Mode to the filter message
    };

    try {
      const response = await postRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/filterStudentData`,
        filterMessage,
        navigate
      );
      setFilteredData(response); // Store the filtered data in state
      calculateTotals(response); // Calculate totals
      alert("Filter applied successfully");
    } catch (error) {
      console.error("Error applying filter:", error);
      alert("Error applying filter");
    }

    handleCloseModal();
  };

  const calculateTotals = (data) => {
    const totalPaid = data.reduce(
      (sum, student) => sum + parseFloat(student.AmountPaid || 0),
      0
    );
    const totalDue = data.reduce(
      (sum, student) => sum + parseFloat(student.AmountDue || 0),
      0
    );
    const totalAdmission = data.reduce(
      (sum, student) => sum + parseFloat(student.AdmissionAmount || 0),
      0
    );
    setTotalAmountPaid(totalPaid);
    setTotalAmountDue(totalDue);
    setTotalAdmissionAmount(totalAdmission);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 50 },
    (_, i) => new Date().getFullYear() - i
  );

  const getInitialDate = () => {
    if (selectedYear && selectedMonth) {
      return new Date(selectedYear, months.indexOf(selectedMonth));
    } else if (selectedYear) {
      return new Date(selectedYear, 0);
    } else {
      return new Date();
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredResults = filteredData.filter((student) =>
    Object.values(student).some((value) =>
      value
        ? value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        : false
    )
  );

  return (
    <Container className="mt-5 filter-container">
      <Row className="justify-content-center">
        <Col xs={12} sm={4} className="mb-2">
          <Button
            variant="primary"
            className="w-100 filter-button neon-button"
            onClick={handleFilterClick}
          >
            Filter Student Data
          </Button>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="filter-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="neon-text">Filter Student Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="selectYear">
              <Form.Label className="neon-text">Select Year</Form.Label>
              <Form.Control
                as="select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="neon-input neon-dropdown"
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year} className="neon-option">
                    {year}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="selectMonth" className="mt-3">
              <Form.Label className="neon-text">Select Month</Form.Label>
              <Form.Control
                as="select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="neon-input neon-dropdown"
              >
                <option value="">Select Month</option>
                {months.map((month, index) => (
                  <option key={index} value={month} className="neon-option">
                    {month}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="selectDateRange" className="mt-3">
              <Form.Label className="neon-text">Select Date Range</Form.Label>
              <div className="d-flex">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  className="form-control neon-input"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  openToDate={getInitialDate()}
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                  className="form-control neon-input ml-2"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  openToDate={getInitialDate()}
                />
              </div>
            </Form.Group>

            <Form.Group controlId="selectPaymentMode" className="mt-3">
              <Form.Label className="neon-text">Select Payment Mode</Form.Label>
              <Form.Control
                as="select"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="neon-input neon-dropdown"
              >
                <option value="">Select Payment Mode</option>
                <option value="online" className="neon-option">
                  Online
                </option>
                <option value="cash" className="neon-option">
                  Cash
                </option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            className="neon-button"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleApplyFilter}
            className="neon-button"
          >
            Apply Filter
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Search Box and Totals */}
      <Row className="mt-4 align-items-center">
        <Col xs={12} sm={6} md={4}>
          <Form.Control
            type="text"
            placeholder="Search by any field..."
            value={searchTerm}
            onChange={handleSearch}
            className="neon-input w-100"
          />
        </Col>
        <Col xs={12} sm={6} md={4} className="text-center mt-2 mt-sm-0">
          <p className="neon-text bg-green-200">
            Total Amount Paid: ₹{totalAmountPaid}
          </p>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={4}
          className="text-center mt-2 mt-sm-0 bg-red-200"
        >
          <p className="neon-text">Total Amount Due: ₹{totalAmountDue}</p>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={4}
          className="text-center mt-2 mt-sm-0 bg-blue-200"
        >
          <p className="neon-text">
            Total Admission Amount: ₹{totalAdmissionAmount}
          </p>
        </Col>
      </Row>

      {/* Display filtered data in a table */}
      {filteredResults.length > 0 && (
        <div className="mt-5">
          <h3 className="neon-text text-center">Filtered Student Data</h3>
          <Table striped bordered hover responsive className="neon-table mt-3">
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
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((student) => (
                <tr key={student.id}>
                  <td>{student.RegistrationNumber}</td>
                  <td>
                    {new Date(student.AdmissionDate).toLocaleDateString()}
                  </td>
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
                  <td>
                    {new Date(student.FeesPaidTillDate).toLocaleDateString()}
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

export default FilterStudentData;

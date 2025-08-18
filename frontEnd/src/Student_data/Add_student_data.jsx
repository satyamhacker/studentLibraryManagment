import React, { useState } from "react";
import axios from "axios";
import "../styles/neonForm.css"; // Custom CSS file for neon effects

const AddStudent = () => {
  const [studentData, setStudentData] = useState({
    RegistrationNumber: "",
    AdmissionDate: "",
    StudentName: "",
    FatherName: "",
    Address: "",
    ContactNumber: "",
    TimeSlots: [],
    Shift: "",
    SeatNumber: "",
    FeesPaidTillDate: "",
    AmountPaid: "",
    AmountDue: "",
    LockerNumber: "",
    PaymentMode: "", // Add PaymentMode to the state
    AdmissionAmount: "", // Add AdmissionAmount to the state
  });

  const [errors, setErrors] = useState({});

  const timeOptions = [
    { label: "06:00 - 10:00", value: "06:00-10:00" },
    { label: "10:00 - 14:00", value: "10:00-14:00" },
    { label: "14:00 - 18:00", value: "14:00-18:00" },
    { label: "18:00 - 22:00", value: "18:00-22:00" },
    { label: "22:00 - 06:00", value: "22:00-06:00" },
    { label: "Reserved", value: "reserved" },
  ];

  const paymentModeOptions = [
    { label: "Online", value: "online" },
    { label: "Cash", value: "cash" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ContactNumber") {
      const regex = /^\d{0,10}$/;
      if (regex.test(value) || value === "") {
        setErrors({
          ...errors,
          ContactNumber:
            value.length > 10 ? "Contact Number must be 10 digits" : "",
        });
        setStudentData({
          ...studentData,
          [name]: value,
        });
      } else {
        setErrors({
          ...errors,
          ContactNumber: "Contact Number must be numeric",
        });
      }
    } else if (name === "SeatNumber") {
      const seatNumber = parseInt(value, 10);
      if (seatNumber >= 0 && seatNumber <= 136) {
        setStudentData({
          ...studentData,
          [name]: value,
        });
        setErrors({
          ...errors,
          [name]: "",
        });
      } else {
        alert("SeatNumber is from 0 to 136 only. 0 is for temporary student.");
      }
    } else if (name === "LockerNumber") {
      const lockerNumber = parseInt(value, 10);
      if (lockerNumber >= 0 && lockerNumber <= 100) {
        setStudentData({
          ...studentData,
          [name]: value,
        });
        setErrors({
          ...errors,
          [name]: "",
        });
      } else {
        alert("Locker range is from 0 to 100. 0 is for no locker.");
      }
    } else {
      setStudentData({
        ...studentData,
        [name]: value,
      });
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleTimeChange = (e) => {
    const selectedTimes = e.target.value;
    setStudentData({
      ...studentData,
      TimeSlots: selectedTimes,
    });
    setErrors({
      ...errors,
      TimeSlots: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(studentData).forEach((key) => {
      if (key === "TimeSlots") {
        if (studentData[key].length === 0) {
          newErrors[key] = "Please select at least one time slot";
        }
      } else if (
        key !== "SeatNumber" &&
        key !== "LockerNumber" &&
        key !== "AmountDue"
      ) {
        if (!studentData[key]) {
          newErrors[key] = `${key
            .replace(/([A-Z])/g, " $1")
            .trim()} is required`;
        }
      }
    });

    if (studentData.ContactNumber.length !== 10) {
      newErrors.ContactNumber = "Contact Number must be exactly 10 digits";
    }

    if (!studentData.PaymentMode) {
      newErrors.PaymentMode = "Payment Mode is required";
    }

    if (!studentData.AdmissionAmount) {
      newErrors.AdmissionAmount = "Admission Amount is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formattedData = {
        ...studentData,
        AmountPaid: studentData.AmountPaid.replace("₹", "").trim(),
        AmountDue: studentData.AmountDue.replace("₹", "").trim(),
        AdmissionAmount: studentData.AdmissionAmount.replace("₹", "").trim(), // Include AdmissionAmount
      };

      // console.log("Data being sent to backend:", formattedData);

      // Get the JWT token from local storage
      const token = localStorage.getItem("jwtToken");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/addStudent`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      // console.log("Server response:", response);

      setStudentData({
        RegistrationNumber: "",
        AdmissionDate: "",
        StudentName: "",
        FatherName: "",
        Address: "",
        ContactNumber: "",
        TimeSlots: [],
        Shift: "",
        SeatNumber: "",
        FeesPaidTillDate: "",
        AmountPaid: "",
        AmountDue: "",
        LockerNumber: "",
        PaymentMode: "",
        AdmissionAmount: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 409) {
        const { conflictingStudent, assignedTo } = error.response.data;
        if (conflictingStudent) {
          alert(
            `Seat ${studentData.SeatNumber} is occupied by ${
              conflictingStudent.StudentName
            } for time slots: ${conflictingStudent.TimeSlots.join(", ")}`
          );
        } else if (assignedTo) {
          alert(
            `Locker ${studentData.LockerNumber} is already assigned to ${assignedTo}`
          );
        }
      } else {
        const errorMessage =
          error.response?.data?.error || "Error adding student data";
        console.error("Error adding student:", errorMessage);
        alert(errorMessage);
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="neon-header text-center mb-4">Add Student Details</h2>
      <div className="neon-form-container">
        <Form onSubmit={handleSubmit} className="p-4">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Registration Number</Form.Label>
                <TextField
                  variant="outlined"
                  name="RegistrationNumber"
                  value={studentData.RegistrationNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Enter Registration Number"
                  error={!!errors.RegistrationNumber}
                  helperText={errors.RegistrationNumber}
                  className="neon-input"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Admission Date</Form.Label>
                <TextField
                  variant="outlined"
                  type="date"
                  name="AdmissionDate"
                  value={studentData.AdmissionDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.AdmissionDate}
                  helperText={errors.AdmissionDate}
                  className="neon-input"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Student Name</Form.Label>
                <TextField
                  variant="outlined"
                  name="StudentName"
                  value={studentData.StudentName}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Enter Student Name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.StudentName}
                  helperText={errors.StudentName}
                  className="neon-input"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Father's Name</Form.Label>
                <TextField
                  variant="outlined"
                  name="FatherName"
                  value={studentData.FatherName}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Enter Father's Name"
                  error={!!errors.FatherName}
                  helperText={errors.FatherName}
                  className="neon-input"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Address</Form.Label>
                <TextField
                  variant="outlined"
                  name="Address"
                  value={studentData.Address}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Enter Address"
                  error={!!errors.Address}
                  helperText={errors.Address}
                  className="neon-input"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Contact Number</Form.Label>
                <TextField
                  variant="outlined"
                  name="ContactNumber"
                  value={studentData.ContactNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Enter Contact Number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ContactPhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.ContactNumber}
                  helperText={errors.ContactNumber}
                  className="neon-input"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Time Slots</Form.Label>
                <TextField
                  select
                  variant="outlined"
                  name="TimeSlots"
                  value={studentData.TimeSlots}
                  onChange={handleTimeChange}
                  fullWidth
                  required
                  SelectProps={{
                    multiple: true,
                  }}
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
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Shift</Form.Label>
                <TextField
                  variant="outlined"
                  name="Shift"
                  value={studentData.Shift}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Enter Shift"
                  error={!!errors.Shift}
                  helperText={errors.Shift}
                  className="neon-input"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Seat Number</Form.Label>
                <TextField
                  variant="outlined"
                  name="SeatNumber"
                  value={studentData.SeatNumber}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Enter Seat Number"
                  error={!!errors.SeatNumber}
                  helperText={errors.SeatNumber}
                  className="neon-input"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Locker Number</Form.Label>
                <TextField
                  variant="outlined"
                  name="LockerNumber"
                  value={studentData.LockerNumber}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Enter Locker Number"
                  error={!!errors.LockerNumber}
                  helperText={errors.LockerNumber}
                  className="neon-input"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Fees Paid Till Date</Form.Label>
                <TextField
                  variant="outlined"
                  type="date"
                  name="FeesPaidTillDate"
                  value={studentData.FeesPaidTillDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.FeesPaidTillDate}
                  helperText={errors.FeesPaidTillDate}
                  className="neon-input"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Payment Mode</Form.Label>
                <TextField
                  select
                  variant="outlined"
                  name="PaymentMode"
                  value={studentData.PaymentMode}
                  onChange={handleChange}
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
            </Col>

            <Form.Group className="mb-4">
              <Form.Label>Amount Paid</Form.Label>
              <TextField
                variant="outlined"
                name="AmountPaid"
                value={studentData.AmountPaid}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Enter Amount Paid"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentIcon />
                      <span className="mr-2">₹</span>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.AmountPaid}
                helperText={errors.AmountPaid}
                className="neon-input"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Amount Due</Form.Label>
              <TextField
                variant="outlined"
                name="AmountDue"
                value={studentData.AmountDue}
                onChange={handleChange}
                fullWidth
                placeholder="Enter Amount Due"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentIcon />
                      <span className="mr-2">₹</span>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.AmountDue}
                helperText={errors.AmountDue}
                className="neon-input"
              />
            </Form.Group>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Admission Amount</Form.Label>
                <TextField
                  variant="outlined"
                  name="AdmissionAmount"
                  value={studentData.AdmissionAmount}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Enter Admission Amount"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PaymentIcon />
                        <span className="mr-2">₹</span>
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.AdmissionAmount}
                  helperText={errors.AdmissionAmount}
                  className="neon-input"
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" className="neon-button w-100">
            Submit
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default AddStudent;

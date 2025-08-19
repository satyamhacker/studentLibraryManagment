import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import '../styles/neonForm.css'; // neon CSS for accents if wanted

const AddStudentData = () => {
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
    PaymentMode: "",
    AdmissionAmount: "",
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
        setErrors({ ...errors, ContactNumber: value.length > 10 ? "Contact Number must be 10 digits" : "" });
        setStudentData({ ...studentData, [name]: value });
      } else {
        setErrors({ ...errors, ContactNumber: "Contact Number must be numeric" });
      }
    } else if (name === "SeatNumber") {
      const seatNumber = parseInt(value, 10);
      if (seatNumber >= 0 && seatNumber <= 136) {
        setStudentData({ ...studentData, [name]: value });
        setErrors({ ...errors, [name]: "" });
      } else {
        alert("SeatNumber is from 0 to 136 only. 0 is for temporary student.");
      }
    } else if (name === "LockerNumber") {
      const lockerNumber = parseInt(value, 10);
      if (lockerNumber >= 0 && lockerNumber <= 100) {
        setStudentData({ ...studentData, [name]: value });
        setErrors({ ...errors, [name]: "" });
      } else {
        alert("Locker range is from 0 to 100. 0 is for no locker.");
      }
    } else {
      setStudentData({ ...studentData, [name]: value });
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setStudentData({ ...studentData, TimeSlots: typeof value === 'string' ? value.split(',') : value });
    setErrors({ ...errors, TimeSlots: "" });
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
          newErrors[key] = `${key.replace(/([A-Z])/g, " $1").trim()} is required`;
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
    if (!validateForm()) return;
    try {
      const formattedData = {
        ...studentData,
        AmountPaid: studentData.AmountPaid.replace("₹", "").trim(),
        AmountDue: studentData.AmountDue.replace("₹", "").trim(),
        AdmissionAmount: studentData.AdmissionAmount.replace("₹", "").trim(),
      };
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/addStudent`,
        formattedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
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
      if (error.response?.status === 409) {
        const { conflictingStudent, assignedTo } = error.response.data;
        if (conflictingStudent) {
          alert(
            `Seat ${studentData.SeatNumber} is occupied by ${conflictingStudent.StudentName} for time slots: ${conflictingStudent.TimeSlots.join(", ")}`
          );
        } else if (assignedTo) {
          alert(
            `Locker ${studentData.LockerNumber} is already assigned to ${assignedTo}`
          );
        }
      } else {
        const errorMessage = error.response?.data?.error || "Error adding student data";
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex items-center justify-center py-6 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-blue-100 p-0 sm:p-0 overflow-hidden">
        {/* Form Header */}
        <div className="w-full px-0 py-8 bg-gradient-to-r from-indigo-600 via-blue-500 to-blue-400 flex flex-col items-center gap-3">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white bg-opacity-20 border border-blue-200 shadow-inner">
            <PersonIcon className="text-4xl text-blue-100" />
          </div>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white drop-shadow">Add Student Details</h2>
          <div className="mb-0 text-blue-100 text-sm">Please carefully fill all required fields.</div>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off" className="px-4 sm:px-8 py-8">
          {/* PERSONAL INFORMATION */}
          <div className="mb-7">
            <div className="mb-1 text-blue-700 font-semibold uppercase text-xs tracking-wide">Personal Info</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 bg-blue-50/30 p-4 rounded-xl">
              <TextField
                variant="outlined"
                name="RegistrationNumber"
                label={<span>Registration Number<span className="text-red-500">*</span></span>}
                value={studentData.RegistrationNumber}
                onChange={handleChange}
                error={!!errors.RegistrationNumber}
                helperText={errors.RegistrationNumber}
                InputProps={{ className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300" }}
                fullWidth
              />
              <TextField
                variant="outlined"
                type="date"
                name="AdmissionDate"
                label={<span>Admission Date<span className="text-red-500">*</span></span>}
                value={studentData.AdmissionDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.AdmissionDate}
                helperText={errors.AdmissionDate}
                InputProps={{ className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300" }}
                fullWidth
              />
              <TextField
                variant="outlined"
                name="StudentName"
                label={<span>Student Name<span className="text-red-500">*</span></span>}
                value={studentData.StudentName}
                onChange={handleChange}
                InputProps={{
                  className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300",
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
                error={!!errors.StudentName}
                helperText={errors.StudentName}
                fullWidth
              />
              <TextField
                variant="outlined"
                name="FatherName"
                label={<span>Father's Name<span className="text-red-500">*</span></span>}
                value={studentData.FatherName}
                onChange={handleChange}
                InputProps={{ className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300" }}
                error={!!errors.FatherName}
                helperText={errors.FatherName}
                fullWidth
              />
              <TextField
                variant="outlined"
                name="Address"
                label={<span>Address<span className="text-red-500">*</span></span>}
                value={studentData.Address}
                onChange={handleChange}
                InputProps={{ className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300" }}
                error={!!errors.Address}
                helperText={errors.Address}
                fullWidth
              />
              <TextField
                variant="outlined"
                name="ContactNumber"
                label={<span>Contact Number<span className="text-red-500">*</span></span>}
                value={studentData.ContactNumber}
                onChange={handleChange}
                InputProps={{
                  className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300",
                  startAdornment: (
                    <InputAdornment position="start">
                      <ContactPhoneIcon />
                    </InputAdornment>
                  ),
                }}
                error={!!errors.ContactNumber}
                helperText={errors.ContactNumber}
                fullWidth
              />
            </div>
          </div>

          {/* SEAT, LOCKER, TIME, SHIFT, DATES */}
          <div className="mb-7">
            <div className="mb-1 text-blue-700 font-semibold uppercase text-xs tracking-wide">Seat / Time / Dates</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 bg-blue-50/30 p-4 rounded-xl">
              <TextField
                select
                variant="outlined"
                name="TimeSlots"
                label={<span>Time Slots<span className="text-red-500">*</span></span>}
                value={studentData.TimeSlots}
                onChange={handleTimeChange}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => (selected && selected.length > 0 ? selected.join(", ") : "Select time slots")
                }}
                InputProps={{ className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300" }}
                error={!!errors.TimeSlots}
                helperText={errors.TimeSlots}
                fullWidth
              >
                {timeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                variant="outlined"
                name="Shift"
                label={<span>Shift<span className="text-red-500">*</span></span>}
                value={studentData.Shift}
                onChange={handleChange}
                InputProps={{ className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300" }}
                error={!!errors.Shift}
                helperText={errors.Shift}
                fullWidth
              />
              <TextField
                variant="outlined"
                name="SeatNumber"
                label="Seat Number"
                value={studentData.SeatNumber}
                onChange={handleChange}
                InputProps={{ className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300" }}
                error={!!errors.SeatNumber}
                helperText={errors.SeatNumber}
                fullWidth
              />
              <TextField
                variant="outlined"
                name="LockerNumber"
                label="Locker Number"
                value={studentData.LockerNumber}
                onChange={handleChange}
                InputProps={{ className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300" }}
                error={!!errors.LockerNumber}
                helperText={errors.LockerNumber}
                fullWidth
              />
              <TextField
                variant="outlined"
                type="date"
                name="FeesPaidTillDate"
                label={<span>Fees Paid Till Date<span className="text-red-500">*</span></span>}
                value={studentData.FeesPaidTillDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{ className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300" }}
                error={!!errors.FeesPaidTillDate}
                helperText={errors.FeesPaidTillDate}
                fullWidth
              />
              <TextField
                select
                variant="outlined"
                name="PaymentMode"
                label={<span>Payment Mode<span className="text-red-500">*</span></span>}
                value={studentData.PaymentMode}
                onChange={handleChange}
                InputProps={{ className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300" }}
                error={!!errors.PaymentMode}
                helperText={errors.PaymentMode}
                fullWidth
              >
                {paymentModeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>

          {/* FEES FIELDS */}
          <div className="mb-7">
            <div className="mb-1 text-blue-700 font-semibold uppercase text-xs tracking-wide">Fees Information</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 bg-blue-50/30 p-4 rounded-xl">
              <TextField
                variant="outlined"
                name="AmountPaid"
                label={<span>Amount Paid<span className="text-red-500">*</span></span>}
                value={studentData.AmountPaid}
                onChange={handleChange}
                InputProps={{
                  className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300",
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentIcon />
                      <span className="mr-2 text-gray-500">₹</span>
                    </InputAdornment>
                  )
                }}
                error={!!errors.AmountPaid}
                helperText={errors.AmountPaid}
                fullWidth
              />
              <TextField
                variant="outlined"
                name="AmountDue"
                label="Amount Due"
                value={studentData.AmountDue}
                onChange={handleChange}
                InputProps={{
                  className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300",
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentIcon />
                      <span className="mr-2 text-gray-400">₹</span>
                    </InputAdornment>
                  )
                }}
                error={!!errors.AmountDue}
                helperText={errors.AmountDue}
                fullWidth
              />
              <TextField
                variant="outlined"
                name="AdmissionAmount"
                label={<span>Admission Amount<span className="text-red-500">*</span></span>}
                value={studentData.AdmissionAmount}
                onChange={handleChange}
                InputProps={{
                  className: "rounded-md bg-white focus:ring-2 focus:ring-indigo-300",
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentIcon />
                      <span className="mr-2 text-gray-700">₹</span>
                    </InputAdornment>
                  )
                }}
                error={!!errors.AdmissionAmount}
                helperText={errors.AdmissionAmount}
                fullWidth
              />
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl shadow-lg bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 hover:from-blue-700 hover:to-indigo-600 text-white font-bold text-lg tracking-wide focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-150"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentData;

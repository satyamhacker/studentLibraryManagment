import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import '../styles/neonForm.css'; // neon CSS for accents if wanted

import { addStudentDataUrl, getNextRegistrationNumberUrl } from "../url/index.url.js";
import { createApi, getApi } from "../api/api.js";

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
  const [alertShown, setAlertShown] = useState({ SeatNumber: false, LockerNumber: false });
  const fieldRefs = useRef({});

  // Fetch next registration number on component mount
  useEffect(() => {
    const fetchNextRegistrationNumber = async () => {
      try {
        const response = await getApi(getNextRegistrationNumberUrl);
        if (response && response.success) {
          setStudentData(prev => ({
            ...prev,
            RegistrationNumber: response.data.nextRegistrationNumber.toString()
          }));
        }
      } catch (error) {
        console.error("Error fetching next registration number:", error);
      }
    };
    fetchNextRegistrationNumber();
  }, []);
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
    // Prevent changes to RegistrationNumber
    if (name === "RegistrationNumber") {
      return;
    }
    if (name === "ContactNumber") {
      const regex = /^\d{0,10}$/;
      if (regex.test(value) || value === "") {
        setErrors({ ...errors, ContactNumber: value.length > 10 ? "Contact Number must be 10 digits" : "" });
        setStudentData({ ...studentData, [name]: value });
      } else {
        setErrors({ ...errors, ContactNumber: "Contact Number must be numeric" });
      }
    } else if (name === "SeatNumber") {
      if (value === "") {
        setStudentData({ ...studentData, [name]: "" });
        setAlertShown({ ...alertShown, SeatNumber: false });
        return;
      }
      const seatNumber = parseInt(value, 10);
      if (!isNaN(seatNumber) && seatNumber >= 0 && seatNumber <= 136) {
        setStudentData({ ...studentData, [name]: seatNumber });
        setErrors({ ...errors, [name]: "" });
      } else if (!alertShown.SeatNumber) {
        alert("SeatNumber is from 0 to 136 only. 0 is for temporary student.");
        setAlertShown({ ...alertShown, SeatNumber: true });
      }
    } else if (name === "LockerNumber") {
      if (value === "") {
        setStudentData({ ...studentData, [name]: "" });
        setAlertShown({ ...alertShown, LockerNumber: false });
        return;
      }
      const lockerNumber = parseInt(value, 10);
      if (!isNaN(lockerNumber) && lockerNumber >= 0 && lockerNumber <= 100) {
        setStudentData({ ...studentData, [name]: lockerNumber });
        setErrors({ ...errors, [name]: "" });
      } else if (!alertShown.LockerNumber) {
        alert("Locker range is from 0 to 100. 0 is for no locker.");
        setAlertShown({ ...alertShown, LockerNumber: true });
      }
    } else if (name === "AmountDue") {
      // Allow empty, or parse as int
      if (value === "") {
        setStudentData({ ...studentData, [name]: "" });
        setErrors({ ...errors, [name]: "" });
      } else {
        const amountDue = parseInt(value, 10);
        if (!isNaN(amountDue)) {
          setStudentData({ ...studentData, [name]: amountDue });
          setErrors({ ...errors, [name]: "" });
        } else {
          setErrors({ ...errors, [name]: "Amount Due must be a number" });
        }
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
    
    // Scroll to first error field
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const fieldRef = fieldRefs.current[firstErrorField];
      if (fieldRef) {
        fieldRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        fieldRef.focus();
      }
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      // Prepare data: if SeatNumber, LockerNumber, AmountDue are empty string, omit them so backend default applies
      const formattedData = {
        ...studentData,
        AmountPaid: studentData.AmountPaid.replace("₹", "").trim(),
        AdmissionAmount: studentData.AdmissionAmount.replace("₹", "").trim(),
      };
      if (formattedData.SeatNumber === "" || formattedData.SeatNumber === undefined) delete formattedData.SeatNumber;
      if (formattedData.LockerNumber === "" || formattedData.LockerNumber === undefined) delete formattedData.LockerNumber;
      if (formattedData.AmountDue === "" || formattedData.AmountDue === undefined) delete formattedData.AmountDue;
      const response = await createApi(addStudentDataUrl, formattedData);
      console.log('API Response:', response);
      if (response.success) {
        alert(response.message || "Student data added successfully");
        // Reset form and fetch new registration number
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
        // Fetch next registration number for new form
        try {
          const nextRegResponse = await getApi(getNextRegistrationNumberUrl);
          if (nextRegResponse && nextRegResponse.success) {
            setStudentData(prev => ({
              ...prev,
              RegistrationNumber: nextRegResponse.data.nextRegistrationNumber.toString()
            }));
          }
        } catch (error) {
          console.error("Error fetching next registration number after submission:", error);
        }
      } else {
        alert(response.details || response.error || "Failed to add student data");
      }
    } catch (error) {
      console.log('Caught Error:', error);
      const errorMessage = error.field
        ? `${error.field}: ${error.error || error.details || error.message}`
        : (error.details || error.error || error.message || "Error adding student data");
      alert(errorMessage);
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
                helperText={errors.RegistrationNumber || "Auto-generated registration number"}
                InputProps={{ 
                  className: "rounded-md bg-gray-100 focus:ring-2 focus:ring-indigo-300",
                  readOnly: true
                }}
                inputRef={(el) => fieldRefs.current.RegistrationNumber = el}
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
                inputRef={(el) => fieldRefs.current.AdmissionDate = el}
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
                inputRef={(el) => fieldRefs.current.StudentName = el}
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
                inputRef={(el) => fieldRefs.current.FatherName = el}
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
                inputRef={(el) => fieldRefs.current.Address = el}
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
                inputRef={(el) => fieldRefs.current.ContactNumber = el}
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
                inputRef={(el) => fieldRefs.current.TimeSlots = el}
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
                inputRef={(el) => fieldRefs.current.Shift = el}
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
                helperText={errors.SeatNumber || (
                  <span className="text-blue-600 font-medium">
                    💺 Range: 0-136 (0 for temporary student)
                  </span>
                )}
                inputRef={(el) => fieldRefs.current.SeatNumber = el}
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
                helperText={errors.LockerNumber || (
                  <span className="text-blue-600 font-medium">
                    🔒 Range: 0-100 (0 for no locker)
                  </span>
                )}
                inputRef={(el) => fieldRefs.current.LockerNumber = el}
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
                inputRef={(el) => fieldRefs.current.FeesPaidTillDate = el}
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
                inputRef={(el) => fieldRefs.current.PaymentMode = el}
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
                inputRef={(el) => fieldRefs.current.AmountPaid = el}
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
                inputRef={(el) => fieldRefs.current.AmountDue = el}
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
                inputRef={(el) => fieldRefs.current.AdmissionAmount = el}
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

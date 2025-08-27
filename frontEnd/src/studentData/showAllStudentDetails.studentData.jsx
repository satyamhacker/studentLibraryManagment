import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/neonTable.css";
import { getApi, deleteApiById, updateApiById, getBlobApi } from "../api/api.js";
import { fetchAllStudentDataUrl, deleteStudentUrl, updateStudentUrl, exportStudentDataUrl, updateStudentStatusUrl } from "../url/index.url.js";

// Icons as components for better performance
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ExportIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

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

  const [filters, setFilters] = useState({
    shifts: [],
    paymentMode: "",
    timeSlots: [],
    studentStatus: "active"
  });
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
      const response = await getApi(fetchAllStudentDataUrl);
      if (response && response.success) {
        const data = response.data || [];
        if (data.length === 0) {
          alert("Please add Student data.");
          navigate("/addStudent");
        } else {
          setStudents(data);
        }
      } else {
        setStudents([]);
        if (response && response.error) {
          alert(response.error);
        }
      }
    } catch (error) {
      setStudents([]);
      console.error("Error fetching students:", error);
      alert("Failed to fetch student data.");
    }
  };

  const handleUpdateStudent = async () => {
    try {
      if (!currentStudent?.TimeSlots || currentStudent.TimeSlots.length === 0) {
        setErrors({ TimeSlots: "At least one time slot is required" });
        return;
      }


      // Remove id and other non-updatable fields from the payload
      const { id, createdAt, updatedAt, signupId, ...updatePayloadRaw } = currentStudent;

      // If SeatNumber, LockerNumber, AmountDue are empty string or undefined, remove them so backend default applies
      const updatePayload = { ...updatePayloadRaw };
      if (updatePayload.SeatNumber === "" || updatePayload.SeatNumber === undefined) delete updatePayload.SeatNumber;
      if (updatePayload.LockerNumber === "" || updatePayload.LockerNumber === undefined) delete updatePayload.LockerNumber;
      if (updatePayload.AmountDue === "" || updatePayload.AmountDue === undefined) delete updatePayload.AmountDue;

      const response = await updateApiById(updateStudentUrl, currentStudent.id, updatePayload);


      // Check if response indicates success
      if (response && (response.success === true || response.success === "true")) {
        console.log('Success detected, closing modal'); // Debug log
        setShowEditModal(false);
        setCurrentStudent(null);
        setErrors({});
        alert(response.message || "Student data updated successfully!");
        fetchStudentData();
        return;
      }


      // If we reach here, it's an error
      console.log('Error detected, showing errors'); // Debug log
      const apiErrors = {};

      // Handle backend conflict/logic errors (locker/seat conflict, etc)
      if (response?.details) {
        // Show the main details message
        apiErrors.api = response.details;
        // Optionally, show who occupies the locker/seat if provided
        if (response.occupiedBy) {
          apiErrors.api += ` (Occupied by: ${response.occupiedBy}`;
          if (response.lockerNumber) {
            apiErrors.api += `, Locker: ${response.lockerNumber}`;
          }
          if (response.seatNumber) {
            apiErrors.api += `, Seat: ${response.seatNumber}`;
          }
          apiErrors.api += ")";
        }
      }

      // Check for validation errors in response.err.details
      if (response?.err?.details && Array.isArray(response.err.details)) {
        response.err.details.forEach(detail => {
          const fieldName = detail.path?.[0] || 'unknown';
          apiErrors[fieldName] = detail.message || 'Invalid value';
        });
      }

      // Set main error message if not already set
      if (!apiErrors.api) {
        if (response?.message) {
          apiErrors.api = response.message;
        } else if (response?.error) {
          apiErrors.api = response.error;
        } else if (response?.err?.message) {
          apiErrors.api = response.err.message;
        } else {
          apiErrors.api = "Failed to update student";
        }
      }


      // Show alert for backend logic/conflict errors (locker/seat conflict, etc)
      if (response?.details) {
        let alertMsg = response.details;
        if (response.occupiedBy) {
          alertMsg += ` (Occupied by: ${response.occupiedBy}`;
          if (response.lockerNumber) {
            alertMsg += `, Locker: ${response.lockerNumber}`;
          }
          if (response.seatNumber) {
            alertMsg += `, Seat: ${response.seatNumber}`;
          }
          alertMsg += ")";
        }
        alert(alertMsg);
      }

      setErrors(apiErrors);

    } catch (error) {
      console.error("Caught error updating student:", error);

      // Try to extract a user-friendly error message
      let alertMsg = "";
      if (error?.details) {
        alertMsg = error.details;
        if (error.occupiedBy) {
          alertMsg += ` (Occupied by: ${error.occupiedBy}`;
          if (error.lockerNumber) {
            alertMsg += `, Locker: ${error.lockerNumber}`;
          }
          if (error.seatNumber) {
            alertMsg += `, Seat: ${error.seatNumber}`;
          }
          alertMsg += ")";
        }
      } else if (error?.message) {
        alertMsg = error.message;
      } else if (typeof error === "string") {
        alertMsg = error;
      } else {
        alertMsg = "Network error: Unable to update student";
      }
      if (alertMsg) alert(alertMsg);

      // Handle network or parsing errors for error display in modal
      if (error.response?.data) {
        const errorData = error.response.data;
        const apiErrors = {};

        if (errorData.err?.details) {
          errorData.err.details.forEach(detail => {
            const fieldName = detail.path?.[0] || 'unknown';
            apiErrors[fieldName] = detail.message || 'Invalid value';
          });
        }

        apiErrors.api = errorData.message || errorData.error || "Update failed";
        setErrors(apiErrors);
      } else {
        setErrors({ api: alertMsg });
      }
    }
  };
  // Use deleteApiById for deleting a student
  const deleteStudent = async (id) => {
    try {
      const response = await deleteApiById(deleteStudentUrl, id);
      setShowDeleteModal(false);
      setStudentToDelete(null);
      fetchStudentData();
      alert(response?.message || "Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student");
    }
  };

  const showEditModalForStudent = (student) => {
    setCurrentStudent(student);
    setShowEditModal(true);
    setErrors({});

  };

  const confirmDeleteStudent = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      const response = await updateApiById(updateStudentStatusUrl, studentId, { StudentActiveStatus: newStatus });
      if (response && response.success) {
        fetchStudentData();
        alert(response.message || "Student status updated successfully!");
      } else {
        alert(response?.message || "Failed to update student status");
      }
    } catch (error) {
      console.error("Error updating student status:", error);
      alert("Error updating student status");
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

  const filteredStudents = students.filter((student) => {
    // Search filter
    const matchesSearch = searchTerm === "" || Object.values(student).some((value) =>
      value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false
    );

    // Additional filters
    const matchesShift = filters.shifts.length === 0 || filters.shifts.some(shift =>
      student.Shift?.toLowerCase().includes(shift.toLowerCase())
    );
    const matchesPaymentMode = filters.paymentMode === "" || student.PaymentMode === filters.paymentMode;
    const matchesTimeSlot = filters.timeSlots.length === 0 || filters.timeSlots.some(timeSlot =>
      student.TimeSlots?.includes(timeSlot)
    );
    const matchesStatus = filters.studentStatus === "" ||
      (filters.studentStatus === "active" && student.StudentActiveStatus === true) ||
      (filters.studentStatus === "inactive" && student.StudentActiveStatus === false);

    return matchesSearch && matchesShift && matchesPaymentMode && matchesTimeSlot && matchesStatus;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleMultiFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const clearFilters = () => {
    setFilters({ shifts: [], paymentMode: "", timeSlots: [], studentStatus: "active" });
    setSearchTerm("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const handleTimeChange = (timeValue) => {
    const currentTimeSlots = currentStudent?.TimeSlots || [];
    let updatedTimeSlots;

    if (currentTimeSlots.includes(timeValue)) {
      updatedTimeSlots = currentTimeSlots.filter(slot => slot !== timeValue);
    } else {
      updatedTimeSlots = [...currentTimeSlots, timeValue];
    }

    setCurrentStudent((prev) => ({
      ...prev,
      TimeSlots: updatedTimeSlots,
    }));
    setErrors((prev) => ({
      ...prev,
      TimeSlots: updatedTimeSlots.length > 0 ? "" : "At least one time slot is required",
    }));
  };

  const exportStudentDataToExcel = async () => {
    try {
      const response = await getBlobApi(exportStudentDataUrl);
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "students_data.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting student data:", error);
      alert(error.message || "Error exporting student data");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              📚 Student Management
            </h1>
            <p className="text-blue-100 text-lg opacity-90">Manage your library's student records efficiently</p>
            <div className="mt-4 flex justify-center items-center gap-2 text-blue-200">
              <span className="text-sm">Total Students:</span>
              <span className="bg-white/20 px-3 py-1 rounded-full font-semibold">{students.length}</span>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col gap-6">
            {/* Search and Export Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
              </div>
              <button
                onClick={exportStudentDataToExcel}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <ExportIcon />
                Export to Excel
              </button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col gap-4">
              <span className="text-white font-semibold text-sm">🔍 Filters:</span>
              <div className="flex flex-wrap gap-4">
                {/* Shifts Filter */}
                <div className="bg-white/5 p-3 rounded-lg border border-white/20">
                  <label className="text-white text-sm font-medium mb-2 block">Shifts:</label>
                  <div className="flex flex-wrap gap-2">
                    {["morning", "evening", "night"].map((shift) => (
                      <label key={shift} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.shifts.includes(shift)}
                          onChange={() => handleMultiFilterChange('shifts', shift)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-white text-sm capitalize">{shift}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Time Slots Filter */}
                <div className="bg-white/5 p-3 rounded-lg border border-white/20">
                  <label className="text-white text-sm font-medium mb-2 block">Time Slots:</label>
                  <div className="flex flex-wrap gap-2 max-w-md">
                    {timeOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.timeSlots.includes(option.value)}
                          onChange={() => handleMultiFilterChange('timeSlots', option.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-white text-xs">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Single Select Filters */}
                <div className="flex gap-4 items-end">
                  <div>
                    <label className="text-white text-sm font-medium mb-1 block">Payment Mode:</label>
                    <select
                      value={filters.paymentMode}
                      onChange={(e) => handleFilterChange('paymentMode', e.target.value)}
                      className="px-3 py-2 bg-white/90 border border-white/30 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">All</option>
                      <option value="online">Online</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-1 block">Status:</label>
                    <select
                      value={filters.studentStatus}
                      onChange={(e) => handleFilterChange('studentStatus', e.target.value)}
                      className="px-3 py-2 bg-white/90 border border-white/30 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="active">Active Students</option>
                      <option value="inactive">Inactive Students</option>
                      <option value="">All Status</option>
                    </select>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        {students.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Students Found</h3>
            <p className="text-blue-200 mb-6">Start by adding your first student to the library system.</p>
            <button
              onClick={() => navigate('/addStudent')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Add First Student
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Student Info</th>
                    <th className="px-6 py-4 text-left font-semibold">Contact</th>
                    <th className="px-6 py-4 text-left font-semibold">Schedule</th>
                    <th className="px-6 py-4 text-left font-semibold">Seat & Locker</th>
                    <th className="px-6 py-4 text-left font-semibold">Payment</th>
                    <th className="px-6 py-4 text-center font-semibold">Status</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id} className={`hover:bg-white/5 transition-all duration-200 ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                      }`}>
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">{student.StudentName}</div>
                        <div className="text-blue-200 text-sm">Reg: {student.RegistrationNumber}</div>
                        <div className="text-blue-300 text-sm">Father: {student.FatherName}</div>
                        <div className="text-blue-300 text-sm">Admitted: {formatDate(student.AdmissionDate)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{student.ContactNumber}</div>
                        <div className="text-blue-200 text-sm">{student.Address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{student.TimeSlots.join(", ")}</div>
                        <div className="text-blue-200 text-sm">Shift: {student.Shift}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">Seat: {student.SeatNumber}</div>
                        <div className="text-blue-200 text-sm">Locker: {student.LockerNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-green-400 font-semibold">₹{student.AmountPaid}</div>
                        <div className="text-red-400 text-sm">Due: ₹{student.AmountDue || '0'}</div>
                        <div className="text-blue-200 text-sm">{student.PaymentMode}</div>
                        <div className="text-blue-300 text-sm">Admission: ₹{student.AdmissionAmount}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${student.id}`}
                              checked={student.StudentActiveStatus === true}
                              onChange={() => handleStatusChange(student.id, true)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="text-green-400 text-sm font-medium">Active</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${student.id}`}
                              checked={student.StudentActiveStatus === false}
                              onChange={() => handleStatusChange(student.id, false)}
                              className="text-red-600 focus:ring-red-500"
                            />
                            <span className="text-red-400 text-sm font-medium">Inactive</span>
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => showEditModalForStudent(student)}
                            className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 hover:text-white p-2 rounded-lg transition-all duration-200 border border-blue-500/30"
                            title="Edit Student"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => confirmDeleteStudent(student)}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-white p-2 rounded-lg transition-all duration-200 border border-red-500/30"
                            title="Delete Student"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">✏️ Edit Student</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-white hover:text-red-300 text-2xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registration Number<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentStudent?.RegistrationNumber || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, RegistrationNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admission Date<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    value={currentStudent?.AdmissionDate ? formatDateForInput(currentStudent.AdmissionDate) : ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, AdmissionDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Student Name<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentStudent?.StudentName || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, StudentName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Father's Name<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentStudent?.FatherName || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, FatherName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address<span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={currentStudent?.Address || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, Address: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  value={currentStudent?.ContactNumber || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, ContactNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time Slots<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-xl p-3">
                    {timeOptions.map((option) => {
                      const isSelected = currentStudent?.TimeSlots?.includes(option.value) || false;
                      return (
                        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleTimeChange(option.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className={`text-sm transition-all duration-200 ${isSelected ? 'text-blue-600 font-semibold' : 'text-gray-700'
                            }`}>
                            {option.label}
                          </span>
                          {isSelected && <span className="text-green-500 text-xs">✓</span>}
                        </label>
                      );
                    })}
                  </div>
                  {errors.TimeSlots && (
                    <div className="flex items-start gap-2 mt-2 p-2 bg-red-50 rounded-lg">
                      <span className="text-red-500 text-sm">⚠️</span>
                      <p className="text-red-600 text-sm">{errors.TimeSlots}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Shift<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentStudent?.Shift || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, Shift: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Seat Number</label>
                  <input
                    type="text"
                    value={currentStudent?.SeatNumber || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, SeatNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-blue-600 text-xs mt-1 font-medium">
                    💺 Range: 0-136 (0 for temporary student)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Locker Number</label>
                  <input
                    type="text"
                    value={currentStudent?.LockerNumber || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, LockerNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-blue-600 text-xs mt-1 font-medium">
                    🔒 Range: 0-100 (0 for no locker)
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount Paid (₹)<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    value={currentStudent?.AmountPaid || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, AmountPaid: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Due (₹)</label>
                  <input
                    type="number"
                    value={currentStudent?.AmountDue || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, AmountDue: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admission Amount (₹)<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    value={currentStudent?.AdmissionAmount || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, AdmissionAmount: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fees Paid Till Date<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    value={currentStudent?.FeesPaidTillDate ? formatDateForInput(currentStudent.FeesPaidTillDate) : ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, FeesPaidTillDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Mode<span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={currentStudent?.PaymentMode || ""}
                    onChange={handlePaymentModeChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Payment Mode</option>
                    {paymentModeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {errors.PaymentMode && <p className="text-red-500 text-sm mt-1">{errors.PaymentMode}</p>}
                </div>
              </div>

              {/* Error Display */}
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                  {errors.api && (
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-red-500 text-lg">⚠️</span>
                      <p className="text-red-600 text-sm font-semibold">{errors.api}</p>
                    </div>
                  )}
                  {Object.entries(errors).filter(([key]) => key !== 'api' && key !== 'TimeSlots').map(([field, message]) => (
                    <div key={field} className="flex items-start gap-2 mb-1">
                      <span className="text-red-400 text-sm">•</span>
                      <p className="text-red-600 text-sm">
                        <span className="font-medium capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}:</span> {message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-3xl flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStudent}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">🗑️ Delete Student</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-white hover:text-red-200 text-2xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-lg text-gray-700 mb-2">Are you sure you want to delete</p>
                <p className="text-xl font-bold text-gray-900">{studentToDelete?.StudentName}?</p>
                <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-3xl flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteStudent(studentToDelete?.id)}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                🗑️ Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowStudentData;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApi, updateApiById } from "../api/api.js";
import { fetchAllStudentDataUrl, updateStudentUrl, updateStudentStatusUrl } from "../url/index.url.js";

// Icons as components
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ShowStudentsWithEndedMonth = () => {
  const [students, setStudents] = useState([]);
  const [expiredStudents, setExpiredStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [paymentExpectedDate, setPaymentExpectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expectedDateChangeCount, setExpectedDateChangeCount] = useState(0);
  const [showUpdateButton, setShowUpdateButton] = useState(false); // State to control button visibility
  const [studentStatus, setStudentStatus] = useState(true); // true for Active, false for Inactive
  const [showStatusUpdateButton, setShowStatusUpdateButton] = useState(false);
  const navigate = useNavigate(); // Define navigate

  // Fetch student data from backend
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getApi(fetchAllStudentDataUrl);
      if (response && response.success) {
        const studentsData = response.data || [];
        
        // Filter students whose FeesPaidTillDate has passed the current date
        const currentDate = new Date();
        const filteredStudents = studentsData.filter((student) => {
          const feesPaidTillDate = new Date(student.FeesPaidTillDate);
          return feesPaidTillDate < currentDate;
        });

        setStudents(studentsData);
        setExpiredStudents(filteredStudents);
      } else {
        setStudents([]);
        setExpiredStudents([]);
        if (response && response.error) {
          alert(response.error);
        }
      }
    } catch (error) {
      setStudents([]);
      setExpiredStudents([]);
      console.error("Error fetching students:", error);
      alert("Failed to fetch student data.");
    }
  };

  // Handle student click to show modal with details
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setPaymentExpectedDate(
      student.PaymentExpectedDate || new Date().toISOString().split("T")[0]
    );
    setExpectedDateChangeCount(student.PaymentExpectedDateChanged || 0);
    setStudentStatus(student.StudentActiveStatus !== undefined ? student.StudentActiveStatus : true);
    setShowModal(true);
    setShowUpdateButton(false); // Hide the update button when modal is opened
    setShowStatusUpdateButton(false);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle payment expected date change
  const handlePaymentExpectedDateChange = async () => {
    const newDate = paymentExpectedDate;
    if (newDate !== selectedStudent.PaymentExpectedDate) {
      const newCount = expectedDateChangeCount + 1;
      setExpectedDateChangeCount(newCount);

      const { id, createdAt, updatedAt, signupId, ...updatePayload } = {
        ...selectedStudent,
        PaymentExpectedDate: newDate,
        PaymentExpectedDateChanged: newCount,
      };

      try {
        const response = await updateApiById(updateStudentUrl, selectedStudent.id, updatePayload);
        if (response && response.success) {
          alert(response.message || "Payment expected date updated successfully!");
          setShowModal(false);
          fetchStudents();
        } else {
          alert(response?.message || "Failed to update payment date");
        }
      } catch (error) {
        console.error("Error updating student data:", error);
        alert("Error updating payment date");
      }
    }
  };

  // Handle date input change
  const handleDateInputChange = (e) => {
    const newDate = e.target.value;
    if (newDate !== paymentExpectedDate) {
      setPaymentExpectedDate(newDate);
      setShowUpdateButton(true); // Show the update button when a new date is selected
    }
  };

  // Handle status change
  const handleStatusChange = (e) => {
    const newStatus = e.target.value === 'true';
    if (newStatus !== studentStatus) {
      setStudentStatus(newStatus);
      setShowStatusUpdateButton(true);
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    try {
      const response = await updateApiById(updateStudentStatusUrl, selectedStudent.id, { StudentActiveStatus: studentStatus });
      if (response && response.success) {
        alert(response.message || "Student status updated successfully!");
        setShowModal(false);
        fetchStudents();
      } else {
        alert(response?.message || "Failed to update student status");
      }
    } catch (error) {
      console.error("Error updating student status:", error);
      alert("Error updating student status");
    }
  };

  // Filter expired students based on search term and status
  const filteredExpiredStudents = expiredStudents.filter((student) => {
    const matchesSearch = student.StudentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && student.StudentActiveStatus === true) ||
      (statusFilter === "inactive" && student.StudentActiveStatus === false);
    return matchesSearch && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString();
  };

  const getDaysOverdue = (feesPaidTillDate) => {
    const currentDate = new Date();
    const paidTillDate = new Date(feesPaidTillDate);
    const diffTime = currentDate - paidTillDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              ⚠️ Subscription Expired
            </h1>
            <p className="text-pink-100 text-lg opacity-90">Students with overdue fees as of {new Date().toLocaleDateString()}</p>
            <div className="mt-4 flex justify-center items-center gap-2 text-pink-200">
              <span className="text-sm">Overdue Students:</span>
              <span className="bg-white/20 px-3 py-1 rounded-full font-semibold">{expiredStudents.length}</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
              >
                <option value="active">Active Students</option>
                <option value="inactive">Inactive Students</option>
                <option value="all">All Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {filteredExpiredStudents.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-semibold text-white mb-2">All Fees Up to Date!</h3>
            <p className="text-pink-200 mb-6">Great news! No students have overdue fees.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExpiredStudents.map((student) => {
              const daysOverdue = getDaysOverdue(student.FeesPaidTillDate);
              return (
                <div
                  key={student.id}
                  onClick={() => handleStudentClick(student)}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 cursor-pointer hover:bg-white/15 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-red-500/20 p-3 rounded-xl">
                      <AlertIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-2">{student.StudentName}</h3>
                      <div className="space-y-1 text-sm">
                        <div className="text-pink-200">Reg: {student.RegistrationNumber}</div>
                        <div className="text-pink-300">Admitted: {formatDate(student.AdmissionDate)}</div>
                        <div className="text-red-400 font-semibold">
                          Overdue: {daysOverdue} day{daysOverdue !== 1 ? 's' : ''}
                        </div>
                        <div className="text-pink-300">Fees Till: {formatDate(student.FeesPaidTillDate)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-pink-200">Due Amount:</span>
                      <span className="text-red-400 font-semibold">₹{student.AmountDue || '0'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <UserIcon />
                  Student Details
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-red-300 text-2xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {selectedStudent && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <UserIcon />
                        Personal Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-900">{selectedStudent.StudentName}</span></div>
                        <div><span className="font-medium text-gray-700">Father's Name:</span> <span className="text-gray-900">{selectedStudent.FatherName}</span></div>
                        <div><span className="font-medium text-gray-700">Registration:</span> <span className="text-gray-900">{selectedStudent.RegistrationNumber}</span></div>
                        <div><span className="font-medium text-gray-700">Contact:</span> <span className="text-gray-900">{selectedStudent.ContactNumber}</span></div>
                        <div><span className="font-medium text-gray-700">Address:</span> <span className="text-gray-900">{selectedStudent.Address}</span></div>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                        <AlertIcon />
                        Fee Status
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium text-gray-700">Fees Paid Till:</span> <span className="text-red-600 font-semibold">{formatDate(selectedStudent.FeesPaidTillDate)}</span></div>
                        <div><span className="font-medium text-gray-700">Days Overdue:</span> <span className="text-red-600 font-bold">{getDaysOverdue(selectedStudent.FeesPaidTillDate)} days</span></div>
                        <div><span className="font-medium text-gray-700">Amount Due:</span> <span className="text-red-600 font-semibold">₹{selectedStudent.AmountDue || '0'}</span></div>
                        <div><span className="font-medium text-gray-700">Payment Mode:</span> <span className="text-gray-900">{selectedStudent.PaymentMode}</span></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                      <CalendarIcon />
                      Update Payment Expected Date
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expected Payment Date</label>
                        <input
                          type="date"
                          value={paymentExpectedDate}
                          onChange={handleDateInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Date Changed Count:</span> {expectedDateChangeCount} times
                      </div>
                      {showUpdateButton && (
                        <button
                          onClick={handlePaymentExpectedDateChange}
                          className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                          Update Expected Date
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-green-800 mb-3">Student Status</h4>
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="studentStatus"
                            value="true"
                            checked={studentStatus === true}
                            onChange={handleStatusChange}
                            className="text-green-600 focus:ring-green-500"
                          />
                          <span className="text-green-700 font-medium">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="studentStatus"
                            value="false"
                            checked={studentStatus === false}
                            onChange={handleStatusChange}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span className="text-red-700 font-medium">Inactive</span>
                        </label>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Current Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedStudent?.StudentActiveStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedStudent?.StudentActiveStatus ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {showStatusUpdateButton && (
                        <button
                          onClick={handleStatusUpdate}
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                          Update Status
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-3xl flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowStudentsWithEndedMonth;

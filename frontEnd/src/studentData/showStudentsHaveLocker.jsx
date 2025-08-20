import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApi } from "../api/api.js";
import { fetchAllStudentDataUrl } from "../url/index.url.js";

// Icons as components
const LockerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

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
      const response = await getApi(fetchAllStudentDataUrl);
      if (response && response.success) {
        const data = response.data || [];
        setStudents(data);

        const lockerNumbers = data
          .map((student) => student.LockerNumber)
          .filter((locker) => locker !== null && locker !== undefined && locker !== "0")
          .map((locker) => locker.toString());

        setOccupiedLockers(lockerNumbers);
      } else {
        setStudents([]);
        if (response && response.error) {
          alert(response.error);
        }
      }
    } catch (error) {
      setStudents([]);
      console.error("Error fetching occupied lockers:", error);
      alert("Failed to fetch locker data.");
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
      : date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              🔒 Locker Management
            </h1>
            <p className="text-blue-100 text-lg opacity-90">View and manage student locker allocations</p>
            <div className="mt-4 flex justify-center items-center gap-6 text-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-sm">Total Lockers:</span>
                <span className="bg-white/20 px-3 py-1 rounded-full font-semibold">{totalLockers}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Occupied:</span>
                <span className="bg-green-500/30 px-3 py-1 rounded-full font-semibold">{occupiedLockers.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Available:</span>
                <span className="bg-blue-500/30 px-3 py-1 rounded-full font-semibold">{totalLockers - occupiedLockers.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-4 mb-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-lg shadow-lg"></div>
              <span className="text-white font-medium">Occupied (Click to view details)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-600 rounded-lg shadow-lg"></div>
              <span className="text-white font-medium">Available</span>
            </div>
          </div>
        </div>

        {/* Lockers Grid */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="grid grid-cols-10 md:grid-cols-20 gap-2">
            {lockers.map((lockerNumber) => {
              const isOccupied = occupiedLockers.includes(lockerNumber.toString());
              return (
                <div
                  key={lockerNumber}
                  onClick={() => isOccupied && handleLockerClick(lockerNumber)}
                  className={`
                    relative w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-200 transform hover:scale-110 shadow-lg
                    ${
                      isOccupied
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white cursor-pointer hover:from-green-500 hover:to-green-700 hover:shadow-xl'
                        : 'bg-gradient-to-br from-gray-500 to-gray-700 text-gray-300 cursor-default'
                    }
                  `}
                  title={isOccupied ? 'Click to view student details' : 'Available locker'}
                >
                  {lockerNumber}
                  {isOccupied && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-3xl">
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
                  
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <LockerIcon />
                      Allocation Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium text-gray-700">Locker Number:</span> <span className="text-green-600 font-bold text-lg">{selectedStudent.LockerNumber}</span></div>
                      <div><span className="font-medium text-gray-700">Seat Number:</span> <span className="text-gray-900">{selectedStudent.SeatNumber}</span></div>
                      <div><span className="font-medium text-gray-700">Time Slots:</span> <span className="text-gray-900">{selectedStudent.TimeSlots.join(", ")}</span></div>
                      <div><span className="font-medium text-gray-700">Shift:</span> <span className="text-gray-900">{selectedStudent.Shift}</span></div>
                      <div><span className="font-medium text-gray-700">Admission Date:</span> <span className="text-gray-900">{formatDate(selectedStudent.AdmissionDate)}</span></div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-xl md:col-span-2">
                    <h4 className="font-semibold text-yellow-800 mb-3">💰 Payment Information</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><span className="font-medium text-gray-700">Amount Paid:</span> <span className="text-green-600 font-semibold">₹{selectedStudent.AmountPaid}</span></div>
                      <div><span className="font-medium text-gray-700">Amount Due:</span> <span className="text-red-600 font-semibold">₹{selectedStudent.AmountDue || "0"}</span></div>
                      <div><span className="font-medium text-gray-700">Admission Amount:</span> <span className="text-gray-900">₹{selectedStudent.AdmissionAmount}</span></div>
                      <div><span className="font-medium text-gray-700">Payment Mode:</span> <span className="text-gray-900">{selectedStudent.PaymentMode}</span></div>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium text-gray-700">Fees Paid Till:</span> <span className="text-gray-900">{formatDate(selectedStudent.FeesPaidTillDate)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-3xl flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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

export default ShowLockers;
